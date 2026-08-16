/**
 * Instant Search & Autocomplete Modal for Join Electronic Center
 * Key shortcut: Ctrl+K or / or clicking search buttons
 */
(function () {
  var searchModal = document.createElement("div");
  searchModal.id = "jecSearchModal";
  searchModal.className = "search-modal-backdrop";
  searchModal.style.display = "none";

  searchModal.innerHTML = `
    <div class="search-modal-box">
      <div class="search-modal-header">
        <span class="search-icon">&#128269;</span>
        <input type="text" id="jecSearchInput" placeholder="Search 378+ TVs, Fridges, Washers, ACs, Brands, Models..." autocomplete="off" />
        <span class="search-shortcut-badge">ESC to close</span>
      </div>
      <div class="search-modal-body" id="jecSearchResults">
        <div class="search-initial-hint">
          <p>🔥 Popular Searches: <a href="shop.html?cat=Television">Smart TVs</a>, <a href="shop.html?brand=Skyworth">Skyworth 4K</a>, <a href="shop.html?cat=Refrigerator">Himstar Fridge</a>, <a href="shop.html?cat=Washing%20Machine">Samsung Washer</a>, <a href="exchange.html">Exchange Offer</a></p>
        </div>
      </div>
      <div class="search-modal-footer">
        <span><b>Navigation:</b> Click item to view specs & MRP &middot; Free Kathmandu valley delivery</span>
      </div>
    </div>
  `;

  document.body.appendChild(searchModal);

  var input = document.getElementById("jecSearchInput");
  var resultsEl = document.getElementById("jecSearchResults");
  var catalog = [];

  function loadSearchCatalog() {
    if (catalog.length > 0) return Promise.resolve(catalog);
    return fetch("data/catalog.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        catalog = data;
        return catalog;
      })
      .catch(function () { return []; });
  }

  function openSearch() {
    searchModal.style.display = "flex";
    loadSearchCatalog();
    setTimeout(function () { input.focus(); }, 100);
  }

  function closeSearch() {
    searchModal.style.display = "none";
    input.value = "";
  }

  // Keyboard shortcut listener
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (searchModal.style.display === "flex") closeSearch();
      else openSearch();
    } else if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape" && searchModal.style.display === "flex") {
      closeSearch();
    }
  });

  searchModal.addEventListener("click", function (e) {
    if (e.target === searchModal) closeSearch();
  });

  // Search input handler
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    if (!q) {
      resultsEl.innerHTML = '<div class="search-initial-hint"><p>🔥 Popular Searches: <a href="shop.html?cat=Television">Smart TVs</a>, <a href="shop.html?brand=Skyworth">Skyworth 4K</a>, <a href="shop.html?cat=Refrigerator">Himstar Fridge</a>, <a href="shop.html?cat=Washing%20Machine">Samsung Washer</a>, <a href="exchange.html">Exchange Offer</a></p></div>';
      return;
    }

    loadSearchCatalog().then(function (items) {
      var terms = q.split(/\s+/).filter(Boolean);
      var matches = items.filter(function (item) {
        var str = ((item.product_name || "") + " " + (item.model_code || "") + " " + (item.brand || "") + " " + (item.category || "")).toLowerCase();
        return terms.every(function (t) { return str.indexOf(t) > -1; });
      }).slice(0, 8);

      if (matches.length === 0) {
        resultsEl.innerHTML = '<div class="search-empty">No products found matching "<b>' + C.escapeHtml(q) + '</b>". Try searching by brand, size, or category.</div>';
        return;
      }

      resultsEl.innerHTML = matches.map(function (p) {
        var photo = p.photo_path ? p.photo_path.replace(/\\/g, "/") : "photos/AURA/AU12FSWAC.webp";
        var price = p.mrp_npr ? "रु. " + p.mrp_npr.toLocaleString("en-IN") : "Ask price";
        var emi = p.emi_monthly_12 ? "EMI from रु. " + p.emi_monthly_12.toLocaleString("en-IN") + "/mo" : "";
        var discount = p.mrp_npr ? '<span class="search-discount-badge">Save Rs. ' + Math.round(p.mrp_npr * 0.08).toLocaleString("en-IN") + '</span>' : '';

        return `
          <a class="search-item-card" href="product.html?model=${encodeURIComponent(p.model_code)}">
            <img src="${photo}" alt="${p.product_name}" class="search-item-img" onerror="this.src='photos/AURA/AU12FSWAC.webp'" />
            <div class="search-item-info">
              <div class="search-item-meta"><span class="search-brand">${p.brand}</span> &middot; <span class="search-model">${p.model_code}</span></div>
              <div class="search-item-title">${p.product_name}</div>
              <div class="search-item-price-row">
                <span class="search-price">${price}</span>
                ${discount}
                <span class="search-emi">${emi}</span>
              </div>
            </div>
            <span class="search-arrow">&rarr;</span>
          </a>
        `;
      }).join("");
    });
  });

  // Attach search open triggers to navbar search buttons
  window.openJecSearch = openSearch;
})();
