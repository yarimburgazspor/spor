/* Yönetim paneli.
   Ana ekranda işe göre kutular durur (Haberler, Maç sonuçları, Kadro…). Kutuya basınca yalnızca o bölüm açılır.
   Listelerde her öğe tek satır olarak görünür; "Düzenle" ile açılır.
   - Varsayılan içerik data.js'ten gelir; kaydedilen değişiklikler Supabase'deki site_icerik tablosunda durur.
   - Yalnızca varsayılandan farklı olan bölümler kaydedilir; kaydetme yetkisi sunucuda yönetici listesine bağlıdır. */
(function () {
  "use strict";
  var VARSAYILAN = JSON.parse(JSON.stringify(window.KULUP));
  var A = VARSAYILAN.sohbet, $ = function (id) { return document.getElementById(id); };
  var istemci = window.supabase.createClient(A.url, A.anahtar);
  var veri = null, kirli = false;

  /* Ana ekrandaki kutular: [başlık, açıklama, içerdiği bölümler] */
  var KUTULAR = [
    ["Haberler", "Haber ekleyin, düzenleyin ya da silin.", ["haberler"]],
    ["Maç sonuçları", "Skor girin, yeni maç ekleyin.", ["fikstur"]],
    ["Puan durumu", "Takımların galibiyet, beraberlik ve mağlubiyet sayıları.", ["puanHaftasi", "puanDurumu"]],
    ["Slider fotoğrafları", "Ana sayfanın üstündeki büyük fotoğraflar ve başlıkları.", ["slider"]],
    ["Haftanın oyuncuları", "Üç oyuncunun adı, notu ve fotoğrafı.", ["haftaninOyunculari"]],
    ["Günün videosu", "Videoyu ve açıklamasını değiştirin.", ["gununVideosu"]],
    ["U17 kadrosu", "Oyuncular, forma numaraları, mevkiler ve fotoğraflar.", ["kadroBaslik", "teknikDirektor", "kadroNot", "kadro"]],
    ["Gol kralı", "Oyuncu, rakamlar ve afiş.", ["golKrali"]],
    ["Sponsorlar", "Sponsor logoları ve sponsorluk yazısı.", ["sponsorlar", "sponsorluk"]],
    ["İletişim", "Adres, telefon, WhatsApp ve Instagram.", ["iletisim", "whatsapp", "instagram", "instagramAd"]],
    ["Başkan ve görseller", "Başkan kartı ve slider'ın yanındaki görsel.", ["baskan", "yanResim"]],
    ["Kulüp bilgileri", "Kulüp adı, künye, sahalar ve lig bilgisi.", ["ad", "kisaAd", "kurulus", "renkler", "ilce", "takim", "lig", "grup", "sezon", "kulupBilgi", "sahalar", "ligKaynak"]],
    ["Anma bölümü", "Anma yazısı ve videosu.", ["anma"]],
    ["Diğer ayarlar", "Canlı sohbeti açıp kapatma, başvuru türleri ve diğerleri.", null]   /* null: başka kutuda olmayan her şey */
  ];
  var BASLIK = {
    slider: "Slider", yanResim: "Slider yanındaki görsel", baskan: "Başkan kartı", haftaninOyunculari: "Haftanın oyuncuları", gununVideosu: "Günün videosu",
    golKrali: "Gol kralı", anma: "Anma bölümü", haberler: "Haberler", fikstur: "Maçlar", puanDurumu: "Takımlar", kadro: "Oyuncular",
    kulupBilgi: "Künye satırları", sahalar: "Sahalar", sponsorlar: "Sponsor logoları", sponsorluk: "Sponsorluk yazısı", iletisim: "İletişim bilgileri",
    ligKaynak: "Lig kaynağı (TFF İstanbul bağlantısı)", tasarim: "Tasarım imzası", basvuruTurleri: "Başvuru formundaki başvuru türleri", sohbet: "Canlı sohbet"
  };
  var ALAN = {
    ad: "Ad", kisaAd: "Kısa ad", takimAdi: "Federasyondaki takım adı", etiket: "Etiket", kurulus: "Kuruluş yılı", renkler: "Renkler",
    instagram: "Instagram adresi", instagramAd: "Instagram kullanıcı adı", ilce: "İlçe / il", takim: "Takım", lig: "Lig", grup: "Grup",
    sezon: "Sezon", puanHaftasi: "Puan durumu kaçıncı hafta", kadroBaslik: "Kadro sayfası başlığı", teknikDirektor: "Teknik direktör", kadroNot: "Kadro notu",
    katilYazi: "Kulübe katıl yazısı", formAdresi: "Form adresi", whatsapp: "WhatsApp numarası", ornekIcerik: "Örnek içerik uyarısını göster",
    baslik: "Başlık", yazi: "Yazı", aciklama: "Açıklama", dosya: "Fotoğraf", odak: "Odak noktası", resim: "Görsel", resimAciklama: "Görsel açıklaması",
    foto: "Fotoğraf", not: "Not", video: "Video", kapak: "Kapak görseli", forma: "Forma numarası", unvan: "Unvan", deger: "Değer", tarih: "Tarih",
    kategori: "Kategori", ozet: "Haber yazısı", hafta: "Hafta", saat: "Saat", ev: "Ev sahibi", konuk: "Konuk", skor: "Skor", saha: "Saha",
    G: "Galibiyet", B: "Beraberlik", M: "Mağlubiyet", no: "Forma numarası", mevki: "Mevki", ilk11: "İlk 11'de (sahada gösterilir)", yedek: "Yedek", kaptan: "Kaptan",
    dogumYili: "Doğum yılı", yer: "Yer", logo: "Logo", url: "Bağlantı adresi", slogan: "Slogan", uyari: "Uyarı notu", adres: "Adres",
    telefon: "Telefon", eposta: "E-posta", saatler: "Çalışma saatleri", onEk: "Ön yazı", isimler: "İsimler", imza: "İmza", videoAciklama: "Video açıklaması",
    acik: "Canlı sohbet açık", gruplar: "Fotoğraf grupları", resimler: "Fotoğraflar", oyuncular: "Oyuncular", rakamlar: "Rakamlar", satirlar: "Satırlar",
    dayanak: "Yasal dayanak maddeleri", kazanimlar: "Kazanımlar"
  };
  var IPUCU = {
    skor: "Önce ev sahibinin golü: 2-1. Maç oynanmadıysa boş bırakın.",
    mevki: "Kaleci, Sol bek, Stoper, Sağ bek, Orta saha, Ofansif orta saha, Sol forvet, Santrfor, Sağ forvet.",
    whatsapp: "Başında + ve 0 olmadan: 905333498011",
    etiket: "Haberin üstünde görünür: #U17",
    ev: "Kendi takımımız için: Öz Yarımburgaz Spor",
    takim: "Kendi takımımız için: Öz Yarımburgaz Spor"
  };
  var GORSEL = /^(foto|resim|logo|dosya|kapak)$/, UZUN = /^(ozet|yazi|aciklama|not|uyari|katilYazi)$/;
  var SAYI = /^(no|dogumYili|hafta|kurulus|G|B|M|forma|puanHaftasi)$/;
  /* Her zaman gerekmediği için "Gelişmiş alanlar" başlığı altına saklanan alanlar */
  var GELISMIS = /^(odak|kategori|formAdresi|ornekIcerik|takimAdi|resimAciklama|videoAciklama|onEk|url)$/;
  var SEMA = {
    kadro: { no: null, ad: "", mevki: "", ilk11: false, yedek: false, kaptan: false, dogumYili: null, foto: "" },
    haberler: { tarih: "", kategori: "u17", etiket: "#U17", baslik: "", ozet: "" },
    fikstur: { hafta: null, tarih: "", saat: "", ev: "", konuk: "", skor: "", saha: "" },
    puanDurumu: { takim: "", G: 0, B: 0, M: 0 },
    sponsorlar: { ad: "", logo: "", url: "" },
    sahalar: { ad: "", yer: "", not: "" },
    kulupBilgi: { etiket: "", deger: "" }
  };
  var USTE_EKLE = { haberler: true };   /* yeni öğe listenin başına eklenir */

  function el(e, s, y) { var o = document.createElement(e); if (s) o.className = s; if (y !== undefined) o.textContent = y; return o; }
  function yaz(id, yazi, tur) { $(id).textContent = yazi; $(id).className = "durum" + (tur ? " " + tur : ""); }
  function degisti() { kirli = true; $("kaydet").disabled = false; yaz("kayit-durum", "Kaydedilmemiş değişiklik var.", "uyari"); }
  /* Listelerdeki isteğe bağlı alanlar hem varsayılana hem düzenlenen içeriğe aynı biçimde eklenir;
     böylece yalnızca gerçekten değişen bölümler "değişmiş" sayılır. */
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
  function bosKopya(o) {
    if (Array.isArray(o)) return [];
    if (o && typeof o === "object") { var y = {}; Object.keys(o).forEach(function (k) { y[k] = bosKopya(o[k]); }); return y; }
    return typeof o === "boolean" ? false : typeof o === "number" || o === null ? null : "";
  }
  function sablon(anahtar, dizi) {
    if (SEMA[anahtar]) return JSON.parse(JSON.stringify(SEMA[anahtar]));
    var ornek = dizi[0] !== undefined ? dizi[0] : (VARSAYILAN[anahtar] || [])[0];
    return ornek === undefined ? "" : bosKopya(ornek);
  }
  /* Listede öğenin tek satırlık özeti */
  function ozet(oge) {
    if (!oge || typeof oge !== "object") return String(oge || "");
    if (oge.ev !== undefined) return (oge.hafta ? oge.hafta + ". hafta: " : "") + (oge.ev || "?") + " " + (oge.skor || "-") + " " + (oge.konuk || "?");
    if (oge.takim !== undefined && oge.G !== undefined) return (oge.takim || "Yeni takım") + "  (" + oge.G + " G, " + oge.B + " B, " + oge.M + " M)";
    if (oge.no !== undefined) return (oge.no ? oge.no + " · " : "") + (oge.ad || "Yeni oyuncu") + (oge.mevki ? " · " + oge.mevki : "") + (oge.ilk11 ? " · İlk 11" : oge.yedek ? " · Yedek" : "");
    if (oge.etiket !== undefined && oge.deger !== undefined && oge.baslik === undefined) return (oge.etiket || "?") + ": " + (oge.deger || "");
    return oge.baslik || oge.ad || oge.aciklama || oge.etiket || "Yeni öğe";
  }

  /* ---- Alanlar ---- */
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
    if (UZUN.test(anahtar)) { giris = el("textarea"); giris.rows = 3; kutu.className += " genis"; }
    else { giris = el("input"); giris.type = SAYI.test(anahtar) || typeof deger === "number" ? "number" : anahtar === "tarih" ? "date" : "text"; }
    giris.id = kimlik; giris.value = deger === null || deger === undefined ? "" : deger;
    giris.addEventListener("input", function () {
      sahip[anahtar] = giris.type === "number" ? (giris.value === "" ? null : Number(giris.value)) : giris.value;
      degisti();
    });
    if (GORSEL.test(anahtar) || anahtar === "video") {
      kutu.className += " genis";
      kutu.appendChild(yukleyici(sahip, anahtar, giris, anahtar === "video"));
      var ayr = el("details", "adres"); ayr.appendChild(el("summary", "", "Dosya adresini göster")); ayr.appendChild(giris); kutu.appendChild(ayr);
    } else {
      kutu.appendChild(giris);
      if (IPUCU[anahtar]) kutu.appendChild(el("small", "ipucu", IPUCU[anahtar]));
    }
    return kutu;
  }

  /* Görsel / video: dosya Supabase'e yüklenir, adresi alana yazılır */
  function yukleyici(sahip, anahtar, giris, video) {
    var sar = el("div", "yukle");
    var onizle = el("img", "onizle"); onizle.alt = "";
    var ad = el("span", "dosya-ad");
    function goster() {
      var v = giris.value || "";
      onizle.hidden = video || !v; if (!video && v) onizle.src = v;
      ad.textContent = v ? (video ? "Video yüklü: " + v.split("/").pop() : "") : (video ? "Henüz video yok." : "Henüz görsel yok.");
    }
    goster(); giris.addEventListener("input", goster);
    var dosya = el("input"); dosya.type = "file"; dosya.accept = video ? "video/mp4" : "image/jpeg,image/png,image/webp,image/gif"; dosya.hidden = true;
    var dugme = el("button", "ikincil", video ? "Video seç ve yükle" : "Fotoğraf seç ve yükle"); dugme.type = "button";
    var kaldir = el("button", "ikincil", "Kaldır"); kaldir.type = "button";
    var not = el("small", "ipucu", video ? "MP4, en fazla 50 MB." : "JPG, PNG ya da WebP.");
    dugme.addEventListener("click", function () { dosya.click(); });
    kaldir.addEventListener("click", function () { giris.value = ""; sahip[anahtar] = ""; goster(); degisti(); });
    dosya.addEventListener("change", function () {
      var f = dosya.files[0]; if (!f) return;
      if (f.size > 52428800) { not.textContent = "Dosya 50 MB sınırını aşıyor. Daha küçük bir dosya seçin."; not.className = "ipucu hata"; return; }
      var uzanti = (f.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      var yol = (video ? "video/" : "gorsel/") + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + uzanti;
      dugme.disabled = true; not.className = "ipucu"; not.textContent = "Yükleniyor…";
      istemci.storage.from("site").upload(yol, f, { cacheControl: "31536000", contentType: f.type }).then(function (y) {
        dugme.disabled = false; dosya.value = "";
        if (y.error) { not.textContent = "Yüklenemedi. Dosya türünü ve boyutunu kontrol edip yeniden deneyin."; not.className = "ipucu hata"; return; }
        giris.value = istemci.storage.from("site").getPublicUrl(yol).data.publicUrl;
        sahip[anahtar] = giris.value; goster(); degisti();
        not.textContent = "Yüklendi. Alttaki Kaydet düğmesine basmayı unutmayın.";
      });
    });
    sar.appendChild(onizle); sar.appendChild(ad); sar.appendChild(dugme); sar.appendChild(kaldir); sar.appendChild(dosya); sar.appendChild(not);
    return sar;
  }

  function nesne(o, yol, kok) {
    var sar = el("div", "nesne"), gelismis = el("div", "nesne");
    Object.keys(o).forEach(function (k) {
      if (kok === "sohbet" && k !== "acik") return;          /* bağlantı ayarları panelden değiştirilmez */
      var d = o[k], altYol = yol + "." + k, hedef = GELISMIS.test(k) ? gelismis : sar;
      if (Array.isArray(d)) sar.appendChild(liste(o, k, altYol));
      else if (d && typeof d === "object") { var f = el("fieldset", "genis"); f.appendChild(el("legend", "", ALAN[k] || k)); f.appendChild(nesne(d, altYol, kok)); sar.appendChild(f); }
      else hedef.appendChild(alan(o, k, altYol));
    });
    if (gelismis.children.length) {
      var d2 = el("details", "gelismis genis"); d2.appendChild(el("summary", "", "Gelişmiş alanlar")); d2.appendChild(gelismis); sar.appendChild(d2);
    }
    return sar;
  }

  /* Liste: her öğe tek satır; "Düzenle" ile açılır */
  function liste(sahip, anahtar, yol) {
    var f = el("div", "liste genis");
    var ust = el("div", "liste-ust");
    ust.appendChild(el("h3", "", ALAN[anahtar] || BASLIK[anahtar] || anahtar));
    var ekle = el("button", "", "+ Yeni ekle"); ekle.type = "button"; ust.appendChild(ekle);
    f.appendChild(ust);
    var govde = el("div", "liste-govde"); f.appendChild(govde);
    var acik = null;                                   /* açık olan öğe */
    function ciz() {
      govde.textContent = "";
      var dizi = sahip[anahtar];
      dizi.forEach(function (oge, i) {
        var nesneMi = oge && typeof oge === "object";
        var kart = el("div", "oge" + (nesneMi && oge === acik ? " acik" : ""));
        var satir = el("div", "oge-ust");
        var baslik = el("strong", "", ozet(oge)); satir.appendChild(baslik);
        var dugmeler = el("div", "dugmeler");
        if (nesneMi) {
          var duzenle = el("button", "ikincil kucuk", oge === acik ? "Kapat" : "Düzenle"); duzenle.type = "button";
          duzenle.addEventListener("click", function () { acik = oge === acik ? null : oge; ciz(); });
          dugmeler.appendChild(duzenle);
        }
        [["↑", "Yukarı taşı", -1], ["↓", "Aşağı taşı", 1]].forEach(function (d) {
          var b = el("button", "ikincil kucuk", d[0]); b.type = "button"; b.setAttribute("aria-label", d[1]);
          b.disabled = i + d[2] < 0 || i + d[2] >= dizi.length;
          b.addEventListener("click", function () { var t = dizi[i]; dizi[i] = dizi[i + d[2]]; dizi[i + d[2]] = t; degisti(); ciz(); });
          dugmeler.appendChild(b);
        });
        var sil = el("button", "ikincil kucuk tehlike", "Sil"); sil.type = "button"; var onay = false;
        sil.addEventListener("click", function () {
          if (!onay) { onay = true; sil.textContent = "Silinsin mi?"; return; }
          dizi.splice(i, 1); if (acik === oge) acik = null; degisti(); ciz();
        });
        dugmeler.appendChild(sil); satir.appendChild(dugmeler); kart.appendChild(satir);
        if (nesneMi && oge === acik) {
          var ic = nesne(oge, yol + "." + i, anahtar);
          var guncelle = function () { baslik.textContent = ozet(oge); };
          ic.addEventListener("input", guncelle); ic.addEventListener("change", guncelle);
          kart.appendChild(ic);
        } else if (!nesneMi) {
          baslik.hidden = true;
          var giris = el("input"); giris.type = "text"; giris.value = oge; giris.setAttribute("aria-label", (ALAN[anahtar] || anahtar) + " " + (i + 1));
          giris.addEventListener("input", function () { dizi[i] = giris.value; degisti(); });
          satir.insertBefore(giris, dugmeler);
        }
        govde.appendChild(kart);
      });
      if (!dizi.length) govde.appendChild(el("p", "bos", "Bu listede henüz bir şey yok. \"Yeni ekle\" ile başlayın."));
    }
    ekle.addEventListener("click", function () {
      var yeni = sablon(anahtar, sahip[anahtar]);
      if (anahtar === "haberler") yeni.tarih = new Date().toISOString().slice(0, 10);
      if (anahtar === "fikstur") {                      /* yeni maç: sıradaki hafta numarası hazır gelir */
        yeni.hafta = sahip[anahtar].reduce(function (en, x) { return Math.max(en, Number(x.hafta) || 0); }, 0) + 1;
      }
      if (USTE_EKLE[anahtar]) sahip[anahtar].unshift(yeni); else sahip[anahtar].push(yeni);
      acik = yeni && typeof yeni === "object" ? yeni : null; degisti(); ciz();
      var kart = govde.querySelector(".oge.acik") || govde.lastElementChild;
      if (kart && kart.scrollIntoView) kart.scrollIntoView({ block: "nearest" });
      var ilk = kart && kart.querySelector(".nesne input, .nesne textarea, .oge-ust > input"); if (ilk) ilk.focus();
    });
    ciz();
    return f;
  }

  /* ---- Ana ekran ve bölüm ekranı ---- */
  function kutuAnahtarlari(i) {
    if (KUTULAR[i][2]) return KUTULAR[i][2].filter(function (k) { return k in veri; });
    var kullanilan = {};
    KUTULAR.forEach(function (k) { (k[2] || []).forEach(function (a) { kullanilan[a] = true; }); });
    return Object.keys(veri).filter(function (k) { return !kullanilan[k]; });
  }
  function anaEkran() {
    var form = $("form"); form.textContent = "";
    $("geri").hidden = true; $("ekran-baslik").textContent = "Ne yapmak istiyorsunuz?";
    var izgara = el("div", "kutular");
    KUTULAR.forEach(function (k, i) {
      if (!kutuAnahtarlari(i).length) return;
      var b = el("button", "kutu"); b.type = "button";
      b.appendChild(el("strong", "", k[0])); b.appendChild(el("span", "", k[1]));
      b.addEventListener("click", function () { bolumEkrani(i); });
      izgara.appendChild(b);
    });
    form.appendChild(izgara);
    window.scrollTo(0, 0);
  }
  function bolumEkrani(i) {
    var form = $("form"); form.textContent = "";
    $("geri").hidden = false; $("ekran-baslik").textContent = KUTULAR[i][0];
    var duz = el("div", "nesne kart"), gelismis = el("div", "nesne"), bloklar = [];
    kutuAnahtarlari(i).forEach(function (k) {
      var d = veri[k];
      if (Array.isArray(d)) { var s = el("section", "kart"); s.appendChild(liste(veri, k, k)); bloklar.push(s); }
      else if (d && typeof d === "object") {
        var s2 = el("section", "kart"); s2.appendChild(el("h3", "", BASLIK[k] || k)); s2.appendChild(nesne(d, k, k)); bloklar.push(s2);
      } else (GELISMIS.test(k) ? gelismis : duz).appendChild(alan(veri, k, k));
    });
    if (gelismis.children.length) {
      var d2 = el("details", "gelismis genis"); d2.appendChild(el("summary", "", "Gelişmiş alanlar")); d2.appendChild(gelismis); duz.appendChild(d2);
    }
    if (duz.children.length) form.appendChild(duz);
    bloklar.forEach(function (b) { form.appendChild(b); });
    window.scrollTo(0, 0);
    $("geri").focus();
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
      if (y.error) { $("kaydet").disabled = false; yaz("kayit-durum", "Kaydedilemedi. Bağlantınızı kontrol edip yeniden deneyin; sorun sürerse çıkış yapıp yeniden girin.", "hata"); return; }
      kirli = false; yaz("kayit-durum", "Kaydedildi. Değişiklik sitede yayında.", "tamam");
    });
  }

  function panelAc() {
    istemci.rpc("sohbet_yonetici_mi").then(function (y) {
      if (y.error || !y.data) { yaz("giris-durum", "Bu hesap yönetici olarak tanımlı değil.", "hata"); istemci.auth.signOut(); return; }
      return istemci.from("site_icerik").select("veri").eq("id", "ana").maybeSingle().then(function (s) {
        if (s.error) { yaz("giris-durum", "İçerik yüklenemedi. Sayfayı yenileyip yeniden deneyin.", "hata"); return; }
        veri = JSON.parse(JSON.stringify(VARSAYILAN));
        var kayitli = s.data && s.data.veri;
        if (kayitli) Object.keys(kayitli).forEach(function (k) {
          if (k === "sohbet") veri.sohbet.acik = kayitli.sohbet.acik; else veri[k] = kayitli[k];
        });
        tamamla(veri);
        $("giris-kart").hidden = true; $("panel").hidden = false; $("alt-cubuk").hidden = false; $("ust-baglar").hidden = false;
        yaz("kayit-durum", "Değişiklik yaptığınızda buradan kaydedin.");
        anaEkran();
      });
    });
  }

  $("giris-form").addEventListener("submit", function (olay) {
    olay.preventDefault(); $("g-dugme").disabled = true; yaz("giris-durum", "Giriş yapılıyor…");
    istemci.auth.signInWithPassword({ email: $("g-eposta").value.trim(), password: $("g-sifre").value }).then(function (y) {
      $("g-dugme").disabled = false;
      if (y.error) { yaz("giris-durum", "Giriş yapılamadı. E-posta ya da şifre hatalı.", "hata"); return; }
      $("g-sifre").value = ""; yaz("giris-durum", ""); panelAc();
    });
  });
  $("kaydet").addEventListener("click", kaydet);
  $("geri").addEventListener("click", anaEkran);
  $("cikis").addEventListener("click", function () { kirli = false; istemci.auth.signOut().then(function () { location.reload(); }); });
  window.addEventListener("beforeunload", function (e) { if (kirli) { e.preventDefault(); e.returnValue = ""; } });
  istemci.auth.getSession().then(function (y) { if (y.data && y.data.session) panelAc(); });
})();
