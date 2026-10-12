import { getAuth } from "../../../../shared/auth.js";
import { PLANS, effectivePlan } from "../../../../shared/plans.js";
import { err, json, newId, randomHex } from "../../../../shared/util.js";

const MAX_BYTES = 2 * 1024 * 1024;

function sniff(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return { ext: "jpg", type: "image/jpeg" };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { ext: "png", type: "image/png" };
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50)
    return { ext: "webp", type: "image/webp" };
  return null;
}

export async function onRequestPost({ request, env, params }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);

  const product = await env.DB.prepare("SELECT id FROM products WHERE id = ? AND store_id = ?").bind(params.id, auth.store.id).first();
  if (!product) return err("Product not found.", 404);

  const plan = effectivePlan(auth.user);
  const limit = PLANS[plan].images;
  const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM product_images WHERE product_id = ?").bind(params.id).first();
  if (count.n >= limit) return err(`Your ${PLANS[plan].name} plan allows ${limit} image${limit > 1 ? "s" : ""} per product.`, 403);

  const buf = await request.arrayBuffer();
  if (!buf.byteLength) return err("No photo received.");
  if (buf.byteLength > MAX_BYTES) return err("That photo is too large. Try a smaller one.", 413);
  const kind = sniff(new Uint8Array(buf, 0, Math.min(16, buf.byteLength)));
  if (!kind) return err("Use a JPG, PNG or WebP photo.", 415);

  const key = `${auth.store.id}/${randomHex(12)}.${kind.ext}`;
  await env.IMAGES.put(key, buf, { httpMetadata: { contentType: kind.type } });
  const id = newId();
  await env.DB.prepare("INSERT INTO product_images (id, product_id, store_id, key, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(id, params.id, auth.store.id, key, Date.now()).run();
  return json({ ok: true, image: { id, url: `/img/${key}` } });
}
