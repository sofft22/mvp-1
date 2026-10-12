import { getAuth } from "../../../shared/auth.js";
import { cleanText, cleanMultiline, err, json, readJson } from "../../../shared/util.js";

async function owned(env, storeId, id) {
  return env.DB.prepare("SELECT id FROM products WHERE id = ? AND store_id = ?").bind(id, storeId).first();
}

export async function onRequestPut({ request, env, params }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);
  if (!(await owned(env, auth.store.id, params.id))) return err("Product not found.", 404);

  const body = await readJson(request);
  if (!body) return err("Invalid request.");
  const name = cleanText(body.name, 80);
  const price = Math.round(Number(body.price));
  const description = cleanMultiline(body.description, 500);
  const inStock = body.inStock === false ? 0 : 1;
  if (name.length < 2) return err("Enter the product name.");
  if (!Number.isFinite(price) || price < 1 || price > 100000000) return err("Enter a price in naira, like 15000.");

  await env.DB.prepare("UPDATE products SET name = ?, price = ?, description = ?, in_stock = ? WHERE id = ? AND store_id = ?")
    .bind(name, price, description, inStock, params.id, auth.store.id).run();
  return json({ ok: true });
}

export async function onRequestDelete({ request, env, params }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);
  if (!(await owned(env, auth.store.id, params.id))) return err("Product not found.", 404);

  await env.DB.prepare("DELETE FROM products WHERE id = ? AND store_id = ?").bind(params.id, auth.store.id).run();
  return json({ ok: true });
}
