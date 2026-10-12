import { getAuth } from "../../shared/auth.js";
import { PLANS, effectivePlan } from "../../shared/plans.js";
import { err, json } from "../../shared/util.js";

export async function onRequestGet({ request, env }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);
  const { user, store } = auth;
  const plan = effectivePlan(user);
  const limits = PLANS[plan];

  const [prodRes, imgRes] = await Promise.all([
    env.DB.prepare("SELECT id, name, price, description, in_stock FROM products WHERE store_id = ? ORDER BY created_at ASC").bind(store.id).all(),
    env.DB.prepare("SELECT id, product_id, key FROM product_images WHERE store_id = ? ORDER BY created_at ASC, rowid ASC").bind(store.id).all(),
  ]);
  const byProduct = new Map();
  for (const im of imgRes.results) {
    if (!byProduct.has(im.product_id)) byProduct.set(im.product_id, []);
    byProduct.get(im.product_id).push({ id: im.id, url: `/img/${im.key}` });
  }
  const products = prodRes.results.map((p, i) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    inStock: !!p.in_stock,
    images: byProduct.get(p.id) || [],
    hidden: i >= limits.products,
  }));

  return json({
    user: { email: user.email, plan: user.plan, effectivePlan: plan, planExpiresAt: user.plan_expires_at },
    store: {
      name: store.name,
      slug: store.slug,
      bio: store.bio,
      whatsapp: store.whatsapp,
      bankName: store.bank_name,
      accountName: store.account_name,
      accountNumber: store.account_number,
      avatarUrl: store.avatar_url,
      coverUrl: store.cover_url,
    },
    limits: { products: limits.products, images: limits.images, planName: limits.name },
    plans: PLANS,
    products,
  });
}
