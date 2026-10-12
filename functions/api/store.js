import { getAuth } from "../../shared/auth.js";
import { cleanText, cleanMultiline, err, json, readJson, validSlug, normalizeWhatsApp } from "../../shared/util.js";

export async function onRequestPut({ request, env }) {
  const auth = await getAuth(request, env);
  if (!auth) return err("Not signed in.", 401);
  const body = await readJson(request);
  if (!body) return err("Invalid request.");

  const name = cleanText(body.name, 60);
  const slug = String(body.slug ?? "").trim().toLowerCase();
  const bio = cleanMultiline(body.bio, 200);
  const bankName = cleanText(body.bankName, 60);
  const accountName = cleanText(body.accountName, 80);
  const accountNumber = String(body.accountNumber ?? "").replace(/\s/g, "");
  const whatsappRaw = String(body.whatsapp ?? "").trim();

  if (name.length < 2) return err("Give your store a name (at least 2 letters).");
  if (!validSlug(slug)) return err("Your store link must be 3 to 30 letters, numbers or hyphens, and can't be a reserved word.");
  if (accountNumber && !/^\d{10}$/.test(accountNumber)) return err("Account numbers have 10 digits.");
  let whatsapp = "";
  if (whatsappRaw) {
    whatsapp = normalizeWhatsApp(whatsappRaw);
    if (!whatsapp) return err("That WhatsApp number doesn't look right. Example: 08012345678");
  }

  try {
    await env.DB.prepare(
      "UPDATE stores SET name = ?, slug = ?, bio = ?, whatsapp = ?, bank_name = ?, account_name = ?, account_number = ? WHERE id = ?"
    ).bind(name, slug, bio, whatsapp, bankName, accountName, accountNumber, auth.store.id).run();
  } catch (e) {
    if (String(e).includes("UNIQUE")) return err("That store link is already taken. Try another one.", 409);
    return err("Could not save. Please try again.", 500);
  }
  return json({ ok: true, whatsapp });
}
