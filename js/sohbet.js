/* Canlı sohbet (ana sayfa). Mesajlar Supabase'de durur.
   - Okuma: herkes son mesajları görür; yenileri anında düşer (Realtime), ayrıca 20 saniyede bir eşitlenir.
   - Yazma: yalnızca sunucudaki sohbet_gonder fonksiyonu üzerinden. Küfür, bağlantı, telefon numarası
     ve çok hızlı yazma sunucuda engellenir; buradaki kontroller yalnızca kullanıcıya erken uyarı içindir.
   Mesajlar sayfaya düz yazı olarak eklenir (textContent), HTML olarak yorumlanmaz. */
(function () {
  "use strict";
  var A = (window.KULUP || {}).sohbet;
  var kutu = document.getElementById("sohbet");
  var ac = document.getElementById("sohbet-ac");
  if (!kutu || !ac) return;
  if (!A || !A.acik) { kutu.hidden = true; ac.hidden = true; return; }

  var liste = document.getElementById("sohbet-liste");
  var form = document.getElementById("sohbet-form");
  var adKutu = document.getElementById("sohbet-ad");
  var mesajKutu = document.getElementById("sohbet-mesaj");
  var durum = document.getElementById("sohbet-durum");
  var rozet = document.getElementById("sohbet-rozet");
  var gonder = document.getElementById("sohbet-gonder");
  var yeniRozet = document.getElementById("sohbet-yeni");
  var SINIR = 60, gorunen = {}, istemci = null, ilkYukleme = true, okunmamis = 0;

  /* Pencere: sağ alttaki düğmeyle açılır, × ile kapanır. Açık olup olmadığı sekme boyunca hatırlanır. */
  function pencere(acik, odak) {
    kutu.hidden = !acik; ac.hidden = acik;
    ac.setAttribute("aria-expanded", acik ? "true" : "false");
    try { sessionStorage.setItem("sohbet-acik", acik ? "1" : "0"); } catch (e) {}
    if (acik) {
      okunmamis = 0; yeniRozet.hidden = true;
      liste.scrollTop = liste.scrollHeight;
      if (odak) (adKutu.value.trim().length >= 2 ? mesajKutu : adKutu).focus();
    } else if (odak) ac.focus();
  }
  ac.addEventListener("click", function () { pencere(true, true); });
  document.getElementById("sohbet-kapat").addEventListener("click", function () { pencere(false, true); });
  kutu.addEventListener("keydown", function (e) { if (e.key === "Escape") pencere(false, true); });
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#sohbet"]'), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); pencere(true, true); });
  });

  function el(etiket, sinif, yazi) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (yazi !== undefined) e.textContent = yazi;
    return e;
  }
  function durumYaz(yazi, hata) { durum.textContent = yazi; durum.className = "sohbet-durum" + (hata ? " hata" : ""); }
  function rozetYaz(canli) { rozet.textContent = canli ? "Canlı" : "Bağlanıyor"; rozet.className = "sohbet-rozet" + (canli ? " canli" : ""); }
  function saat(iso) {
    var d = new Date(iso), bugun = new Date();
    var s = d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    return d.toDateString() === bugun.toDateString() ? s : d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + " " + s;
  }
  function altta() { return liste.scrollHeight - liste.scrollTop - liste.clientHeight < 60; }

  function ekle(m) {
    if (gorunen[m.id]) return;
    var bos = document.getElementById("sohbet-bos"); if (bos) bos.remove();
    var kaydir = altta();
    var li = el("li"); li.setAttribute("data-id", m.id);
    var ust = el("div", "sohbet-ust");
    ust.appendChild(el("strong", "", m.ad));
    var z = el("time", "", saat(m.olusturuldu)); z.dateTime = m.olusturuldu; ust.appendChild(z);
    li.appendChild(ust); li.appendChild(el("p", "", m.mesaj));
    /* Kimlik sırasına göre yerine koy */
    var sonraki = null, ogeler = liste.children;
    for (var i = ogeler.length - 1; i >= 0; i--) {
      if (Number(ogeler[i].getAttribute("data-id")) < m.id) break;
      sonraki = ogeler[i];
    }
    liste.insertBefore(li, sonraki);
    gorunen[m.id] = li;
    if (!ilkYukleme && kutu.hidden) {
      okunmamis += 1; yeniRozet.hidden = false;
      yeniRozet.textContent = okunmamis > 9 ? "9+" : String(okunmamis);
      yeniRozet.setAttribute("aria-label", okunmamis + " yeni mesaj");
    }
    while (liste.children.length > SINIR) { var ilk = liste.firstElementChild; delete gorunen[ilk.getAttribute("data-id")]; ilk.remove(); }
    if (kaydir) liste.scrollTop = liste.scrollHeight;
  }
  function cikar(id) { if (gorunen[id]) { gorunen[id].remove(); delete gorunen[id]; } }

  /* Son mesajları çeker; ekranda olup sunucuda artık bulunmayanları (silinenleri) kaldırır */
  function esitle() {
    return istemci.from("sohbet_mesajlari").select("id, ad, mesaj, olusturuldu").order("id", { ascending: false }).limit(SINIR)
      .then(function (yanit) {
        if (yanit.error) throw yanit.error;
        var gelen = {}, satirlar = yanit.data.slice().reverse();
        satirlar.forEach(function (m) { gelen[m.id] = true; });
        var enKucuk = satirlar.length ? satirlar[0].id : 0;
        Object.keys(gorunen).forEach(function (id) { if (!gelen[id] && Number(id) >= enKucuk) cikar(id); });
        satirlar.forEach(ekle);
        if (!liste.children.length && !document.getElementById("sohbet-bos")) {
          var bos = el("li", "sohbet-bos", "Henüz mesaj yok. İlk mesajı siz yazın."); bos.id = "sohbet-bos"; liste.appendChild(bos);
        }
      });
  }

  function baslat() {
    istemci = window.supabase.createClient(A.url, A.anahtar, { auth: { persistSession: false } });
    esitle().then(function () { ilkYukleme = false; liste.scrollTop = liste.scrollHeight; durumYaz(""); })
      .catch(function () { durumYaz("Sohbet yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.", true); });
    istemci.channel("sohbet")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "sohbet_mesajlari" }, function (olay) { ekle(olay.new); })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "sohbet_mesajlari" }, function (olay) { cikar(olay.old.id); })
      .subscribe(function (hal) { rozetYaz(hal === "SUBSCRIBED"); });
    setInterval(function () { if (!document.hidden) esitle().catch(function () {}); }, 20000);
  }

  /* Kullanıcı adı bu tarayıcıda hatırlanır */
  try { adKutu.value = localStorage.getItem("sohbet-ad") || ""; } catch (e) {}

  form.addEventListener("submit", function (olay) {
    olay.preventDefault();
    var ad = adKutu.value.trim(), mesaj = mesajKutu.value.trim();
    if (ad.length < 2) { durumYaz("Önce bir kullanıcı adı yazın (en az 2 harf).", true); adKutu.focus(); return; }
    if (!mesaj) { mesajKutu.focus(); return; }
    if (!istemci) { durumYaz("Sohbet henüz bağlanmadı. Birkaç saniye sonra yeniden deneyin.", true); return; }
    gonder.disabled = true; durumYaz("Gönderiliyor…");
    istemci.rpc("sohbet_gonder", { p_ad: ad, p_mesaj: mesaj }).then(function (yanit) {
      gonder.disabled = false;
      if (yanit.error) {
        /* Sunucunun yazdığı Türkçe açıklama doğrudan gösterilir; yoksa genel bir açıklama */
        var aciklama = yanit.error.code === "P0001" && yanit.error.message ? yanit.error.message
          : "Mesaj gönderilemedi. Bağlantınızı kontrol edip yeniden deneyin.";
        durumYaz(aciklama, true);
        return;
      }
      try { localStorage.setItem("sohbet-ad", ad); } catch (e) {}
      if (yanit.data) ekle(yanit.data);
      mesajKutu.value = ""; durumYaz(""); liste.scrollTop = liste.scrollHeight; mesajKutu.focus();
    });
  });

  var hatirlanan = "0";
  try { hatirlanan = sessionStorage.getItem("sohbet-acik") || "0"; } catch (e) {}
  pencere(hatirlanan === "1" || location.hash === "#sohbet", false);

  /* Supabase kitaplığı yalnızca sohbet açıksa yüklenir */
  rozetYaz(false);
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js";
  s.onload = baslat;
  s.onerror = function () { durumYaz("Sohbet yüklenemedi. Sayfayı yenileyip yeniden deneyin.", true); };
  document.body.appendChild(s);
})();
