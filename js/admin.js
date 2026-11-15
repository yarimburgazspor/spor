/* Admin paneli. Sitedeki bütün içerik alanlarını formlardan düzenler.
   - Varsayılan içerik data.js'ten gelir; kaydedilen değişiklikler Supabase'deki site_icerik tablosunda durur.
   - Yalnızca varsayılandan farklı olan bölümler kaydedilir; kaydetme yetkisi sunucuda yönetici listesine bağlıdır.
   - Form, içeriğin yapısından kendiliğinden üretilir: yazı, sayı, onay kutusu, tarih, liste ve görsel alanları. */
(function () {
  "use strict";
  var VARSAYILAN = JSON.parse(JSON.stringify(window.KULUP));
  var A = VARSAYILAN.sohbet, $ = function (id) { return document.getElementById(id); };
  var istemci = window.supabase.createClient(A.url, A.anahtar);
  var veri = null, kirli = false;

  /* Bölüm ve alan adlarının Türkçe karşılıkları */
  var BOLUM = {
    _genel: "Genel bilgiler", slider: "Slider (büyük fotoğraflar)", yanResim: "Slider yanındaki görsel", baskan: "Başkan",
    haftaninOyunculari: "Haftanın oyuncuları", gununVideosu: "Günün videosu", golKrali: "Gol kralı", anma: "Anma bölümü",
    haberler: "Haberler", fikstur: "Maçlar (sonuçlar ve fikstür)", puanDurumu: "Puan durumu", kadro: "U17 kadrosu",
    kulupBilgi: "Kulüp bilgileri", sahalar: "Sahalar", sponsorlar: "Sponsorlar", sponsorluk: "Sponsorluk bölümü",
    iletisim: "İletişim", ligKaynak: "Lig kaynağı (TFF İstanbul bağlantısı)", tasarim: "Tasarım imzası",
    basvuruTurleri: "Başvuru formu: başvuru türleri", sohbet: "Canlı sohbet"
  };
  var ALAN = {
    ad: "Ad", kisaAd: "Kısa ad", takimAdi: "Federasyondaki takım adı", etiket: "Etiket", kurulus: "Kuruluş yılı", renkler: "Renkler",
    instagram: "Instagram adresi", instagramAd: "Instagram kullanıcı adı", ilce: "İlçe / il", takim: "Takım", lig: "Lig", grup: "Grup",
    sezon: "Sezon", puanHaftasi: "Puan durumu haftası", kadroBaslik: "Kadro başlığı", teknikDirektor: "Teknik direktör", kadroNot: "Kadro notu",
    katilYazi: "Kulübe katıl yazısı", formAdresi: "Form adresi (boş bırakılabilir)", whatsapp: "WhatsApp numarası (905…)", ornekIcerik: "Örnek içerik uyarısını göster",
    baslik: "Başlık", yazi: "Yazı", aciklama: "Açıklama", dosya: "Görsel", odak: "Odak noktası (örn. 50% 60%)", resim: "Görsel", resimAciklama: "Görsel açıklaması",
    foto: "Fotoğraf", not: "Not", video: "Video", kapak: "Kapak görseli", forma: "Forma numarası", unvan: "Unvan", deger: "Değer", tarih: "Tarih",
    kategori: "Kategori", ozet: "Özet", hafta: "Hafta", saat: "Saat", ev: "Ev sahibi", konuk: "Konuk", skor: "Skor (ev-konuk, örn. 2-1)", saha: "Saha",
    G: "Galibiyet", B: "Beraberlik", M: "Mağlubiyet", no: "Forma numarası", mevki: "Mevki", ilk11: "İlk 11'de", yedek: "Yedek", kaptan: "Kaptan",
    dogumYili: "Doğum yılı", yer: "Yer", logo: "Logo / görsel", url: "Bağlantı adresi", slogan: "Slogan", uyari: "Uyarı notu", adres: "Adres",
    telefon: "Telefon", eposta: "E-posta", saatler: "Çalışma saatleri", onEk: "Ön yazı", isimler: "İsimler", imza: "İmza", videoAciklama: "Video açıklaması",
    acik: "Sohbet açık", gruplar: "Fotoğraf grupları", resimler: "Fotoğraflar", oyuncular: "Oyuncular", rakamlar: "Rakamlar", satirlar: "Satırlar",
    dayanak: "Yasal dayanak maddeleri", kazanimlar: "Kazanımlar"
  };
  var GORSEL = /^(foto|resim|logo|dosya|kapak)$/, UZUN = /^(ozet|yazi|aciklama|not|uyari|katilYazi|resimAciklama|videoAciklama)$/;
  var SAYI = /^(no|dogumYili|hafta|kurulus|G|B|M|forma|puanHaftasi)$/;
  /* Listeye yeni eklenen öğenin alanları (liste boşken ya da isteğe bağlı alanlar için) */
  var SEMA = {
    kadro: { no: null, ad: "", mevki: "", ilk11: false, yedek: false, kaptan: false, dogumYili: null, foto: "" },
    haberler: { tarih: "", kategori: "u17", etiket: "#U17", baslik: "", ozet: "" },
    fikstur: { hafta: null, tarih: "", saat: "", ev: "", konuk: "", skor: "", saha: "" },
    puanDurumu: { takim: "", G: 0, B: 0, M: 0 },
    sponsorlar: { ad: "", logo: "", url: "" },
    sahalar: { ad: "", yer: "", not: "" },
    kulupBilgi: { etiket: "", deger: "" }
  };

  /* Listelerdeki isteğe bağlı alanlar (ör. kadroda ilk11, yedek, kaptan) hem varsayılana hem düzenlenen
     içeriğe aynı biçimde eklenir; böylece yalnızca gerçekten değişen bölümler "değişmiş" sayılır. */
  function tamamla(icerik) {
    Object.keys(SEMA).forEach(function (k) {
      if (!Array.isArray(icerik[k])) return;
      icerik[k].forEach(function (oge) {
        if (oge && typeof oge === "object") Object.keys(SEMA[k]).forEach(function (a) { if (!(a in oge)) oge[a] = SEMA[k][a]; });
      });
    });
    return icerik;
  }
  tamamla(VARSAYILAN);

  function el(e, s, y) { var o = document.createElement(e); if (s) o.className = s; if (y !== undefined) o.textContent = y; return o; }
  function yaz(id, yazi, hata) { $(id).textContent = yazi; $(id).className = "durum" + (hata ? " hata" : ""); }
  function degisti() { kirli = true; $("kaydet").disabled = false; yaz("kayit-durum", "Kaydedilmemiş değişiklik var."); }
  function bosKopya(o) {
    if (Array.isArray(o)) return [];
    if (o && typeof o === "object") { var y = {}; Object.keys(o).forEach(function (k) { y[k] = bosKopya(o[k]); }); return y; }
    return typeof o === "boolean" ? false : typeof o === "number" ? null : o === null ? null : "";
  }
  function sablon(anahtar, dizi, varsayilanDizi) {
    if (SEMA[anahtar]) return JSON.parse(JSON.stringify(SEMA[anahtar]));
    var ornek = dizi[0] !== undefined ? dizi[0] : (varsayilanDizi || [])[0];
    return ornek === undefined ? "" : bosKopya(ornek);
  }

  /* ---- Alan üreticileri ---- */
  function alan(sahip, anahtar, yol) {
    var deger = sahip[anahtar], etiket = ALAN[anahtar] || anahtar, kimlik = "a-" + yol.replace(/[^a-zA-Z0-9]/g, "-");
    var kutu = el("div", "alan");
    if (typeof deger === "boolean") {
      var l = el("label", "onay"), c = el("input"); c.type = "checkbox"; c.id = kimlik; c.checked = deger;
      c.addEventListener("change", function () { sahip[anahtar] = c.checked; degisti(); });
      l.appendChild(c); l.appendChild(el("span", "", etiket)); kutu.appendChild(l); return kutu;
    }
    var lab = el("label", "", etiket); lab.htmlFor = kimlik; kutu.appendChild(lab);
    var giris;
    if (UZUN.test(anahtar)) { giris = el("textarea"); giris.rows = 3; }
    else { giris = el("input"); giris.type = SAYI.test(anahtar) || typeof deger === "number" ? "number" : anahtar === "tarih" ? "date" : "text"; }
    giris.id = kimlik; giris.value = deger === null || deger === undefined ? "" : deger;
    giris.addEventListener("input", function () {
      sahip[anahtar] = giris.type === "number" ? (giris.value === "" ? null : Number(giris.value)) : giris.value;
      degisti();
    });
    kutu.appendChild(giris);
    if (GORSEL.test(anahtar) || anahtar === "video") kutu.appendChild(yukleyici(sahip, anahtar, giris, anahtar === "video"));
    return kutu;
  }

  /* Görsel / video yükleme: dosya Supabase'e yüklenir, adresi alana yazılır */
  function yukleyici(sahip, anahtar, giris, video) {
    var sar = el("div", "yukle");
    var onizle = el(video ? "span" : "img", "onizle");
    function goster() { if (!video) { onizle.src = giris.value || ""; onizle.alt = ""; onizle.hidden = !giris.value; } }
    goster(); giris.addEventListener("input", goster);
    var dosya = el("input"); dosya.type = "file"; dosya.accept = video ? "video/mp4" : "image/jpeg,image/png,image/webp,image/gif"; dosya.hidden = true;
    var dugme = el("button", "ikincil", video ? "Video yükle" : "Görsel yükle"); dugme.type = "button";
    var not = el("small", "", video ? "MP4, en fazla 50 MB" : "JPG, PNG ya da WebP");
    dugme.addEventListener("click", function () { dosya.click(); });
    dosya.addEventListener("change", function () {
      var f = dosya.files[0]; if (!f) return;
      if (f.size > 52428800) { not.textContent = "Dosya 50 MB sınırını aşıyor. Daha küçük bir dosya seçin."; not.className = "hata"; return; }
      var uzanti = (f.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      var yol = (video ? "video/" : "gorsel/") + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + uzanti;
      dugme.disabled = true; not.className = ""; not.textContent = "Yükleniyor…";
      istemci.storage.from("site").upload(yol, f, { cacheControl: "31536000", contentType: f.type }).then(function (y) {
        dugme.disabled = false; dosya.value = "";
        if (y.error) { not.textContent = "Yüklenemedi. Dosya türünü ve boyutunu kontrol edip yeniden deneyin."; not.className = "hata"; return; }
        giris.value = istemci.storage.from("site").getPublicUrl(yol).data.publicUrl;
        sahip[anahtar] = giris.value; goster(); degisti();
        not.textContent = "Yüklendi. Kaydetmeyi unutmayın.";
      });
    });
    sar.appendChild(onizle); sar.appendChild(dugme); sar.appendChild(dosya); sar.appendChild(not);
    return sar;
  }

  function nesne(o, yol, kok) {
    var sar = el("div", "nesne");
    Object.keys(o).forEach(function (k) {
      if (kok === "sohbet" && k !== "acik") return;          /* bağlantı ayarları panelden değiştirilmez */
      var d = o[k], altYol = yol + "." + k;
      if (Array.isArray(d)) sar.appendChild(liste(o, k, altYol));
      else if (d && typeof d === "object") { var f = el("fieldset"); f.appendChild(el("legend", "", ALAN[k] || k)); f.appendChild(nesne(d, altYol, kok)); sar.appendChild(f); }
      else sar.appendChild(alan(o, k, altYol));
    });
    return sar;
  }

  function liste(sahip, anahtar, yol) {
    var f = el("fieldset", "liste"); f.appendChild(el("legend", "", (ALAN[anahtar] || BOLUM[anahtar] || anahtar)));
    var govde = el("div", "liste-govde"); f.appendChild(govde);
    function ciz() {
      govde.textContent = "";
      var dizi = sahip[anahtar];
      dizi.forEach(function (oge, i) {
        var kart = el("div", "oge");
        var ust = el("div", "oge-ust");
        var ozet = oge && typeof oge === "object" ? (oge.ad || oge.baslik || oge.takim || oge.etiket || (oge.ev ? oge.ev + " - " + oge.konuk : "") || "") : "";
        ust.appendChild(el("strong", "", (i + 1) + ". " + (ozet || "")));
        var dugmeler = el("div", "dugmeler");
        [["↑", "Yukarı taşı", -1], ["↓", "Aşağı taşı", 1]].forEach(function (d) {
          var b = el("button", "ikincil kucuk", d[0]); b.type = "button"; b.setAttribute("aria-label", d[1]);
          b.disabled = i + d[2] < 0 || i + d[2] >= dizi.length;
          b.addEventListener("click", function () { var t = dizi[i]; dizi[i] = dizi[i + d[2]]; dizi[i + d[2]] = t; degisti(); ciz(); });
          dugmeler.appendChild(b);
        });
        var sil = el("button", "ikincil kucuk", "Sil"); sil.type = "button"; var onay = false;
        sil.addEventListener("click", function () {
          if (!onay) { onay = true; sil.textContent = "Emin misiniz?"; return; }
          dizi.splice(i, 1); degisti(); ciz();
        });
        dugmeler.appendChild(sil); ust.appendChild(dugmeler); kart.appendChild(ust);
        if (oge && typeof oge === "object") {
          if (SEMA[anahtar]) Object.keys(SEMA[anahtar]).forEach(function (k) { if (!(k in oge)) oge[k] = SEMA[anahtar][k]; });
          kart.appendChild(nesne(oge, yol + "." + i, anahtar));
        } else {
          var giris = el("input"); giris.type = "text"; giris.value = oge; giris.setAttribute("aria-label", (ALAN[anahtar] || anahtar) + " " + (i + 1));
          giris.addEventListener("input", function () { dizi[i] = giris.value; degisti(); });
          kart.appendChild(giris);
        }
        govde.appendChild(kart);
      });
      if (!dizi.length) govde.appendChild(el("p", "bos", "Bu listede henüz öğe yok."));
    }
    var ekle = el("button", "ikincil", "+ Yeni ekle"); ekle.type = "button";
    ekle.addEventListener("click", function () { sahip[anahtar].push(sablon(anahtar, sahip[anahtar], VARSAYILAN[anahtar])); degisti(); ciz(); });
    f.appendChild(ekle);
    ciz();
    return f;
  }

  /* ---- Form: her üst başlık açılır kapanır bir bölüm ---- */
  function formuCiz() {
    var form = $("form"); form.textContent = "";
    function bolum(baslik, icerik) {
      var d = el("details", "bolum"); d.appendChild(el("summary", "", baslik)); d.appendChild(icerik); form.appendChild(d);
    }
    var genel = el("div", "nesne"), sira = Object.keys(BOLUM).filter(function (k) { return k !== "_genel"; });
    Object.keys(veri).forEach(function (k) {
      var d = veri[k];
      if (d === null || typeof d !== "object") genel.appendChild(alan(veri, k, k));
      else if (sira.indexOf(k) === -1) sira.push(k);
    });
    bolum(BOLUM._genel, genel);
    sira.forEach(function (k) {
      if (!(k in veri)) return;
      bolum(BOLUM[k] || k, Array.isArray(veri[k]) ? liste(veri, k, k) : nesne(veri[k], k, k));
    });
  }

  /* ---- Kaydet: yalnızca varsayılandan farklı bölümler yazılır ---- */
  function kaydet() {
    var fark = {};
    Object.keys(veri).forEach(function (k) {
      if (k === "sohbet") { if (veri.sohbet.acik !== VARSAYILAN.sohbet.acik) fark.sohbet = { acik: veri.sohbet.acik }; return; }
      if (JSON.stringify(veri[k]) !== JSON.stringify(VARSAYILAN[k])) fark[k] = veri[k];
    });
    $("kaydet").disabled = true; yaz("kayit-durum", "Kaydediliyor…");
    istemci.auth.getUser().then(function (u) {
      return istemci.from("site_icerik").upsert({ id: "ana", veri: fark, guncellendi: new Date().toISOString(), guncelleyen: u.data.user ? u.data.user.email : null });
    }).then(function (y) {
      if (y.error) { $("kaydet").disabled = false; yaz("kayit-durum", "Kaydedilemedi. Bağlantınızı kontrol edip yeniden deneyin; sorun sürerse yeniden giriş yapın.", true); return; }
      kirli = false; yaz("kayit-durum", "Kaydedildi. Sitede hemen görünür; eski hâli görürseniz sayfayı yenileyin.");
    });
  }

  function panelAc() {
    istemci.rpc("sohbet_yonetici_mi").then(function (y) {
      if (y.error || !y.data) { yaz("giris-durum", "Bu hesap yönetici olarak tanımlı değil.", true); istemci.auth.signOut(); return; }
      return istemci.from("site_icerik").select("veri").eq("id", "ana").maybeSingle().then(function (s) {
        if (s.error) { yaz("giris-durum", "İçerik yüklenemedi. Sayfayı yenileyip yeniden deneyin.", true); return; }
        veri = JSON.parse(JSON.stringify(VARSAYILAN));
        var kayitli = s.data && s.data.veri;
        if (kayitli) Object.keys(kayitli).forEach(function (k) {
          if (k === "sohbet") veri.sohbet.acik = kayitli.sohbet.acik; else veri[k] = kayitli[k];
        });
        tamamla(veri);
        $("giris-kart").hidden = true; $("panel").hidden = false; formuCiz();
        yaz("kayit-durum", "Değişiklik yapıp Kaydet'e basın.");
      });
    });
  }

  $("giris-form").addEventListener("submit", function (olay) {
    olay.preventDefault(); $("g-dugme").disabled = true; yaz("giris-durum", "Giriş yapılıyor…");
    istemci.auth.signInWithPassword({ email: $("g-eposta").value.trim(), password: $("g-sifre").value }).then(function (y) {
      $("g-dugme").disabled = false;
      if (y.error) { yaz("giris-durum", "Giriş yapılamadı. E-posta ya da şifre hatalı.", true); return; }
      $("g-sifre").value = ""; yaz("giris-durum", ""); panelAc();
    });
  });
  $("kaydet").addEventListener("click", kaydet);
  $("cikis").addEventListener("click", function () { istemci.auth.signOut().then(function () { location.reload(); }); });
  window.addEventListener("beforeunload", function (e) { if (kirli) { e.preventDefault(); e.returnValue = ""; } });
  istemci.auth.getSession().then(function (y) { if (y.data && y.data.session) panelAc(); });
})();
