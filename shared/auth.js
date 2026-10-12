import { newId, randomHex, safeEqual } from "./util.js";

const enc = new TextEncoder();
const ITERATIONS = 100000; // Cloudflare Workers allows at most 100,000 for PBKDF2
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;
export const COOKIE = "bs_session";

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function hashPassword(password, saltB64) {
  const salt = saltB64 ? fromB64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256);
  return { hash: toB64(bits), salt: toB64(salt) };
}

export async function verifyPassword(password, hash, salt) {
  const r = await hashPassword(password, salt);
  return safeEqual(r.hash, hash);
}

async function sha256Hex(text) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function cookieHeader(request, token, maxAgeSeconds) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}

export async function createSession(env, userId) {
  const token = randomHex(32);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(await sha256Hex(token), userId, Date.now() + SESSION_MS)
    .run();
  return token;
}

function readCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

export async function destroySession(env, request) {
  const token = readCookie(request, COOKIE);
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
}

// Returns { user, store } or null.
export async function getAuth(request, env) {
  const token = readCookie(request, COOKIE);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const user = await env.DB.prepare(
    "SELECT u.id, u.email, u.plan, u.plan_expires_at, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?"
  ).bind(await sha256Hex(token), Date.now()).first();
  if (!user) return null;
  const store = await env.DB.prepare("SELECT * FROM stores WHERE user_id = ?").bind(user.id).first();
  if (!store) return null;
  return { user, store };
}

export const dummyHash = () => hashPassword("not-a-real-password-" + newId());
