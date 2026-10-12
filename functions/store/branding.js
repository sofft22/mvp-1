import { getAuth } from "../../../shared/auth.js";
import { err, json, newId, randomHex } from "../../../shared/util.js";

const MAX_BYTES = 2 * 1024 * 1024;

function sniff(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return { ext: "jpg", type: "image/jpeg" };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { ext: "png", type: "image/png" };
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50)
    return { ext: "webp", type: "image/webp" };
  return null;
}

export async function onRequestPost({ request, env }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  if (kind !== "avatar" && kind !== "cover") return err("Unknown branding type.");

  const buf = await request.arrayBuffer();
  if (!buf.byteLength) return err("No image received.");
  if (buf.byteLength > MAX_BYTES) return err("That image is too large. Try a smaller one.", 413);
  const sig = sniff(new Uint8Array(buf, 0, Math.min(16, buf.byteLength)));
  if (!sig) return err("Use a JPG, PNG or WebP image.", 415);

  const key = `branding/${auth.store.id}/${kind}-${randomHex(12)}.${sig.ext}`;
  const id = newId();
  await env.DB.prepare(
    "INSERT INTO product_images (id, product_id, store_id, key, bytes, content_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, `branding-${kind}`, auth.store.id, key, new Uint8Array(buf), sig.type, Date.now()).run();

  const imageUrl = `/img/${key}`;
  const column = kind === "avatar" ? "avatar_url" : "cover_url";
  await env.DB.prepare(`UPDATE stores SET ${column} = ? WHERE id = ?`).bind(imageUrl, auth.store.id).run();

  return json({ ok: true, url: imageUrl });
}
