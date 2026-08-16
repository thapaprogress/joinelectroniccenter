(function () {
  'use strict';

  var WA_NUMBER = '9779765985999';
  var WA_SECONDARY = '9851045662';
  var STORE_NAME = 'Join Electronic Center';
  var DATA_URL = 'data/catalog.json';

  var catalogPromise = null;

  function loadCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch(DATA_URL)
        .then(function (res) {
          if (!res.ok) throw new Error('Failed to load catalog: ' + res.status);
          return res.json();
        })
        .catch(function () {
          if (window.CATALOG_DATA) return window.CATALOG_DATA;
          return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = 'data/catalog-data.js';
            s.onload = function () {
              if (window.CATALOG_DATA) resolve(window.CATALOG_DATA);
              else reject(new Error('Fallback catalog data missing'));
            };
            s.onerror = function () { reject(new Error('Failed to load fallback catalog data')); };
            document.head.appendChild(s);
          });
        })
        .catch(function (err) {
          catalogPromise = null;
          throw err;
        });
    }
    return catalogPromise;
  }

  function getProductByModel(model) {
    return loadCatalog().then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].model_code === model) return list[i];
      }
      return null;
    });
  }

  function uniqueBrands() {
    return loadCatalog().then(function (list) {
      var seen = {};
      var out = [];
      for (var i = 0; i < list.length; i++) {
        var b = list[i].brand;
        if (!seen[b]) {
          seen[b] = true;
          out.push(b);
        }
      }
      out.sort(function (a, b) { return a.localeCompare(b); });
      return out;
    });
  }

  function categoriesWithCounts() {
    return loadCatalog().then(function (list) {
      var map = {};
      for (var i = 0; i < list.length; i++) {
        var c = list[i].category;
        map[c] = (map[c] || 0) + 1;
      }
      var out = [];
      for (var k in map) {
        if (Object.prototype.hasOwnProperty.call(map, k)) out.push({ name: k, count: map[k] });
      }
      out.sort(function (a, b) { return a.name.localeCompare(b.name); });
      return out;
    });
  }

  function formatMRP(n) {
    var num = parseInt(n, 10);
    if (isNaN(num)) return 'Rs. 0';
    return 'Rs. ' + num.toLocaleString('en-IN');
  }

  function emiMonthly(price, months) {
    var m = months || 12;
    var r = 0.015;
    var num = parseInt(price, 10) || 0;
    if (!num) return 0;
    var f = r * Math.pow(1 + r, m) / (Math.pow(1 + r, m) - 1);
    return Math.round(num * f);
  }

  function keySpecs(p) {
    var out = [];
    if (p.type && String(p.type).trim()) out.push(String(p.type).trim());
    if (p.capacity && String(p.capacity).trim()) out.push(String(p.capacity).trim());
    return out.slice(0, 3);
  }

  function photoFor(p) {
    if (p.photo_path && String(p.photo_path).trim() !== '') {
      return String(p.photo_path).replace(/\\/g, '/');
    }
    if (p.image_live !== false && p.image_url && String(p.image_url).trim() !== '') {
      return p.image_url;
    }
    return null;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseSpecs(str) {
    if (!str || !String(str).trim()) return [];
    var raw = String(str)
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&');
    var parts = raw.split(/[;\n|]/).map(function (s) { return s.trim(); }).filter(Boolean);
    var rows = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var idx = part.indexOf(':');
      var sep = ':';
      if (idx === -1) {
        idx = part.indexOf('=');
        sep = '=';
      }
      if (idx > 0) {
        var key = part.slice(0, idx).trim();
        var val = part.slice(idx + sep.length).trim();
        if (key && val) {
          rows.push({ key: key, value: val });
          continue;
        }
      }
      rows.push({ key: part, value: '' });
    }
    return rows;
  }

  function brandInitial(brand) {
    var b = String(brand || '?').trim();
    return b ? b.charAt(0).toUpperCase() : '?';
  }

  function placeholderHTML(brand, label) {
    return '<div class="ph" role="img" aria-label="Photo coming soon">' +
      '<span class="ph-initial">' + escapeHtml(brandInitial(brand)) + '</span>' +
      '<span class="ph-text"><b>Ask on WhatsApp</b> for photo</span>' +
      '</div>';
  }

  function productCard(p) {
    var src = photoFor(p);
    var media = '';
    if (src) {
      media = '<img class="card-img" src="' + escapeHtml(src) + '" alt="' + escapeHtml(p.product_name) +
        '" loading="lazy" decoding="async" data-fallback="1" data-brand="' + escapeHtml(p.brand) + '">';
    } else {
      media = placeholderHTML(p.brand, 'Photo coming soon');
    }
    var avail = src
      ? '<span class="badge badge-stock">&#10003; In stock</span>'
      : '<span class="badge badge-ask">Ask availability</span>';
    
    var mrp = p.mrp_npr || 0;
    var saveAmount = Math.round(mrp * 0.08);
    var saveBadge = mrp > 5000
      ? '<span class="badge-discount-save">Save रु. ' + escapeHtml(saveAmount.toLocaleString('en-IN')) + '</span>'
      : '';

    return '<a class="card" data-model="' + escapeHtml(p.model_code) + '" href="' + escapeHtml(p.url || ('product.html?model=' + encodeURIComponent(p.model_code))) + '">' +
      '<div class="card-media">' + media +
      '<div class="card-badges">' + avail + saveBadge + '</div>' +
      '</div>' +
      '<div class="card-body">' +
      '<div class="card-mrp">MRP रु. ' + escapeHtml(mrp.toLocaleString('en-IN')) + '</div>' +
      '<h3 class="card-name">' + escapeHtml(p.product_name) + '</h3>' +
      '<div class="card-emi">EMI from रु. ' + escapeHtml(emiMonthly(mrp, 12).toLocaleString('en-IN')) + '/mo &middot; 0% Down</div>' +
      '<div class="card-meta"><span class="card-brand">' + escapeHtml(p.brand) + '</span>' +
      '<span class="card-model">' + escapeHtml(p.model_code) + '</span></div>' +
      '</div></a>';
  }

  function waLink(p, extraText) {
    var text = 'Namaste! I am interested in the ' + p.product_name +
      ' (Model: ' + p.model_code + ').\nMRP: ' + formatMRP(p.mrp_npr) + '.';
    if (extraText) text += '\n' + extraText;
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function setQueryParam(name, value) {
    var params = new URLSearchParams(window.location.search);
    if (value === null || value === '' || value === undefined) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    var qs = params.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '');
    history.replaceState(null, '', url);
  }

  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.site-nav a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === current) links[i].classList.add('active');
    }
  }

  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.getAttribute('data-fallback') === '1') {
      var holder = document.createElement('div');
      holder.className = 'ph';
      holder.setAttribute('role', 'img');
      holder.setAttribute('aria-label', 'Photo coming soon');
      var init = document.createElement('span');
      init.className = 'ph-initial';
      init.textContent = brandInitial(t.getAttribute('data-brand'));
      var txt = document.createElement('span');
      txt.className = 'ph-text';
      txt.textContent = 'Photo coming soon';
      holder.appendChild(init);
      holder.appendChild(txt);
      t.replaceWith(holder);
    }
  }, true);

  document.addEventListener('DOMContentLoaded', initNav);

  function itemListSchema(items, listName) {
    var s = document.getElementById('itemlist-jsonld');
    if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'itemlist-jsonld'; document.head.appendChild(s); }
    var arr = (items || []).slice(0, 20).map(function (p, i) {
      return { "@type": "ListItem", "position": i + 1, "name": p.product_name, "url": p.url };
    });
    s.textContent = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "ItemList",
      "name": listName || "Products",
      "itemListElement": arr
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a.card[data-model]') : null;
    if (!a || !window.JEC) return;
    var model = a.getAttribute('data-model');
    if (!model) return;
    loadCatalog().then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].model_code === model) {
          JEC.selectItem(list[i]);
          break;
        }
      }
    });
  });

  window.Catalog = {
    WA_NUMBER: WA_NUMBER,
    WA_SECONDARY: WA_SECONDARY,
    STORE_NAME: STORE_NAME,
    loadCatalog: loadCatalog,
    getProductByModel: getProductByModel,
    uniqueBrands: uniqueBrands,
    categoriesWithCounts: categoriesWithCounts,
    formatMRP: formatMRP,
    emiMonthly: emiMonthly,
    keySpecs: keySpecs,
    photoFor: photoFor,
    escapeHtml: escapeHtml,
    parseSpecs: parseSpecs,
    productCard: productCard,
    waLink: waLink,
    placeholderHTML: placeholderHTML,
    itemListSchema: itemListSchema,
    getQueryParam: getQueryParam,
    setQueryParam: setQueryParam
  };
})();