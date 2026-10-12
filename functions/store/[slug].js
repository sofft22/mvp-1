import { PLANS, effectivePlan } from "../../shared/plans.js";
import { esc, formatNaira, validSlug } from "../../shared/util.js";

function safeJson(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function renderNotFound() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Store not found · BIOSHOP</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/store.css"></head>
<body><main class="wrap" style="text-align:center;padding-top:96px">
<h1 style="font:400 28px/1.15 'Instrument Serif',Georgia,serif;letter-spacing:-0.02em">This store doesn't exist</h1>
<p class="bio" style="margin-top:14px">The link may be misspelled, or the seller changed it.</p>
<p style="margin-top:24px"><a class="btn" href="/signup">Open your own free store</a></p></main></body></html>`;
}

export function renderStore({ store, products, showBranding, origin }) {
  const url = `${origin}/store/${store.slug}`;
  const desc = store.bio || `Shop ${store.name}. Tap a product to order on WhatsApp or pay by bank transfer.`;
  const firstImage = products.find((p) => p.images.length)?.images[0];
  const initial = esc((store.name || "?").trim().charAt(0).toUpperCase());

  const cards = products
    .map((p) => {
      const media = p.images.length
        ? `<img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" decoding="async" width="400" height="500">`
        : `<span class="letter" aria-hidden="true">${esc(p.name.trim().charAt(0).toUpperCase())}</span>`;
      return `<button class="card" type="button" data-id="${esc(p.id)}">
  <span class="ph">${media}${p.in_stock ? "" : '<span class="sold">Sold out</span>'}</span>
  <span class="nm">${esc(p.name)}</span>
  <span class="pr">${esc(formatNaira(p.price))}</span>
</button>`;
    })
    .join("\n");

  const data = {
    store: {
      name: store.name,
      slug: store.slug,
      whatsapp: store.whatsapp,
      bankName: store.bank_name,
      accountName: store.account_name,
      accountNumber: store.account_number,
    },
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      inStock: !!p.in_stock,
      images: p.images,
    })),
  };

  const waHello = store.whatsapp
    ? `<a class="btn wa" href="https://wa.me/${esc(store.whatsapp)}?text=${encodeURIComponent("Hi! I found your store on BIOSHOP.")}" rel="noopener">Message on WhatsApp</a>`
    : "";

  const coverHtml = store.cover_url
    ? `<div class="cover"><img src="${esc(store.cover_url)}" alt=""></div>`
    : "";
  const avatarInner = store.avatar_url
    ? `<img src="${esc(store.avatar_url)}" alt="">`
    : initial;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(store.name)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(store.name)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
${firstImage ? `<meta property="og:image" content="${esc(origin + firstImage)}">\n<meta name="twitter:card" content="summary_large_image">` : ""}
<link rel="canonical" href="${esc(url)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/store.css">
</head>
<body>
<main class="wrap">
  ${coverHtml}
  <header class="head${store.cover_url ? " has-cover" : ""}">
    <div class="avatar" aria-hidden="true">${avatarInner}</div>
    <h1>${esc(store.name)}</h1>
    ${store.bio ? `<p class="bio">${esc(store.bio)}</p>` : ""}
    ${waHello}
  </header>
  ${products.length ? `<section class="grid" aria-label="Products">\n${cards}\n</section>` : `<p class="empty">No products yet. Check back soon.</p>`}
  ${showBranding ? `<footer class="foot"><a href="/signup">Made with BIOSHOP</a></footer>` : ""}
</main>
<dialog id="sheet" aria-label="Product details"></dialog>
<script type="application/json" id="data">${safeJson(data)}</script>
<script src="/store.js" defer></script>
</body>
</html>`;
}

export async function onRequestGet({ request, env, params }) {
  const slug = String(params.slug || "").toLowerCase();
  const html = (body, status = 200, cache = "public, max-age=60, s-maxage=60") =>
    new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache } });

  if (!validSlug(slug)) return html(renderNotFound(), 404, "no-store");

  const row = await env.DB.prepare(
    "SELECT s.*, u.plan AS plan, u.plan_expires_at AS plan_expires_at FROM stores s JOIN users u ON u.id = s.user_id WHERE s.slug = ?"
  ).bind(slug).first();
  if (!row) return html(renderNotFound(), 404, "no-store");

  const planKey = effectivePlan({ plan: row.plan, plan_expires_at: row.plan_expires_at });
  const limits = PLANS[planKey];

  const [prodRes, imgRes] = await Promise.all([
    env.DB.prepare("SELECT id, name, price, description, in_stock FROM products WHERE store_id = ? ORDER BY created_at ASC LIMIT ?")
      .bind(row.id, Math.min(limits.products, 300)).all(),
    env.DB.prepare("SELECT product_id, key FROM product_images WHERE store_id = ? AND product_id NOT LIKE 'branding-%' ORDER BY created_at ASC, rowid ASC").bind(row.id).all(),
  ]);

  const byProduct = new Map();
  for (const im of imgRes.results) {
    const list = byProduct.get(im.product_id) || [];
    if (list.length < limits.images) list.push(`/img/${im.key}`);
    byProduct.set(im.product_id, list);
  }
  const products = prodRes.results.map((p) => ({ ...p, images: byProduct.get(p.id) || [] }));

  const origin = new URL(request.url).origin;
  return html(renderStore({ store: row, products, showBranding: planKey === "free", origin }));
}
