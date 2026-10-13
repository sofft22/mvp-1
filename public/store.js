/* BioStore — public store page */

(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var dataEl = document.getElementById("data");
  if (!dataEl) return;

  var DATA = {};
  try { DATA = JSON.parse(dataEl.textContent || "{}"); } catch (e) {}
  var STORE = DATA.store || {};
  var PRODUCTS = DATA.products || [];

  var SLUG = STORE.slug || "store";
  var CART_KEY = "biostore.cart." + SLUG;

  /* ---------- State ---------- */
  var cart = [];
  var current = null;
  var currentQty = 1;
  var currentVariant = null;
  var currentImageIdx = 0;

  /* ---------- Utilities ---------- */
  function naira(n) {
    return "₦" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- Cart persistence ---------- */
  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch (e) { cart = []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function cartCount() {
    return cart.reduce(function (n, it) { return n + it.qty; }, 0);
  }
  function cartTotal() {
    return cart.reduce(function (n, it) { return n + it.qty * it.unitPrice; }, 0);
  }

  /* ---------- Cart UI ---------- */
  function renderCartBadge() {
    var el = $("cartCount");
    if (!el) return;
    var c = cartCount();
    if (c > 0) {
      el.textContent = c > 99 ? "99+" : String(c);
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  function renderCart() {
    var body = $("cartBody");
    var foot = $("cartFoot");
    var totalEl = $("cartTotalAmount");
    if (!body) return;

    if (!cart.length) {
      body.innerHTML = '<div class="cart-empty">Your bag is empty.</div>';
      if (foot) foot.hidden = true;
      return;
    }
    if (foot) foot.hidden = false;

    body.innerHTML = cart.map(function (it, i) {
      var img = it.image
        ? '<div class="cart-thumb"><img src="' + esc(it.image) + '" alt=""></div>'
        : '<div class="cart-thumb"></div>';
      var variant = it.variant
        ? '<p class="cart-variant">' + esc(it.variant) + '</p>'
        : "";
      return '<div class="cart-item">' +
        img +
        '<div class="cart-info">' +
          '<p class="cart-name">' + esc(it.name) + '</p>' +
          variant +
          '<p class="cart-price">' + naira(it.unitPrice) + '</p>' +
        '</div>' +
        '<div class="cart-actions">' +
          '<div class="cart-qty">' +
            '<button type="button" data-cart-qty="' + i + '" data-dir="-1">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button type="button" data-cart-qty="' + i + '" data-dir="1">+</button>' +
          '</div>' +
          '<button type="button" class="cart-remove" data-cart-remove="' + i + '">Remove</button>' +
        '</div>' +
      '</div>';
    }).join("");

    if (totalEl) totalEl.textContent = naira(cartTotal());
  }

  function addToCart(product, qty, variant, unitPrice) {
    var image = (product.images && product.images[0]) || "";
    var key = product.id + "|" + (variant || "");
    var found = cart.find(function (it) { return it.key === key; });
    if (found) {
      found.qty += qty;
    } else {
      cart.push({
        key: key,
        id: product.id,
        name: product.name,
        image: image,
        variant: variant || null,
        unitPrice: unitPrice,
        qty: qty
      });
    }
    saveCart();
    renderCartBadge();
    renderCart();
  }

  function changeQty(i, delta) {
    var it = cart[i];
    if (!it) return;
    it.qty += delta;
    if (it.qty < 1) cart.splice(i, 1);
    saveCart();
    renderCartBadge();
    renderCart();
  }

  function removeItem(i) {
    cart.splice(i, 1);
    saveCart();
    renderCartBadge();
    renderCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCartBadge();
    renderCart();
  }

  /* ---------- Drawer ---------- */
  function openCart() {
    var d = $("cartDrawer");
    var bg = $("cartBg");
    if (d) d.classList.add("open");
    if (bg) bg.classList.add("open");
    document.body.style.overflow = "hidden";
    renderCart();
  }
  function closeCart() {
    var d = $("cartDrawer");
    var bg = $("cartBg");
    if (d) d.classList.remove("open");
    if (bg) bg.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- WhatsApp order ---------- */
  function sendOrderToWhatsApp() {
    if (!cart.length) return;
    var lines = ["Hi " + (STORE.name || "") + "!", "", "I'd like to order:", ""];
    cart.forEach(function (it) {
      var line = "• " + it.name;
      if (it.variant) line += " (" + it.variant + ")";
      line += " — " + it.qty + " × " + naira(it.unitPrice) + " = " + naira(it.qty * it.unitPrice);
      lines.push(line);
    });
    lines.push("");
    lines.push("Total: " + naira(cartTotal()));
    lines.push("");
    lines.push("Is this available?");
    var msg = lines.join("\n");
    var url = "https://wa.me/" + (STORE.whatsapp || "") + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  }

  /* ---------- Product modal ---------- */
  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function renderModal() {
    var sheet = $("sheet");
    if (!sheet || !current) return;
    var p = current;

    var images = (p.images && p.images.length) ? p.images.slice() : [];
    var variants = (p.variants && p.variants.suggested) || [];
    var selectedVariant = variants.find(function (v) { return v.label === currentVariant; });
    var priceDelta = selectedVariant ? selectedVariant.priceDelta : 0;
    var unitPrice = p.price + priceDelta;
    var displayCompare = p.compareAtPrice ? p.compareAtPrice + priceDelta : null;
    var canOrder = variants.length === 0 || currentVariant !== null;

    var slides = "";
    if (images.length) {
      slides = images.map(function (url) {
        return '<img src="' + esc(url) + '" alt="' + esc(p.name) + '">';
      }).join("");
    } else {
      slides = '<div class="pd-letter">' + esc((p.name || "?").charAt(0).toUpperCase()) + '</div>';
    }

    var dots = "";
    if (images.length > 1) {
      dots = '<div class="pd-dots">' + images.map(function (_, i) {
        return '<span class="' + (i === currentImageIdx ? "active" : "") + '"></span>';
      }).join("") + '</div>';
    }

    var variantsHtml = "";
    if (variants.length && p.inStock) {
      variantsHtml = '<p class="pd-label">Choose an option</p><div class="pd-variants">' +
        variants.map(function (v) {
          var active = currentVariant === v.label;
          return '<button type="button" class="pd-variant' + (active ? ' active' : '') + '" data-variant="' + esc(v.label) + '">' +
            esc(v.label) +
            (v.priceDelta > 0 ? '<span class="delta">+' + naira(v.priceDelta) + '</span>' : '') +
          '</button>';
        }).join("") + '</div>';
    }

    var inStock = p.inStock !== false;
    var bodyHtml = '<div class="pd-body">' +
      '<h2 class="pd-name">' + esc(p.name) + '</h2>' +
      '<div class="pd-price">' +
        '<span class="main">' + naira(unitPrice) + '</span>' +
        (displayCompare ? '<span class="cmp">' + naira(displayCompare) + '</span>' : '') +
      '</div>' +
      (p.description ? '<p class="pd-desc">' + esc(p.description) + '</p>' : '') +
      variantsHtml +
      (inStock
        ? '<div class="pd-qty-row">' +
            '<span class="pd-label" style="margin:0">Qty</span>' +
            '<div class="pd-qty">' +
              '<button type="button" data-qty="-1">−</button>' +
              '<span>' + currentQty + '</span>' +
              '<button type="button" data-qty="1">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="pd-actions">' +
            '<button type="button" class="pd-btn primary" id="pdAdd"' + (canOrder ? '' : ' disabled') + '>Add to bag</button>' +
            '<button type="button" class="pd-btn secondary" id="pdBuy"' + (canOrder ? '' : ' disabled') + '>Quick buy</button>' +
          '</div>' +
          (!canOrder ? '<p class="pd-label" style="text-align:center;color:var(--accent)">Choose an option first</p>' : '') +
          '<button type="button" class="pd-ask" id="pdAsk">Ask a question</button>'
        : '<div class="pd-sold">Sold out</div>') +
    '</div>';

    sheet.innerHTML =
      '<button type="button" class="pd-close" id="pdClose" aria-label="Close">' +
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<div class="pd">' +
        '<div class="pd-gallery">' +
          '<div class="pd-slides" id="pdSlides">' + slides + '</div>' +
          dots +
        '</div>' +
        bodyHtml +
      '</div>';

    /* Wire modal */
    var closeBtn = $("pdClose");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    var slidesEl = $("pdSlides");
    if (slidesEl && images.length > 1) {
      slidesEl.addEventListener("scroll", function () {
        var idx = Math.round(slidesEl.scrollLeft / slidesEl.clientWidth);
        if (idx !== currentImageIdx) {
          currentImageIdx = idx;
          var dotsWrap = sheet.querySelector(".pd-dots");
          if (dotsWrap) {
            dotsWrap.querySelectorAll("span").forEach(function (s, i) {
              s.className = i === idx ? "active" : "";
            });
          }
        }
      });
    }

    sheet.querySelectorAll("[data-qty]").forEach(function (b) {
      b.addEventListener("click", function () {
        currentQty = Math.max(1, currentQty + Number(b.getAttribute("data-qty")));
        renderModal();
      });
    });

    sheet.querySelectorAll("[data-variant]").forEach(function (b) {
      b.addEventListener("click", function () {
        currentVariant = b.getAttribute("data-variant");
        renderModal();
      });
    });

    var addBtn = $("pdAdd");
    if (addBtn) addBtn.addEventListener("click", function () {
      if (!canOrder) return;
      addToCart(p, currentQty, currentVariant, unitPrice);
      toast("Added to bag");
      closeModal();
      openCart();
    });

    var buyBtn = $("pdBuy");
    if (buyBtn) buyBtn.addEventListener("click", function () {
      if (!canOrder) return;
      var line = p.name;
      if (currentVariant) line += " (" + currentVariant + ")";
      var msg = "Hi " + (STORE.name || "") + "!\n\nI want to buy:\n\n" +
        "• " + line + "\n" +
        "• Qty: " + currentQty + "\n" +
        "• Total: " + naira(unitPrice * currentQty) + "\n\n" +
        "Is this available?";
      window.open("https://wa.me/" + (STORE.whatsapp || "") + "?text=" + encodeURIComponent(msg), "_blank");
      closeModal();
    });

    var askBtn = $("pdAsk");
    if (askBtn) askBtn.addEventListener("click", function () {
      var msg = "Hi " + (STORE.name || "") + "!\n\nI have a question about: " + p.name + "\n\n____";
      window.open("https://wa.me/" + (STORE.whatsapp || "") + "?text=" + encodeURIComponent(msg), "_blank");
    });
  }

  function openModal(id) {
    var p = findProduct(id);
    if (!p) return;
    current = p;
    currentQty = 1;
    currentVariant = null;
    currentImageIdx = 0;
    renderModal();
    var sheet = $("sheet");
    if (sheet && sheet.showModal) sheet.showModal();
  }

  function closeModal() {
    var sheet = $("sheet");
    if (sheet && sheet.close) sheet.close();
    current = null;
  }

  /* ---------- Search ---------- */
  function wireSearch() {
    var input = $("searchInput");
    var panel = $("searchPanel");
    var toggle = $("searchToggle");
    if (!input) return;

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.hidden = !panel.hidden;
        if (!panel.hidden) input.focus();
      });
    }

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var cards = document.querySelectorAll(".card");
      var visible = 0;
      cards.forEach(function (c) {
        var name = (c.getAttribute("data-name") || "").toLowerCase();
        var cat = (c.getAttribute("data-category") || "").toLowerCase();
        var match = !q || name.indexOf(q) >= 0 || cat.indexOf(q) >= 0;
        c.style.display = match ? "" : "none";
        if (match) visible++;
      });
      var countEl = $("gridCount");
      if (countEl) countEl.textContent = visible + (q ? "" : " items");
    });
  }

  /* ---------- Card click ---------- */
  function wireGrid() {
    var grid = $("grid");
    if (!grid) return;
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".card");
      if (!card) return;
      openModal(card.getAttribute("data-id"));
    });
  }

  /* ---------- Cart wiring ---------- */
  function wireCart() {
    var btn = $("cartToggle");
    var close = $("cartClose");
    var bg = $("cartBg");
    var send = $("cartSend");
    var body = $("cartBody");

    if (btn) btn.addEventListener("click", openCart);
    if (close) close.addEventListener("click", closeCart);
    if (bg) bg.addEventListener("click", closeCart);

    if (body) {
      body.addEventListener("click", function (e) {
        var q = e.target.closest("[data-cart-qty]");
        if (q) {
          changeQty(Number(q.getAttribute("data-cart-qty")), Number(q.getAttribute("data-dir")));
          return;
        }
        var r = e.target.closest("[data-cart-remove]");
        if (r) removeItem(Number(r.getAttribute("data-cart-remove")));
      });
    }

    if (send) send.addEventListener("click", sendOrderToWhatsApp);

    var sheet = $("sheet");
    if (sheet) {
      sheet.addEventListener("click", function (e) {
        if (e.target === sheet) closeModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeCart();
        closeModal();
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    loadCart();
    renderCartBadge();
    renderCart();
    wireGrid();
    wireCart();
    wireSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
