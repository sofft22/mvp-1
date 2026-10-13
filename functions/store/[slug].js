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
<main style="text-align:center;padding:96px 20px;font-family:'Figtree',system-ui,sans-serif;max-width:600px;margin:0 auto">
<h1 style="font:800 28px/1.15 'Figtree',sans-serif;letter-spacing:-.03em;margin:0">This store doesn't exist</h1>
<p style="margin-top:14px;color:#6B6660;font-size:15px">The link may be misspelled, or the seller changed it.</p>
<p style="margin-top:28px"><a href="/signup" style="display:inline-block;padding:14px 24px;background:#0A0A0A;color:#FBF9F5;border-radius:999px;font:800 12px 'Figtree',sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none">Open your own free store</a></p>
</main>
</body>
</html>`;
}

export function renderStore({ store, products, showBranding, origin }) {
  const url = `${origin}/store/${store.slug}`;
  const desc = store.bio || `Shop ${store.name}. Order on WhatsApp.`;
  const firstImage = products.find((p) => p.images && p.images.length)?.images[0];

  const productCount = products.length;
  const coverUrl = store.cover_url || store.coverUrl || "";
  const hasCover = !!coverUrl;

  /* ---------- Payload for store.js ---------- */
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
      compareAtPrice: p.compare_at_price || null,
      description: p.description || "",
      category: p.category || "",
      badge: p.badge || "",
      inStock: !!p.in_stock,
      createdAt: p.created_at || null,
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

<!-- Top nav -->
<header class="top">
  <div class="top-inner">
    <a class="brand" href="/store/${esc(store.slug)}">${esc(store.name)}</a>
    <div class="top-actions">
      <button class="icon-btn" id="searchToggle" type="button" aria-label="Search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      </button>
      <button class="icon-btn" id="cartToggle" type="button" aria-label="Bag">
        <svg viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 3H3"/></svg>
        <span class="cart-count" id="cartCount" hidden>0</span>
      </button>
    </div>
  </div>
</header>

<!-- Search panel -->
<section class="search-panel" id="searchPanel" hidden>
  <div class="search-panel-inner">
    <input type="search" class="search-input" id="searchInput" placeholder="Search products…" autocomplete="off">
  </div>
</section>

<!-- Hero -->
<section class="hero${hasCover ? " has-image" : ""}">
  ${hasCover ? `<img class="hero-img" src="${esc(coverUrl)}" alt="" loading="eager"><div class="hero-overlay"></div>` : ""}
  <div class="hero-inner">

    <!-- Normal hero (not searching) -->
    <div class="hero-row" id="heroNormal">
      <button class="hero-title-btn" id="heroTitleBtn" type="button" aria-label="Choose category">
        <h1 class="hero-title" id="heroTitle">Shop</h1>
        <svg class="hero-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      <div class="hero-meta">
        <p class="hero-count" id="heroCount">${productCount} ${productCount === 1 ? "PIECE" : "PIECES"}</p>
        <div style="position:relative">
          <button class="sort-btn" id="sortBtn" type="button" aria-label="Sort">
            <svg viewBox="0 0 24 24"><path d="M8 4v16M4 8l4-4 4 4"/><path d="M16 20V4M12 16l4 4 4-4"/></svg>
          </button>
          <div class="sort-menu" id="sortMenu"></div>
        </div>
      </div>
    </div>

    <!-- Search hero -->
    <div class="hero-search" id="heroSearch" hidden>
      <div class="hero-search-left">
        <button class="hero-back" id="heroBack" type="button" aria-label="Back to shop">
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style="min-width:0;flex:1">
          <p class="hero-search-label">Search</p>
          <h1 class="hero-search-query" id="heroSearchQuery"></h1>
          <p class="hero-search-count" id="heroSearchCount"></p>
        </div>
      </div>
      <button class="hero-clear" id="heroClear" type="button">Clear</button>
    </div>
  </div>
</section>

<!-- Products -->
<main>
  <div class="wrap">
    <section class="grid" id="grid" aria-label="Products"></section>
  </div>
</main>

${showBranding ? `<footer class="foot"><a href="/signup">Made with BioStore</a></footer>` : ""}

<!-- Category picker — desktop modal -->
<div class="panel-bg" id="catBg"></div>
<div class="cat-modal" id="catModal">
  <p class="cat-modal-head">Choose category</p>
  <div class="cat-list" id="catModalList"></div>
</div>

<!-- Category picker — mobile sheet -->
<div class="cat-sheet" id="catSheet">
  <div class="cat-sheet-handle"></div>
  <p class="cat-sheet-title">Choose category</p>
  <div class="cat-sheet-list" id="catSheetList"></div>
</div>

<!-- Cart drawer -->
<div class="drawer-bg" id="cartBg"></div>
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
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" fill="currentColor" stroke="none"/></svg>
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
      "SELECT id, name, price, compare_at_price, description, in_stock, category, badge, variants, created_at FROM products WHERE store_id = ? ORDER BY created_at ASC LIMIT ?"
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
      compare_at_price: p.compare_at_price || null,
      description: p.description || "",
      in_stock: !!p.in_stock,
      category: p.category || "",
      badge: p.badge || "",
      created_at: p.created_at || null,
      variants,
      images: byProduct.get(p.id) || [],
    };
  });

  const origin = new URL(request.url).origin;
  return html(renderStore({ store: row, products, showBranding: planKey === "free", origin }));
}
