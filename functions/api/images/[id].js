import { getAuth } from "../../../shared/auth.js";
import { err, json } from "../../../shared/util.js";

export async function onRequestDelete({ request, env, params }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);
  const img = await env.DB.prepare("SELECT id FROM product_images WHERE id = ? AND store_id = ?").bind(params.id, auth.store.id).first();
  if (!img) return err("Photo not found.", 404);
  await env.DB.prepare("DELETE FROM product_images WHERE id = ? AND store_id = ?").bind(params.id, auth.store.id).run();
  return json({ ok: true });
}
