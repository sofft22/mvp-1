import { PLANS, effectivePlan } from "../../shared/plans.js";
import { renderStore, renderNotFound } from "../../shared/render.js";
import { validSlug } from "../../shared/util.js";

const html = (body, status = 200, cache = "public, max-age=60, s-maxage=60") =>
  new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache } });

export async function onRequestGet({ request, env, params }) {
  const slug = String(params.slug || "").toLowerCase();
  if (!validSlug(slug)) return html(renderNotFound(), 404, "no-store");

  const row = await env.DB.prepare(
    "SELECT s.*, u.plan AS plan, u.plan_expires_at AS plan_expires_at FROM stores s JOIN users u ON u.id = s.user_id WHERE s.slug = ?"
  ).bind(slug).first();
  if (!row) return html(renderNotFound(), 404, "no-store");

  const planKey = effectivePlan({ plan: row.plan, plan_expires_at: row.plan_expires_at });
  const limits = PLANS[planKey];

  const [prodRes, imgRes] = await Promise.all([
    env.DB.prepare("SELECT id, name, price, description, in_stock FROM products WHERE store_id = ? ORDER BY created_at ASC LIMIT ?")
      .bind(row.id, Math.min(limits.products, 300)).all(),
    env.DB.prepare("SELECT product_id, key FROM product_images WHERE store_id = ? ORDER BY created_at ASC, rowid ASC").bind(row.id).all(),
  ]);

  const byProduct = new Map();
  for (const im of imgRes.results) {
    const list = byProduct.get(im.product_id) || [];
    if (list.length < limits.images) list.push(`/img/${im.key}`);
    byProduct.set(im.product_id, list);
  }
  const products = prodRes.results.map((p) => ({ ...p, images: byProduct.get(p.id) || [] }));

  const origin = new URL(request.url).origin;
  return html(renderStore({ store: row, products, showBranding: planKey === "free", origin }));
}
