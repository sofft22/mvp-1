import { destroySession, cookieHeader } from "../../shared/auth.js";
import { json } from "../../shared/util.js";

export async function onRequestPost({ request, env }) {
  await destroySession(env, request);
  return json({ ok: true }, 200, { "set-cookie": cookieHeader(request, "", 0) });
}
