export async function onRequestGet({ env, params }) {
  const key = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!/^[a-f0-9-]{36}\/[a-f0-9]{16,64}\.(jpg|png|webp)$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const row = await env.DB.prepare(
    "SELECT bytes, content_type FROM product_images WHERE key = ?"
  ).bind(key).first();
  if (!row) return new Response("Not found", { status: 404 });

  let body;
  if (row.bytes instanceof ArrayBuffer) {
    body = row.bytes;
  } else if (row.bytes instanceof Uint8Array) {
    body = row.bytes;
  } else if (row.bytes && typeof row.bytes === "object") {
    body = new Uint8Array(Object.values(row.bytes));
  } else {
    return new Response("Bad image data", { status: 500 });
  }

  return new Response(body, {
    headers: {
      "content-type": row.content_type || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
