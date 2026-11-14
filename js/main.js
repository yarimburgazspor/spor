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
  function tarihYaz(iso, secenek) {
    var p = iso.split("-");
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return d.toLocaleDateString("tr-TR", secenek);
  }

  /* Başlıklar */
  document.title = K.ad;
  $("marka-ad").textContent = K.kisaAd;
  $("arma-yazi").textContent = K.armaHarfleri;
  $("kapak-lig").textContent = K.lig + " · " + K.sezon;
  $("kapak-ad").textContent = K.ad;
  $("kapak-slogan").textContent = K.slogan;
  $("alt-yazi").textContent = "© " + new Date().getFullYear() + " " + K.ad + " · Kuruluş " + K.kurulus + ", " + K.sehir;

  /* Hakkımızda */
  K.hakkinda.forEach(function (p) { $("hakkinda-yazi").appendChild(el("p", "", p)); });
  K.rakamlar.forEach(function (r) {
    var kutu = el("div");
    kutu.appendChild(el("dt", "", r.etiket));
    kutu.appendChild(el("dd", "", r.deger));
    $("rakamlar").appendChild(kutu);
  });

  /* Fikstür */
  function sonucSinifi(m) {
    var s = m.skor.split("-").map(Number); // skor her zaman bizim golümüz önce yazılır
    return s[0] > s[1] ? "g" : s[0] === s[1] ? "b" : "m";
  }
  var siradaki = K.fikstur.filter(function (m) { return !m.skor; })[0];

  K.fikstur.forEach(function (m) {
    var li = el("li", m === siradaki ? "siradaki" : "");
    var gun = el("span", "gun");
    gun.appendChild(document.createTextNode(tarihYaz(m.tarih, { day: "numeric", month: "short" })));
    gun.appendChild(el("br"));
    gun.appendChild(document.createTextNode(m.saat));
    var rakip = el("span", "rakip", m.rakip);
    rakip.appendChild(el("span", "yer", m.ev ? "İç saha" : "Deplasman"));
    var sonuc = m.skor
      ? el("span", "sonuc " + sonucSinifi(m), m.skor)
      : el("span", "sonuc bekliyor", m === siradaki ? "Sıradaki" : "Oynanacak");
    if (m.skor) sonuc.setAttribute("aria-label", "Sonuç " + m.skor);
    li.appendChild(gun); li.appendChild(rakip); li.appendChild(sonuc);
    $("maclar").appendChild(li);
  });

  var kart = $("siradaki");
  if (siradaki) {
    var takimlar = el("p", "mac-takimlar");
    takimlar.appendChild(el("span", "", siradaki.ev ? K.kisaAd : siradaki.rakip));
    takimlar.appendChild(el("span", "ara", "—"));
    takimlar.appendChild(el("span", "", siradaki.ev ? siradaki.rakip : K.kisaAd));
    var bilgi = el("p", "mac-bilgi");
    bilgi.appendChild(el("strong", "", tarihYaz(siradaki.tarih, { weekday: "long", day: "numeric", month: "long" }) + " · " + siradaki.saat));
    bilgi.appendChild(el("span", "", siradaki.ev ? K.stat + " (iç saha)" : "Deplasman"));
    kart.appendChild(takimlar); kart.appendChild(bilgi);
  } else {
    kart.appendChild(el("p", "mac-bilgi", "Yeni maç takvimi açıklandığında burada yer alacak."));
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

  /* Kadro */
  $("teknik").textContent = "Teknik direktör: " + K.teknikDirektor;
  K.kadro.forEach(function (g) {
    var kutu = el("div");
    kutu.appendChild(el("h3", "", g.mevki));
    var ul = el("ul");
    g.oyuncular.forEach(function (o) {
      var li = el("li");
      li.appendChild(el("span", "no", String(o.no)));
      li.appendChild(el("span", "", o.ad));
      if (o.kaptan) li.appendChild(el("span", "rozet", "Kaptan"));
      ul.appendChild(li);
    });
    kutu.appendChild(ul);
    $("kadro-liste").appendChild(kutu);
  });

  /* Haberler */
  K.haberler.forEach(function (h) {
    var a = el("article", "haber");
    var t = el("time", "", tarihYaz(h.tarih, { day: "numeric", month: "long", year: "numeric" }));
    t.dateTime = h.tarih;
    a.appendChild(t); a.appendChild(el("h3", "", h.baslik)); a.appendChild(el("p", "", h.ozet));
    $("haber-liste").appendChild(a);
  });

  /* Galeri */
  K.galeri.forEach(function (g) {
    var f = el("figure");
    if (g.dosya) {
      var img = el("img"); img.src = g.dosya; img.alt = g.aciklama; img.loading = "lazy";
      f.appendChild(img);
    } else {
      f.appendChild(el("div", "yer-tutucu", "Fotoğraf eklenecek"));
    }
    f.appendChild(el("figcaption", "", g.aciklama));
    $("galeri-liste").appendChild(f);
  });

  /* İletişim */
  [["Adres", K.iletisim.adres], ["Telefon", K.iletisim.telefon], ["E-posta", K.iletisim.eposta], ["Çalışma saatleri", K.iletisim.saatler]]
    .forEach(function (c) {
      var kutu = el("div");
      kutu.appendChild(el("dt", "", c[0]));
      kutu.appendChild(el("dd", "", c[1]));
      $("iletisim-liste").appendChild(kutu);
    });

  /* Başvuru formu */
  var form = $("basvuru-formu"), durum = $("form-durum"), gonder = $("f-gonder");
  K.basvuruTurleri.forEach(function (t) {
    var o = el("option", "", t); o.value = t; $("f-tur").appendChild(o);
  });
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
      durumYaz("Lütfen işaretli alanları doldurun: ad soyad, telefon, geçerli bir e-posta ve onay kutusu gerekli.", "hata");
      eksik.focus();
      return;
    }
    if (!K.formAdresi) {
      durumYaz("Başvurunuz gönderilmedi: form henüz bir alıcıya bağlanmadı. Şimdilik " + K.iletisim.telefon + " numarasından ulaşabilirsiniz.", "hata");
      return;
    }
    gonder.disabled = true;
    durumYaz("Gönderiliyor…");
    fetch(K.formAdresi, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
      .then(function (yanit) {
        if (!yanit.ok) throw new Error("Sunucu " + yanit.status + " yanıtı verdi");
        form.reset();
        durumYaz("Başvurunuz alındı. Üç iş günü içinde sizi arayacağız.", "tamam");
      })
      .catch(function () {
        durumYaz("Başvuru gönderilemedi. Bağlantınızı kontrol edip yeniden deneyin ya da " + K.iletisim.telefon + " numarasını arayın.", "hata");
      })
      .then(function () { gonder.disabled = false; });
  });
})();
