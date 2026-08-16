(function () {
  'use strict';

  // --- Meta configuration ---
  // PIXEL_ID: required for on-page Meta tracking. Find it in Meta Events Manager
  // (or Business Suite -> Settings -> Data sources -> Meta Pixel): a 15-16 digit
  // number, DISTINCT from the Ad Account ID.
  // Ad Account ID + Business ID are for Ads Manager attribution / Conversions API.
  var PIXEL_ID = '';
  var AD_ACCOUNT_ID = '359582455153241';
  var BUSINESS_ID = '686726835304077';
  var pixelLoaded = false;

  function toItems(p) {
    return [{
      item_id: p.model_code,
      item_name: p.product_name,
      item_category: p.category || '',
      item_brand: p.brand || '',
      price: Number(p.mrp_npr) || 0,
      quantity: 1
    }];
  }

  function gtagEvent(name, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', name, params || {});
  }

  function loadPixel() {
    if (!PIXEL_ID || pixelLoaded) return;
    pixelLoaded = true;
    (function (f, b) {
      var t = f.getElementsByTagName(b)[0];
      var s = f.createElement(b);
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      t.parentNode.insertBefore(s, t);
    })(document, 'script');
    window.fbq = window.fbq || function () { (window.fbq.q = window.fbq.q || []).push(arguments); };
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function fbTrack(name, data) {
    if (!PIXEL_ID || typeof fbq !== 'function') return;
    fbq('track', name, data || {});
  }

  var JEC = {
    PIXEL_ID: PIXEL_ID,
    AD_ACCOUNT_ID: AD_ACCOUNT_ID,
    BUSINESS_ID: BUSINESS_ID,
    loadPixel: loadPixel,
    viewItem: function (p) {
      var value = Number(p.mrp_npr) || 0;
      gtagEvent('view_item', { currency: 'NPR', value: value, items: toItems(p) });
      fbTrack('ViewContent', {
        content_ids: [p.model_code],
        content_name: p.product_name,
        content_type: 'product',
        value: value,
        currency: 'NPR'
      });
    },
    selectItem: function (p) {
      gtagEvent('select_item', { currency: 'NPR', value: Number(p.mrp_npr) || 0, items: toItems(p) });
    },
    viewList: function (items, id) {
      var arr = (items || []).slice(0, 10);
      var flat = arr.reduce(function (acc, p) { return acc.concat(toItems(p)); }, []);
      gtagEvent('view_item_list', { item_list_id: id || 'list', item_list_name: id || 'list', items: flat });
    },
    contact: function (method) {
      gtagEvent('whatsapp_contact', { method: method || 'whatsapp' });
      fbTrack('Contact', { content_name: 'whatsapp', method: method || 'whatsapp' });
    },
    lead: function (method) {
      gtagEvent('generate_lead', { method: method || 'contact_form' });
      fbTrack('Lead', { content_name: 'lead_form', method: method || 'contact_form' });
    },
    setPixelId: function (id) {
      if (!id) return;
      PIXEL_ID = String(id);
      JEC.PIXEL_ID = PIXEL_ID;
      JEC.loadPixel();
    },
    track: gtagEvent
  };

  window.JEC = JEC;

  document.addEventListener('DOMContentLoaded', function () {
    JEC.loadPixel();
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me/9779765985999') > -1 || href.indexOf('wa.me/9851045662') > -1) {
      JEC.contact('whatsapp');
    }
  });
})();