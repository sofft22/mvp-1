// Runs the real Pages Functions handlers against an in-memory SQLite database (D1 shim) and a Map-backed R2 shim.
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

import * as middleware from "../functions/_middleware.js";
import * as signup from "../functions/api/signup.js";
import * as login from "../functions/api/login.js";
import * as logout from "../functions/api/logout.js";
import * as me from "../functions/api/me.js";
import * as storeApi from "../functions/api/store.js";
import * as products from "../functions/api/products/index.js";
import * as productId from "../functions/api/products/[id].js";
import * as productImages from "../functions/api/products/[id]/images.js";
import * as imageId from "../functions/api/images/[id].js";
import * as img from "../functions/img/[[path]].js";
import * as publicStore from "../functions/store/[slug].js";
import * as adminUsers from "../functions/api/admin/users.js";
import * as adminPlan from "../functions/api/admin/plan.js";

/* ---- shims ---- */
const sqlite = new DatabaseSync(":memory:");
sqlite.exec("PRAGMA foreign_keys = ON");
sqlite.exec(readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));
class Stmt {
  constructor(sql) { this.sql = sql; this.params = []; }
  bind(...p) { this.params = p; return this; }
  async first() { return sqlite.prepare(this.sql).get(...this.params) ?? null; }
  async all() { return { results: sqlite.prepare(this.sql).all(...this.params) }; }
  async run() { sqlite.prepare(this.sql).run(...this.params); return { success: true }; }
}
const DB = {
  prepare: (sql) => new Stmt(sql),
  async batch(stmts) {
    sqlite.exec("BEGIN");
    try { for (const s of stmts) await s.run(); sqlite.exec("COMMIT"); } catch (e) { sqlite.exec("ROLLBACK"); throw e; }
  },
};
const bucket = new Map();
const IMAGES = {
  async put(k, buf, opts) { bucket.set(k, { buf, httpMetadata: opts?.httpMetadata }); },
  async get(k) { const o = bucket.get(k); return o ? { body: o.buf, httpMetadata: o.httpMetadata } : null; },
  async delete(k) { for (const key of Array.isArray(k) ? k : [k]) bucket.delete(key); },
};
const env = { DB, IMAGES, ADMIN_KEY: "test-admin-key" };

/* ---- helpers ---- */
const BASE = "https://bioshop.test";
async function call(mod, method, path, { body, cookie, params = {}, headers = {}, raw } = {}) {
  const h = { origin: BASE, "cf-connecting-ip": "1.2.3.4", ...headers };
  if (cookie) h.cookie = cookie;
  let payload;
  if (raw) { payload = raw.body; h["content-type"] = raw.type; }
  else if (body !== undefined) { payload = JSON.stringify(body); h["content-type"] = "application/json"; }
  const request = new Request(BASE + path, { method, headers: h, body: payload });
  const res = await mod[`onRequest${method[0] + method.slice(1).toLowerCase()}`]({ request, env, params });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch {}
  return { status: res.status, data, text, headers: res.headers };
}
const cookieOf = (r) => r.headers.get("set-cookie").split(";")[0];
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16, 74, 70, 73, 70, 0, 1, 1, 0, 0, 1]);

let n = 0;
const t = async (name, fn) => { await fn(); n++; console.log("ok  ", name); };
let cookie, cookie2, productIds = [], imageId1, imageKey;

await t("signup creates account, store and session cookie", async () => {
  const r = await call(signup, "POST", "/api/signup", { body: { email: "Ada.Eze@Example.com", password: "password123" } });
  assert.equal(r.status, 200);
  assert.match(r.headers.get("set-cookie"), /HttpOnly/);
  assert.match(r.headers.get("set-cookie"), /Secure/);
  cookie = cookieOf(r);
});
await t("signup rejects duplicate email, short password, bad email", async () => {
  assert.equal((await call(signup, "POST", "/api/signup", { body: { email: "ada.eze@example.com", password: "password123" } })).status, 409);
  assert.equal((await call(signup, "POST", "/api/signup", { body: { email: "x@y.com", password: "short" } })).status, 400);
  assert.equal((await call(signup, "POST", "/api/signup", { body: { email: "nope", password: "password123" } })).status, 400);
});
await t("me requires login", async () => assert.equal((await call(me, "GET", "/api/me")).status, 401));
await t("me returns starter store with temporary link", async () => {
  const r = await call(me, "GET", "/api/me", { cookie });
  assert.equal(r.status, 200);
  assert.equal(r.data.store.slug, "ada-eze");
  assert.equal(r.data.user.effectivePlan, "free");
  assert.equal(r.data.limits.products, 5);
  assert.equal(r.data.user.email, "ada.eze@example.com");
});
await t("login: wrong password 401, right password 200", async () => {
  assert.equal((await call(login, "POST", "/api/login", { body: { email: "ada.eze@example.com", password: "wrongwrong" } })).status, 401);
  assert.equal((await call(login, "POST", "/api/login", { body: { email: "nobody@example.com", password: "whatever123" } })).status, 401);
  assert.equal((await call(login, "POST", "/api/login", { body: { email: "ADA.eze@example.com", password: "password123" } })).status, 200);
});
await t("login is rate limited after repeated failures", async () => {
  let last;
  for (let i = 0; i < 10; i++) last = await call(login, "POST", "/api/login", { body: { email: "brute@example.com", password: "nope-nope" } });
  assert.equal(last.status, 429);
});
await t("store settings validate and save", async () => {
  const bad = await call(storeApi, "PUT", "/api/store", { cookie, body: { name: "A", slug: "adaeze" } });
  assert.equal(bad.status, 400);
  assert.equal((await call(storeApi, "PUT", "/api/store", { cookie, body: { name: "Adaeze's Closet", slug: "admin" } })).status, 400);
  assert.equal((await call(storeApi, "PUT", "/api/store", { cookie, body: { name: "Adaeze's Closet", slug: "adaeze", accountNumber: "123" } })).status, 400);
  const ok = await call(storeApi, "PUT", "/api/store", { cookie, body: { name: "Adaeze's Closet", slug: "adaeze", bio: "Bags & shoes in Lagos", whatsapp: "0801 234 5678", bankName: "GTBank", accountName: "Adaeze Okafor", accountNumber: "0123456789" } });
  assert.equal(ok.status, 200);
  assert.equal(ok.data.whatsapp, "2348012345678");
});
await t("store link must be unique across sellers", async () => {
  const s = await call(signup, "POST", "/api/signup", { body: { email: "chi@example.com", password: "password123" }, headers: { "cf-connecting-ip": "5.5.5.5" } });
  cookie2 = cookieOf(s);
  const r = await call(storeApi, "PUT", "/api/store", { cookie: cookie2, body: { name: "Chi Shop", slug: "adaeze" } });
  assert.equal(r.status, 409);
});
await t("free plan: 5 products max", async () => {
  for (let i = 1; i <= 5; i++) {
    const r = await call(products, "POST", "/api/products", { cookie, body: { name: `Product ${i}`, price: 1000 * i, description: "nice" } });
    assert.equal(r.status, 200); productIds.push(r.data.id);
  }
  const sixth = await call(products, "POST", "/api/products", { cookie, body: { name: "Product 6", price: 6000 } });
  assert.equal(sixth.status, 403);
  assert.match(sixth.data.error, /Upgrade/);
});
await t("product validation", async () => {
  assert.equal((await call(products, "POST", "/api/products", { cookie: cookie2, body: { name: "x", price: 100 } })).status, 400);
  assert.equal((await call(products, "POST", "/api/products", { cookie: cookie2, body: { name: "Good name", price: -5 } })).status, 400);
  assert.equal((await call(products, "POST", "/api/products", { cookie: cookie2, body: { name: "Good name", price: "abc" } })).status, 400);
});
await t("cannot edit or delete another seller's product", async () => {
  assert.equal((await call(productId, "PUT", `/api/products/${productIds[0]}`, { cookie: cookie2, params: { id: productIds[0] }, body: { name: "Hacked", price: 1 } })).status, 404);
  assert.equal((await call(productId, "DELETE", `/api/products/${productIds[0]}`, { cookie: cookie2, params: { id: productIds[0] } })).status, 404);
  assert.equal((await call(productImages, "POST", `/api/products/${productIds[0]}/images`, { cookie: cookie2, params: { id: productIds[0] }, raw: { body: JPEG, type: "image/jpeg" } })).status, 404);
});
await t("image upload: accepts jpeg, enforces 1 image on free, rejects non-images", async () => {
  const ok = await call(productImages, "POST", "/api/products/x/images", { cookie, params: { id: productIds[0] }, raw: { body: JPEG, type: "image/jpeg" } });
  assert.equal(ok.status, 200);
  imageId1 = ok.data.image.id; imageKey = ok.data.image.url.replace("/img/", "");
  assert.equal((await call(productImages, "POST", "/api/products/x/images", { cookie, params: { id: productIds[0] }, raw: { body: JPEG, type: "image/jpeg" } })).status, 403);
  const text = new TextEncoder().encode("<?php echo 1; ?>");
  assert.equal((await call(productImages, "POST", "/api/products/x/images", { cookie, params: { id: productIds[1] }, raw: { body: text, type: "image/jpeg" } })).status, 415);
  const big = new Uint8Array(2 * 1024 * 1024 + 10); big.set(JPEG);
  assert.equal((await call(productImages, "POST", "/api/products/x/images", { cookie, params: { id: productIds[1] }, raw: { body: big, type: "image/jpeg" } })).status, 413);
});
await t("image is served from /img with long cache", async () => {
  const r = await call(img, "GET", "/img/" + imageKey, { params: { path: imageKey.split("/") } });
  assert.equal(r.status, 200);
  assert.match(r.headers.get("cache-control"), /immutable/);
  assert.equal((await call(img, "GET", "/img/../../etc/passwd", { params: { path: ["..", "..", "etc", "passwd"] } })).status, 404);
});
await t("public store page renders products, image, WhatsApp, bank flow and branding (free plan)", async () => {
  const r = await call(publicStore, "GET", "/store/adaeze", { params: { slug: "adaeze" } });
  assert.equal(r.status, 200);
  assert.ok(r.text.includes("Adaeze&#39;s Closet"));
  assert.ok(r.text.includes("Product 1") && r.text.includes("₦1,000"));
  assert.ok(r.text.includes(`/img/${imageKey}`));
  assert.ok(r.text.includes("https://wa.me/2348012345678"));
  assert.ok(r.text.includes("Made with BIOSHOP"));
  assert.ok(r.text.includes('property="og:image"'));
  const data = JSON.parse(r.text.match(/id="data">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data.store.accountNumber, "0123456789");
  assert.equal(data.products.length, 5);
});
await t("unknown store gives 404", async () => {
  assert.equal((await call(publicStore, "GET", "/store/nope-nope", { params: { slug: "nope-nope" } })).status, 404);
  assert.equal((await call(publicStore, "GET", "/store/..%2f", { params: { slug: "../" } })).status, 404);
});
await t("admin endpoints need the key", async () => {
  assert.equal((await call(adminUsers, "GET", "/api/admin/users")).status, 401);
  assert.equal((await call(adminUsers, "GET", "/api/admin/users", { headers: { "x-admin-key": "wrong" } })).status, 401);
  const ok = await call(adminUsers, "GET", "/api/admin/users", { headers: { "x-admin-key": "test-admin-key" } });
  assert.equal(ok.status, 200);
  assert.equal(ok.data.users.length, 2);
  assert.equal((await call(adminPlan, "POST", "/api/admin/plan", { body: { email: "ada.eze@example.com", plan: "starter", months: 1 } })).status, 401);
});
await t("admin upgrade to Starter unlocks 30 products, 3 images, removes branding", async () => {
  const up = await call(adminPlan, "POST", "/api/admin/plan", { headers: { "x-admin-key": "test-admin-key" }, body: { email: "ada.eze@example.com", plan: "starter", months: 1 } });
  assert.equal(up.status, 200);
  assert.equal((await call(products, "POST", "/api/products", { cookie, body: { name: "Product 6", price: 6000 } })).status, 200);
  assert.equal((await call(productImages, "POST", "/api/products/x/images", { cookie, params: { id: productIds[0] }, raw: { body: JPEG, type: "image/jpeg" } })).status, 200);
  const page = await call(publicStore, "GET", "/store/adaeze", { params: { slug: "adaeze" } });
  assert.ok(!page.text.includes("Made with BIOSHOP"));
  assert.ok(page.text.includes("Product 6"));
});
await t("expired plan falls back to Free: extra products are hidden on the public page", async () => {
  sqlite.prepare("UPDATE users SET plan_expires_at = ? WHERE email = ?").run(Date.now() - 1000, "ada.eze@example.com");
  const page = await call(publicStore, "GET", "/store/adaeze", { params: { slug: "adaeze" } });
  assert.ok(!page.text.includes("Product 6"), "6th product should be hidden");
  assert.ok(page.text.includes("Made with BIOSHOP"));
  const dash = await call(me, "GET", "/api/me", { cookie });
  assert.equal(dash.data.user.effectivePlan, "free");
  assert.equal(dash.data.products.find((p) => p.name === "Product 6").hidden, true);
  const imgs = JSON.parse(page.text.match(/id="data">([\s\S]*?)<\/script>/)[1]).products[0].images;
  assert.equal(imgs.length, 1, "free plan shows only 1 image per product");
});
await t("delete image and delete product clean up storage", async () => {
  const before = bucket.size;
  assert.equal((await call(imageId, "DELETE", "/api/images/x", { cookie: cookie2, params: { id: imageId1 } })).status, 404);
  assert.equal((await call(imageId, "DELETE", "/api/images/x", { cookie, params: { id: imageId1 } })).status, 200);
  assert.equal(bucket.size, before - 1);
  assert.equal((await call(productId, "DELETE", `/api/products/${productIds[0]}`, { cookie, params: { id: productIds[0] } })).status, 200);
  assert.equal(bucket.size, 0, "images of the deleted product are removed from R2");
  const rows = sqlite.prepare("SELECT COUNT(*) AS n FROM product_images").get();
  assert.equal(rows.n, 0);
});
await t("product edit: sold out shows on public page", async () => {
  const r = await call(productId, "PUT", `/api/products/${productIds[1]}`, { cookie, params: { id: productIds[1] }, body: { name: "Product 2", price: 2500, description: "x", inStock: false } });
  assert.equal(r.status, 200);
  const page = await call(publicStore, "GET", "/store/adaeze", { params: { slug: "adaeze" } });
  assert.ok(page.text.includes("Sold out") && page.text.includes("₦2,500"));
});
await t("CSRF: cross-site origin is blocked by middleware", async () => {
  const req = new Request(BASE + "/api/store", { method: "PUT", headers: { origin: "https://evil.example", "content-type": "application/json" }, body: "{}" });
  let reached = false;
  const res = await middleware.onRequest({ request: req, next: async () => { reached = true; return new Response("ok"); } });
  assert.equal(res.status, 403); assert.equal(reached, false);
  const same = new Request(BASE + "/api/store", { method: "PUT", headers: { origin: BASE }, body: "{}" });
  await middleware.onRequest({ request: same, next: async () => { reached = true; return new Response("ok"); } });
  assert.equal(reached, true);
});
await t("logout invalidates the session", async () => {
  assert.equal((await call(logout, "POST", "/api/logout", { cookie })).status, 200);
  assert.equal((await call(me, "GET", "/api/me", { cookie })).status, 401);
});
await t("XSS payloads in seller content are escaped on the public page", async () => {
  await call(storeApi, "PUT", "/api/store", { cookie: cookie2, body: { name: `<img src=x onerror=alert(1)>`, slug: "chi-shop", bio: `</script><script>alert(1)</script>` } });
  await call(products, "POST", "/api/products", { cookie: cookie2, body: { name: `"><svg onload=alert(1)>`, price: 100, description: "</script><b>" } });
  const page = await call(publicStore, "GET", "/store/chi-shop", { params: { slug: "chi-shop" } });
  assert.equal(page.status, 200);
  assert.ok(!/<img src=x/.test(page.text) && !page.text.includes("<svg onload") && !page.text.includes("<script>alert"));
});

console.log(`\n${n} end-to-end tests passed`);
