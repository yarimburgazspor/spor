(function () {
  "use strict";
  var K = window.KULUP;
  /* Aynı betik iki sayfada da çalışır (ana sayfa ve u17.html). Bir sayfada bulunmayan öğe
     istenirse sayfaya bağlı olmayan boş bir kutu döner; o öğeye yazılanlar hiçbir yerde görünmez. */
  var $ = function (id) { return document.getElementById(id) || document.createElement("div"); };
  var varMi = function (id) { return !!document.getElementById(id); };

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
  $("sayfa-baslik").textContent = K.ad;
  $("marka-ad").textContent = K.kisaAd;
  $("marka-alt").textContent = K.kurulus + " · " + K.renkler;
  $("alt-ad").textContent = K.kurulus + " yılında " + (K.ilce ? K.ilce.split(" / ")[0] + "'de " : "") + "kurulan kulübümüz, " + K.renkler.toLowerCase().replace(" - ", "-") + " renkleriyle gençleri sporla buluşturuyor.";
  $("alt-yazi").textContent = "© " + new Date().getFullYear() + " " + K.ad + ". Tüm hakları saklıdır.";
  $("alt-marka-ad").textContent = K.ad;
  $("alt-marka-alt").textContent = K.kurulus + " · " + K.renkler;
  if (K.tasarim) {
    $("tasarim").appendChild(document.createTextNode(K.tasarim.onEk + " "));
    var ta = el("a", "", K.tasarim.ad); disBaglanti(ta, K.tasarim.url);
    $("tasarim").appendChild(ta);
  }
  $("ornek-uyari").hidden = !K.ornekIcerik;
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

  /* Büyük slider: 5 saniyede bir geçer; oklar, noktalar ve kaydırma ile de değişir.
     Fotoğraflar gruplar hâlinde gelir; alttaki başlık ve yazı, görünen fotoğrafın grubuna göre değişir. */
  (function () {
    if (!varMi("vitrin")) return;
    var S = K.slider, kutu = $("vitrin"), slaytlar = [];
    ((S && S.gruplar) || []).forEach(function (g) {
      g.resimler.forEach(function (r) { slaytlar.push({ r: r, baslik: g.baslik, yazi: g.yazi }); });
    });
    if (!slaytlar.length) { kutu.hidden = true; return; }
    var cerceve = $("vitrin-cerceve"), kareler = [], noktalar = [], aktif = 0, zamanlayici = null;
    slaytlar.forEach(function (sl, i) {
      var f = el("figure", i === 0 ? "aktif" : "");
      var img = el("img"); img.src = sl.r.dosya; img.alt = sl.r.aciklama;
      if (sl.r.odak) img.style.objectPosition = sl.r.odak;
      if (i > 0) img.loading = "lazy";
      f.appendChild(img);
      cerceve.appendChild(f); kareler.push(f);
      var n = el("button"); n.type = "button";
      n.setAttribute("aria-label", (i + 1) + ". fotoğraf: " + sl.r.aciklama);
      n.addEventListener("click", function () { durdur(); goster(i); });
      $("vitrin-noktalar").appendChild(n); noktalar.push(n);
    });
    function goster(n) {
      aktif = (n + kareler.length) % kareler.length;
      kareler.forEach(function (f, i) { f.className = i === aktif ? "aktif" : ""; });
      noktalar.forEach(function (d, i) { d.setAttribute("aria-current", i === aktif ? "true" : "false"); });
      $("vitrin-baslik").textContent = slaytlar[aktif].baslik;
      $("vitrin-aciklama").textContent = slaytlar[aktif].yazi;
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

  /* Haftanın oyuncuları: üç kart. Adı girilmemiş kart "Yakında açıklanacak" olarak görünür. */
  if (K.haftaninOyunculari && varMi("haftanin-oyunculari")) {
    $("haftanin-oyunculari").hidden = false;
    $("ho-baslik").textContent = K.haftaninOyunculari.baslik;
    K.haftaninOyunculari.oyuncular.forEach(function (o, i) {
      var li = el("li", o.ad ? "" : "bos");
      var kare = el("div", "ho-foto");
      if (o.foto) { var img = el("img"); img.src = o.foto; img.alt = o.ad || ""; img.loading = "lazy"; kare.appendChild(img); }
      else {
        /* Fotoğraf yokken: forma giymiş oyuncu silueti */
        kare.setAttribute("aria-hidden", "true");
        var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 96 96"); svg.setAttribute("class", "siluet");
        [["circle", { cx: 48, cy: 30, r: 15 }],
         ["path", { d: "M48 49c-9 0-15 2-21 6l-13 9 6 14 9-4v22h38V74l9 4 6-14-13-9c-6-4-12-6-21-6z" }]
        ].forEach(function (s) {
          var o = document.createElementNS(ns, s[0]);
          Object.keys(s[1]).forEach(function (k) { o.setAttribute(k, s[1][k]); });
          svg.appendChild(o);
        });
        kare.appendChild(svg);
      }
      li.appendChild(kare);
      var yazi = el("div", "ho-yazi");
      yazi.appendChild(el("strong", "", o.ad || "Yakında açıklanacak"));
      if (o.not) yazi.appendChild(el("small", "", o.not));
      li.appendChild(yazi);
      $("ho-liste").appendChild(li);
    });
  }

  /* Günün videosu */
  if (K.gununVideosu && varMi("gunun-videosu")) {
    $("gunun-videosu").hidden = false;
    $("gv-baslik").textContent = K.gununVideosu.baslik;
    $("gv-aciklama").textContent = K.gununVideosu.aciklama || "";
    $("gv-aciklama").hidden = !K.gununVideosu.aciklama;
    $("gv-video").src = K.gununVideosu.video;
    $("gv-video").poster = K.gununVideosu.kapak;
    $("gv-video").setAttribute("aria-label", K.gununVideosu.baslik + ": " + (K.gununVideosu.aciklama || ""));
  }

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
    if (!varMi("ig-ic")) return;
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

  /* U17 kadrosu (u17.html): saha dizilişi + oyuncu kartları. */
  (function () {
    if (!varMi("kadro-liste") || !K.kadro || !K.kadro.length) return;
    $("kadro-baslik").textContent = K.kadroBaslik || "Kadromuz";
    $("teknik").textContent = K.teknikDirektor ? "Teknik direktör: " + K.teknikDirektor : "";
    $("kadro-not").textContent = K.kadroNot || "";
    $("kadro-not").hidden = !K.kadroNot;

    /* Mevki adından hat (0 kaleci, 1 defans, 2 orta saha, 2.5 ofansif orta saha, 3 forvet) ve kanat (-1 sol, 0 orta, 1 sağ) çıkarılır.
       "Sol bek", "Stoper", "Sağ kanat", "Ön libero", "Santrfor" gibi yazımlar tanınır. */
    function hat(mevki) {
      var m = (mevki || "").toLocaleLowerCase("tr-TR");
      if (!m) return -1;
      if (m.indexOf("kaleci") !== -1) return 0;
      if (/bek|stoper|defans|savunma|libero/.test(m) && m.indexOf("ön libero") === -1) return 1;
      if (/forvet|santrfor|golcü|hücum/.test(m)) return 3;
      if (/ofansif|ön orta|10 numara/.test(m)) return 2.5;
      return 2;
    }
    function kanat(mevki) {
      var m = (mevki || "").toLocaleLowerCase("tr-TR");
      return m.indexOf("sol") === 0 ? -1 : m.indexOf("sağ") === 0 ? 1 : 0;
    }
    function basHarf(o) { var p = o.ad.split(" "); return p[0].charAt(0) + p[p.length - 1].charAt(0); }
    function foto(o, sinif) {
      var kare = el("div", sinif);
      if (o.foto) {
        var img = el("img"); img.src = o.foto; img.alt = o.ad; img.loading = "lazy"; kare.appendChild(img);
      } else {
        kare.className += " bos" + (o.no ? "" : " harf");
        kare.setAttribute("aria-hidden", "true");
        kare.appendChild(el("span", "", o.no ? String(o.no) : basHarf(o)));
      }
      return kare;
    }
    var sirali = K.kadro.map(function (o, i) { return { o: o, i: i, hat: hat(o.mevki) }; }).sort(function (a, b) {
      var ha = a.hat < 0 ? 9 : a.hat, hb = b.hat < 0 ? 9 : b.hat;
      return ha - hb || (a.o.no || 999) - (b.o.no || 999) || a.i - b.i;
    });

    /* Saha: ilk11 işaretli oyuncular varsa yalnızca onlar, yoksa mevkisi girilmiş herkes dizilir.
       Forvet hattı üstte, kaleci altta; her hatta soldan sağa: sol, orta, sağ. */
    var sahadakiler = sirali.filter(function (k) { return k.hat >= 0; });
    var ilk11 = sahadakiler.filter(function (k) { return k.o.ilk11; });
    if (ilk11.length) sahadakiler = ilk11;
    if (sahadakiler.length) {
      $("dizilis-sar").hidden = false;
      [3, 2.5, 2, 1, 0].forEach(function (h) {
        var hattakiler = sahadakiler.filter(function (k) { return k.hat === h; });
        if (!hattakiler.length) return;
        var satir = el("div", "hat");
        hattakiler
          .sort(function (a, b) { return kanat(a.o.mevki) - kanat(b.o.mevki) || a.i - b.i; })
          .forEach(function (k) {
            var d = el("div", "saha-oyuncu");
            d.appendChild(foto(k.o, "saha-foto"));
            d.appendChild(el("strong", "", k.o.ad));
            d.appendChild(el("small", "", (k.o.no && k.o.foto ? k.o.no + " · " : "") + k.o.mevki));
            satir.appendChild(d);
          });
        $("dizilis").appendChild(satir);
      });
      $("dizilis").setAttribute("aria-label", "Saha dizilişi: " + sahadakiler.map(function (k) { return k.o.ad + " (" + k.o.mevki + ")"; }).join(", "));
      var yedekler = sirali.filter(function (k) { return k.o.yedek; }).sort(function (a, b) { return (a.o.no || 999) - (b.o.no || 999); });
      if (yedekler.length) {
        $("yedekler").hidden = false;
        yedekler.forEach(function (k) {
          var li = el("li"); li.appendChild(el("span", "", k.o.no ? String(k.o.no) : "-")); li.appendChild(document.createTextNode(k.o.ad));
          $("yedek-liste").appendChild(li);
        });
      }
    } else {
      $("kadro-liste-baslik").hidden = true;
    }
    /* Kartlar: önce ilk 11 (hat sırasıyla), sonra yedekler, sonra diğer oyuncular */
    sirali.sort(function (a, b) {
      var ga = a.o.ilk11 ? 0 : a.o.yedek ? 1 : 2, gb = b.o.ilk11 ? 0 : b.o.yedek ? 1 : 2;
      return ga - gb || (ga === 0 ? a.hat - b.hat : 0) || (a.o.no || 999) - (b.o.no || 999) || a.i - b.i;
    });

    sirali.forEach(function (k) {
      var o = k.o, li = el("li", "oyuncu");
      li.appendChild(foto(o, "oyuncu-foto"));
      var bilgi = el("div", "oyuncu-bilgi" + (o.no ? "" : " nosuz"));
      if (o.no) bilgi.appendChild(el("span", "oyuncu-no", String(o.no)));
      var ad = el("div"); ad.appendChild(el("strong", "", o.ad));
      var alt = [];
      if (o.mevki) alt.push(o.mevki); else if (o.yedek) alt.push("Yedek");
      if (o.dogumYili) alt.push(o.dogumYili + " doğumlu");
      if (alt.length) ad.appendChild(el("small", "", alt.join(" · ")));
      if (o.kaptan) ad.appendChild(el("small", "rozet", "Kaptan"));
      bilgi.appendChild(ad);
      li.appendChild(bilgi);
      $("kadro-liste").appendChild(li);
    });
  })();

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

  /* İletişim (alt bilgi): simgeli satırlar ve sosyal düğmeler. Boş bilgiler atlanır. */
  (function () {
    var SIMGE = {
      adres: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.500C19 14.800 12 21 12 21zm0-8.500a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      telefon: "M6.500 3h3l1.500 4.500-2 1.500a12 12 0 0 0 6 6l1.500-2 4.500 1.500v3A2.500 2.500 0 0 1 18.500 20 15.500 15.500 0 0 1 4 5.500 2.500 2.500 0 0 1 6.500 3z",
      whatsapp: "M12 3a9 9 0 0 0-7.700 13.600L3 21l4.500-1.200A9 9 0 1 0 12 3zm-3 5.500c.300 2.500 2 4.500 4.500 5.500l1.500-1.500 2 1c-.300 1.500-1.500 2-3 2-3.500-.500-6.500-3.500-7-7 0-1.500.500-2.700 2-3l1 2z",
      instagram: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm4 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.400-1.400a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
      saat: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3.500 2",
      eposta: "M3 6h18v12H3zm0 0 9 7 9-7"
    };
    function simge(ad) {
      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("aria-hidden", "true");
      var yol = document.createElementNS(ns, "path"); yol.setAttribute("d", SIMGE[ad]); svg.appendChild(yol);
      return svg;
    }
    function satir(ad, yazi, adres, dis) {
      var li = el("li"); li.appendChild(simge(ad));
      if (adres) { var a = el("a", "", yazi); if (dis) disBaglanti(a, adres); else a.href = adres; li.appendChild(a); }
      else li.appendChild(el("span", "", yazi));
      $("iletisim-liste").appendChild(li);
    }
    function sosyal(ad, etiket, adres, dis) {
      var a = el("a"); a.setAttribute("aria-label", etiket); a.appendChild(simge(ad));
      if (dis) disBaglanti(a, adres); else a.href = adres;
      $("alt-sosyal").appendChild(a);
    }
    var I = K.iletisim, tel = I.telefon ? "tel:+" + (K.whatsapp || I.telefon.replace(/\D/g, "")) : "";
    if (I.adres) satir("adres", I.adres);
    if (I.telefon) satir("telefon", I.telefon, tel);
    if (K.whatsapp) satir("whatsapp", "WhatsApp'tan yazın", "https://wa.me/" + K.whatsapp, true);
    if (I.eposta) satir("eposta", I.eposta, "mailto:" + I.eposta);
    satir("instagram", K.instagramAd, K.instagram, true);
    if (I.saatler) satir("saat", I.saatler);

    sosyal("instagram", "Instagram: " + K.instagramAd, K.instagram, true);
    if (K.whatsapp) sosyal("whatsapp", "WhatsApp'tan yazın", "https://wa.me/" + K.whatsapp, true);
    if (I.telefon) sosyal("telefon", "Telefon: " + I.telefon, tel);
    if (K.whatsapp) $("f-gonder").textContent = "WhatsApp ile gönder";
  })();

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
