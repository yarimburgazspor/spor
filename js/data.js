/*
  SİTE İÇERİĞİ
  Sitedeki tüm yazılar bu dosyadan gelir. Maçları, puan durumunu ve haberleri
  burada değiştirmeniz yeterli; HTML'e dokunmanız gerekmez.

  Maç ve puan durumu verileri TFF İstanbul sayfasından (ligKaynak.url) elle
  aktarılır. Son aktarım: 15 Kasım 2026 (6. hafta puan durumu). 6. hafta Ferahevler sonucu kulüp paylaşımından eklendi.
*/
window.KULUP = {
  /* true yapılırsa sayfanın üstünde "bilgiler örnektir" uyarısı çıkar */
  ornekIcerik: false,

  ad: "Yarımburgaz Spor Kulübü",
  kisaAd: "Yarımburgaz Spor",
  /* Federasyon kayıtlarındaki ad: maç ve puan tablosunda kendi takımımızı bununla tanırız */
  takimAdi: "Öz Yarımburgaz Spor",
  etiket: "#YarımburgazSpor",
  kurulus: 2012,
  renkler: "Kırmızı - Sarı",
  instagram: "https://www.instagram.com/yarimburgaz.spor/",
  instagramAd: "@yarimburgaz.spor",

  /* Federasyon kayıtlarındaki kulüp bilgileri. "Takımımız" bölümünde gösterilir. */
  kulupBilgi: [
    { etiket: "Resmi adı", deger: "Öz Yarımburgaz Spor" },
    { etiket: "Kulüp kodu", deger: "17016" },
    { etiket: "Başkan", deger: "Recai Şaz" },
    { etiket: "İl", deger: "İstanbul" },
    { etiket: "İlçe", deger: "Küçükçekmece" },
    { etiket: "Kuruluş", deger: "2012" },
    { etiket: "Renkler", deger: "Kırmızı - Sarı" },
    { etiket: "Adres", deger: "Halkalı Etap Stadı, Atakent Mah. 3. Etap 4. Cad. No: 37/A, Küçükçekmece / İstanbul" }
  ],
  ilce: "Küçükçekmece / İstanbul",

  takim: "U17",
  lig: "U17 B Ligi",
  grup: "7. Grup",
  sezon: "2026-27",
  ligKaynak: {
    ad: "TFF İstanbul",
    url: "https://tffistanbul.org/kulup/oz-yarimburgaz-spor/1417/2026-2027/30/u17-b-ligi/178#group"
  },

  /* Sayfanın ortasındaki fotoğraf slider'ı. Yeni fotoğraf için dosyayı images/
     klasörüne koyup listeye bir satır ekleyin. */
  slider: {
    /* Her grubun kendi başlığı ve yazısı vardır; grubun fotoğrafları gösterilirken o başlık görünür.
       odak: geniş çerçevede fotoğrafın hangi bölümünün görüneceği (yatay dikey). */
    gruplar: [
      {
        baslik: "ŞAMPİYONLUK MEŞALESİ YANDI!",
        yazi: "Grubun iddialı ekiplerinden Ferahevler'i 6-1 yendik. Altı maçta altı galibiyetle 7. Grup'un zirvesindeyiz.",
        resimler: [
          { dosya: "images/sampiyonluk-1-takim.jpg", aciklama: "Maç öncesi takım fotoğrafı, İFA Spor Stadyumu", odak: "50% 70%" },
          { dosya: "images/sampiyonluk-2-soyunma-odasi.jpg", aciklama: "Maç sonrası soyunma odasında galibiyet sevinci", odak: "50% 66%" },
          { dosya: "images/sampiyonluk-3-kenar.jpg", aciklama: "Kenarda maçı izleyen antrenörümüz", odak: "50% 40%" }
        ]
      },
      {
        baslik: "U19 TAKIMIMIZ SEZON HAZIRLIKLARINA DEVAM EDİYOR!",
        yazi: "U19 takımımız yağmurlu havaya rağmen antrenmanlarını sürdürüyor.",
        resimler: [
          { dosya: "images/u19-hazirlik-1.jpg", aciklama: "U19 takımı yağmur altında antrenman sonrası toplu fotoğrafta", odak: "50% 80%" },
          { dosya: "images/u19-hazirlik-2.jpg", aciklama: "Yağmur altında çift kale antrenman maçı", odak: "50% 62%" },
          { dosya: "images/u19-hazirlik-3.jpg", aciklama: "Sırtında Öz Yarımburgaz Spor yazan antrenman yeleğiyle bir oyuncu", odak: "50% 100%" },
          { dosya: "images/u19-hazirlik-4.jpg", aciklama: "Turuncu ve yeşil yelekli oyuncular pas çalışmasında", odak: "50% 62%" },
          { dosya: "images/u19-hazirlik-5.jpg", aciklama: "Orta sahada top mücadelesi", odak: "50% 62%" },
          { dosya: "images/u19-hazirlik-6.jpg", aciklama: "İstanbul Büyükşehir Belediyesi 100. Yıl Stadı'nda ısınma", odak: "50% 58%" }
        ]
      }
    ]
  },

  /* Slider'ın sağındaki görsel. dosya boş bırakılırsa gösterilmez. */
  yanResim: {
    dosya: "images/yan-gorsel.jpg",
    aciklama: "Atatürk portresi ve sözü: Ben sporcunun zeki, çevik ve aynı zamanda ahlaklısını severim."
  },

  /* Yan sütunda, portrenin altındaki başkan görseli. Bloğu silerseniz gösterilmez. */
  baskan: {
    baslik: "Başkanımız",
    ad: "Recai Şaz",
    resim: "images/baskan-2.jpg",
    resimAciklama: "Yarımburgaz Spor Kulübü Başkanı Recai Şaz, makamında"
  },

  /* Gol kralı bölümü. Rakamlar değişince yalnızca "rakamlar" satırlarını güncelleyin. */
  golKrali: {
    baslik: "U17 Gol Kralımız",
    ad: "Muhammed Can Ceylan",
    forma: 11,
    unvan: "U17 B Ligi · 7. Grup gol kralı",
    rakamlar: [
      { deger: "5", etiket: "Maç" },
      { deger: "8", etiket: "Gol" },
      { deger: "5", etiket: "Asist" }
    ],
    resim: "images/gol-krali.jpg",
    resimAciklama: "Muhammed Can Ceylan, 11 numaralı formasıyla: U17 B Ligi 7. Grup gol kralı, 5 maç, 8 gol, 5 asist"
  },

  /* kategori: "u17" veya "kulup" (haber filtreleri bunu kullanır) */
  haberler: [
    { tarih: "2026-11-14", kategori: "u17", etiket: "#U17",
      baslik: "Şampiyonluk meşalesi yandı: Ferahevler'e 6-1",
      ozet: "Grubun iddialı ekiplerinden Ferahevler'i İFA Sahası'nda 6-1 yendik. Altıda altı yaptık; 18 puanla 7. Grup'un lideriyiz." },
    { tarih: "2026-11-08", kategori: "u17", etiket: "#U17",
      baslik: "Beşte beş: 7. Grup'ta liderlik bizde",
      ozet: "U17 takımımız ilk beş maçını da kazandı ve 15 puanla grubun zirvesine yerleşti." },
    { tarih: "2026-11-08", kategori: "u17", etiket: "#U17",
      baslik: "Denizköşkler karşısında 4-1",
      ozet: "5. hafta maçında Denizköşkler Mahallesispor'u İBB 100. Yıl Stadı'nda üç farkla geçtik." },
    { tarih: "2026-10-31", kategori: "u17", etiket: "#U17",
      baslik: "Kiraç deplasmanından 4-0'la döndük",
      ozet: "Esenyurt Turgut Özal Stadı'ndaki 4. hafta maçında kalemizi gole kapattık." },
    { tarih: "2026-10-10", kategori: "u17", etiket: "#U17",
      baslik: "Sezonu galibiyetle açtık",
      ozet: "Ligin ilk haftasında Aksaray'ı 2-1 yendik." }
  ],

  /* skor: "ev sahibi golü - konuk golü". Boşsa ("") sonuç girilmemiş sayılır. */
  fikstur: [
    { hafta: 1, tarih: "2026-10-10", saat: "17:00", ev: "Öz Yarımburgaz Spor", konuk: "Aksaray", skor: "2-1",
      saha: "İBB 100. Yıl Stadı - Küçükçekmece (Halkalı Etap)" },
    { hafta: 2, tarih: "2026-10-25", saat: "15:00", ev: "Araphan Spor", konuk: "Öz Yarımburgaz Spor", skor: "2-4",
      saha: "Alibeyköy Fuat Çakar Stadı" },
    { hafta: 3, tarih: "2026-10-21", saat: "16:00", ev: "Öz Yarımburgaz Spor", konuk: "Nurtepe Spor", skor: "3-2",
      saha: "İBB 100. Yıl Stadı - Küçükçekmece (Halkalı Etap)" },
    { hafta: 4, tarih: "2026-10-31", saat: "17:30", ev: "İstanbul Kiraç Spor Kulübü", konuk: "Öz Yarımburgaz Spor", skor: "0-4",
      saha: "Esenyurt Turgut Özal Stadı" },
    { hafta: 5, tarih: "2026-11-08", saat: "16:15", ev: "Öz Yarımburgaz Spor", konuk: "Denizköşkler Mahallesispor", skor: "4-1",
      saha: "İBB 100. Yıl Stadı - Küçükçekmece (Halkalı Etap)" },
    { hafta: 6, tarih: "2026-11-14", saat: "14:30", ev: "Öz Yarımburgaz Spor", konuk: "Ferahevler", skor: "6-1",
      saha: "İFA Sahası" }
  ],

  /* G: galibiyet, B: beraberlik, M: mağlubiyet. Oynanan maç ve puan otomatik hesaplanır. */
  puanHaftasi: 6,
  puanDurumu: [
    /* 6. hafta Ferahevler maçı (6-1) kulübün paylaşımından işlendi; iki takımın satırı buna göre güncel */
    { takim: "Öz Yarımburgaz Spor", G: 6, B: 0, M: 0 },
    { takim: "Denizköşkler Mahallesispor", G: 3, B: 2, M: 1 },
    { takim: "Nurtepe Spor", G: 3, B: 1, M: 1 },
    { takim: "Ferahevler", G: 3, B: 1, M: 2 },
    { takim: "Aksaray", G: 3, B: 0, M: 3 },
    { takim: "İstanbul Bahçelievler Spor Kulübü", G: 2, B: 0, M: 4 },
    { takim: "Araphan Spor", G: 1, B: 0, M: 4 },
    { takim: "İstanbul Kiraç Spor Kulübü", G: 0, B: 0, M: 6 }
  ],

  /* Anma bölümü. Metinler kulübün anma videosundan alınmıştır. Bölümü kaldırmak için
     bu bloğu silin; menüdeki siyah kurdele de kendiliğinden kalkar. */
  anma: {
    baslik: "Acı kaybımız",
    isimler: "Ahmet Efe & Ahmet Çalık",
    satirlar: [
      "Bazı insanlar aramızdan ayrılsa da kalbimizden asla ayrılmaz.",
      "İki güzel insan, tek bir gökyüzü.",
      "Unutulmadınız, unutulmayacaksınız."
    ],
    imza: "Yarımburgaz Spor ailesi",
    video: "media/anma.mp4",
    kapak: "images/anma-kapak.jpg",
    videoAciklama: "Ahmet Efe ve Ahmet Çalık anısına hazırlanan video"
  },

  /* Sponsorlar. Yeni sponsor için görseli images/ klasörüne koyup bir satır ekleyin.
     url doluysa görsel o adrese bağlantı olur. Kutular hep aynı ölçüdedir. */
  sponsorlar: [
    { ad: "Örtaş Antrepo", logo: "images/sponsor-ortas-antrepo.jpg", url: "" },
    { ad: "Elyaka Kozmetik", logo: "images/sponsor-elyaka-kozmetik.jpg", url: "" }
  ],

  /* Sponsorluk bölümü. Metinler kulübün sponsorluk afişinden alınmıştır. */
  sponsorluk: {
    baslik: "Sponsorluk",
    slogan: "Geleceğimiz için, hep birlikte",
    yazi: "Yarımburgaz Spor Kulübü'ne yapacağınız sponsorluk desteği, ilgili mevzuatta belirtilen şartların yerine getirilmesi kaydıyla, amatör spor dallarına yönelik sponsorluk harcamaları kapsamında gelir veya kurumlar vergisi matrahından %100 oranında indirilebilmektedir.",
    uyari: "Bu tutar doğrudan vergi iadesi değil, vergi matrahından indirim avantajıdır. Kendi durumunuz için mali müşavirinize danışın.",
    dayanak: ["193 sayılı Gelir Vergisi Kanunu, madde 89/8", "5520 sayılı Kurumlar Vergisi Kanunu, madde 10/1-b"],
    kazanimlar: ["Marka görünürlüğü", "Toplumsal katkı", "Geleceğe yatırım", "Vergisel avantaj"],
    resim: "images/sponsorluk.jpg",
    resimAciklama: "Yarımburgaz Spor Kulübü sponsorluk afişi: sponsorlukta yüzde 100 vergi matrahı indirimi avantajı"
  },

  /* U17 KADROMUZ
     Her oyuncu için bir satır: { no: 11, ad: "Ad Soyad", mevki: "Forvet", dogumYili: 2010, foto: "images/kadro/11.jpg" }
     - no: forma numarası; bilinmiyorsa null yazın.
     - mevki: "Kaleci", "Sol bek", "Stoper", "Sağ bek", "Orta saha", "Ofansif orta saha", "Sol forvet",
       "Santrfor", "Sağ forvet" gibi; bilinmiyorsa "" bırakın. Saha dizilişi bu yazıya göre kurulur.
     - ilk11: true olan oyuncular sahada dizilir. yedek: true olanlar sahanın altında "Yedekler"de listelenir.
     - dogumYili: yalnızca yıl. Oyuncular reşit olmadığı için tam doğum tarihi sitede yayınlanmaz.
     - foto: boşsa forma numaralı (ya da baş harfli) yer tutucu gösterilir. Fotoğraf dikey (3:4) olmalı;
       dosyayı images/kadro/ klasörüne koyup yolunu buraya yazın. */
  kadroBaslik: "U17 Kadromuz",
  teknikDirektor: "",
  kadroNot: "",
  kadro: [
    { no: 3, ad: "Yasin Aksu", mevki: "Sol bek", ilk11: true, dogumYili: 2010, foto: "" },
    { no: null, ad: "Mustafa Dönmez", mevki: "", dogumYili: 2010, foto: "" },
    { no: null, ad: "Mustafa Çakmak", mevki: "", dogumYili: 2010, foto: "" },
    { no: null, ad: "Süleyman Teymur", mevki: "", dogumYili: 2010, foto: "" },
    { no: 41, ad: "Ömürcan Özer", mevki: "Kaleci", ilk11: true, dogumYili: 2010, foto: "" },
    { no: 8, ad: "Hazar Çapan", mevki: "Orta saha", ilk11: true, dogumYili: 2010, foto: "" },
    { no: 18, ad: "Muhammed Çelik", mevki: "", yedek: true, dogumYili: 2010, foto: "" },
    { no: null, ad: "Cihat Duran", mevki: "", dogumYili: 2010, foto: "" },
    { no: 11, ad: "Muhammed Can Ceylan", mevki: "Sol forvet", ilk11: true, dogumYili: 2010, foto: "" },
    { no: 9, ad: "Harun Hanedar", mevki: "Sağ forvet", ilk11: true, dogumYili: 2010, foto: "" },
    { no: null, ad: "Ömer Faruk Polat", mevki: "", dogumYili: 2010, foto: "" },
    { no: 4, ad: "Mert Dönmez", mevki: "Stoper", ilk11: true, dogumYili: 2010, foto: "" },
    { no: 31, ad: "Olcay Kamacı", mevki: "Ofansif orta saha", ilk11: true, dogumYili: 2010, foto: "" },
    { no: 14, ad: "Arif Hamza Özen", mevki: "Sağ bek", ilk11: true, dogumYili: 2010, foto: "" },
    { no: null, ad: "Kerem Güngör", mevki: "", dogumYili: 2010, foto: "" },
    { no: null, ad: "Muhammed Ali Çetin", mevki: "", dogumYili: 2010, foto: "" },
    { no: 5, ad: "Berat Yıldız", mevki: "Stoper", ilk11: true, dogumYili: 2010, foto: "" },
    { no: 17, ad: "Çetin Can Uğur", mevki: "", yedek: true, dogumYili: 2010, foto: "" },
    { no: 29, ad: "Muhammed Taha Artuç", mevki: "", yedek: true, dogumYili: 2010, foto: "" },
    { no: null, ad: "Ümeyir Tiz", mevki: "", dogumYili: 2011, foto: "" },
    { no: 36, ad: "Alperen Polat", mevki: "", yedek: true, dogumYili: 2011, foto: "" },
    { no: null, ad: "Halit Zalat", mevki: "", dogumYili: 2011, foto: "" },
    { no: 66, ad: "Mustafa Can Gülbeyaz", mevki: "", yedek: true, dogumYili: 2011, foto: "" },
    { no: 72, ad: "Mehmet Reşit Duran", mevki: "Orta saha", ilk11: true, dogumYili: 2011, foto: "" },
    { no: null, ad: "Ahmet Efe Kalkanbaş", mevki: "", dogumYili: 2011, foto: "" },
    { no: 19, ad: "Muhammed Emir Bozdağ", mevki: "", yedek: true, dogumYili: 2011, foto: "" },
    { no: null, ad: "Muhammet Ali Gülbetekin", mevki: "", dogumYili: 2011, foto: "" },
    { no: null, ad: "Bünyamin Tekdemir", mevki: "", dogumYili: 2011, foto: "" },
    { no: null, ad: "Yiğit Ali Polat", mevki: "", dogumYili: null, foto: "" }
  ],

  sahalar: [
    { ad: "İBB 100. Yıl Stadı", yer: "Küçükçekmece (Halkalı Etap)",
      not: "2026-27 sezonunda iç saha maçlarımızın çoğunu burada oynuyoruz." }
  ],

  katilYazi: "Kulübümüzde forma giymek isteyen sporcular ve veliler formu doldurabilir. 18 yaşından küçükler için başvuruyu veli yapar.",

  /* Boş bırakılan satırlar sitede gösterilmez. */
  iletisim: { adres: "Halkalı Etap Stadı, Atakent Mah. 3. Etap 4. Cad. No: 37/A, Küçükçekmece / İstanbul", telefon: "+90 533 349 80 11", eposta: "", saatler: "" },

  /* Sayfanın en altındaki tasarım imzası */
  tasarim: {
    onEk: "Website Design by",
    ad: "Yalçın Kır · Yapay Zeka Koçu",
    url: "https://wa.me/905388177838"
  },

  /* BAŞVURU FORMU
     GitHub Pages yalnızca statik dosya yayınlar; formun bir alıcıya ihtiyacı var.
     Formspree gibi bir servisten aldığınız adresi buraya yazın:
       formAdresi: "https://formspree.io/f/xxxxxxx"
     Boş kaldığı sürece form başvuru GÖNDERMEZ ve bunu ziyaretçiye açıkça söyler. */
  formAdresi: "",

  /* WhatsApp numarası (ülke koduyla, başında + ve 0 olmadan). Doluysa başvuru formu
     WhatsApp'ı açar ve bilgileri hazır mesaj olarak yazar; göndermek ziyaretçiye kalır. */
  whatsapp: "905333498011",
  basvuruTurleri: ["Sporcu başvurusu", "Sponsorluk", "Kulüp üyeliği", "Gönüllü / antrenör"]
};
