/* İçerik yükleyici.
   1) data.js içindeki varsayılan içerik hazırdır (window.KULUP).
   2) Admin panelinden kaydedilen değişiklikler Supabase'den okunur ve varsayılanların üzerine yazılır.
   3) Sonra sayfayı çizen betikler (main.js, sohbet.js) yüklenir.
   Supabase'e 2,5 saniyede ulaşılamazsa site varsayılan içerikle açılır; ziyaretçi boş sayfa görmez. */
(function () {
  "use strict";
  var K = window.KULUP || {}, A = K.sohbet, basladi = false;
  var surum = (document.currentScript && document.currentScript.src.split("?v=")[1]) || "";

  function betik(yol, sonra) {
    var s = document.createElement("script");
    s.src = yol + (surum ? "?v=" + surum : "");
    s.onload = sonra || null;
    document.body.appendChild(s);
  }
  function ciz() {
    if (basladi) return;
    basladi = true;
    betik("js/main.js", function () { betik("js/sohbet.js"); });
  }

  if (!A || !A.url || typeof fetch !== "function") { ciz(); return; }
  var sure = setTimeout(ciz, 2500);
  fetch(A.url + "/rest/v1/site_icerik?id=eq.ana&select=veri", {
    headers: { apikey: A.anahtar, Authorization: "Bearer " + A.anahtar }
  }).then(function (y) { return y.ok ? y.json() : []; })
    .then(function (satirlar) {
      if (basladi) return;                      /* süre dolduysa çizim başladı; yarım güncelleme yapma */
      var veri = satirlar[0] && satirlar[0].veri;
      if (veri && typeof veri === "object") {
        Object.keys(veri).forEach(function (anahtar) {
          if (anahtar === "sohbet") { if (veri.sohbet && typeof veri.sohbet.acik === "boolean") K.sohbet.acik = veri.sohbet.acik; }
          else K[anahtar] = veri[anahtar];
        });
      }
    })
    .catch(function () {})
    .then(function () { clearTimeout(sure); ciz(); });
})();
