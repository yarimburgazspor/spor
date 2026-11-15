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
    baslik: "ŞAMPİYONLUK MEŞALESİ YANDI!",
    yazi: "Grubun iddialı ekiplerinden Ferahevler'i 6-1 yendik. Altı maçta altı galibiyetle 7. Grup'un zirvesindeyiz.",
    resimler: [
      { dosya: "images/sampiyonluk-1-takim.jpg", aciklama: "Maç öncesi takım fotoğrafı, İFA Spor Stadyumu" },
      { dosya: "images/sampiyonluk-2-soyunma-odasi.jpg", aciklama: "Maç sonrası soyunma odasında galibiyet sevinci" },
      { dosya: "images/sampiyonluk-3-kenar.jpg", aciklama: "Kenarda maçı izleyen antrenörümüz" }
    ]
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

  /* Kadro eklemek için: { mevki: "Kaleci", oyuncular: [{ no: 1, ad: "Ad Soyad", kaptan: true }] }
     Liste boşken kadro bölümü gösterilmez. */
  teknikDirektor: "",
  kadro: [],

  sahalar: [
    { ad: "İBB 100. Yıl Stadı", yer: "Küçükçekmece (Halkalı Etap)",
      not: "2026-27 sezonunda iç saha maçlarımızın çoğunu burada oynuyoruz." }
  ],

  katilYazi: "Kulübümüzde forma giymek isteyen sporcular ve veliler formu doldurabilir. 18 yaşından küçükler için başvuruyu veli yapar.",

  /* Boş bırakılan satırlar sitede gösterilmez. */
  iletisim: { adres: "", telefon: "", eposta: "", saatler: "" },

  /* BAŞVURU FORMU
     GitHub Pages yalnızca statik dosya yayınlar; formun bir alıcıya ihtiyacı var.
     Formspree gibi bir servisten aldığınız adresi buraya yazın:
       formAdresi: "https://formspree.io/f/xxxxxxx"
     Boş kaldığı sürece form başvuru GÖNDERMEZ ve bunu ziyaretçiye açıkça söyler. */
  formAdresi: "",
  basvuruTurleri: ["Sporcu başvurusu", "Kulüp üyeliği", "Gönüllü / antrenör"]
};
