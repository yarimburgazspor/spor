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

  /* Başlık, şerit, alt bilgi */
  document.title = K.kisaAd;
  $("serit-etiket").textContent = K.etiket;
  $("marka-ad").textContent = K.kisaAd;
  $("marka-alt").textContent = K.kurulus + " · " + K.renkler;
  $("alt-ad").textContent = K.ad + ", " + K.kurulus + " yılında kuruldu. Renkleri " + K.renkler.toLowerCase().replace(" - ", "-") + ".";
  $("alt-yazi").textContent = "© " + new Date().getFullYear() + " " + K.ad;
  $("ornek-uyari").hidden = !K.ornekIcerik;
  ["serit-instagram", "instagram-dugme"].forEach(function (id) {
    $(id).href = K.instagram; $(id).target = "_blank";
  });
  $("serit-instagram-ad").textContent = K.instagramAd;
  $("instagram-dugme").textContent = K.instagramAd + " hesabını aç";

  /* Haberler: en yenisi büyük kart olur, sekmeler kategoriye göre süzer */
  function haberleriCiz(kategori) {
    var liste = $("haber-liste");
    liste.textContent = "";
    var secili = K.haberler
      .filter(function (h) { return kategori === "tumu" || h.kategori === kategori; })
      .sort(function (a, b) { return a.tarih < b.tarih ? 1 : -1; });
    if (!secili.length) { liste.appendChild(el("p", "bos", "Bu başlıkta henüz haber yok.")); return; }
    secili.forEach(function (h, i) {
      var a = el("article", "haber" + (i === 0 ? " buyuk" : ""));
      a.appendChild(el("div", "haber-ust"));
      var ic = el("div", "haber-ic");
      var satir = el("div", "kunye-satir");
      satir.appendChild(el("span", "etiket", h.etiket));
      var t = el("time", "", tarihYaz(h.tarih, { day: "numeric", month: "long", year: "numeric" }));
      t.dateTime = h.tarih;
      satir.appendChild(t);
      ic.appendChild(satir); ic.appendChild(el("h3", "", h.baslik)); ic.appendChild(el("p", "", h.ozet));
      a.appendChild(ic);
      liste.appendChild(a);
    });
  }
  var sekmeler = document.querySelectorAll(".sekmeler button");
  Array.prototype.forEach.call(sekmeler, function (b) {
    b.addEventListener("click", function () {
      Array.prototype.forEach.call(sekmeler, function (d) { d.setAttribute("aria-pressed", d === b ? "true" : "false"); });
      haberleriCiz(b.getAttribute("data-kategori"));
    });
  });
  haberleriCiz("tumu");

  /* Maç takvimi */
  function sonucSinifi(m) {
    var s = m.skor.split("-").map(Number);
    return s[0] > s[1] ? "g" : s[0] === s[1] ? "b" : "m";
  }
  var siradaki = K.fikstur.filter(function (m) { return !m.skor; })[0];

  K.fikstur.forEach(function (m) {
    var li = el("li", m === siradaki ? "sirada" : "");
    var gun = el("span", "gun");
    gun.appendChild(document.createTextNode(tarihYaz(m.tarih, { day: "numeric", month: "short" })));
    gun.appendChild(el("br"));
    gun.appendChild(document.createTextNode(m.saat));
    var rakip = el("span", "rakip", m.rakip);
    rakip.appendChild(el("span", "ic-dis", m.ev ? "İç saha" : "Deplasman"));
    var sonuc = m.skor
      ? el("span", "sonuc " + sonucSinifi(m), m.skor)
      : el("span", "sonuc bekliyor", m === siradaki ? "Sıradaki" : "Oynanacak");
    if (m.skor) sonuc.setAttribute("aria-label", "Sonuç " + m.skor + ({ g: ", galibiyet", b: ", beraberlik", m: ", mağlubiyet" })[sonucSinifi(m)]);
    li.appendChild(gun); li.appendChild(rakip); li.appendChild(sonuc);
    $("maclar").appendChild(li);
  });

  var kutu = $("siradaki");
  if (siradaki) {
    var evSahibi = siradaki.ev ? K.kisaAd : siradaki.rakip;
    var konuk = siradaki.ev ? siradaki.rakip : K.kisaAd;
    var sol = el("div", "takim"); sol.appendChild(el("small", "", "EV SAHİBİ")); sol.appendChild(document.createTextNode(evSahibi));
    var sag = el("div", "takim sag"); sag.appendChild(el("small", "", "KONUK")); sag.appendChild(document.createTextNode(konuk));
    var orta = el("div", "orta");
    orta.appendChild(el("p", "ne-zaman", tarihYaz(siradaki.tarih, { weekday: "long", day: "numeric", month: "long" }) + " · " + siradaki.saat));
    var sayac = el("dl", "sayac");
    var parcalar = {};
    [["gun", "Gün"], ["saat", "Saat"], ["dakika", "Dakika"]].forEach(function (p) {
      var d = el("div"); d.appendChild(el("dt", "", p[1]));
      parcalar[p[0]] = el("dd", "", "0"); d.appendChild(parcalar[p[0]]);
      sayac.appendChild(d);
    });
    orta.appendChild(sayac);
    orta.appendChild(el("p", "yer", siradaki.ev ? K.stat : "Deplasman"));
    kutu.appendChild(sol); kutu.appendChild(orta); kutu.appendChild(sag);

    var hedef = tarihNesnesi(siradaki.tarih, siradaki.saat).getTime();
    var say = function () {
      var kalan = Math.max(0, hedef - Date.now());
      parcalar.gun.textContent = Math.floor(kalan / 864e5);
      parcalar.saat.textContent = Math.floor(kalan % 864e5 / 36e5);
      parcalar.dakika.textContent = Math.floor(kalan % 36e5 / 6e4);
    };
    say(); setInterval(say, 30000);
  } else {
    kutu.style.display = "block";
    kutu.appendChild(el("p", "ne-zaman", "Yeni maç takvimi açıklandığında burada yer alacak."));
  }

  /* Puan durumu: puana, sonra averaja, sonra atılan gole göre sıralanır */
  K.puanDurumu
    .map(function (t) { return Object.assign({}, t, { P: t.G * 3 + t.B, AV: t.A - t.Y }); })
    .sort(function (a, b) { return b.P - a.P || b.AV - a.AV || b.A - a.A; })
    .forEach(function (t, i) {
      var tr = el("tr", t.biz ? "biz" : "");
      [i + 1, t.takim, t.O, t.G, t.B, t.M, (t.AV > 0 ? "+" : "") + t.AV, t.P].forEach(function (v) {
        tr.appendChild(el("td", "", String(v)));
      });
      $("puan-govde").appendChild(tr);
    });

  /* Takımlar */
  $("teknik").textContent = "Teknik direktör: " + K.teknikDirektor;
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
  K.altyapi.forEach(function (t) {
    var k = el("div", "kart");
    k.appendChild(el("div", "yas", t.ad));
    k.appendChild(el("p", "kucuk", t.dogum));
    var dl = el("dl");
    [["Antrenör", t.antrenor], ["Antrenman günleri", t.gunler]].forEach(function (c) {
      var d = el("div"); d.appendChild(el("dt", "", c[0])); d.appendChild(el("dd", "", c[1])); dl.appendChild(d);
    });
    k.appendChild(dl);
    $("altyapi-liste").appendChild(k);
  });

  /* Tesisler */
  K.tesisler.forEach(function (t) {
    var k = el("div", "kart tesis");
    k.appendChild(el("h3", "", t.ad));
    k.appendChild(el("p", "kucuk", t.yer));
    var ul = el("ul");
    t.ozellikler.forEach(function (o) { ul.appendChild(el("li", "", o)); });
    k.appendChild(ul);
    $("tesis-liste").appendChild(k);
  });

  /* Futbol okulu ve künye */
  $("okul-yazi").textContent = K.futbolOkulu.yazi;
  K.futbolOkulu.maddeler.forEach(function (m) { $("okul-maddeler").appendChild(el("li", "", m)); });
  [["Kuruluş", String(K.kurulus)], ["Renkler", K.renkler], ["Altyapı takımı", String(K.altyapi.length)]].forEach(function (c) {
    var d = el("div"); d.appendChild(el("dt", "", c[0])); d.appendChild(el("dd", "", c[1])); $("kunye").appendChild(d);
  });

  /* İletişim */
  [K.iletisim.adres, K.iletisim.telefon, K.iletisim.eposta, K.iletisim.saatler].forEach(function (s) {
    $("iletisim-liste").appendChild(el("li", "", s));
  });
  var ig = el("li"); var iga = el("a", "", "Instagram: " + K.instagramAd);
  iga.href = K.instagram; iga.target = "_blank"; iga.rel = "noopener"; ig.appendChild(iga);
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
        durumYaz("Başvurunuz alındı. Kulüp sekreterliği sizi arayacak.", "tamam");
      })
      .catch(function () {
        durumYaz("Başvuru gönderilemedi. Bağlantınızı kontrol edip yeniden deneyin ya da Instagram'dan (" + K.instagramAd + ") yazın.", "hata");
      })
      .then(function () { gonder.disabled = false; });
  });
})();
