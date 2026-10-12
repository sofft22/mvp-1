import { getAuth } from "../../../shared/auth.js";
import { PLANS, effectivePlan } from "../../../shared/plans.js";
import { cleanText, cleanMultiline, err, json, readJson, newId } from "../../../shared/util.js";

export async function onRequestPost({ request, env }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);
  const plan = effectivePlan(auth.user);
  const limit = PLANS[plan].products;

  const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM products WHERE store_id = ?").bind(auth.store.id).first();
  if (count.n >= limit) return err(`Your ${PLANS[plan].name} plan allows ${limit} products. Upgrade to add more.`, 403);

  const body = await readJson(request);
  if (!body) return err("Invalid request.");
  const name = cleanText(body.name, 80);
  const price = Math.round(Number(body.price));
  const description = cleanMultiline(body.description, 500);
  if (name.length < 2) return err("Enter the product name.");
  if (!Number.isFinite(price) || price < 1 || price > 100000000) return err("Enter a price in naira, like 15000.");

  const id = newId();
  await env.DB.prepare("INSERT INTO products (id, store_id, name, price, description, in_stock, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)")
    .bind(id, auth.store.id, name, price, description, Date.now()).run();
  return json({ ok: true, id });
}
