import { PLANS, effectivePlan } from "../../shared/plans.js";
import { esc, formatNaira, validSlug } from "../../shared/util.js";

function safeJson(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function renderNotFound() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Store not found · BioStore</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/store.css">
</head>
<body>
<main class="wrap" style="text-align:center;padding:96px 20px">
<h1 style="font:800 28px/1.15 Figtree,system-ui,sans-serif;letter-spacing:-.03em">This store doesn't exist</h1>
<p class="bio" style="margin-top:14px;color:var(--muted)">The link may be misspelled, or the seller changed it.</p>
<p style="margin-top:28px"><a class="btn" href="/signup" style="display:inline-block;padding:14px 24px;background:#0A0A0A;color:#FBF9F5;border-radius:999px;font:800 13px Figtree,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none">Open your own free store</a></p>
</main>
</body>
</html>`;
}

export function renderStore({ store, products, showBranding, origin }) {
  const url = `${origin}/store/${store.slug}`;
  const desc = store.bio || `Shop ${store.name}. Order on WhatsApp.`;
  const firstImage = products.find((p) => p.images && p.images.length)?.images[0];
  const initial = esc((store.name || "?").trim().charAt(0).toUpperCase());

  const productCount = products.length;
  const coverUrl = store.cover_url || store.coverUrl || "";

  // Product cards
  const cards = products
    .map((p) => {
      const firstImg = p.images && p.images.length ? p.images[0] : "";
      const hasCompare = p.compareAtPrice && p.compareAtPrice > p.price;
      const discountPct = hasCompare
        ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
        : 0;
      const showBadge = p.badge && String(p.badge).toLowerCase() !== "none";

      const media = firstImg
        ? `<img src="${esc(firstImg)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`
        : `<span class="letter" aria-hidden="true">${esc((p.name || "?").trim().charAt(0).toUpperCase())}</span>`;

      const badgeEl = !p.inStock
        ? `<span class="sold">Sold out</span>`
        : (hasCompare
            ? `<span class="badge discount">−${discountPct}%</span>`
            : (showBadge ? `<span class="badge">${esc(p.badge)}</span>` : ""));

      const priceEl = `<span class="pr">${esc(formatNaira(p.price))}</span>` +
        (hasCompare ? `<span class="pr strike">${esc(formatNaira(p.compareAtPrice))}</span>` : "");

      return `<button class="card" type="button" data-id="${esc(p.id)}" data-name="${esc(p.name)}" data-category="${esc(p.category || "")}">
  <span class="ph">${media}${badgeEl}</span>
  <span class="nm">${esc(p.name)}</span>
  <span class="pr-row">${priceEl}</span>
</button>`;
    })
    .join("\n");

  // Banner
  const bannerClass = coverUrl ? "banner has-image" : "banner";
  const bannerImg = coverUrl
    ? `<img class="banner-img" src="${esc(coverUrl)}" alt="" loading="eager" decoding="async"><div class="banner-overlay"></div>`
    : "";

  // Payload for store.js
  const data = {
    store: {
      name: store.name,
      slug: store.slug,
      whatsapp: store.whatsapp || "",
      bio: store.bio || "",
      coverUrl: coverUrl,
    },
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      compareAtPrice: p.compareAtPrice || p.compare_at_price || null,
      description: p.description || "",
      category: p.category || "",
      badge: p.badge || "",
      inStock: !!p.in_stock,
      images: p.images || [],
      variants: p.variants || null,
    })),
  };

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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/store.css">
</head>
<body>

<header class="top">
  <div class="top-inner">
    <a class="brand" href="/store/${esc(store.slug)}">${esc(store.name)}</a>
    <div class="top-actions">
      <button class="icon-btn" id="searchToggle" type="button" aria-label="Search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      </button>
      <button class="icon-btn" id="cartToggle" type="button" aria-label="Cart">
        <svg viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 3H3"/></svg>
        <span class="cart-count" id="cartCount" hidden>0</span>
      </button>
    </div>
  </div>
</header>

<section class="search-panel" id="searchPanel" hidden>
  <div class="search-panel-inner">
    <input type="search" class="search-input" id="searchInput" placeholder="Search products…" autocomplete="off">
  </div>
</section>

<section class="${bannerClass}">
  ${bannerImg}
  <div class="banner-inner">
    <div>
      <h1 class="banner-title">${esc(store.name)}</h1>
      ${store.bio ? `<p class="banner-sub">${esc(store.bio)}</p>` : ""}
    </div>
    <div class="banner-meta" id="gridCount">${productCount} ${productCount === 1 ? "item" : "items"}</div>
  </div>
</section>

<main>
  <div class="wrap">
    ${products.length
      ? `<section class="grid" id="grid" aria-label="Products">\n${cards}\n</section>`
      : `<p class="empty">No products yet. Check back soon.</p>`}
  </div>
</main>

${showBranding ? `<footer class="foot"><a href="/signup">Made with BioStore</a></footer>` : ""}

<!-- Cart drawer -->
<div class="drawer-bg" id="cartBg" aria-hidden="true"></div>
<aside class="drawer" id="cartDrawer" aria-label="Shopping bag">
  <div class="drawer-head">
    <h2>Your bag</h2>
    <button class="drawer-close" id="cartClose" type="button" aria-label="Close">
      <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <div class="drawer-body" id="cartBody"></div>
  <div class="drawer-foot" id="cartFoot" hidden>
    <div class="cart-total">
      <span class="label">Total</span>
      <span class="amount" id="cartTotalAmount">₦0</span>
    </div>
    <button class="cart-send" id="cartSend" type="button">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.48 3.106"/></svg>
      Send order on WhatsApp
    </button>
  </div>
</aside>

<!-- Product modal -->
<dialog id="sheet" aria-label="Product details"></dialog>

<!-- Toast -->
<div id="toast" role="status" aria-live="polite"></div>

<script type="application/json" id="data">${safeJson(data)}</script>
<script src="/store.js" defer></script>
</body>
</html>`;
}

export async function onRequestGet({ request, env, params }) {
  const slug = String(params.slug || "").toLowerCase();
  const html = (body, status = 200, cache = "public, max-age=60, s-maxage=60") =>
    new Response(body, {
      status,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache },
    });

  if (!validSlug(slug)) return html(renderNotFound(), 404, "no-store");

  const row = await env.DB.prepare(
    "SELECT s.*, u.plan AS plan, u.plan_expires_at AS plan_expires_at FROM stores s JOIN users u ON u.id = s.user_id WHERE s.slug = ?"
  ).bind(slug).first();
  if (!row) return html(renderNotFound(), 404, "no-store");

  const planKey = effectivePlan({ plan: row.plan, plan_expires_at: row.plan_expires_at });
  const limits = PLANS[planKey];

  const [prodRes, imgRes] = await Promise.all([
    env.DB.prepare(
      "SELECT id, name, price, compare_at_price, description, in_stock, category, badge, variants FROM products WHERE store_id = ? ORDER BY created_at ASC LIMIT ?"
    ).bind(row.id, Math.min(limits.products, 300)).all(),
    env.DB.prepare(
      "SELECT product_id, key FROM product_images WHERE store_id = ? AND product_id NOT LIKE 'branding-%' ORDER BY created_at ASC, rowid ASC"
    ).bind(row.id).all(),
  ]);

  const byProduct = new Map();
  for (const im of imgRes.results) {
    const list = byProduct.get(im.product_id) || [];
    if (list.length < limits.images) list.push(`/img/${im.key}`);
    byProduct.set(im.product_id, list);
  }

  const products = prodRes.results.map((p) => {
    let variants = null;
    if (p.variants) {
      try {
        const parsed = JSON.parse(p.variants);
        variants = parsed && parsed.suggested ? parsed : null;
      } catch (e) { variants = null; }
    }
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      compareAtPrice: p.compare_at_price || null,
      description: p.description || "",
      inStock: !!p.in_stock,
      category: p.category || "",
      badge: p.badge || "",
      variants,
      images: byProduct.get(p.id) || [],
    };
  });

  const origin = new URL(request.url).origin;
  return html(renderStore({ store: row, products, showBranding: planKey === "free", origin }));
}
