import { hashPassword, createSession, cookieHeader } from "../../shared/auth.js";
import { err, json, readJson, isValidEmail, slugify, newId, randomHex, rateLimit, RESERVED_SLUGS, cleanText, normalizeWhatsApp } from "../../shared/util.js";

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (!(await rateLimit(env, `signup:${ip}`, 10, 60 * 60 * 1000))) {
    return err("Too many sign-ups from this connection. Try again later.", 429);
  }

  const body = await readJson(request);
  if (!body) return err("Invalid request.");

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const storeName = cleanText(body.storeName, 60);
  const whatsappRaw = String(body.whatsapp ?? "").trim();

  if (!isValidEmail(email)) return err("Enter a valid email address.");
  if (password.length < 8) return err("Use at least 8 characters for your password.");
  if (password.length > 128) return err("That password is too long.");
  if (storeName.length < 2) return err("Enter your store name (at least 2 letters).");

  const whatsapp = normalizeWhatsApp(whatsappRaw);
  if (!whatsapp) return err("Enter a valid WhatsApp number, like 08012345678.");

  const exists = await env.DB.prepare("SELECT 1 FROM users WHERE email = ?").bind(email).first();
  if (exists) return err("An account with this email already exists. Log in instead.", 409);

  // Slug from the store name
  let base = slugify(storeName);
  if (base.length < 3) base = (base + "shop").slice(0, 30);
  if (RESERVED_SLUGS.has(base)) base = (base + "-shop").slice(0, 30);
  let slug = base;
  for (let i = 0; i < 6; i++) {
    const taken = await env.DB.prepare("SELECT 1 FROM stores WHERE slug = ?").bind(slug).first();
    if (!taken) break;
    slug = (base.slice(0, 24).replace(/-+$/, "") + "-" + randomHex(2)).slice(0, 30);
  }

  const { hash, salt } = await hashPassword(password);
  const userId = newId();
  const now = Date.now();

  try {
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO users (id, email, pass_hash, pass_salt, plan, created_at) VALUES (?, ?, ?, ?, 'free', ?)"
      ).bind(userId, email, hash, salt, now),
      env.DB.prepare(
        "INSERT INTO stores (id, user_id, slug, name, whatsapp, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(newId(), userId, slug, storeName, whatsapp, now),
    ]);
  } catch (e) {
    return err("Could not create your account. Please try again.", 500);
  }

  const token = await createSession(env, userId);
  return json({ ok: true }, 200, { "set-cookie": cookieHeader(request, token, 30 * 24 * 3600) });
}
