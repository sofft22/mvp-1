import { esc, formatNaira } from "./util.js";

const HEAD_FONTS = `font-family:Georgia,"Times New Roman",serif`;

function safeJson(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function renderNotFound() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Store not found · BIOSHOP</title><link rel="stylesheet" href="/store.css"></head>
<body><main class="wrap" style="text-align:center;padding-top:96px">
<h1 style="${HEAD_FONTS}">This store doesn't exist</h1>
<p class="bio">The link may be misspelled, or the seller changed it.</p>
<p><a class="btn" href="/signup">Open your own free store</a></p></main></body></html>`;
}

// store: { name, slug, bio, whatsapp, bank_name, account_name, account_number }
// products: [{ id, name, price, description, in_stock, images: [url] }]
export function renderStore({ store, products, showBranding, origin }) {
  const url = `${origin}/store/${store.slug}`;
  const desc = store.bio || `Shop ${store.name}. Tap a product to order on WhatsApp or pay by bank transfer.`;
  const firstImage = products.find((p) => p.images.length)?.images[0];
  const initial = esc((store.name || "?").trim().charAt(0).toUpperCase());

  const cards = products
    .map((p) => {
      const media = p.images.length
        ? `<img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" decoding="async" width="400" height="400">`
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
<link rel="stylesheet" href="/store.css">
</head>
<body>
<main class="wrap">
  <header class="head">
    <div class="avatar" aria-hidden="true">${initial}</div>
    <h1>${esc(store.name)}</h1>
    ${store.bio ? `<p class="bio">${esc(store.bio)}</p>` : ""}
    ${waHello}
  </header>
  ${products.length ? `<section class="grid" aria-label="Products">\n${cards}\n</section>` : `<p class="empty">No products yet. Check back soon.</p>`}
  ${showBranding ? `<footer class="foot"><a href="/signup">Made with BIOSHOP. Open your free store</a></footer>` : ""}
</main>
<dialog id="sheet" aria-label="Product details"></dialog>
<script type="application/json" id="data">${safeJson(data)}</script>
<script src="/store.js" defer></script>
</body>
</html>`;
}
