import assert from "node:assert/strict";
import { esc, normalizeWhatsApp, validSlug, slugify, formatNaira, isValidEmail, safeEqual, cleanText } from "../shared/util.js";
import { effectivePlan, PLANS } from "../shared/plans.js";
import { hashPassword, verifyPassword } from "../shared/auth.js";
import { renderStore } from "../shared/render.js";

let n = 0;
const t = (name, fn) => Promise.resolve(fn()).then(() => { n++; console.log("ok  ", name); });

await t("esc escapes html", () => assert.equal(esc(`<img src=x onerror="a">&'`), "&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;"));
await t("whatsapp: 080 format", () => assert.equal(normalizeWhatsApp("0801 234 5678"), "2348012345678"));
await t("whatsapp: +234 format", () => assert.equal(normalizeWhatsApp("+234 801 234 5678"), "2348012345678"));
await t("whatsapp: 10 digits without zero", () => assert.equal(normalizeWhatsApp("8012345678"), "2348012345678"));
await t("whatsapp: junk rejected", () => { assert.equal(normalizeWhatsApp("abc"), null); assert.equal(normalizeWhatsApp("123"), null); });
await t("slug rules", () => {
  assert.ok(validSlug("adaeze-closet"));
  for (const bad of ["ab", "-abc", "abc-", "Abc", "a b c", "admin", "api", "x".repeat(31)]) assert.ok(!validSlug(bad), bad);
});
await t("slugify", () => { assert.equal(slugify("Adaeze's Closet!!"), "adaeze-s-closet"); assert.equal(slugify("  --  "), ""); });
await t("naira formatting", () => { assert.equal(formatNaira(18500), "₦18,500"); assert.equal(formatNaira(1234567), "₦1,234,567"); });
await t("email check", () => { assert.ok(isValidEmail("a@b.co")); assert.ok(!isValidEmail("a@b")); assert.ok(!isValidEmail("a b@c.com")); });
await t("safeEqual", () => { assert.ok(safeEqual("abc", "abc")); assert.ok(!safeEqual("abc", "abd")); assert.ok(!safeEqual("abc", "ab")); });
await t("cleanText collapses whitespace", () => assert.equal(cleanText("  a   b \n c ", 10), "a b c"));
await t("plans: free fallback when expired", () => {
  assert.equal(effectivePlan({ plan: "starter", plan_expires_at: Date.now() - 1000 }), "free");
  assert.equal(effectivePlan({ plan: "starter", plan_expires_at: Date.now() + 100000 }), "starter");
  assert.equal(effectivePlan({ plan: "pro", plan_expires_at: null }), "free");
  assert.equal(effectivePlan({ plan: "free" }), "free");
  assert.equal(PLANS.free.products, 5); assert.equal(PLANS.starter.images, 3);
});
await t("password hash round trip", async () => {
  const { hash, salt } = await hashPassword("correct horse battery");
  assert.ok(await verifyPassword("correct horse battery", hash, salt));
  assert.ok(!(await verifyPassword("wrong password", hash, salt)));
});
await t("store page escapes seller content", () => {
  const html = renderStore({
    store: { name: `<script>alert(1)</script>`, slug: "x-shop", bio: `"><img src=x>`, whatsapp: "2348012345678", bank_name: "GT", account_name: "A", account_number: "0123456789" },
    products: [{ id: "p1", name: `<b>Bag</b></script><script>alert(2)</script>`, price: 15000, description: "d", in_stock: 1, images: [] }],
    showBranding: true, origin: "https://example.com",
  });
  assert.ok(!html.includes("<script>alert"), "raw script tag leaked");
  assert.ok(!html.includes('"><img'), "attribute breakout leaked");
  assert.ok(html.includes("₦15,000"));
  assert.ok(html.includes("Made with BIOSHOP"));
  const json = html.match(/<script type="application\/json" id="data">([\s\S]*?)<\/script>/)[1];
  JSON.parse(json); // must still be valid JSON
});

console.log(`\n${n} tests passed`);
