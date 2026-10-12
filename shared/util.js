export const RESERVED_SLUGS = new Set([
  "admin", "api", "store", "stores", "login", "signup", "dashboard", "img", "www", "bioshop",
  "help", "support", "about", "pricing", "terms", "privacy", "app", "static", "assets",
]);

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

export const err = (message, status = 400) => json({ error: message }, status);

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export const newId = () => crypto.randomUUID();

export function randomHex(bytes = 8) {
  return [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function cleanText(v, max) {
  return String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanMultiline(v, max) {
  return String(v ?? "").replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);
}

export function isValidEmail(e) {
  return typeof e === "string" && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

export function slugify(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)
    .replace(/-+$/g, "");
}

export function validSlug(s) {
  return typeof s === "string" && /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(s) && !RESERVED_SLUGS.has(s);
}

// Returns digits with country code (e.g. 2348012345678) or null if it doesn't look like a phone number.
export function normalizeWhatsApp(input) {
  const digits = String(input ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("234") && digits.length === 13) return digits;
  if (digits.startsWith("0") && digits.length === 11) return "234" + digits.slice(1);
  if (digits.length === 10 && /^[789]/.test(digits)) return "234" + digits;
  if (digits.length >= 11 && digits.length <= 15 && !digits.startsWith("0")) return digits;
  return null;
}

export function formatNaira(n) {
  return "₦" + String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function safeEqual(a, b) {
  a = String(a ?? "");
  b = String(b ?? "");
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function rateLimit(env, key, max, windowMs) {
  const now = Date.now();
  const row = await env.DB.prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?").bind(key).first();
  if (!row || row.reset_at < now) {
    await env.DB.prepare(
      "INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = excluded.reset_at"
    ).bind(key, now + windowMs).run();
    return true;
  }
  if (row.count >= max) return false;
  await env.DB.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(key).run();
  return true;
}
