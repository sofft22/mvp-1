(function () {
  var raw = document.getElementById("data");
  if (!raw) return;
  var data = JSON.parse(raw.textContent);
  var store = data.store;
  var byId = {};
  data.products.forEach(function (p) { byId[p.id] = p; });
  var sheet = document.getElementById("sheet");

  function naira(n) { return "₦" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function copy(text, btn) {
    function done() { var old = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = old; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
    function fallback() {
      var t = document.createElement("textarea");
      t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(t);
    }
  }

  function open(id) {
    var p = byId[id];
    if (!p) return;
    sheet.textContent = "";
    var box = el("div", "sheet");

    var close = el("button", "close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", function () { sheet.close(); });
    box.appendChild(close);

    var gal = el("div", "gallery");
    if (p.images.length) {
      p.images.forEach(function (src) {
        var im = document.createElement("img");
        im.src = src; im.alt = p.name; im.decoding = "async";
        gal.appendChild(im);
      });
    } else {
      gal.appendChild(el("div", "nophoto", p.name.charAt(0).toUpperCase()));
    }
    box.appendChild(gal);

    var body = el("div", "body");
    body.appendChild(el("h2", null, p.name));
    body.appendChild(el("div", "price", naira(p.price)));
    if (p.description) body.appendChild(el("p", "desc", p.description));

    var any = false;

    if (store.whatsapp) {
      any = true;
      var o1 = el("div", "opt");
      o1.appendChild(el("h3", null, "Order on WhatsApp"));
      var a = el("a", "btn wa", p.inStock ? "Message " + store.name : "Sold out");
      if (p.inStock) {
        var link = location.origin + location.pathname + "#p=" + p.id;
        var text = "Hi! I'd like to order: " + p.name + " (" + naira(p.price) + "). " + link;
        a.href = "https://wa.me/" + store.whatsapp + "?text=" + encodeURIComponent(text);
        a.rel = "noopener";
      } else {
        a.setAttribute("aria-disabled", "true");
      }
      o1.appendChild(a);
      body.appendChild(o1);
    }

    if (store.accountNumber) {
      any = true;
      var o2 = el("div", "opt");
      o2.appendChild(el("h3", null, "Pay by bank transfer"));
      var bank = el("div", "bank");
      [["Bank", store.bankName], ["Account name", store.accountName], ["Account number", store.accountNumber], ["Amount", naira(p.price)]].forEach(function (row) {
        if (!row[1]) return;
        var d = el("div");
        d.appendChild(el("span", null, row[0]));
        d.appendChild(el("b", null, row[1]));
        bank.appendChild(d);
      });
      o2.appendChild(bank);
      var cb = el("button", "copy", "Copy account number");
      cb.type = "button";
      cb.addEventListener("click", function () { copy(store.accountNumber, cb); });
      o2.appendChild(cb);
      body.appendChild(o2);
      if (store.whatsapp) body.appendChild(el("p", "note", "After paying, send your receipt to " + store.name + " on WhatsApp."));
    }

    if (!any) body.appendChild(el("p", "note", "This seller hasn't added contact details yet."));

    box.appendChild(body);
    sheet.appendChild(box);
    if (!sheet.open) sheet.showModal();
    try { history.replaceState(null, "", "#p=" + id); } catch (e) {}
  }

  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("click", function () { open(c.getAttribute("data-id")); });
  });
  sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener("close", function () { try { history.replaceState(null, "", location.pathname); } catch (e) {} });

  var m = /^#p=([\w-]+)$/.exec(location.hash);
  if (m) open(m[1]);
})();
