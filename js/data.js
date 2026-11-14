/*
  SİTE İÇERİĞİ
  Sitedeki tüm yazılar bu dosyadan gelir. Kulüp adını, kadroyu, maçları ve
  haberleri burada değiştirmeniz yeterli; HTML'e dokunmanız gerekmez.
  Aşağıdaki tüm adlar ve sonuçlar ÖRNEKTİR.
*/
window.KULUP = {
  ad: "Örnek Spor Kulübü",
  kisaAd: "Örnekspor",
  armaHarfleri: "ÖSK",
  kurulus: 1987,
  sehir: "İzmir",
  slogan: "Mahallenin takımı, şehrin gururu.",
  lig: "Bölgesel Amatör Lig · 4. Grup",
  sezon: "2026-27",

  hakkinda: [
    "Örnek Spor Kulübü 1987'de mahalle sahasında bir araya gelen on dört gencin girişimiyle kuruldu. Bugün A takımı, dört altyapı yaş grubu ve futbol okuluyla 320 lisanslı sporcuya ev sahipliği yapıyor.",
    "Önceliğimiz altyapı: A takım kadromuzun yarısından fazlası kendi futbol okulumuzdan yetişti. Antrenmanlar haftada beş gün kulüp tesislerinde yapılır."
  ],
  rakamlar: [
    { deger: "1987", etiket: "Kuruluş" },
    { deger: "320", etiket: "Lisanslı sporcu" },
    { deger: "5", etiket: "Yaş grubu" },
    { deger: "2", etiket: "Lig şampiyonluğu" }
  ],

  /* skor boşsa ("") maç oynanmamış sayılır. ev: true = iç saha */
  fikstur: [
    { tarih: "2026-10-25", saat: "14:00", rakip: "Yıldıztepe SK", ev: true, skor: "2-0" },
    { tarih: "2026-11-01", saat: "13:30", rakip: "Demirköy Gücü", ev: false, skor: "1-1" },
    { tarih: "2026-11-08", saat: "14:00", rakip: "Kıyıkent Belediyespor", ev: true, skor: "3-1" },
    { tarih: "2026-11-22", saat: "13:30", rakip: "Akçaova Gençlik", ev: false, skor: "" },
    { tarih: "2026-11-29", saat: "14:00", rakip: "Bağlarbaşı İdman Yurdu", ev: true, skor: "" },
    { tarih: "2026-12-06", saat: "13:00", rakip: "Tepecik Yıldızspor", ev: false, skor: "" }
  ],
  stat: "Kulüp Tesisleri Sahası",

  /* O: oynanan, G: galibiyet, B: beraberlik, M: mağlubiyet, A: atılan, Y: yenilen */
  puanDurumu: [
    { takim: "Kıyıkent Belediyespor", O: 9, G: 6, B: 1, M: 2, A: 17, Y: 9 },
    { takim: "Örnekspor", O: 9, G: 6, B: 2, M: 1, A: 19, Y: 8, biz: true },
    { takim: "Akçaova Gençlik", O: 9, G: 5, B: 2, M: 2, A: 14, Y: 10 },
    { takim: "Demirköy Gücü", O: 9, G: 4, B: 3, M: 2, A: 12, Y: 9 },
    { takim: "Bağlarbaşı İdman Yurdu", O: 9, G: 3, B: 2, M: 4, A: 11, Y: 13 },
    { takim: "Yıldıztepe SK", O: 9, G: 2, B: 2, M: 5, A: 8, Y: 15 },
    { takim: "Tepecik Yıldızspor", O: 9, G: 1, B: 2, M: 6, A: 7, Y: 18 },
    { takim: "Güneşli Esnafspor", O: 9, G: 1, B: 2, M: 6, A: 6, Y: 12 }
  ],

  kadro: [
    { mevki: "Kaleci", oyuncular: [
      { no: 1, ad: "Emre Aksoy" }, { no: 12, ad: "Tolga Şen" }
    ]},
    { mevki: "Defans", oyuncular: [
      { no: 2, ad: "Burak Yıldırım" }, { no: 3, ad: "Kerem Doğan" }, { no: 4, ad: "Onur Kaya" },
      { no: 5, ad: "Serkan Polat", kaptan: true }, { no: 15, ad: "Ali Güneş" }, { no: 22, ad: "Mert Çelik" }
    ]},
    { mevki: "Orta saha", oyuncular: [
      { no: 6, ad: "Hakan Öztürk" }, { no: 8, ad: "Barış Arslan" }, { no: 10, ad: "Deniz Korkmaz" },
      { no: 14, ad: "Yusuf Erdem" }, { no: 17, ad: "Can Aydın" }, { no: 20, ad: "Furkan Bulut" }
    ]},
    { mevki: "Forvet", oyuncular: [
      { no: 7, ad: "Oğuz Tekin" }, { no: 9, ad: "Sinan Demir" }, { no: 11, ad: "Arda Yavuz" }, { no: 19, ad: "Efe Kılıç" }
    ]}
  ],
  teknikDirektor: "Murat Özkan",

  haberler: [
    { tarih: "2026-11-09", baslik: "Kıyıkent karşısında 3-1: liderlik bizde",
      ozet: "Sinan Demir'in iki golüyle iç sahadaki yenilmezlik serisi beş maça çıktı." },
    { tarih: "2026-11-03", baslik: "Futbol okulu kış dönemi kayıtları başladı",
      ozet: "2014-2019 doğumlu çocuklar için kayıtlar 30 Kasım'a kadar sürüyor. Kontenjan her yaş grubunda 20 kişi." },
    { tarih: "2026-10-27", baslik: "Tesislerde yeni aydınlatma devrede",
      ozet: "Ana sahanın aydınlatması yenilendi; akşam antrenmanları artık 21.00'e kadar yapılabiliyor." }
  ],

  /* Fotoğraf eklemek için dosyayı images/ klasörüne koyun ve
     { dosya: "images/ornek.jpg", aciklama: "..." } biçiminde yazın.
     dosya boşsa yer tutucu kutu gösterilir. */
  galeri: [
    { dosya: "", aciklama: "Kıyıkent maçı, gol sevinci" },
    { dosya: "", aciklama: "U13 takımı turnuva kupasıyla" },
    { dosya: "", aciklama: "Sezon açılışı antrenmanı" },
    { dosya: "", aciklama: "Yenilenen aydınlatma altında ana saha" },
    { dosya: "", aciklama: "Futbol okulu kayıt günü" },
    { dosya: "", aciklama: "Deplasman yolculuğu" }
  ],

  iletisim: {
    adres: "Örnek Mah. Stadyum Cad. No: 1, Bornova / İzmir",
    telefon: "0 (232) 000 00 00",
    eposta: "bilgi@ornekspor.example",
    saatler: "Hafta içi 10.00-19.00 · Cumartesi 10.00-14.00"
  },

  /* ÜYELİK FORMU
     GitHub Pages yalnızca statik dosya yayınlar; formun bir alıcıya ihtiyacı var.
     Formspree gibi bir servisten aldığınız adresi buraya yazın:
       formAdresi: "https://formspree.io/f/xxxxxxx"
     Boş kaldığı sürece form başvuru GÖNDERMEZ ve bunu ziyaretçiye açıkça söyler. */
  formAdresi: "",
  basvuruTurleri: ["Futbol okulu (çocuk kaydı)", "Altyapı seçmeleri", "Kulüp üyeliği", "Gönüllü / antrenör"]
};
