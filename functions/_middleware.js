// Blocks cross-site writes to the API (CSRF defence on top of SameSite=Lax cookies).
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== url.host) {
      return new Response(JSON.stringify({ error: "Blocked request" }), { status: 403, headers: { "content-type": "application/json" } });
    }
  }
  return next();
}
