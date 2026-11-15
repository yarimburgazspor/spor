(function () {
  "use strict";
  var K = window.KULUP;
  var $ = function (id) { return document.getElementById(id); };

  function el(etiket, sinif, yazi) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (yazi !== undefined) e.textContent = yazi;
    return e;
  }
  function tarihNesnesi(iso, saat) {
    var p = iso.split("-"), s = (saat || "00:00").split(":");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), Number(s[0]), Number(s[1]));
  }
  function tarihYaz(iso, secenek) { return tarihNesnesi(iso).toLocaleDateString("tr-TR", secenek); }
  function disBaglanti(a, adres) { a.href = adres; a.target = "_blank"; a.rel = "noopener"; }
  function bizMi(ad) { return ad === K.takimAdi; }

  /* Başlık ve alt bilgi */
  document.title = K.kisaAd;
  $("sayfa-baslik").textContent = K.ad;
  $("marka-ad").textContent = K.kisaAd;
  $("marka-alt").textContent = K.kurulus + " · " + K.renkler;
  $("alt-ad").textContent = K.ad + ", " + K.kurulus + " yılında kuruldu. Renkleri " + K.renkler.toLowerCase().replace(" - ", "-") + "." + (K.ilce ? " " + K.ilce + "." : "");
  $("alt-yazi").textContent = "© " + new Date().getFullYear() + " " + K.ad + ". Tüm hakları saklıdır.";
  $("alt-marka-ad").textContent = K.ad;
  $("alt-marka-alt").textContent = K.kurulus + " · " + K.renkler;
  disBaglanti($("alt-ig"), K.instagram);
  $("alt-ig-ad").textContent = K.instagramAd;
  (K.kulupBilgi || []).filter(function (b) { return b.etiket !== "Adres" && b.etiket !== "Renkler"; }).forEach(function (b) {
    var d = el("div"); d.appendChild(el("dt", "", b.etiket)); d.appendChild(el("dd", "", b.deger));
    $("alt-kunye").appendChild(d);
  });
  if (K.tasarim) {
    $("tasarim").appendChild(document.createTextNode(K.tasarim.onEk + " "));
    var ta = el("a", "", K.tasarim.ad); disBaglanti(ta, K.tasarim.url);
    $("tasarim").appendChild(ta);
  }
  $("ornek-uyari").hidden = !K.ornekIcerik;
  disBaglanti($("yan-instagram"), K.instagram);
  $("yan-instagram").setAttribute("aria-label", "Instagram: " + K.instagramAd);
  Array.prototype.forEach.call(document.querySelectorAll(".kaynak-dugme"), function (a) { disBaglanti(a, K.ligKaynak.url); });

  var maclar = K.fikstur.slice().sort(function (a, b) { return a.hafta - b.hafta; });

  /* Kayan sonuç bandı: en yeni maç başta. Kesintisiz dönmesi için liste iki kez yazılır;
     ikinci kopya ekran okuyuculardan gizlenir. Veriler canlı değildir, fikstur listesinden gelir. */
  (function () {
    var serit = $("bant-serit");
    var oynanan = maclar.filter(function (m) { return m.skor; }).reverse();
    if (!oynanan.length) { $("bant").hidden = true; return; }
    $("bant-etiket").textContent = "Maç sonuçları";
    [false, true].forEach(function (kopya) {
      var grup = el("div", "bant-grup");
      if (kopya) grup.setAttribute("aria-hidden", "true");
      oynanan.forEach(function (m) {
        var s = m.skor.split("-");
        var b = el("span", "bant-mac");
        b.appendChild(el("span", "bant-lig", K.takim));
        b.appendChild(el("span", bizMi(m.ev) ? "biz" : "", m.ev));
        b.appendChild(el("strong", "", s[0] + " - " + s[1]));
        b.appendChild(el("span", bizMi(m.konuk) ? "biz" : "", m.konuk));
        grup.appendChild(b);
      });
      serit.appendChild(grup);
    });
    serit.style.animationDuration = Math.max(20, oynanan.length * 7) + "s";
  })();

  /* Büyük slider: 5 saniyede bir geçer; oklar, noktalar ve kaydırma ile de değişir */
  (function () {
    var S = K.slider, kutu = $("vitrin");
    if (!S || !S.resimler.length) { kutu.hidden = true; return; }
    $("vitrin-baslik").textContent = S.baslik;
    $("vitrin-aciklama").textContent = S.yazi;
    var cerceve = $("vitrin-cerceve"), kareler = [], noktalar = [], aktif = 0, zamanlayici = null;
    S.resimler.forEach(function (r, i) {
      var f = el("figure", i === 0 ? "aktif" : "");
      var img = el("img"); img.src = r.dosya; img.alt = r.aciklama;
      if (r.odak) img.style.objectPosition = r.odak;
      if (i > 0) img.loading = "lazy";
      f.appendChild(img);
      cerceve.appendChild(f); kareler.push(f);
      var n = el("button"); n.type = "button";
      n.setAttribute("aria-label", (i + 1) + ". fotoğraf: " + r.aciklama);
      n.addEventListener("click", function () { durdur(); goster(i); });
      $("vitrin-noktalar").appendChild(n); noktalar.push(n);
    });
    function goster(n) {
      aktif = (n + kareler.length) % kareler.length;
      kareler.forEach(function (f, i) { f.className = i === aktif ? "aktif" : ""; });
      noktalar.forEach(function (d, i) { d.setAttribute("aria-current", i === aktif ? "true" : "false"); });
    }
    function durdur() { clearInterval(zamanlayici); zamanlayici = null; }
    function baslat() {
      if (zamanlayici || kareler.length < 2) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      zamanlayici = setInterval(function () { goster(aktif + 1); }, 5000);
    }
    $("vitrin-geri").addEventListener("click", function () { durdur(); goster(aktif - 1); });
    $("vitrin-ileri").addEventListener("click", function () { durdur(); goster(aktif + 1); });
    kutu.addEventListener("mouseenter", durdur);
    kutu.addEventListener("mouseleave", baslat);
    kutu.addEventListener("focusin", durdur);
    var basX = null;
    cerceve.addEventListener("touchstart", function (e) { basX = e.touches[0].clientX; }, { passive: true });
    cerceve.addEventListener("touchend", function (e) {
      if (basX === null) return;
      var fark = e.changedTouches[0].clientX - basX; basX = null;
      if (Math.abs(fark) > 40) { durdur(); goster(aktif + (fark < 0 ? 1 : -1)); }
    });
    goster(0); baslat();
  })();

  /* Maçlar */
  $("lig-baslik").textContent = K.lig;
  function sonucumuz(m) {
    var s = m.skor.split("-").map(Number);
    var biz = bizMi(m.ev) ? s[0] : s[1], rakip = bizMi(m.ev) ? s[1] : s[0];
    return biz > rakip ? "g" : biz === rakip ? "b" : "m";
  }
  var sonucAdi = { g: "galibiyet", b: "beraberlik", m: "mağlubiyet" };
  var siradaki = maclar.filter(function (m) { return !m.skor; })[0];

  maclar.forEach(function (m) {
    var li = el("li", "mac" + (m === siradaki ? " sirada" : ""));
    li.appendChild(el("div", "mac-ust", m.hafta + ". hafta - " + tarihYaz(m.tarih, { day: "numeric", month: "long", year: "numeric", weekday: "long" })));
    var orta = el("div", "mac-orta");
    orta.appendChild(el("span", "ev" + (bizMi(m.ev) ? " biz" : ""), m.ev));
    var skor;
    if (m.skor) {
      var sinif = sonucumuz(m);
      skor = el("span", "skor " + sinif, m.skor.replace("-", " - "));
      skor.setAttribute("aria-label", m.skor.replace("-", " - ") + ", " + sonucAdi[sinif]);
    } else {
      skor = el("span", "skor yok", "-");
      skor.setAttribute("aria-label", "Sonuç girilmedi");
    }
    orta.appendChild(skor);
    orta.appendChild(el("span", "konuk" + (bizMi(m.konuk) ? " biz" : ""), m.konuk));
    li.appendChild(orta);
    li.appendChild(el("div", "mac-alt", m.saha + " - " + m.saat));
    $("maclar").appendChild(li);
  });

  /* Sıradaki maç kutusu: sonucu girilmemiş ilk maç. Saati geçtiyse "sonuç bekleniyor" yazar. */
  var kutu = $("siradaki");
  if (siradaki) {
    var sol = el("div", "takim"); sol.appendChild(el("small", "", "EV SAHİBİ")); sol.appendChild(document.createTextNode(siradaki.ev));
    var sag = el("div", "takim sag"); sag.appendChild(el("small", "", "KONUK")); sag.appendChild(document.createTextNode(siradaki.konuk));
    var orta2 = el("div", "orta");
    orta2.appendChild(el("p", "ne-zaman", siradaki.hafta + ". hafta · " + tarihYaz(siradaki.tarih, { weekday: "long", day: "numeric", month: "long" }) + " · " + siradaki.saat));
    var hedef = tarihNesnesi(siradaki.tarih, siradaki.saat).getTime();
    if (hedef > Date.now()) {
      var sayac = el("dl", "sayac"), parcalar = {};
      [["gun", "Gün"], ["saat", "Saat"], ["dakika", "Dakika"]].forEach(function (p) {
        var d = el("div"); d.appendChild(el("dt", "", p[1]));
        parcalar[p[0]] = el("dd", "", "0"); d.appendChild(parcalar[p[0]]);
        sayac.appendChild(d);
      });
      orta2.appendChild(sayac);
      var say = function () {
        var kalan = Math.max(0, hedef - Date.now());
        parcalar.gun.textContent = Math.floor(kalan / 864e5);
        parcalar.saat.textContent = Math.floor(kalan % 864e5 / 36e5);
        parcalar.dakika.textContent = Math.floor(kalan % 36e5 / 6e4);
      };
      say(); setInterval(say, 30000);
    } else {
      orta2.appendChild(el("p", "bekleniyor", "Sonuç bekleniyor"));
    }
    orta2.appendChild(el("p", "yer", siradaki.saha));
    kutu.appendChild(sol); kutu.appendChild(orta2); kutu.appendChild(sag);
  } else {
    kutu.hidden = true;
  }

  /* Puan durumu: puana göre sıralanır, eşitlikte dosyadaki sıra korunur */
  var tablo = K.puanDurumu
    .map(function (t, i) { return { takim: t.takim, G: t.G, B: t.B, M: t.M, O: t.G + t.B + t.M, P: t.G * 3 + t.B, i: i }; })
    .sort(function (a, b) { return b.P - a.P || a.i - b.i; });
  tablo.forEach(function (t, i) {
    var tr = el("tr", bizMi(t.takim) ? "biz" : "");
    [(i < 9 ? "0" : "") + (i + 1), t.takim, t.O, t.G, t.B, t.M, t.P].forEach(function (v) { tr.appendChild(el("td", "", String(v))); });
    $("puan-govde").appendChild(tr);
  });
  var pb = $("puan-baslik");
  pb.appendChild(document.createTextNode(K.lig));
  pb.appendChild(el("br"));
  pb.appendChild(document.createTextNode(K.puanHaftasi + ". hafta puan durumu"));
  $("puan-alt").textContent = K.grup;
  var kaynak = $("kaynak-not");
  kaynak.appendChild(document.createTextNode("Kaynak: "));
  var ka = el("a", "", K.ligKaynak.ad); disBaglanti(ka, K.ligKaynak.url);
  kaynak.appendChild(ka);

  /* Haberler: en yenisi büyük kart olur */
  K.haberler
    .map(function (h, i) { return { h: h, i: i }; })
    .sort(function (a, b) { return a.h.tarih === b.h.tarih ? a.i - b.i : (a.h.tarih < b.h.tarih ? 1 : -1); })
    .forEach(function (kayit) {
      var h = kayit.h;
      var a = el("article", "haber");
      var satir = el("div", "kunye-satir");
      satir.appendChild(el("span", "etiket", h.etiket));
      var t = el("time", "", tarihYaz(h.tarih, { day: "numeric", month: "long", year: "numeric" }));
      t.dateTime = h.tarih;
      satir.appendChild(t);
      a.appendChild(satir); a.appendChild(el("h3", "", h.baslik)); a.appendChild(el("p", "", h.ozet));
      $("haber-liste").appendChild(a);
    });

  /* Anma bölümü ve menüdeki siyah kurdele */
  (function () {
    var A = K.anma;
    if (!A) return;
    $("anma").hidden = false;
    $("kurdele-bag").hidden = false;
    $("anma-baslik").textContent = A.baslik;
    $("anma-isim").textContent = A.isimler;
    A.satirlar.forEach(function (s) { $("anma-satirlar").appendChild(el("p", "", s)); });
    $("anma-imza").textContent = A.imza;
    var v = $("anma-video");
    v.src = A.video; v.poster = A.kapak;
    v.setAttribute("aria-label", A.videoAciklama);
  })();

  /* Slider'ın yanındaki görsel */
  if (K.yanResim && K.yanResim.dosya) {
    $("yan-resim").src = K.yanResim.dosya; $("yan-resim").alt = K.yanResim.aciklama;
  } else {
    $("yan-gorsel").hidden = true;
  }

  /* Başkan görseli */
  if (K.baskan) {
    $("yan-baskan").hidden = false;
    $("baskan-baslik").textContent = K.baskan.baslik;
    $("baskan-ad").textContent = K.baskan.ad;
    $("baskan-resim").src = K.baskan.resim; $("baskan-resim").alt = K.baskan.resimAciklama;
  }

  /* Gol kralı */
  (function () {
    var G = K.golKrali;
    if (!G) { $("gol-krali").hidden = true; return; }
    $("gk-baslik").textContent = G.baslik;
    $("gk-resim").src = G.resim; $("gk-resim").alt = G.resimAciklama;
    $("gk-forma").textContent = String(G.forma);
    $("gk-ad").textContent = G.ad;
    $("gk-unvan").textContent = G.unvan;
    G.rakamlar.forEach(function (r) {
      var d = el("div"); d.appendChild(el("dt", "", r.etiket)); d.appendChild(el("dd", "", r.deger));
      $("gk-rakamlar").appendChild(d);
    });
  })();

  /* Instagram profil yerleştirmesi. Instagram'ın embed.js dosyası blockquote'u profil
     önizlemesine çevirir; yüklenemezse içindeki bağlantı görünür kalır. */
  (function () {
    disBaglanti($("ig-dugme"), K.instagram);
    var bq = el("blockquote", "instagram-media");
    bq.setAttribute("data-instgrm-permalink", K.instagram);
    bq.setAttribute("data-instgrm-version", "14");
    var a = el("a", "", "Instagram'da " + K.instagramAd + " profilini görüntüle");
    disBaglanti(a, K.instagram);
    bq.appendChild(a);
    $("ig-ic").appendChild(bq);
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(s);
  })();

  /* Takım özeti: tablodaki kendi satırımızdan hesaplanır */
  var biz = tablo.filter(function (t) { return bizMi(t.takim); })[0];
  var sira = tablo.indexOf(biz) + 1;
  var gol = maclar.filter(function (m) { return m.skor; }).reduce(function (top, m) {
    var s = m.skor.split("-").map(Number);
    top.a += bizMi(m.ev) ? s[0] : s[1]; top.y += bizMi(m.ev) ? s[1] : s[0];
    return top;
  }, { a: 0, y: 0 });
  var ozet = [[K.takim, K.lig + " · " + K.sezon]];
  if (biz) {
    ozet.push([sira + ".", K.grup + " sıralaması"]);
    ozet.push([String(biz.P), "Puan"]);
    ozet.push([biz.G + " - " + biz.B + " - " + biz.M, "Galibiyet - beraberlik - mağlubiyet"]);
    ozet.push([gol.a + " : " + gol.y, "Attığı : yediği gol"]);
  }
  ozet.forEach(function (o) {
    var d = el("div"); d.appendChild(el("strong", "", o[0])); d.appendChild(el("span", "", o[1]));
    $("takim-ozet").appendChild(d);
  });

  /* Kadro: liste boşsa bölüm gizli kalır */
  if (K.kadro.length) {
    $("kadro-bolum").hidden = false;
    $("teknik").textContent = K.teknikDirektor ? "Teknik direktör: " + K.teknikDirektor : "";
    K.kadro.forEach(function (g) {
      var d = el("div");
      d.appendChild(el("h4", "", g.mevki));
      var ul = el("ul");
      g.oyuncular.forEach(function (o) {
        var li = el("li");
        li.appendChild(el("span", "no", String(o.no)));
        li.appendChild(el("span", "", o.ad));
        if (o.kaptan) li.appendChild(el("span", "rozet", "Kaptan"));
        ul.appendChild(li);
      });
      d.appendChild(ul);
      $("kadro-liste").appendChild(d);
    });
  }

  /* Kulüp bilgileri */
  (K.kulupBilgi || []).forEach(function (b) {
    var d = el("div"); d.appendChild(el("dt", "", b.etiket)); d.appendChild(el("dd", "", b.deger));
    $("kulup-bilgi").appendChild(d);
  });

  /* Saha */
  K.sahalar.forEach(function (s) {
    var k = el("div", "saha");
    k.appendChild(el("strong", "", s.ad));
    k.appendChild(el("span", "kucuk", s.yer));
    k.appendChild(el("p", "", s.not));
    $("saha-liste").appendChild(k);
  });

  /* Sponsorlarımız: eşit ölçülü kutular */
  if (K.sponsorlar && K.sponsorlar.length) {
    $("sponsorlar").hidden = false;
    K.sponsorlar.forEach(function (s) {
      var li = el("li");
      var img = el("img"); img.src = s.logo; img.alt = s.ad; img.loading = "lazy";
      if (s.url) { var a = el("a"); disBaglanti(a, s.url); a.appendChild(img); li.appendChild(a); }
      else li.appendChild(img);
      $("sponsor-liste").appendChild(li);
    });
  }

  /* Sponsorluk: düğme, başvuru formunda "Sponsorluk" türünü seçili getirir */
  (function () {
    var S = K.sponsorluk;
    if (!S) { $("sponsorluk").hidden = true; return; }
    $("sp-baslik").textContent = S.baslik;
    $("sp-resim").src = S.resim; $("sp-resim").alt = S.resimAciklama;
    $("sp-slogan").textContent = S.slogan;
    $("sp-metin").textContent = S.yazi;
    $("sp-uyari").textContent = S.uyari;
    S.dayanak.forEach(function (d) { $("sp-dayanak").appendChild(el("li", "", d)); });
    S.kazanimlar.forEach(function (k) { $("sp-kazanim").appendChild(el("li", "", k)); });
    $("sp-dugme").addEventListener("click", function () {
      var sec = $("f-tur");
      if (K.basvuruTurleri.indexOf("Sponsorluk") !== -1) sec.value = "Sponsorluk";
    });
  })();

  /* Kulübe katıl ve künye */
  $("katil-yazi").textContent = K.katilYazi;
  [["Kuruluş", String(K.kurulus)], ["Renkler", K.renkler], ["Lig", K.lig]].forEach(function (c) {
    var d = el("div"); d.appendChild(el("dt", "", c[0])); d.appendChild(el("dd", "", c[1])); $("kunye").appendChild(d);
  });

  /* İletişim: boş satırlar atlanır */
  if (K.iletisim.adres) $("iletisim-liste").appendChild(el("li", "", K.iletisim.adres));
  if (K.iletisim.telefon) {
    var tl = el("li"), ta2 = el("a", "", "Telefon: " + K.iletisim.telefon);
    ta2.href = "tel:+" + (K.whatsapp || K.iletisim.telefon.replace(/\D/g, ""));
    tl.appendChild(ta2); $("iletisim-liste").appendChild(tl);
  }
  if (K.whatsapp) {
    var wl = el("li"), wa = el("a", "", "WhatsApp'tan yazın");
    disBaglanti(wa, "https://wa.me/" + K.whatsapp);
    wl.appendChild(wa); $("iletisim-liste").appendChild(wl);
    $("f-gonder").textContent = "WhatsApp ile gönder";
  }
  [K.iletisim.eposta, K.iletisim.saatler].forEach(function (s) {
    if (s) $("iletisim-liste").appendChild(el("li", "", s));
  });
  var ig = el("li"), iga = el("a", "", "Instagram: " + K.instagramAd);
  disBaglanti(iga, K.instagram); ig.appendChild(iga);
  $("iletisim-liste").appendChild(ig);

  /* Başvuru formu */
  var form = $("basvuru"), durum = $("form-durum"), gonder = $("f-gonder");
  K.basvuruTurleri.forEach(function (t) { var o = el("option", "", t); o.value = t; $("f-tur").appendChild(o); });
  function durumYaz(yazi, sinif) { durum.textContent = yazi; durum.className = "form-durum " + (sinif || ""); }

  form.addEventListener("submit", function (olay) {
    olay.preventDefault();
    var eksik = null;
    Array.prototype.forEach.call(form.elements, function (a) {
      if (!a.willValidate) return;
      var gecerli = a.checkValidity();
      a.setAttribute("aria-invalid", gecerli ? "false" : "true");
      if (!gecerli && !eksik) eksik = a;
    });
    if (eksik) {
      durumYaz("Eksik alan var: ad soyad, telefon, geçerli bir e-posta ve onay kutusu gerekli.", "hata");
      eksik.focus();
      return;
    }
    if (K.whatsapp) {
      var deger = function (id) { return $(id).value.trim(); };
      var satirlar = [
        K.kisaAd + " başvuru formu",
        "Başvuru türü: " + deger("f-tur"),
        "Ad soyad: " + deger("f-ad"),
        "Telefon: " + deger("f-tel"),
        "E-posta: " + deger("f-eposta")
      ];
      if (deger("f-dogum")) satirlar.push("Sporcunun doğum yılı: " + deger("f-dogum"));
      if (deger("f-not")) satirlar.push("Not: " + deger("f-not"));
      var adres = "https://wa.me/" + K.whatsapp + "?text=" + encodeURIComponent(satirlar.join("\n"));
      durumYaz("WhatsApp açılıyor. Başvurunuz, WhatsApp'ta Gönder'e bastığınızda bize ulaşır.", "tamam");
      var pencere = window.open(adres, "_blank", "noopener");
      if (!pencere) window.location.href = adres;
      return;
    }
    if (!K.formAdresi) {
      durumYaz("Başvurunuz gönderilmedi: form henüz bir alıcıya bağlanmadı. Şimdilik Instagram'dan (" + K.instagramAd + ") yazabilirsiniz.", "hata");
      return;
    }
    gonder.disabled = true;
    durumYaz("Gönderiliyor…");
    fetch(K.formAdresi, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
      .then(function (yanit) {
        if (!yanit.ok) throw new Error("Sunucu " + yanit.status + " yanıtı verdi");
        form.reset();
        durumYaz("Başvurunuz alındı. Kulüp sizi arayacak.", "tamam");
      })
      .catch(function () {
        durumYaz("Başvuru gönderilemedi. Bağlantınızı kontrol edip yeniden deneyin ya da Instagram'dan (" + K.instagramAd + ") yazın.", "hata");
      })
      .then(function () { gonder.disabled = false; });
  });
})();
