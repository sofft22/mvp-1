import { verifyPassword, createSession, cookieHeader, dummyHash } from "../../shared/auth.js";
import { err, json, readJson, rateLimit } from "../../shared/util.js";

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body) return err("Invalid request.");
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password || password.length > 128) return err("Enter your email and password.");

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (!(await rateLimit(env, `login:${ip}:${email}`, 8, 15 * 60 * 1000))) {
    return err("Too many attempts. Wait 15 minutes and try again.", 429);
  }

  const user = await env.DB.prepare("SELECT id, pass_hash, pass_salt FROM users WHERE email = ?").bind(email).first();
  if (!user) {
    await dummyHash(); // keeps timing similar whether or not the email exists
    return err("Wrong email or password.", 401);
  }
  if (!(await verifyPassword(password, user.pass_hash, user.pass_salt))) return err("Wrong email or password.", 401);

  const token = await createSession(env, user.id);
  return json({ ok: true }, 200, { "set-cookie": cookieHeader(request, token, 30 * 24 * 3600) });
}
