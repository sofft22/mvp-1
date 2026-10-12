export async function onRequestGet({ env, params }) {
  const key = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!/^[a-f0-9-]{36}\/[a-f0-9]{24}\.(jpg|png|webp)$/.test(key)) return new Response("Not found", { status: 404 });
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  return new Response(obj.body, {
    headers: {
      "content-type": obj.httpMetadata?.contentType || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
