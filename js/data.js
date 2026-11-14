/*
  SİTE İÇERİĞİ
  Sitedeki tüm yazılar bu dosyadan gelir. Kadroyu, maçları ve haberleri burada
  değiştirmeniz yeterli; HTML'e dokunmanız gerekmez.

  DİKKAT: Kulüp adı, kuruluş yılı, renkler ve Instagram adresi gerçektir.
  Bunların dışındaki her şey (haberler, maçlar, kadro, tesis, iletişim) ÖRNEKTİR.
  Gerçek bilgileri girince ornekIcerik değerini false yapın; sayfanın üstündeki
  "örnek içerik" uyarısı kalkar.
*/
window.KULUP = {
  ornekIcerik: true,

  ad: "Yarımburgaz Spor Kulübü",
  kisaAd: "Yarımburgaz Spor",
  etiket: "#YarımburgazSpor",
  kurulus: 2012,
  renkler: "Kırmızı - Sarı",
  sehir: "İstanbul",
  instagram: "https://www.instagram.com/yarimburgaz.spor/",
  instagramAd: "@yarimburgaz.spor",
  lig: "Amatör Lig",
  sezon: "2026-27",

  /* kategori: "a-takim", "altyapi" veya "futbol-okulu" (haber filtreleri bunu kullanır) */
  haberler: [
    { tarih: "2026-11-09", kategori: "a-takim", etiket: "#ATakım",
      baslik: "İç sahada 3-1: liderlik bizde",
      ozet: "A takımımız Kıyıkent Belediyespor'u iki farkla geçti ve haftayı zirvede kapattı. İç sahadaki yenilmezlik serisi beş maça çıktı." },
    { tarih: "2026-11-07", kategori: "altyapi", etiket: "#U15",
      baslik: "U15 takımımız grubunu namağlup tamamladı",
      ozet: "Altı maçta beş galibiyet, bir beraberlik. Play-off kuraları gelecek hafta çekilecek." },
    { tarih: "2026-11-03", kategori: "futbol-okulu", etiket: "#FutbolOkulu",
      baslik: "Futbol okulu kış dönemi kayıtları başladı",
      ozet: "2014-2019 doğumlu çocuklar için kayıtlar 30 Kasım'a kadar sürüyor. Kontenjan her yaş grubunda 20 kişi." },
    { tarih: "2026-10-30", kategori: "altyapi", etiket: "#U13",
      baslik: "U13'ler hazırlık turnuvasında ikinci oldu",
      ozet: "Sekiz takımlı turnuvada finale kalan U13 takımımız kupayı penaltılarla kaçırdı." },
    { tarih: "2026-10-27", kategori: "a-takim", etiket: "#Kulüp",
      baslik: "Sahada yeni aydınlatma devrede",
      ozet: "Ana sahanın aydınlatması yenilendi; akşam antrenmanları artık 21.00'e kadar yapılabiliyor." }
  ],

  /* skor boşsa ("") maç oynanmamış sayılır. Skorda önce kendi golümüz yazılır. ev: true = iç saha */
  fikstur: [
    { tarih: "2026-10-25", saat: "14:00", rakip: "Yıldıztepe SK", ev: true, skor: "2-0" },
    { tarih: "2026-11-01", saat: "13:30", rakip: "Demirköy Gücü", ev: false, skor: "1-1" },
    { tarih: "2026-11-08", saat: "14:00", rakip: "Kıyıkent Belediyespor", ev: true, skor: "3-1" },
    { tarih: "2026-11-22", saat: "13:30", rakip: "Akçaova Gençlik", ev: false, skor: "" },
    { tarih: "2026-11-29", saat: "14:00", rakip: "Bağlarbaşı İdman Yurdu", ev: true, skor: "" },
    { tarih: "2026-12-06", saat: "13:00", rakip: "Tepecik Yıldızspor", ev: false, skor: "" }
  ],
  stat: "Yarımburgaz Sahası",

  /* O: oynanan, G: galibiyet, B: beraberlik, M: mağlubiyet, A: atılan, Y: yenilen */
  puanDurumu: [
    { takim: "Kıyıkent Belediyespor", O: 9, G: 6, B: 1, M: 2, A: 17, Y: 9 },
    { takim: "Yarımburgaz Spor", O: 9, G: 6, B: 2, M: 1, A: 19, Y: 8, biz: true },
    { takim: "Akçaova Gençlik", O: 9, G: 5, B: 2, M: 2, A: 14, Y: 10 },
    { takim: "Demirköy Gücü", O: 9, G: 4, B: 3, M: 2, A: 12, Y: 9 },
    { takim: "Bağlarbaşı İdman Yurdu", O: 9, G: 3, B: 2, M: 4, A: 11, Y: 13 },
    { takim: "Yıldıztepe SK", O: 9, G: 2, B: 2, M: 5, A: 8, Y: 15 },
    { takim: "Tepecik Yıldızspor", O: 9, G: 1, B: 2, M: 6, A: 7, Y: 18 },
    { takim: "Güneşli Esnafspor", O: 9, G: 1, B: 2, M: 6, A: 6, Y: 12 }
  ],

  teknikDirektor: "Murat Özkan",
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

  altyapi: [
    { ad: "U17", dogum: "2010-2011 doğumlular", antrenor: "Cem Yalçın", gunler: "Salı, Perşembe, Cumartesi" },
    { ad: "U15", dogum: "2012-2013 doğumlular", antrenor: "Volkan Acar", gunler: "Pazartesi, Çarşamba, Cuma" },
    { ad: "U13", dogum: "2014-2015 doğumlular", antrenor: "İlker Soylu", gunler: "Salı, Perşembe, Cumartesi" },
    { ad: "U11", dogum: "2016-2017 doğumlular", antrenor: "Ozan Tunç", gunler: "Çarşamba, Cumartesi" }
  ],

  tesisler: [
    { ad: "Yarımburgaz Sahası", yer: "Ana saha", ozellikler: ["Sentetik çim zemin", "Aydınlatma: 21.00'e kadar", "Soyunma odaları ve tribün"] },
    { ad: "Antrenman Sahası", yer: "Altyapı ve futbol okulu", ozellikler: ["Yarı saha ölçüsünde iki alan", "Minikler için küçük kaleler", "Veli bekleme alanı"] }
  ],

  futbolOkulu: {
    yazi: "Futbol okulumuz 6-12 yaş arası çocuklara haftada iki gün, lisanslı antrenörlerle temel futbol eğitimi verir. Yetenekli sporcular altyapı takımlarımıza alınır.",
    maddeler: ["Kayıt: 2014-2019 doğumlular", "Altyapı seçmeleri: U11, U13, U15, U17", "18 yaşından küçükler için başvuruyu veli yapar"]
  },

  iletisim: {
    adres: "Örnek adres satırı, Yarımburgaz / İstanbul",
    telefon: "0 (212) 000 00 00",
    eposta: "bilgi@example.com",
    saatler: "Hafta içi 10.00-19.00 · Cumartesi 10.00-14.00"
  },

  /* BAŞVURU FORMU
     GitHub Pages yalnızca statik dosya yayınlar; formun bir alıcıya ihtiyacı var.
     Formspree gibi bir servisten aldığınız adresi buraya yazın:
       formAdresi: "https://formspree.io/f/xxxxxxx"
     Boş kaldığı sürece form başvuru GÖNDERMEZ ve bunu ziyaretçiye açıkça söyler. */
  formAdresi: "",
  basvuruTurleri: ["Futbol okulu (çocuk kaydı)", "Altyapı seçmeleri", "Kulüp üyeliği", "Gönüllü / antrenör"]
};
