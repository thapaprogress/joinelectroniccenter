/**
 * Register Service Worker and PWA Install Prompt
 */
(function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").then(function () {
        console.log("[PWA] ServiceWorker registered successfully.");
      }).catch(function (err) {
        console.log("[PWA] ServiceWorker registration failed:", err);
      });
    });
  }

  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;

    var installBtn = document.getElementById("jecPwaInstallBtn");
    if (installBtn) {
      installBtn.style.display = "inline-flex";
      installBtn.addEventListener("click", function () {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function (choiceResult) {
            if (choiceResult.outcome === "accepted") {
              console.log("[PWA] User accepted the install prompt");
              installBtn.style.display = "none";
            }
            deferredPrompt = null;
          });
        }
      });
    }
  });
})();
