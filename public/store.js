<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Store · BioStore</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#FBF9F5;
  --bg-2:#F4EFE7;
  --mat:#EFEAE2;
  --ink:#0A0A0A;
  --muted:#6B6660;
  --faint:#9A948C;
  --line:#E6DFD4;
  --accent:#C66B4F;
  --accent-soft:#F5E4DB;
  --danger:#B14A2E;
  --green:#1F6B37;
  --wa:#25D366;
  --cta:#0A0A0A;
  --cta-ink:#FBF9F5;
  --sans:"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif;
  box-sizing:border-box;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0;
  background:var(--bg);
  color:var(--ink);
  font:400 15.5px/1.55 var(--sans);
  -webkit-font-smoothing:antialiased;
  min-height:100dvh;
}
button{font-family:inherit}
input{font-family:inherit}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
[hidden],.hide{display:none!important}

.wrap{max-width:640px;margin:0 auto;padding:0 20px}

/* ---------- Header ---------- */
header.top{
  position:sticky;top:0;z-index:30;
  background:var(--bg);
  border-bottom:1px solid var(--line);
  padding-top:env(safe-area-inset-top,0px);
}
header.top .wrap{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;height:60px;
}
.brand{
  font-size:15px;font-weight:900;letter-spacing:.18em;
  text-transform:uppercase;flex-shrink:0;
  color:var(--ink);
}
.header-actions{display:flex;align-items:center;gap:4px}
.icon-btn{
  background:none;border:0;cursor:pointer;
  width:38px;height:38px;
  display:grid;place-items:center;
  color:var(--muted);
  border-radius:10px;
  transition:color .15s,background .15s;
}
.icon-btn:hover{color:var(--ink);background:var(--bg-2)}
.icon-btn svg{width:18px;height:18px;stroke-width:1.9}

/* ---------- Search bar ---------- */
.search-bar{
  padding:0 0 14px;
}
.search{
  position:relative;
  width:100%;
}
.search svg{
  position:absolute;left:14px;top:50%;
  transform:translateY(-50%);
  width:15px;height:15px;
  color:var(--faint);
  pointer-events:none;
}
.search input{
  width:100%;
  font:500 14.5px var(--sans);
  padding:12px 14px 12px 40px;
  border:1.5px solid var(--line);
  background:var(--bg);
  color:var(--ink);
  border-radius:12px;
  outline:none;
  transition:border-color .15s,box-shadow .15s;
  -webkit-appearance:none;
}
.search input::placeholder{color:var(--faint)}
.search input:focus{
  border-color:var(--cta);
  box-shadow:0 0 0 3px rgba(10,10,10,.06);
}

/* ---------- Main ---------- */
main{padding:0 0 80px}

/* ---------- Banner ---------- */
.banner{
  margin:0 -20px;
  aspect-ratio:16/9;
  max-height:260px;
  background:var(--mat);
  overflow:hidden;
  position:relative;
}
.banner img{width:100%;height:100%;object-fit:cover}
.banner.no-image{
  display:grid;place-items:center;
  background:linear-gradient(135deg, var(--bg-2) 0%, var(--mat) 100%);
}
.banner.no-image::after{
  content:"";
  position:absolute;
  inset:0;
  background:radial-gradient(circle at 30% 40%, rgba(198,107,79,.18), transparent 60%);
}

/* ---------- Store header info ---------- */
.store-info{
  text-align:center;
  padding:28px 0 32px;
  border-bottom:1px solid var(--line);
  margin-bottom:32px;
}
.store-name{
  font-size:26px;font-weight:800;
  letter-spacing:-.03em;
  line-height:1.15;
  margin:0 0 10px;
}
.store-bio{
  font-size:14px;
  color:var(--muted);
  line-height:1.6;
  max-width:34em;
  margin:0 auto;
}
.store-wa{
  display:inline-flex;align-items:center;gap:8px;
  margin-top:20px;
  font:700 13px var(--sans);
  background:var(--wa);color:#053b18;
  padding:12px 20px;border-radius:999px;
  letter-spacing:-.005em;
  transition:opacity .15s;
}
.store-wa:hover{opacity:.88}
.store-wa svg{width:16px;height:16px}

/* ---------- Products grid ---------- */
.section-head{
  display:flex;align-items:baseline;justify-content:space-between;
  gap:12px;margin-bottom:20px;
}
.section-head h2{
  font-size:11px;font-weight:900;
  letter-spacing:.22em;text-transform:uppercase;
  color:var(--faint);
  margin:0;
}
.section-head .count{
  font:600 12px var(--sans);
  color:var(--muted);
  font-variant-numeric:tabular-nums;
}

.grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:14px 12px;
}
@media (min-width:520px){
  .grid{grid-template-columns:repeat(3,1fr);gap:20px 16px}
}

.card{
  all:unset;
  box-sizing:border-box;
  cursor:pointer;
  display:block;
  transition:opacity .15s;
  -webkit-tap-highlight-color:transparent;
}
.card:hover{opacity:.75}
.card:active{opacity:.6}
.ph{
  position:relative;
  display:block;
  aspect-ratio:4/5;
  overflow:hidden;
  background:var(--mat);
  border-radius:10px;
}
.ph img{
  width:100%;height:100%;
  object-fit:cover;display:block;
}
.letter{
  position:absolute;inset:0;
  display:grid;place-items:center;
  font:900 44px var(--sans);
  color:var(--faint);
}
.sold{
  position:absolute;left:8px;top:8px;
  background:var(--cta);color:var(--cta-ink);
  font:900 9px var(--sans);
  letter-spacing:.14em;text-transform:uppercase;
  padding:4px 8px;border-radius:4px;
}
.nm{
  display:block;margin-top:10px;
  font:700 13px var(--sans);
  letter-spacing:-.01em;
  line-height:1.35;
  color:var(--ink);
  overflow:hidden;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
}
.pr{
  display:block;margin-top:4px;
  font:800 14px var(--sans);
  color:var(--ink);
  font-variant-numeric:tabular-nums;
  letter-spacing:-.01em;
}
.cmp{
  display:inline-block;
  font:500 12px var(--sans);
  color:var(--faint);
  text-decoration:line-through;
  margin-left:6px;
  font-variant-numeric:tabular-nums;
}
.badge{
  position:absolute;left:8px;top:8px;
  font:900 9px var(--sans);
  letter-spacing:.14em;text-transform:uppercase;
  background:var(--bg);
  color:var(--ink);
  padding:4px 8px;border-radius:4px;
}
.sold + .badge{top:26px}

.empty{
  text-align:center;
  color:var(--muted);
  padding:72px 20px;
  font-size:13.5px;
}

/* ---------- Product modal ---------- */
dialog{
  border:0;padding:0;background:var(--bg);color:var(--ink);
  width:100%;max-width:560px;
  margin:auto auto 0;
  max-height:94vh;
  overflow:auto;
  border-radius:20px 20px 0 0;
}
@media (min-width:600px){
  dialog{margin:auto;border-radius:20px}
}
dialog::backdrop{
  background:rgba(10,10,10,.55);
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
}
.sheet{padding:0 0 calc(24px + env(safe-area-inset-bottom,0px))}

.close{
  position:sticky;top:12px;
  float:right;margin:12px 12px 0 0;
  z-index:5;
  width:38px;height:38px;
  border:0;
  background:var(--bg);
  font-size:20px;cursor:pointer;
  color:var(--ink);line-height:1;
  border-radius:50%;
  display:grid;place-items:center;
  transition:color .15s,transform .15s;
}
.close:hover{color:var(--accent);transform:scale(1.05)}

.gallery{
  display:flex;
  overflow-x:auto;
  scroll-snap-type:x mandatory;
  background:var(--mat);
  border-radius:20px 20px 0 0;
  scrollbar-width:none;
}
.gallery::-webkit-scrollbar{display:none}
.gallery>*{
  flex:0 0 100%;
  scroll-snap-align:center;
  aspect-ratio:4/5;
  object-fit:cover;
  display:block;
}
.gallery .nophoto{
  display:grid;place-items:center;
  font:900 72px var(--sans);
  color:var(--faint);
}
.gallery-dots{
  display:flex;justify-content:center;gap:6px;
  padding:12px 0 0;
  position:absolute;
  bottom:16px;left:0;right:0;
  pointer-events:none;
}
.gallery-dots span{
  width:6px;height:6px;border-radius:50%;
  background:rgba(255,255,255,.5);
}
.gallery-dots span.active{background:#fff}

.body{padding:28px 24px 0}
.body h2{
  font:800 22px var(--sans);
  letter-spacing:-.025em;
  margin:0 0 12px;
  line-height:1.2;
}
.body .price-row{
  display:flex;align-items:baseline;gap:12px;
  margin-bottom:18px;
}
.body .price{
  font:800 24px var(--sans);
  color:var(--ink);
  font-variant-numeric:tabular-nums;
  letter-spacing:-.02em;
}
.body .price-cmp{
  font:500 15px var(--sans);
  color:var(--faint);
  text-decoration:line-through;
  font-variant-numeric:tabular-nums;
}
.body .desc{
  color:var(--muted);
  white-space:pre-line;
  margin:0 0 24px;
  font-size:14.5px;
  line-height:1.65;
}

.variants{
  margin-bottom:24px;
}
.variants-label{
  font:900 10.5px var(--sans);
  letter-spacing:.22em;text-transform:uppercase;
  color:var(--faint);
  margin:0 0 12px;
}
.variant-list{
  display:flex;flex-wrap:wrap;gap:8px;
}
.variant-btn{
  padding:10px 16px;
  font:700 12.5px var(--sans);
  border:1.5px solid var(--line);
  background:transparent;
  color:var(--ink);
  border-radius:999px;
  cursor:pointer;
  transition:all .15s;
}
.variant-btn:hover{border-color:var(--ink)}
.variant-btn.active{
  background:var(--cta);
  color:var(--cta-ink);
  border-color:var(--cta);
}
.variant-btn .delta{
  font-weight:800;
  margin-left:6px;
  color:var(--accent);
}
.variant-btn.active .delta{color:var(--accent-soft)}

.qty-row{
  display:flex;align-items:center;gap:16px;
  margin-bottom:24px;
}
.qty-label{
  font:900 10.5px var(--sans);
  letter-spacing:.22em;text-transform:uppercase;
  color:var(--faint);
}
.qty{
  display:inline-flex;
  border:1.5px solid var(--line);
  border-radius:10px;
  overflow:hidden;
}
.qty button{
  background:none;border:0;cursor:pointer;
  width:40px;height:40px;
  font:800 18px var(--sans);
  color:var(--ink);
  transition:background .15s;
}
.qty button:hover{background:var(--bg-2)}
.qty span{
  width:44px;height:40px;
  display:grid;place-items:center;
  font:800 14px var(--sans);
  color:var(--ink);
  border-left:1.5px solid var(--line);
  border-right:1.5px solid var(--line);
  font-variant-numeric:tabular-nums;
}

.order-btn{
  display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;
  padding:18px 24px;
  font:800 14px var(--sans);
  background:var(--wa);
  color:#053b18;
  border:0;cursor:pointer;
  border-radius:999px;
  letter-spacing:-.005em;
  transition:opacity .15s;
  margin-bottom:12px;
}
.order-btn:hover{opacity:.9}
.order-btn:disabled{opacity:.4;cursor:not-allowed}
.order-btn svg{width:18px;height:18px}

.ask-btn{
  display:flex;align-items:center;justify-content:center;
  width:100%;
  padding:15px 20px;
  font:700 13.5px var(--sans);
  background:transparent;
  color:var(--ink);
  border:1.5px solid var(--line);
  cursor:pointer;
  border-radius:999px;
  transition:border-color .15s;
}
.ask-btn:hover{border-color:var(--ink)}

.sold-out{
  padding:16px;
  text-align:center;
  font:800 12px var(--sans);
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--muted);
  border:1.5px solid var(--line);
  border-radius:999px;
}

/* ---------- Footer ---------- */
footer{
  text-align:center;
  padding:56px 20px 32px;
  color:var(--faint);
  font-size:12px;
  letter-spacing:.1em;
  text-transform:uppercase;
  font-weight:600;
}
footer a{color:var(--ink);font-weight:800;text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:4px}

/* ---------- Desktop ---------- */
@media (min-width:600px){
  .wrap{padding:0 24px}
  .banner{margin:0 -24px}
  .store-name{font-size:30px}
  .body{padding:32px 32px 0}
}
</style>
</head>
<body>

<header class="top">
  <div class="wrap" style="display:block;height:auto;padding-top:14px;padding-bottom:0">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;height:44px">
      <a class="brand" href="/" id="brandLink">BioStore</a>
      <div class="header-actions">
        <button class="icon-btn" id="shareBtn" type="button" aria-label="Share store">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4M12 2v13"/></svg>
        </button>
      </div>
    </div>
    <div class="search-bar">
      <div class="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input type="text" id="search" placeholder="Search products…" autocomplete="off">
      </div>
    </div>
  </div>
</header>

<main class="wrap" id="app">
  <p style="color:var(--muted);padding:40px 0">Loading store…</p>
</main>

<footer>
  <p>Powered by <a href="/">BioStore</a></p>
</footer>

<dialog id="modal">
  <div class="sheet" id="modalContent"></div>
</dialog>

<script>
var S = { store: null, products: [], filtered: [], query: "", current: null, qty: 1, variant: null, imageIndex: 0 };
var $ = function (id) { return document.getElementById(id); };
var slug = (location.pathname.split("/store/")[1] || "").split("/")[0] || new URLSearchParams(location.search).get("slug");

function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function naira(n) { return "₦" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

async function api(method, url) {
  var r = await fetch(url, { method: method, credentials: "same-origin" });
  var d = null;
  try { d = await r.json(); } catch (e) {}
  if (!r.ok) throw new Error((d && d.error) || "Could not load store.");
  return d;
}

async function load() {
  var d = await api("GET", "/api/store/" + encodeURIComponent(slug));
  S.store = d.store;
  S.products = d.products || [];
  S.filtered = S.products.slice();
  document.title = (S.store.name || "Store") + " · BioStore";
  $("brandLink").href = "/store/" + slug;
  $("brandLink").textContent = S.store.name || "BioStore";
  render();
}

function render() {
  var st = S.store;
  var h = "";

  // Banner
  if (st.coverUrl) {
    h += '<div class="banner"><img src="' + esc(st.coverUrl) + '" alt=""></div>';
  } else {
    h += '<div class="banner no-image"></div>';
  }

  // Store info
  h += '<div class="store-info">' +
    '<h1 class="store-name">' + esc(st.name || "Store") + '</h1>' +
    (st.bio ? '<p class="store-bio">' + esc(st.bio) + '</p>' : '') +
    (st.whatsapp ? '<a class="store-wa" href="https://wa.me/' + esc(st.whatsapp) + '?text=' + encodeURIComponent("Hi " + (st.name || "") + "!") + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.48 3.106"/></svg>' +
      'Chat with us</a>' : '') +
  '</div>';

  // Products heading
  h += '<div class="section-head">' +
    '<h2>' + (S.query ? "Results" : "Shop") + '</h2>' +
    '<div class="count">' + S.filtered.length + (S.query ? "" : " items") + '</div>' +
  '</div>';

  // Grid
  if (!S.filtered.length) {
    h += '<div class="empty">' + (S.query ? 'No products match "' + esc(S.query) + '".' : "No products yet.") + '</div>';
  } else {
    h += '<div class="grid">';
    S.filtered.forEach(function (p) {
      var img = (p.images && p.images[0] && p.images[0].url) || p.image_url || "";
      var hasBadge = p.badge && p.badge !== "none";
      var hasCompare = p.compareAtPrice && p.compareAtPrice > p.price;
      h += '<button class="card" data-id="' + esc(p.id) + '" type="button">' +
        '<div class="ph">' +
          (img
            ? '<img src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy">'
            : '<span class="letter">' + esc((p.name || "?").charAt(0).toUpperCase()) + '</span>') +
          (p.inStock === false ? '<span class="sold">Sold out</span>' : (hasBadge ? '<span class="badge">' + esc(p.badge) + '</span>' : '')) +
        '</div>' +
        '<span class="nm">' + esc(p.name) + '</span>' +
        '<span class="pr">' + naira(p.price) + (hasCompare ? '<span class="cmp">' + naira(p.compareAtPrice) + '</span>' : '') + '</span>' +
      '</button>';
    });
    h += '</div>';
  }

  $("app").innerHTML = h;
}

/* ---------- Search ---------- */
$("search").addEventListener("input", function (e) {
  S.query = e.target.value.trim().toLowerCase();
  if (!S.query) S.filtered = S.products.slice();
  else {
    S.filtered = S.products.filter(function (p) {
      return (p.name || "").toLowerCase().indexOf(S.query) >= 0 ||
             (p.category || "").toLowerCase().indexOf(S.query) >= 0 ||
             (p.description || "").toLowerCase().indexOf(S.query) >= 0;
    });
  }
  render();
});

/* ---------- Share store ---------- */
$("shareBtn").addEventListener("click", async function () {
  var url = location.href;
  var text = S.store.name || "My store";
  if (navigator.share) {
    try { await navigator.share({ title: text, url: url }); return; } catch (e) {}
  }
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  } catch (e) {
    prompt("Copy this link:", url);
  }
});

function toast(msg) {
  var t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = "position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:#0A0A0A;color:#FBF9F5;font:700 13px Figtree,system-ui,sans-serif;padding:13px 22px;border-radius:999px;z-index:200;box-shadow:0 10px 30px -10px rgba(0,0,0,.5)";
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 2000);
}

/* ---------- Product card click ---------- */
$("app").addEventListener("click", function (e) {
  var card = e.target.closest("[data-id]");
  if (!card) return;
  var p = S.products.find(function (x) { return x.id === card.getAttribute("data-id"); });
  if (p) openProduct(p);
});

/* ---------- Product modal ---------- */
function openProduct(p) {
  S.current = p;
  S.qty = 1;
  S.variant = null;
  S.imageIndex = 0;
  renderModal();
  $("modal").showModal();
  document.body.style.overflow = "hidden";
}

$("modal").addEventListener("close", function () {
  document.body.style.overflow = "";
  S.current = null;
});

$("modal").addEventListener("click", function (e) {
  if (e.target === $("modal")) {
    $("modal").close();
  }
});

function renderModal() {
  var p = S.current;
  if (!p) return;

  var images = [(p.images && p.images[0] && p.images[0].url) || p.image_url].concat(
    (p.images || []).slice(1).map(function (i) { return i.url || i; })
  ).filter(Boolean);

  var variants = (p.variants && p.variants.suggested) || [];
  var hasVariants = variants.length > 0;
  var selectedVariant = variants.find(function (v) { return v.label === S.variant; });
  var priceDelta = selectedVariant ? selectedVariant.priceDelta : 0;
  var displayPrice = p.price + priceDelta;
  var displayCompare = p.compareAtPrice ? p.compareAtPrice + priceDelta : null;
  var canOrder = !hasVariants || S.variant !== null;
  var inStock = p.inStock !== false;

  var h = '';

  h += '<button class="close" id="modalClose" aria-label="Close">×</button>';

  // Gallery
  h += '<div class="gallery" id="gallery">';
  if (images.length) {
    images.forEach(function (url, i) {
      h += '<img src="' + esc(url) + '" alt="' + esc(p.name) + ' — image ' + (i+1) + '">';
    });
  } else {
    h += '<div class="nophoto">' + esc((p.name || "?").charAt(0).toUpperCase()) + '</div>';
  }
  h += '</div>';

  // Body
  h += '<div class="body">';
  h += '<h2>' + esc(p.name) + '</h2>';

  h += '<div class="price-row">' +
    '<span class="price">' + naira(displayPrice) + '</span>' +
    (displayCompare ? '<span class="price-cmp">' + naira(displayCompare) + '</span>' : '') +
  '</div>';

  if (p.description) {
    h += '<p class="desc">' + esc(p.description) + '</p>';
  }

  if (hasVariants && inStock) {
    h += '<div class="variants">' +
      '<p class="variants-label">Choose an option</p>' +
      '<div class="variant-list">';
    variants.forEach(function (v) {
      var active = S.variant === v.label;
      h += '<button type="button" class="variant-btn' + (active ? ' active' : '') + '" data-variant="' + esc(v.label) + '">' +
        esc(v.label) +
        (v.priceDelta > 0 ? '<span class="delta">+' + naira(v.priceDelta) + '</span>' : '') +
      '</button>';
    });
    h += '</div></div>';
  }

  if (inStock) {
    h += '<div class="qty-row">' +
      '<span class="qty-label">Qty</span>' +
      '<div class="qty">' +
        '<button type="button" data-qty="-1">−</button>' +
        '<span>' + S.qty + '</span>' +
        '<button type="button" data-qty="1">+</button>' +
      '</div>' +
    '</div>';

    h += '<button class="order-btn" id="orderBtn"' + (canOrder ? '' : ' disabled') + '>' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.48 3.106"/></svg>' +
      (canOrder ? 'Order on WhatsApp' : 'Choose an option first') +
    '</button>';

    h += '<button class="ask-btn" id="askBtn" type="button">Ask a question</button>';
  } else {
    h += '<div class="sold-out">Sold out</div>';
  }

  h += '</div>';

  $("modalContent").innerHTML = h;

  // Wire
  $("modalClose").addEventListener("click", function () { $("modal").close(); });

  $("modalContent").addEventListener("click", function (e) {
    var q = e.target.closest("[data-qty]");
    if (q) {
      S.qty = Math.max(1, S.qty + Number(q.getAttribute("data-qty")));
      renderModal();
      return;
    }
    var v = e.target.closest("[data-variant]");
    if (v) {
      S.variant = v.getAttribute("data-variant");
      renderModal();
      return;
    }
  });

  var orderBtn = $("orderBtn");
  if (orderBtn) orderBtn.addEventListener("click", function () {
    if (!canOrder) return;
    var st = S.store;
    var msg = "Hi " + (st.name || "") + "!\n\n" +
      "I'd like to order:\n\n" +
      "• " + p.name + (S.variant ? " (" + S.variant + ")" : "") + "\n" +
      "• Qty: " + S.qty + "\n" +
      "• Price: " + naira(displayPrice * S.qty) + "\n\n" +
      "Is it available?";
    window.open("https://wa.me/" + st.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  });

  var askBtn = $("askBtn");
  if (askBtn) askBtn.addEventListener("click", function () {
    var st = S.store;
    var msg = "Hi " + (st.name || "") + "!\n\nI have a question about: " + p.name + "\n\n____";
    window.open("https://wa.me/" + st.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  });

  // Gallery swipe dots
  var gallery = $("gallery");
  if (gallery && images.length > 1) {
    var dots = document.createElement("div");
    dots.className = "gallery-dots";
    images.forEach(function (_, i) {
      var s = document.createElement("span");
      if (i === 0) s.className = "active";
      dots.appendChild(s);
    });
    gallery.parentElement.style.position = "relative";
    gallery.parentElement.appendChild(dots);
    gallery.addEventListener("scroll", function () {
      var idx = Math.round(gallery.scrollLeft / gallery.clientWidth);
      dots.querySelectorAll("span").forEach(function (s, i) {
        s.className = i === idx ? "active" : "";
      });
    });
  }
}

/* ---------- Boot ---------- */
if (!slug) {
  $("app").innerHTML = '<div class="empty">No store specified.</div>';
} else {
  load().catch(function (x) {
    $("app").innerHTML = '<div class="empty">' + esc(x.message) + '</div>';
  });
}
</script>
</body>
</html>
