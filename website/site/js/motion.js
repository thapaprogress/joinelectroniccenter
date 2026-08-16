(function () {
  'use strict';

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function initWaFloat() {
    var wa = document.querySelector('.wa-float');
    if (!wa) return;
    function onScroll() {
      if (window.scrollY > 260) wa.classList.add('visible');
      else wa.classList.remove('visible');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMarquee() {
    var track = document.querySelector('.marquee-track');
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  function initHeroBadges() {
    var badges = document.querySelector('.hero-badges');
    if (!badges) return;
    if (window.innerWidth < 720) badges.remove();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initWaFloat();
    initMarquee();
    initHeroBadges();
  });
})();