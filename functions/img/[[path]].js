export async function onRequestGet({ env, params }) {
  const key = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!/^[a-f0-9-]{36}\/[a-f0-9]{24}\.(jpg|png|webp)$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const row = await env.DB.prepare(
    "SELECT bytes, content_type FROM product_images WHERE key = ?"
  ).bind(key).first();
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(row.bytes, {
    headers: {
      "content-type": row.content_type || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
