/* BioStore — public store page. Vanilla JS. */

(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return (root || document).querySelectorAll(sel); };

  var dataEl = document.getElementById("data");
  if (!dataEl) return;

  var DATA = {};
  try { DATA = JSON.parse(dataEl.textContent || "{}"); } catch (e) {}
  var STORE = DATA.store || {};
  var ALL = DATA.products || [];
  var SLUG = STORE.slug || "store";
  var CART_KEY = "biostore.cart." + SLUG;

  /* ---------- State ---------- */
  var cart = [];
  var current = null;
  var currentQty = 1;
  var currentVariant = null;
  var currentImageIdx = 0;

  var filters = {
    category: "all",
    sort: "featured",
    query: ""
  };

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

  /* ---------- Product grid render ---------- */
  function findProduct(id) {
    for (var i = 0; i < ALL.length; i++) {
      if (ALL[i].id === id) return ALL[i];
    }
    return null;
  }

  function sortProducts(list, sort) {
    var out = list.slice();
    switch (sort) {
      case "newest":
        out.sort(function (a, b) {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        break;
      case "price-asc":
        out.sort(function (a, b) { return a.price - b.price; });
        break;
      case "price-desc":
        out.sort(function (a, b) { return b.price - a.price; });
        break;
      case "name":
        out.sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
        break;
      default:
        // featured: keep original order from server
        break;
    }
    return out;
  }

  function filterProducts() {
    var q = filters.query.toLowerCase();
    var list = ALL.slice();
    if (q) {
      list = list.filter(function (p) {
        return (p.name || "").toLowerCase().indexOf(q) >= 0 ||
               (p.category || "").toLowerCase().indexOf(q) >= 0 ||
               (p.description || "").toLowerCase().indexOf(q) >= 0;
      });
    } else if (filters.category !== "all") {
      list = list.filter(function (p) {
        return (p.category || "") === filters.category;
      });
    }
    return sortProducts(list, filters.sort);
  }

  function renderCard(p) {
    var images = (p.images && p.images.length) ? p.images.slice(0, 3) : [];
    var hasCompare = p.compareAtPrice && p.compareAtPrice > p.price;
    var discountPct = hasCompare
      ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
      : 0;
    var showBadge = p.badge && String(p.badge).toLowerCase() !== "none";
    var hasVariants = p.variants && p.variants.suggested && p.variants.suggested.length > 0;

    /* Image markup */
    var media = "";
    if (images.length) {
      var slides = images.map(function (url, i) {
        return '<div><img src="' + esc(url) + '" alt="' + esc(p.name) + '" loading="' + (i === 0 ? "eager" : "lazy") + '"></div>';
      }).join("");
      var progress = images.length > 1
        ? '<div class="ph-progress">' + images.map(function (_, i) {
            return '<span class="' + (i === 0 ? "active" : "") + '"></span>';
          }).join("") + '</div>'
        : "";
      var desktop = '<div class="ph-desktop">' +
        '<img class="main-img' + (images.length > 1 ? " has-alt" : "") + '" src="' + esc(images[0]) + '" alt="">' +
        (images.length > 1
          ? '<img class="alt-img" src="' + esc(images[1]) + '" alt="">'
          : "") +
      '</div>';
      media = '<div class="ph-slides" data-slides>' + slides + '</div>' + progress + desktop;
    } else {
      media = '<span class="letter" aria-hidden="true">' + esc((p.name || "?").charAt(0).toUpperCase()) + '</span>';
    }

    /* Badges */
    var badges = "";
    if (!p.inStock) {
      badges = '<span class="ph-sold">Sold out</span>';
    } else {
      var b = "";
      if (showBadge) b += '<span class="ph-badge">' + esc(p.badge) + '</span>';
      if (hasCompare) b += '<span class="ph-badge discount">−' + discountPct + '%</span>';
      if (b) badges = '<div class="ph-badges">' + b + '</div>';
    }

    /* Hover button (desktop) */
    var hoverBtn = p.inStock
      ? '<div class="ph-hover-btn"><button type="button" data-quick="' + esc(p.id) + '">' +
          (hasVariants ? "Choose options" : "Add to bag") +
        '</button></div>'
      : "";

    var priceHtml = '<span class="pr">' + naira(p.price) + '</span>' +
      (hasCompare ? '<span class="pr strike">' + naira(p.compareAtPrice) + '</span>' : "");

    return '<button class="card" type="button" data-id="' + esc(p.id) + '">' +
      '<span class="ph">' +
        media +
        badges +
        hoverBtn +
      '</span>' +
      '<span class="meta">' +
        '<span class="nm">' + esc(p.name) + '</span>' +
        '<span class="pr-row">' + priceHtml + '</span>' +
      '</span>' +
    '</button>';
  }

  function renderGrid() {
    var grid = $("grid");
    if (!grid) return;
    var list = filterProducts();

    /* Update hero count */
    var countEl = $("heroCount");
    if (countEl) {
      countEl.textContent = list.length + " " + (list.length === 1 ? "PIECE" : "PIECES");
    }
    var searchCount = $("heroSearchCount");
    if (searchCount) {
      searchCount.textContent = list.length + " " + (list.length === 1 ? "result" : "results");
    }

    if (!list.length) {
      grid.innerHTML = '<p class="empty">' + (filters.query ? 'No pieces match "' + esc(filters.query) + '".' : "No pieces in this collection yet.") + '</p>';
      grid.style.display = "block";
      return;
    }
    grid.style.display = "";
    grid.innerHTML = list.map(renderCard).join("");

    /* Wire mobile carousel progress */
    $$("[data-slides]").forEach(function (slider) {
      var dots = slider.parentElement.querySelector(".ph-progress");
      if (!dots) return;
      slider.addEventListener("scroll", function () {
        if (!slider.clientWidth) return;
        var idx = Math.round(slider.scrollLeft / slider.clientWidth);
        var spans = dots.querySelectorAll("span");
        spans.forEach(function (s, i) {
          s.className = i === idx ? "active" : "";
        });
      });
    });
  }

  /* ---------- Product modal ---------- */
  function renderModal() {
    var sheet = $("sheet");
    if (!sheet || !current) return;
    var p = current;

    var images = (p.images && p.images.length) ? p.images.slice(0, 3) : [];
    var variants = (p.variants && p.variants.suggested) || [];
    var selectedVariant = variants.find(function (v) { return v.label === currentVariant; });
    var priceDelta = selectedVariant ? selectedVariant.priceDelta : 0;
    var unitPrice = p.price + priceDelta;
    var displayCompare = p.compareAtPrice ? p.compareAtPrice + priceDelta : null;
    var canOrder = variants.length === 0 || currentVariant !== null;
    var inStock = p.inStock !== false;

    /* Image column */
    var slides = "";
    if (images.length) {
      slides = images.map(function (url) {
        return '<img src="' + esc(url) + '" alt="' + esc(p.name) + '" loading="eager">';
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

    var thumbs = "";
    if (images.length > 1) {
      thumbs = '<div class="pd-thumbs">' + images.map(function (url, i) {
        return '<button type="button" class="pd-thumb' + (i === currentImageIdx ? " active" : "") + '" data-thumb="' + i + '">' +
          '<img src="' + esc(url) + '" alt="">' +
        '</button>';
      }).join("") + '</div>';
    }

    /* Variants */
    var variantsHtml = "";
    if (variants.length && inStock) {
      variantsHtml = '<p class="pd-label">Choose an option</p><div class="pd-variants">' +
        variants.map(function (v) {
          var active = currentVariant === v.label;
          return '<button type="button" class="pd-variant' + (active ? " active" : "") + '" data-variant="' + esc(v.label) + '">' +
            esc(v.label) +
            (v.priceDelta > 0 ? '<span class="delta">+' + naira(v.priceDelta) + '</span>' : "") +
          '</button>';
        }).join("") + '</div>';
    }

    /* Buttons */
    var actionsHtml = "";
    if (inStock) {
      actionsHtml =
        '<div class="pd-qty-row">' +
          '<span class="pd-label" style="margin:0">Qty</span>' +
          '<div class="pd-qty">' +
            '<button type="button" data-qty="-1">−</button>' +
            '<span>' + currentQty + '</span>' +
            '<button type="button" data-qty="1">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="pd-actions">' +
          '<button type="button" class="pd-btn primary" id="pdAdd"' + (canOrder ? "" : " disabled") + '>Add to bag</button>' +
          '<button type="button" class="pd-btn secondary" id="pdBuy"' + (canOrder ? "" : " disabled") + '>Quick buy</button>' +
        '</div>' +
        (!canOrder ? '<p class="pd-label" style="text-align:center;color:var(--accent)">Choose an option first</p>' : "") +
        '<button type="button" class="pd-ask" id="pdAsk">Ask us a question</button>';
    } else {
      actionsHtml = '<div class="pd-sold">Sold out</div>';
    }

    /* Share */
    var shareHtml =
      '<div class="pd-share">' +
        '<span class="pd-share-label">Share</span>' +
        '<button type="button" class="pd-share-btn" id="pdShareWa" aria-label="Share on WhatsApp">' +
          '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" fill="currentColor" stroke="none"/></svg>' +
        '</button>' +
        '<button type="button" class="pd-share-btn" id="pdShareCopy" aria-label="Copy link">' +
          '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>' +
        '</button>' +
        '<span class="pd-copied" id="pdCopied">Copied</span>' +
      '</div>';

    sheet.innerHTML =
      '<div class="pd-scroll">' +
        '<button type="button" class="pd-close" id="pdClose" aria-label="Close">' +
          '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<div class="pd">' +
          '<div class="pd-image-col">' +
            '<div class="pd-image-main">' +
              '<div class="pd-slides" id="pdSlides">' + slides + '</div>' +
              dots +
            '</div>' +
            thumbs +
          '</div>' +
          '<div class="pd-info">' +
            '<h2 class="pd-name">' + esc(p.name) + '</h2>' +
            '<div class="pd-price-row">' +
              '<span class="pd-price">' + naira(unitPrice) + '</span>' +
              (displayCompare ? '<span class="pd-compare">' + naira(displayCompare) + '</span>' : "") +
            '</div>' +
            (p.description ? '<p class="pd-desc">' + esc(p.description) + '</p>' : "") +
            variantsHtml +
            actionsHtml +
            shareHtml +
          '</div>' +
        '</div>' +
      '</div>';

    wireModal();
  }

  function wireModal() {
    var sheet = $("sheet");
    if (!sheet) return;
    var p = current;

    var closeBtn = $("pdClose");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    /* Slides */
    var slidesEl = $("pdSlides");
    if (slidesEl) {
      slidesEl.addEventListener("scroll", function () {
        if (!slidesEl.clientWidth) return;
        var idx = Math.round(slidesEl.scrollLeft / slidesEl.clientWidth);
        if (idx !== currentImageIdx) {
          currentImageIdx = idx;
          var dots = sheet.querySelector(".pd-dots");
          if (dots) {
            dots.querySelectorAll("span").forEach(function (s, i) {
              s.className = i === idx ? "active" : "";
            });
          }
          sheet.querySelectorAll(".pd-thumb").forEach(function (t, i) {
            t.classList.toggle("active", i === idx);
          });
        }
      });
    }

    /* Thumbnails */
    sheet.querySelectorAll("[data-thumb]").forEach(function (b) {
      b.addEventListener("click", function () {
        var idx = Number(b.getAttribute("data-thumb"));
        if (slidesEl) {
          slidesEl.scrollTo({ left: idx * slidesEl.clientWidth, behavior: "smooth" });
        }
      });
    });

    /* Qty */
    sheet.querySelectorAll("[data-qty]").forEach(function (b) {
      b.addEventListener("click", function () {
        currentQty = Math.max(1, currentQty + Number(b.getAttribute("data-qty")));
        renderModal();
      });
    });

    /* Variants */
    sheet.querySelectorAll("[data-variant]").forEach(function (b) {
      b.addEventListener("click", function () {
        currentVariant = b.getAttribute("data-variant");
        renderModal();
      });
    });

    /* Add to bag */
    var addBtn = $("pdAdd");
    if (addBtn) addBtn.addEventListener("click", function () {
      var variants = (p.variants && p.variants.suggested) || [];
      var selectedVariant = variants.find(function (v) { return v.label === currentVariant; });
      var priceDelta = selectedVariant ? selectedVariant.priceDelta : 0;
      var unitPrice = p.price + priceDelta;
      addToCart(p, currentQty, currentVariant, unitPrice);
      toast("Added to bag");
      closeModal();
      openCart();
    });

    /* Quick buy */
    var buyBtn = $("pdBuy");
    if (buyBtn) buyBtn.addEventListener("click", function () {
      var variants = (p.variants && p.variants.suggested) || [];
      var selectedVariant = variants.find(function (v) { return v.label === currentVariant; });
      var priceDelta = selectedVariant ? selectedVariant.priceDelta : 0;
      var unitPrice = p.price + priceDelta;
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

    /* Ask question */
    var askBtn = $("pdAsk");
    if (askBtn) askBtn.addEventListener("click", function () {
      var msg = "Hi " + (STORE.name || "") + "!\n\nI have a question about: " + p.name + "\n\n____";
      window.open("https://wa.me/" + (STORE.whatsapp || "") + "?text=" + encodeURIComponent(msg), "_blank");
    });

    /* Share WhatsApp */
    var shareWa = $("pdShareWa");
    if (shareWa) shareWa.addEventListener("click", function () {
      var url = window.location.origin + "/store/" + SLUG + "?p=" + p.id;
      var text = "Check out " + p.name;
      window.open("https://wa.me/?text=" + encodeURIComponent(text + " — " + url), "_blank");
    });

    /* Share copy */
    var shareCopy = $("pdShareCopy");
    if (shareCopy) shareCopy.addEventListener("click", function () {
      var url = window.location.origin + "/store/" + SLUG + "?p=" + p.id;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          var c = $("pdCopied");
          if (c) {
            c.classList.add("show");
            setTimeout(function () { c.classList.remove("show"); }, 1600);
          }
        });
      } else {
        window.prompt("Copy this link:", url);
      }
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
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    var sheet = $("sheet");
    if (sheet && sheet.close) sheet.close();
    document.body.style.overflow = "";
    current = null;
  }

  /* ---------- Grid interactions ---------- */
  function wireGrid() {
    var grid = $("grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
      var quick = e.target.closest("[data-quick]");
      if (quick) {
        e.preventDefault();
        e.stopPropagation();
        openModal(quick.getAttribute("data-quick"));
        return;
      }
      var card = e.target.closest(".card");
      if (!card) return;
      openModal(card.getAttribute("data-id"));
    });
  }

  /* ---------- Search ---------- */
  function wireSearch() {
    var input = $("searchInput");
    var panel = $("searchPanel");
    var toggle = $("searchToggle");
    var clearBtn = $("heroClear");
    var backBtn = $("heroBack");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.hidden = !panel.hidden;
        if (!panel.hidden) {
          input.focus();
        } else {
          filters.query = "";
          input.value = "";
          updateHero();
          renderGrid();
        }
      });
    }

    if (input) {
      var debounce;
      input.addEventListener("input", function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () {
          filters.query = input.value.trim();
          updateHero();
          renderGrid();
        }, 120);
      });
    }

    if (clearBtn) clearBtn.addEventListener("click", function () {
      filters.query = "";
      if (input) input.value = "";
      updateHero();
      renderGrid();
    });
    if (backBtn) backBtn.addEventListener("click", function () {
      filters.query = "";
      if (input) input.value = "";
      updateHero();
      renderGrid();
    });
  }

  /* ---------- Hero state ---------- */
  function updateHero() {
    var normal = $("heroNormal");
    var search = $("heroSearch");
    if (!normal || !search) return;
    if (filters.query) {
      normal.hidden = true;
      search.hidden = false;
      var q = $("heroSearchQuery");
      if (q) q.textContent = '"' + filters.query + '"';
    } else {
      normal.hidden = false;
      search.hidden = true;
    }
  }

  /* ---------- Category picker ---------- */
  var CATEGORIES = [];
  function buildCategoryList() {
    var seen = {};
    var list = [{ id: "all", label: "All categories" }];
    ALL.forEach(function (p) {
      var c = p.category || "";
      if (c && !seen[c]) {
        seen[c] = true;
        list.push({ id: c, label: c });
      }
    });
    CATEGORIES = list;
  }

  function renderCategoryList() {
    var items = CATEGORIES.map(function (c) {
      var active = filters.category === c.id;
      return '<button type="button" class="cat-item' + (active ? " active" : "") + '" data-cat="' + esc(c.id) + '">' +
        '<span>' + esc(c.label) + '</span>' +
        (active ? '<span class="cat-dot"></span>' : "") +
      '</button>';
    }).join("");
    var modalList = $("catModalList");
    if (modalList) modalList.innerHTML = items;

    var sheetItems = CATEGORIES.map(function (c) {
      var active = filters.category === c.id;
      return '<button type="button" class="cat-sheet-item' + (active ? " active" : "") + '" data-cat="' + esc(c.id) + '">' +
        '<span>' + esc(c.label) + '</span>' +
        (active ? '<span class="cat-dot"></span>' : "") +
      '</button>';
    }).join("");
    var sheetList = $("catSheetList");
    if (sheetList) sheetList.innerHTML = sheetItems;
  }

  function setCategory(id) {
    filters.category = id;
    filters.query = "";
    var input = $("searchInput");
    if (input) input.value = "";
    updateHero();
    updateHeroTitle();
    renderCategoryList();
    renderGrid();
    closeCatPicker();
  }

  function updateHeroTitle() {
    var t = $("heroTitle");
    if (!t) return;
    if (filters.category === "all") {
      t.textContent = "Shop";
    } else {
      var found = CATEGORIES.find(function (c) { return c.id === filters.category; });
      t.textContent = found ? found.label : "Shop";
    }
  }

  function openCatPicker() {
    var modal = $("catModal");
    var sheet = $("catSheet");
    var bg = $("catBg");
    if (modal) modal.classList.add("open");
    if (sheet) sheet.classList.add("open");
    if (bg) bg.classList.add("open");
  }
  function closeCatPicker() {
    var modal = $("catModal");
    var sheet = $("catSheet");
    var bg = $("catBg");
    if (modal) modal.classList.remove("open");
    if (sheet) sheet.classList.remove("open");
    if (bg) bg.classList.remove("open");
  }

  function wireCatPicker() {
    var titleBtn = $("heroTitleBtn");
    if (titleBtn) titleBtn.addEventListener("click", openCatPicker);

    var bg = $("catBg");
    if (bg) bg.addEventListener("click", closeCatPicker);

    document.addEventListener("click", function (e) {
      var c = e.target.closest("[data-cat]");
      if (c) {
        setCategory(c.getAttribute("data-cat"));
      }
    });
  }

  /* ---------- Sort ---------- */
  var SORTS = [
    { key: "featured", label: "Featured" },
    { key: "newest", label: "Newest" },
    { key: "price-asc", label: "Price: low to high" },
    { key: "price-desc", label: "Price: high to low" },
    { key: "name", label: "Name A–Z" }
  ];

  function renderSortMenu() {
    var menu = $("sortMenu");
    if (!menu) return;
    menu.innerHTML = SORTS.map(function (s) {
      var active = filters.sort === s.key;
      return '<button type="button" class="sort-item' + (active ? " active" : "") + '" data-sort="' + s.key + '">' + esc(s.label) + '</button>';
    }).join("");
  }

  function wireSort() {
    var btn = $("sortBtn");
    var menu = $("sortMenu");
    if (!btn || !menu) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("open")) return;
      var s = e.target.closest("[data-sort]");
      if (s) {
        filters.sort = s.getAttribute("data-sort");
        renderSortMenu();
        renderGrid();
        menu.classList.remove("open");
        return;
      }
      if (!e.target.closest(".hero-meta")) {
        menu.classList.remove("open");
      }
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
        closeCatPicker();
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    loadCart();
    renderCartBadge();
    renderCart();
    buildCategoryList();
    renderCategoryList();
    renderSortMenu();
    wireGrid();
    wireCart();
    wireSearch();
    wireCatPicker();
    wireSort();
    updateHero();
    updateHeroTitle();
    renderGrid();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
