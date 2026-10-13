/* BioStore — public store page. Matches KOVA reference. */

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
  --wa:#25D366;
  --dark:#0A0A0A;
  --dark-ink:#FBF9F5;
  --dark-muted:rgba(251,249,245,.5);
  --dark-line:rgba(251,249,245,.15);
  --sans:"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif;
  box-sizing:border-box;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{
  margin:0;
  background:var(--bg);
  color:var(--ink);
  font:400 15px/1.55 var(--sans);
  -webkit-font-smoothing:antialiased;
  min-height:100dvh;
}
button{font-family:inherit}
input{font-family:inherit}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
[hidden],.hide{display:none!important}

/* ================= TOP NAV (dark) ================= */
.top{
  position:sticky;top:0;z-index:30;
  background:var(--dark);
  color:var(--dark-ink);
  padding-top:env(safe-area-inset-top,0px);
}
.top-inner{
  max-width:1280px;margin:0 auto;padding:0 20px;
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;height:64px;
}
@media (min-width:640px){
  .top-inner{padding:0 32px;height:72px}
}
.brand{
  font-size:15px;font-weight:900;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--dark-ink);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  max-width:60%;
}
.top-actions{display:flex;align-items:center;gap:2px}
.icon-btn{
  background:none;border:0;cursor:pointer;
  width:42px;height:42px;
  display:grid;place-items:center;
  color:var(--dark-ink);
  border-radius:10px;
  position:relative;
  transition:background .15s;
}
.icon-btn:hover{background:rgba(255,255,255,.08)}
.icon-btn svg{width:20px;height:20px;stroke-width:1.8;stroke:currentColor;fill:none;stroke-linecap:round;stroke-linejoin:round}
.cart-count{
  position:absolute;top:4px;right:4px;
  min-width:18px;height:18px;padding:0 5px;
  background:var(--accent);color:#fff;
  border-radius:999px;
  font:800 10px/18px var(--sans);
  text-align:center;letter-spacing:0;
}

/* ================= SEARCH PANEL ================= */
.search-panel{
  background:var(--dark);color:var(--dark-ink);
  padding:0 0 16px;
}
.search-panel-inner{max-width:1280px;margin:0 auto;padding:0 20px}
@media (min-width:640px){.search-panel-inner{padding:0 32px}}
.search-input{
  width:100%;font:500 15px var(--sans);
  padding:13px 16px;
  background:rgba(255,255,255,.06);
  border:1.5px solid rgba(255,255,255,.1);
  color:var(--dark-ink);
  border-radius:12px;outline:none;
  -webkit-appearance:none;
  transition:border-color .15s,background .15s;
}
.search-input::placeholder{color:rgba(251,249,245,.4)}
.search-input:focus{
  border-color:rgba(255,255,255,.3);
  background:rgba(255,255,255,.1);
}

/* ================= HERO ================= */
.hero{
  background:var(--dark);color:var(--dark-ink);
  position:relative;
  overflow:hidden;
}
.hero.has-image{
  min-height:280px;
}
.hero-img{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;opacity:.55;
}
.hero-overlay{
  position:absolute;inset:0;
  background:linear-gradient(180deg, rgba(10,10,10,.35) 0%, rgba(10,10,10,.75) 100%);
}
.hero-inner{
  position:relative;
  max-width:1280px;margin:0 auto;
  padding:56px 20px 24px;
  min-height:200px;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  gap:20px;
}
@media (min-width:640px){
  .hero-inner{padding:80px 32px 32px;min-height:240px}
}
.hero.has-image .hero-inner{padding-top:120px;padding-bottom:40px}

.hero-row{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:16px;
}

/* Title (clickable, opens category picker) */
.hero-title-btn{
  background:none;border:0;cursor:pointer;
  display:flex;align-items:center;gap:12px;
  padding:0;
  color:inherit;
  text-align:left;
  min-width:0;
}
.hero-title{
  font-size:44px;font-weight:800;
  letter-spacing:-.04em;
  line-height:1;
  color:var(--dark-ink);
  margin:0;
  white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;
}
@media (min-width:640px){
  .hero-title{font-size:64px}
}
.hero-chev{
  width:18px;height:18px;flex-shrink:0;
  stroke-width:2;stroke:currentColor;fill:none;stroke-linecap:round;stroke-linejoin:round;
  color:var(--dark-muted);
  margin-top:6px;
  transition:transform .25s,color .15s;
}
.hero-title-btn:hover .hero-chev{
  transform:translateY(3px);
  color:var(--dark-ink);
}

/* Right side: count + sort */
.hero-meta{
  display:flex;align-items:center;gap:12px;
  flex-shrink:0;
  padding-bottom:6px;
}
@media (min-width:640px){
  .hero-meta{gap:16px}
}
.hero-count{
  font:800 10px var(--sans);
  letter-spacing:.22em;text-transform:uppercase;
  color:var(--dark-muted);
  white-space:nowrap;
}
.sort-btn{
  background:none;border:0;cursor:pointer;
  width:32px;height:32px;
  display:grid;place-items:center;
  color:var(--dark-ink);
  transition:opacity .15s;
}
.sort-btn:hover{opacity:.7}
.sort-btn svg{width:16px;height:16px;stroke-width:1.8;stroke:currentColor;fill:none;stroke-linecap:round;stroke-linejoin:round}

/* Search mode hero */
.hero-search{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;
}
.hero-search-left{display:flex;align-items:center;gap:16px;min-width:0;flex:1}
.hero-back{
  background:none;border:0;cursor:pointer;
  width:32px;height:32px;flex-shrink:0;
  display:grid;place-items:center;
  color:var(--dark-ink);
  transition:opacity .15s;
}
.hero-back:hover{opacity:.7}
.hero-back svg{width:16px;height:16px;stroke-width:1.8;stroke:currentColor;fill:none;stroke-linecap:round;stroke-linejoin:round}
.hero-search-label{
  font:800 10px var(--sans);
  letter-spacing:.28em;text-transform:uppercase;
  color:var(--dark-muted);
  margin:0 0 6px;
}
.hero-search-query{
  font-size:32px;font-weight:800;
  letter-spacing:-.03em;
  line-height:1.05;
  color:var(--dark-ink);
  margin:0;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.hero-search-count{
  font:600 12px var(--sans);
  color:var(--dark-muted);
  margin-top:6px;
}
@media (min-width:640px){
  .hero-search-query{font-size:44px}
}
.hero-clear{
  background:none;border:0;cursor:pointer;
  font:800 10.5px var(--sans);
  letter-spacing:.18em;text-transform:uppercase;
  color:var(--dark-muted);
  padding:8px 0;
  flex-shrink:0;
  transition:color .15s;
}
.hero-clear:hover{color:var(--dark-ink)}

/* ================= MAIN ================= */
main{padding:0 0 96px}
.wrap{
  max-width:1280px;margin:0 auto;padding:0 20px;
}
@media (min-width:640px){.wrap{padding:0 32px}}

/* ================= PRODUCT GRID ================= */
.grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  column-gap:8px;
  row-gap:40px;
  padding-top:56px;
}
@media (min-width:640px){
  .grid{grid-template-columns:repeat(3,1fr);column-gap:20px;row-gap:56px;padding-top:80px}
}

.card{
  all:unset;
  box-sizing:border-box;
  cursor:pointer;
  display:block;
  -webkit-tap-highlight-color:transparent;
}

/* Card image */
.ph{
  position:relative;
  display:block;
  aspect-ratio:4/5;
  overflow:hidden;
  border-radius:2px;
  background:var(--mat);
}
.ph img{
  position:absolute;inset:0;
  width:100%;height:100%;
  object-fit:cover;
  transition:opacity .5s,transform .7s;
}
.ph .alt-img{
  opacity:0;
}
.card:hover .ph .main-img.has-alt{opacity:0}
.card:hover .ph .alt-img{opacity:1}
.letter{
  position:absolute;inset:0;
  display:grid;place-items:center;
  font:900 56px var(--sans);
  color:var(--faint);
  background:var(--mat);
}

/* Mobile carousel */
.ph-slides{
  display:flex;
  overflow-x:auto;
  scroll-snap-type:x mandatory;
  scrollbar-width:none;
  height:100%;
}
.ph-slides::-webkit-scrollbar{display:none}
.ph-slides>div{
  flex:0 0 100%;
  scroll-snap-align:center;
  height:100%;
  position:relative;
}
.ph-slides img{
  position:relative;
  width:100%;height:100%;object-fit:cover;
}
@media (min-width:768px){
  .ph-slides{display:none}
}
.ph-progress{
  position:absolute;bottom:0;left:50%;
  transform:translateX(-50%);
  width:40px;height:3px;
  display:flex;
  z-index:2;
}
.ph-progress span{
  flex:1;height:100%;
  background:rgba(251,249,245,.35);
  transition:background .2s;
}
.ph-progress span.active{background:var(--dark-ink)}

/* Desktop hover swap */
.ph-desktop{
  position:absolute;inset:0;
  display:none;
}
@media (min-width:768px){
  .ph-desktop{display:block}
}

/* Badges */
.ph-badges{
  position:absolute;top:8px;left:8px;
  display:flex;flex-direction:column;align-items:flex-start;gap:6px;
  z-index:3;
  pointer-events:none;
}
@media (min-width:640px){
  .ph-badges{top:12px;left:12px}
}
.ph-badge{
  background:var(--bg);color:var(--ink);
  font:800 9px var(--sans);
  letter-spacing:.14em;text-transform:uppercase;
  padding:5px 9px;
}
@media (min-width:640px){
  .ph-badge{font-size:9.5px;padding:5px 10px}
}
.ph-badge.discount{
  background:var(--dark);color:var(--dark-ink);
}

/* Sold out overlay */
.ph-sold{
  position:absolute;inset:0;
  background:rgba(251,249,245,.8);
  display:grid;place-items:center;
  z-index:4;
  font:800 10px var(--sans);
  letter-spacing:.24em;text-transform:uppercase;
  color:var(--ink);
}

/* Desktop hover button */
.ph-hover-btn{
  position:absolute;left:0;right:0;bottom:0;
  display:none;
  justify-content:center;
  padding-bottom:24px;
  z-index:5;
  pointer-events:none;
}
@media (min-width:768px){
  .ph-hover-btn{display:flex}
}
.ph-hover-btn button{
  pointer-events:auto;
  background:var(--dark);color:#fff;
  border:0;cursor:pointer;
  padding:12px 24px;
  border-radius:6px;
  font:800 10.5px var(--sans);
  letter-spacing:.18em;text-transform:uppercase;
  transform:translateY(12px);
  opacity:0;
  transition:all .3s;
  box-shadow:0 4px 12px rgba(10,10,10,.15);
}
.card:hover .ph-hover-btn button{
  transform:translateY(0);
  opacity:1;
}
.ph-hover-btn button:hover{background:var(--accent)}

/* Meta below image */
.meta{
  display:block;
  margin-top:10px;
  text-align:left;
}
@media (min-width:640px){
  .meta{margin-top:12px}
}
.nm{
  display:block;
  font:600 11.5px var(--sans);
  letter-spacing:.08em;
  text-transform:uppercase;
  line-height:1.4;
  color:var(--ink);
  margin:0 0 2px;
  overflow:hidden;
  display:-webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient:vertical;
}
@media (min-width:640px){
  .nm{font-size:12px;letter-spacing:.09em}
}
.pr-row{
  display:flex;align-items:baseline;gap:8px;
  margin-top:4px;
}
.pr{
  font:500 11.5px var(--sans);
  letter-spacing:.06em;
  color:rgba(10,10,10,.55);
  font-variant-numeric:tabular-nums;
}
@media (min-width:640px){
  .pr{font-size:12px}
}
.pr.strike{
  color:rgba(10,10,10,.35);
  text-decoration:line-through;
}

.empty{
  text-align:center;
  color:var(--muted);
  padding:80px 20px;
  font-size:13.5px;
  font-weight:500;
}

/* ================= PAGINATION ================= */
.pager{
  display:flex;align-items:center;justify-content:center;
  gap:4px;
  margin-top:64px;
}
.pager button,.pager span{
  min-width:36px;height:36px;
  padding:0 8px;
  display:grid;place-items:center;
  font:800 11px var(--sans);
  letter-spacing:.14em;text-transform:uppercase;
  color:rgba(10,10,10,.45);
  background:none;border:0;cursor:pointer;
  transition:color .15s;
}
.pager button:hover{color:var(--ink)}
.pager button[aria-current="page"]{color:var(--ink)}
.pager button:disabled{opacity:.3;cursor:not-allowed}
.pager svg{width:14px;height:14px;stroke-width:1.8;stroke:currentColor;fill:none;stroke-linecap:round;stroke-linejoin:round}

/* ================= FOOTER ================= */
.foot{
  text-align:center;
  padding:48px 20px 32px;
  color:var(--faint);
  font-size:11px;
  letter-spacing:.14em;
  text-transform:uppercase;
  font-weight:700;
  border-top:1px solid var(--line);
  margin-top:48px;
}
.foot a{
  color:var(--ink);
  font-weight:800;
  text-decoration:underline;
  text-decoration-color:var(--accent);
  text-underline-offset:4px;
}

/* ================= CATEGORY / SORT PANELS ================= */
.panel-bg{
  position:fixed;inset:0;z-index:50;
  background:rgba(10,10,10,.5);
  opacity:0;pointer-events:none;
  transition:opacity .25s;
}
.panel-bg.open{opacity:1;pointer-events:auto}

/* Desktop category modal — centered */
.cat-modal{
  position:fixed;z-index:60;
  top:50%;left:50%;
  transform:translate(-50%,-50%) scale(.95);
  width:100%;max-width:360px;
  background:var(--dark);color:var(--dark-ink);
  border-radius:8px;
  border:1px solid var(--dark-line);
  padding:8px 0;
  opacity:0;pointer-events:none;
  transition:all .2s;
  box-shadow:0 20px 60px rgba(0,0,0,.4);
  max-height:80vh;
  overflow:hidden;
  display:none;
}
@media (min-width:640px){
  .cat-modal{display:block}
}
.cat-modal.open{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
.cat-modal-head{
  padding:14px 20px;
  font:800 10px var(--sans);
  letter-spacing:.28em;text-transform:uppercase;
  color:var(--dark-muted);
  border-bottom:1px solid var(--dark-line);
  margin:0;
}
.cat-list{
  max-height:60vh;
  overflow-y:auto;
  padding:4px 0;
}
.cat-item{
  display:flex;align-items:center;justify-content:space-between;
  width:100%;
  padding:12px 20px;
  background:none;border:0;cursor:pointer;
  font:500 13.5px var(--sans);
  color:rgba(251,249,245,.75);
  text-align:left;
  transition:background .15s,color .15s;
}
.cat-item:hover{background:rgba(255,255,255,.05);color:var(--dark-ink)}
.cat-item.active{background:rgba(255,255,255,.08);color:var(--dark-ink);font-weight:700}
.cat-dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--accent);
  flex-shrink:0;
}

/* Mobile category — bottom sheet */
.cat-sheet{
  position:fixed;left:0;right:0;bottom:0;z-index:60;
  background:var(--dark);color:var(--dark-ink);
  border-radius:16px 16px 0 0;
  padding:8px 0 calc(24px + env(safe-area-inset-bottom,0px));
  transform:translateY(100%);
  transition:transform .3s cubic-bezier(.2,.8,.3,1);
  box-shadow:0 -10px 40px rgba(0,0,0,.4);
}
.cat-sheet.open{transform:translateY(0)}
@media (min-width:640px){
  .cat-sheet{display:none}
}
.cat-sheet-handle{
  width:40px;height:4px;
  background:rgba(251,249,245,.2);
  border-radius:999px;
  margin:6px auto 12px;
}
.cat-sheet-title{
  padding:0 24px 12px;
  font:800 10px var(--sans);
  letter-spacing:.28em;text-transform:uppercase;
  color:var(--dark-muted);
  margin:0;
}
.cat-sheet-list{
  max-height:60vh;overflow-y:auto;
}
.cat-sheet-item{
  display:flex;align-items:center;justify-content:space-between;
  width:100%;
  padding:16px 24px;
  background:none;border:0;cursor:pointer;
  font:700 20px var(--sans);
  letter-spacing:-.02em;
  color:rgba(251,249,245,.6);
  text-align:left;
  transition:color .15s;
}
.cat-sheet-item:hover,.cat-sheet-item.active{color:var(--dark-ink)}

/* Sort dropdown */
.sort-menu{
  position:absolute;top:100%;right:0;
  z-index:60;
  margin-top:12px;
  width:220px;
  background:var(--dark);color:var(--dark-ink);
  border-radius:6px;
  border:1px solid var(--dark-line);
  padding:4px 0;
  opacity:0;pointer-events:none;
  transform:translateY(-8px);
  transition:all .2s;
  box-shadow:0 20px 40px rgba(0,0,0,.4);
}
.sort-menu.open{opacity:1;pointer-events:auto;transform:translateY(0)}
.sort-item{
  display:block;width:100%;
  padding:10px 16px;
  background:none;border:0;cursor:pointer;
  text-align:left;
  font:500 12.5px var(--sans);
  color:rgba(251,249,245,.7);
  transition:background .15s,color .15s;
}
.sort-item:hover{background:rgba(255,255,255,.05);color:var(--dark-ink)}
.sort-item.active{background:rgba(255,255,255,.1);color:var(--dark-ink);font-weight:700}

/* ================= MODAL (KOVA-style) ================= */
dialog#sheet{
  border:0;padding:0;
  background:var(--bg);
  color:var(--ink);
  width:100%;max-width:1040px;
  margin:auto;
  max-height:96vh;
  overflow:hidden;
  border-radius:0;
}
dialog#sheet::backdrop{
  background:rgba(10,10,10,.6);
  backdrop-filter:blur(3px);
  -webkit-backdrop-filter:blur(3px);
}
@media (min-width:640px){
  dialog#sheet{border-radius:4px}
}
@media (max-width:639px){
  dialog#sheet{
    max-height:100vh;
    height:100vh;
  }
}

.pd-scroll{
  max-height:96vh;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch;
}
@media (max-width:639px){
  .pd-scroll{height:100vh;max-height:100vh}
}

.pd-close{
  position:absolute;top:16px;right:16px;
  z-index:10;
  width:36px;height:36px;
  background:var(--bg);
  color:var(--ink);
  border:0;cursor:pointer;
  display:grid;place-items:center;
  transition:color .15s;
}
.pd-close:hover{color:var(--accent)}
.pd-close svg{width:16px;height:16px;stroke-width:1.5;stroke:currentColor;fill:none;stroke-linecap:round}

.pd{
  display:grid;
  grid-template-columns:1fr;
  min-height:0;
}
@media (min-width:640px){
  .pd{grid-template-columns:1fr 1fr;min-height:600px}
}

/* Image column */
.pd-image-col{
  background:var(--bg);
  position:relative;
}
.pd-image-main{
  position:relative;
  aspect-ratio:4/5;
  background:var(--bg);
  overflow:hidden;
}
@media (min-width:640px){
  .pd-image-main{aspect-ratio:auto;height:100%;min-height:600px}
}
.pd-slides{
  display:flex;
  overflow-x:auto;
  scroll-snap-type:x mandatory;
  scrollbar-width:none;
  height:100%;
}
.pd-slides::-webkit-scrollbar{display:none}
.pd-slides>*{
  flex:0 0 100%;
  scroll-snap-align:center;
  aspect-ratio:4/5;
  object-fit:contain;
  display:block;
  background:var(--bg);
}
@media (min-width:640px){
  .pd-slides>*{aspect-ratio:auto;height:100%}
}
.pd-letter{
  display:grid;place-items:center;
  font:900 96px var(--sans);
  color:var(--faint);
  height:100%;
  min-height:400px;
}
.pd-dots{
  position:absolute;bottom:16px;left:0;right:0;
  display:flex;justify-content:center;gap:6px;
  pointer-events:none;
}
@media (min-width:640px){
  .pd-dots{display:none}
}
.pd-dots span{
  width:6px;height:6px;border-radius:999px;
  background:rgba(10,10,10,.3);
  transition:all .2s;
}
.pd-dots span.active{
  width:20px;
  background:var(--ink);
}

/* Thumbnails (desktop) */
.pd-thumbs{
  display:none;
  gap:8px;
  padding:12px;
}
@media (min-width:640px){
  .pd-thumbs{display:flex}
}
.pd-thumb{
  width:64px;height:64px;
  background:var(--bg-2);
  border:1px solid transparent;
  cursor:pointer;
  padding:0;
  overflow:hidden;
  transition:border-color .15s;
}
.pd-thumb img{width:100%;height:100%;object-fit:contain}
.pd-thumb.active{border-color:var(--ink)}

/* Info column */
.pd-info{
  padding:24px 20px 32px;
  background:var(--bg);
}
@media (min-width:640px){
  .pd-info{padding:48px 48px 48px 32px}
}
.pd-name{
  font:600 15px var(--sans);
  letter-spacing:.12em;
  text-transform:uppercase;
  line-height:1.4;
  margin:0 0 16px;
  color:var(--ink);
}
@media (min-width:640px){
  .pd-name{font-size:16px;letter-spacing:.14em;margin-bottom:20px}
}
.pd-price-row{
  display:flex;align-items:baseline;gap:16px;
  margin-bottom:24px;
}
@media (min-width:640px){
  .pd-price-row{margin-bottom:28px}
}
.pd-price{
  font:500 22px var(--sans);
  letter-spacing:-.01em;
  color:var(--ink);
  font-variant-numeric:tabular-nums;
}
@media (min-width:640px){
  .pd-price{font-size:26px}
}
.pd-compare{
  font:400 14px var(--sans);
  color:rgba(10,10,10,.4);
  text-decoration:line-through;
  font-variant-numeric:tabular-nums;
}
.pd-desc{
  color:rgba(10,10,10,.7);
  white-space:pre-line;
  margin:0 0 28px;
  font-size:14px;
  line-height:1.7;
}
@media (min-width:640px){
  .pd-desc{font-size:14.5px;margin-bottom:32px}
}

.pd-label{
  font:800 10.5px var(--sans);
  letter-spacing:.2em;text-transform:uppercase;
  color:rgba(10,10,10,.5);
  margin:0 0 12px;
}

/* Variants */
.pd-variants{
  display:flex;flex-wrap:wrap;gap:10px;
  margin-bottom:32px;
}
.pd-variant{
  padding:10px 20px;
  font:800 11px var(--sans);
  letter-spacing:.14em;text-transform:uppercase;
  background:transparent;
  color:var(--ink);
  border:1px solid var(--line);
  cursor:pointer;
  transition:all .2s;
}
.pd-variant:hover{border-color:var(--ink)}
.pd-variant.active{
  background:var(--dark);
  color:var(--dark-ink);
  border-color:var(--dark);
}
.pd-variant .delta{
  font-weight:500;
  letter-spacing:0;
  margin-left:8px;
  color:var(--accent);
}
.pd-variant.active .delta{color:var(--dark-ink)}

/* Qty */
.pd-qty-row{
  display:flex;align-items:center;gap:16px;
  margin-bottom:32px;
}
.pd-qty{
  display:inline-flex;
  border:1px solid var(--line);
}
.pd-qty button{
  background:none;border:0;cursor:pointer;
  width:40px;height:40px;
  font:400 18px var(--sans);
  color:var(--ink);
  transition:background .15s;
}
.pd-qty button:hover{background:var(--bg-2)}
.pd-qty span{
  width:40px;
  display:grid;place-items:center;
  font:500 14px var(--sans);
  border-left:1px solid var(--line);
  border-right:1px solid var(--line);
  font-variant-numeric:tabular-nums;
}

/* Actions */
.pd-actions{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
  margin-bottom:16px;
}
.pd-btn{
  display:flex;align-items:center;justify-content:center;
  padding:16px 20px;
  font:800 10.5px var(--sans);
  letter-spacing:.2em;text-transform:uppercase;
  border:0;cursor:pointer;
  transition:all .2s;
}
.pd-btn.primary{
  background:var(--dark);
  color:var(--dark-ink);
}
.pd-btn.primary:hover{background:var(--accent)}
.pd-btn.secondary{
  background:transparent;
  color:var(--ink);
  border:1px solid var(--ink);
}
.pd-btn.secondary:hover{
  background:var(--dark);
  color:var(--dark-ink);
  border-color:var(--dark);
}
.pd-btn:disabled{opacity:.4;cursor:not-allowed}

.pd-ask{
  display:block;width:100%;
  background:none;border:0;cursor:pointer;
  text-align:center;
  font:800 10.5px var(--sans);
  letter-spacing:.18em;text-transform:uppercase;
  color:rgba(10,10,10,.5);
  padding:10px 0;
  margin-bottom:32px;
  transition:color .15s;
}
.pd-ask:hover{
  color:var(--accent);
  text-decoration:underline;
  text-underline-offset:4px;
}

.pd-sold{
  padding:16px;
  text-align:center;
  font:800 10.5px var(--sans);
  letter-spacing:.2em;text-transform:uppercase;
  color:rgba(10,10,10,.5);
  border:1px solid var(--line);
  margin-bottom:24px;
}

/* Share */
.pd-share{
  display:flex;align-items:center;gap:16px;
  padding-top:24px;
  border-top:1px solid var(--line);
}
.pd-share-label{
  font:800 10.5px var(--sans);
  letter-spacing:.2em;text-transform:uppercase;
  color:rgba(10,10,10,.5);
}
.pd-share-btn{
  width:36px;height:36px;
  display:grid;place-items:center;
  background:none;
  border:1px solid var(--line);
  color:var(--ink);
  cursor:pointer;
  transition:all .2s;
}
.pd-share-btn:hover{
  border-color:var(--accent);
  color:var(--accent);
}
.pd-share-btn svg{width:16px;height:16px;stroke-width:1.8;stroke:currentColor;fill:none}
.pd-copied{
  font:800 10.5px var(--sans);
  letter-spacing:.14em;text-transform:uppercase;
  color:var(--accent);
  opacity:0;
  transition:opacity .3s;
}
.pd-copied.show{opacity:1}

/* ================= CART DRAWER ================= */
.drawer-bg{
  position:fixed;inset:0;z-index:70;
  background:rgba(10,10,10,.5);
  opacity:0;pointer-events:none;
  transition:opacity .25s;
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
}
.drawer-bg.open{opacity:1;pointer-events:auto}

.drawer{
  position:fixed;top:0;right:0;bottom:0;
  width:100%;max-width:440px;
  background:var(--bg);
  z-index:80;
  display:flex;flex-direction:column;
  transform:translateX(100%);
  transition:transform .3s cubic-bezier(.2,.8,.3,1);
  padding-top:env(safe-area-inset-top,0px);
  padding-bottom:env(safe-area-inset-bottom,0px);
}
.drawer.open{transform:translateX(0)}

.drawer-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 22px;
  border-bottom:1px solid var(--line);
}
.drawer-head h2{
  font:800 17px var(--sans);
  letter-spacing:-.02em;margin:0;
}
.drawer-close{
  background:none;border:0;cursor:pointer;
  width:36px;height:36px;
  display:grid;place-items:center;
  color:var(--muted);
  transition:color .15s;
}
.drawer-close:hover{color:var(--ink)}
.drawer-close svg{width:16px;height:16px;stroke-width:2;stroke:currentColor;fill:none;stroke-linecap:round}

.drawer-body{
  flex:1;overflow-y:auto;
  padding:8px 0;
}
.cart-item{
  display:grid;grid-template-columns:64px 1fr auto;
  gap:14px;align-items:start;
  padding:16px 22px;
  border-bottom:1px solid var(--line);
}
.cart-thumb{
  width:64px;height:80px;
  background:var(--mat);overflow:hidden;
}
.cart-thumb img{width:100%;height:100%;object-fit:cover}
.cart-info{min-width:0}
.cart-name{
  font:600 13px var(--sans);
  letter-spacing:.02em;margin:0 0 4px;line-height:1.35;
}
.cart-variant{
  font:500 12px var(--sans);
  color:var(--faint);margin:0 0 4px;
}
.cart-price{
  font:700 13.5px var(--sans);
  font-variant-numeric:tabular-nums;
}
.cart-actions{
  display:flex;flex-direction:column;align-items:flex-end;gap:8px;
}
.cart-qty{
  display:inline-flex;
  border:1px solid var(--line);
}
.cart-qty button{
  background:none;border:0;cursor:pointer;
  width:28px;height:28px;
  font:400 14px var(--sans);
  color:var(--ink);
}
.cart-qty span{
  width:30px;
  display:grid;place-items:center;
  font:600 12.5px var(--sans);
  border-left:1px solid var(--line);
  border-right:1px solid var(--line);
}
.cart-remove{
  background:none;border:0;cursor:pointer;
  font:700 10px var(--sans);
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--faint);
  padding:0;
}
.cart-remove:hover{color:var(--accent)}

.cart-empty{
  padding:80px 22px;
  text-align:center;
  color:var(--muted);
  font-size:13.5px;
}

.drawer-foot{
  padding:20px 22px;
  border-top:1px solid var(--line);
}
.cart-total{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-bottom:16px;
}
.cart-total .label{
  font:800 10.5px var(--sans);
  letter-spacing:.22em;text-transform:uppercase;
  color:var(--faint);
}
.cart-total .amount{
  font:800 20px var(--sans);
  letter-spacing:-.02em;
  font-variant-numeric:tabular-nums;
}
.cart-send{
  display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;
  padding:18px 24px;
  font:800 11px var(--sans);
  letter-spacing:.2em;text-transform:uppercase;
  background:var(--wa);color:#053b18;
  border:0;cursor:pointer;
  transition:opacity .15s;
}
.cart-send:hover{opacity:.9}
.cart-send:disabled{opacity:.4;cursor:not-allowed}
.cart-send svg{width:18px;height:18px;fill:currentColor}

/* ================= TOAST ================= */
#toast{
  position:fixed;left:50%;bottom:32px;
  transform:translate(-50%,140%);
  background:var(--dark);color:var(--dark-ink);
  font:700 13px var(--sans);
  padding:14px 22px;
  border-radius:999px;
  box-shadow:0 12px 32px -10px rgba(10,10,10,.5);
  transition:transform .3s cubic-bezier(.2,.8,.3,1);
  z-index:200;
  max-width:calc(100% - 40px);
  text-align:center;
}
#toast.show{transform:translate(-50%,0)}

/* ================= SKELETON ================= */
@keyframes sk-pulse{0%,100%{opacity:.5}50%{opacity:.8}}
.sk{
  background:var(--bg-2);
  animation:sk-pulse 1.5s ease-in-out infinite;
}
