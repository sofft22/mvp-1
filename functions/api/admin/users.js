import { err, json, safeEqual } from "../../../shared/util.js";

export async function onRequestGet({ request, env }) {
  if (!env.ADMIN_KEY || !safeEqual(request.headers.get("x-admin-key"), env.ADMIN_KEY)) return err("Wrong admin key.", 401);
  const rows = await env.DB.prepare(
    `SELECT u.email, u.plan, u.plan_expires_at, u.created_at, s.slug, s.name,
       (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) AS products
     FROM users u JOIN stores s ON s.user_id = u.id ORDER BY u.created_at DESC LIMIT 500`
  ).all();
  return json({ users: rows.results });
}
