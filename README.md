# Spor Kulübü Sitesi

Futbol kulübü için tek sayfalık, statik site. Derleme adımı yok; GitHub Pages üzerinde doğrudan çalışır.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sayfa iskeleti |
| `js/data.js` | **Tüm içerik burada**: kulüp adı, kadro, fikstür, puan durumu, haberler, galeri, iletişim |
| `js/main.js` | İçeriği sayfaya yerleştirir, formu yönetir |
| `css/style.css` | Görünüm. Kulüp renkleri en üstteki `--bordo` ve `--lacivert` değerleridir |
| `images/` | Galeri fotoğrafları (kendiniz ekleyin) |

## İçeriği güncelleme

`js/data.js` dosyasını açıp değerleri değiştirin. Dosyadaki tüm adlar ve sonuçlar örnektir.

- **Maç sonucu girmek:** ilgili maçın `skor` alanına `"2-1"` yazın (önce kendi golünüz). Boş bırakılan ilk maç "Sıradaki maç" olarak gösterilir.
- **Puan durumu:** her takımın O/G/B/M/A/Y değerlerini girin; puan ve sıralama otomatik hesaplanır.
- **Fotoğraf:** dosyayı `images/` klasörüne koyun, `galeri` listesinde `dosya: "images/ad.jpg"` yazın.
- Tarayıcı sekmesindeki ad için `index.html` içindeki `<title>` satırını da güncelleyin.

## GitHub Pages'te yayınlama

1. GitHub'da yeni bir depo açın (Public).
2. Bu klasördeki dosyaları depoya yükleyin:
   ```bash
   git init
   git add .
   git commit -m "İlk sürüm"
   git branch -M main
   git remote add origin https://github.com/KULLANICI/DEPO.git
   git push -u origin main
   ```
3. Depoda **Settings → Pages → Build and deployment**: Source olarak **Deploy from a branch**, Branch olarak **main** ve **/ (root)** seçip kaydedin.
4. Birkaç dakika sonra site `https://KULLANICI.github.io/DEPO/` adresinde açılır.

## Üyelik formu

GitHub Pages yalnızca statik dosya yayınlar, bu yüzden form kendi başına başvuru kaydedemez. `js/data.js` içindeki `formAdresi` boş olduğu sürece form **gönderim yapmaz** ve ziyaretçiye bunu söyler.

Bağlamak için Formspree gibi bir form servisinde form oluşturup verdiği adresi yazın:

```js
formAdresi: "https://formspree.io/f/xxxxxxx"
```

Başvuruları bir veritabanında (ör. Supabase) tutmak isterseniz `js/main.js` içindeki `fetch` çağrısı buna göre değiştirilebilir.
