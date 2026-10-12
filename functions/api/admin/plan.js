import { PLANS } from "../../../shared/plans.js";
import { err, json, readJson, safeEqual } from "../../../shared/util.js";

const MONTH = 30 * 24 * 60 * 60 * 1000;

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_KEY || !safeEqual(request.headers.get("x-admin-key"), env.ADMIN_KEY)) return err("Wrong admin key.", 401);
  const body = await readJson(request);
  if (!body) return err("Invalid request.");
  const email = String(body.email ?? "").trim().toLowerCase();
  const plan = String(body.plan ?? "");
  const months = Math.round(Number(body.months ?? 1));
  if (!PLANS[plan]) return err("Unknown plan.");

  const user = await env.DB.prepare("SELECT id, plan_expires_at FROM users WHERE email = ?").bind(email).first();
  if (!user) return err("No user with that email.", 404);

  if (plan === "free") {
    await env.DB.prepare("UPDATE users SET plan = 'free', plan_expires_at = NULL WHERE id = ?").bind(user.id).run();
    return json({ ok: true });
  }
  if (!Number.isFinite(months) || months < 1 || months > 24) return err("Months must be between 1 and 24.");
  const start = Math.max(Date.now(), user.plan_expires_at || 0);
  const expires = start + months * MONTH;
  await env.DB.prepare("UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?").bind(plan, expires, user.id).run();
  return json({ ok: true, expiresAt: expires });
}
