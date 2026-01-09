# Wireframe Comments API - Cloudflare Workers + D1

Bu dokuman, wireframe yorum sisteminin kurulumu ve kullanimi icin rehber niteligindedir.

## Gereksinimler

- Node.js (v18+)
- Cloudflare hesabi
- Wrangler CLI

## Kurulum Adimlari

### 1. Bagimlikari Yukle

```bash
cd workers/comments-api
npm install
```

### 2. Wrangler'a Giris Yap

```bash
npx wrangler login
```

Tarayicinizda Cloudflare giris sayfasi acilacak. Giris yapin ve izin verin.

### 3. D1 Veritabani Olustur

```bash
npx wrangler d1 create wireframe-comments
```

Bu komut ciktisinda su sekilde bir sey goreceksiniz:

```
[[d1_databases]]
binding = "DB"
database_name = "wireframe-comments"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 4. wrangler.toml Dosyasini Guncelle

`wrangler.toml` dosyasindaki `database_id` degerini yukaridaki komut ciktisindaki deger ile degistirin.

### 5. Veritabani Semasini Olustur

```bash
npx wrangler d1 execute wireframe-comments --file=./schema.sql
```

### 6. Local Development (Gelistirme)

```bash
npm run dev
```

API artik `http://localhost:8787` adresinde calisacak.

### 7. Production Deploy

```bash
npm run deploy
```

Deploy sonrasi API URL'i Cloudflare Workers panelinden gorebilirsiniz.
Ornek: `https://wireframe-comments-api.your-subdomain.workers.dev`

## Frontend Entegrasyonu

Wireframe sayfalariniza yorum sistemini eklemek icin:

```html
<!-- Sayfa sonuna ekleyin (</body> oncesi) -->
<script src="../js/comments.js"></script>
```

Veya ozel ayarlarla:

```html
<script src="../js/comments.js"></script>
<script>
  // API URL'ini degistir (production icin)
  window.wireframeComments = new WireframeComments({
    apiUrl: 'https://wireframe-comments-api.your-subdomain.workers.dev'
  });
</script>
```

## API Endpoints

### Yorumlari Listele
```
GET /comments?page_id=sprint1/dashboard
```

### Yorum Ekle
```
POST /comments
Content-Type: application/json

{
  "page_id": "sprint1/dashboard",
  "author_name": "Ahmet",
  "author_email": "ahmet@email.com",
  "content": "Bu buton daha buyuk olmali",
  "priority": "high",
  "x_position": 150,  // Pin konumu (opsiyonel)
  "y_position": 300
}
```

### Yorum Guncelle
```
PUT /comments/:id
Content-Type: application/json

{
  "status": "resolved",
  "resolved_by": "Mehmet"
}
```

### Yorum Sil
```
DELETE /comments/:id
```

### Yanit Ekle
```
POST /comments/:id/replies
Content-Type: application/json

{
  "author_name": "Mehmet",
  "content": "Tamam, duzeltiyorum"
}
```

### Istatistikler
```
GET /stats
```

## Ozellikler

- **Sayfa bazli yorumlar**: Her wireframe sayfasi icin ayri yorumlar
- **Pin modu**: Sayfada belirli noktalara yorum ekleme
- **Yanitlar**: Yorumlara yanit verme
- **Durum takibi**: Acik/Cozuldu durumlari
- **Oncelik seviyeleri**: Normal, Dusuk, Yuksek, Kritik
- **LocalStorage**: Kullanici bilgilerini hatirlar

## Notlar

- CORS ayarlari `localhost:3000`, `localhost:5173` ve `localhost:8080` icin aktif
- Production'da kendi domain'inizi `wrangler.toml` dosyasina ekleyin
- D1 free tier: 5GB storage, 5M rows/day read, 100K rows/day write
