# Cloudflare Kurulum Rehberi

Bu rehber, wireframe'lerin PIN korumalı subdomain'lerle paylaşımını sağlar.

**Sonuç:** `legends.wireframes.untitledproduct.com` -> PIN ile erişim

---

## 1. Cloudflare Pages Kurulumu

### 1.1 Pages Projesi Oluştur

1. [Cloudflare Dashboard](https://dash.cloudflare.com) > **Pages** > **Create a project**
2. **Connect to Git** > GitHub hesabını bağla
3. **untitled-wireframes** reposunu seç
4. Ayarlar:
   - **Project name:** `legends-wireframes` (proje bazlı değiştir)
   - **Production branch:** `main`
   - **Build command:** `npx tailwindcss -i ./src/styles/base.css -o ./dist/output.css`
   - **Build output directory:** `/` (root)
5. **Save and Deploy**

> **Not:** Her proje için ayrı Pages projesi oluştur veya aynı repo'da branch'ler kullan.

---

## 2. KV Namespace Oluştur

### 2.1 KV Storage

1. Cloudflare Dashboard > **Workers & Pages** > **KV**
2. **Create a namespace** > Ad: `wireframe-projects`
3. Namespace ID'yi kopyala

### 2.2 Proje Verisi Ekle

KV'de şu formatta veri ekle:

**Key:** `projects/legends`
**Value:**
```json
{
  "pin": "1234",
  "name": "Legends DXP",
  "pages_project": "legends-wireframes"
}
```

> `pages_project`: Cloudflare Pages'deki proje adı (Step 1.1'de belirlediğin)

---

## 3. Worker Deploy

### 3.1 Wrangler Kurulumu (Local)

```bash
cd cloudflare-worker
npm install -g wrangler
wrangler login
```

### 3.2 wrangler.toml Güncelle

`wrangler.toml` dosyasındaki `YOUR_KV_NAMESPACE_ID` kısmını gerçek ID ile değiştir:

```toml
[[kv_namespaces]]
binding = "WIREFRAME_PROJECTS"
id = "abc123def456..."  # KV Namespace ID
```

### 3.3 Deploy

```bash
wrangler deploy
```

---

## 4. DNS Ayarları

### 4.1 Wildcard Subdomain

Cloudflare Dashboard > **DNS** > **Records**

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `*.wireframes` | `wireframe-auth.workers.dev` | Proxied ✓ |

> Bu ayar tüm `*.wireframes.untitledproduct.com` trafiğini Worker'a yönlendirir.

---

## 5. Yeni Proje Ekleme

Yeni bir proje eklemek için:

### 5.1 Pages'de Yeni Deployment

Option A: Aynı repo, farklı branch
```bash
git checkout -b project-acme
# wireframe'leri düzenle
git push origin project-acme
```
Pages'de: Settings > Branches > Add branch deployment

Option B: Farklı repo
- Yeni GitHub repo oluştur
- Yeni Pages projesi oluştur

### 5.2 KV'ye Proje Ekle

**Key:** `projects/acme`
**Value:**
```json
{
  "pin": "5678",
  "name": "Acme Corp",
  "pages_project": "acme-wireframes"
}
```

### 5.3 Test Et

`https://acme.wireframes.untitledproduct.com` adresini ziyaret et.

---

## Proje Yapısı

```
wireframes.untitledproduct.com/
├── Worker (PIN Authentication)
│   └── *.wireframes.untitledproduct.com/* -> Worker
│
├── KV Storage
│   ├── projects/legends -> { pin, name, pages_project }
│   ├── projects/acme -> { pin, name, pages_project }
│   └── projects/...
│
└── Pages Projects
    ├── legends-wireframes.pages.dev
    ├── acme-wireframes.pages.dev
    └── ...
```

---

## Sorun Giderme

### "Project not found" hatası
- KV'de `projects/{subdomain}` key'i var mı kontrol et
- Subdomain küçük harf olmalı

### PIN kabul edilmiyor
- KV'deki PIN değeri string olmalı: `"1234"` (sayı değil)
- Boşluk olmamalı

### Sayfa yüklenmiyor
- Pages projesi deploy edilmiş mi kontrol et
- `pages_project` değeri doğru mu

### CSS/JS yüklenmiyor
- Build output directory `/` olmalı
- `dist/output.css` dosyası oluşturulmuş mu

---

## Güvenlik Notları

- PIN'ler KV'de düz metin olarak saklanır (basit koruma için yeterli)
- Cookie HttpOnly ve Secure flag'leri ile korunur
- Her proje izole - bir projenin PIN'i diğerlerine erişim sağlamaz
- Brute-force koruması için Cloudflare Rate Limiting eklenebilir

---

## Hızlı Başlangıç Komutları

```bash
# 1. Wrangler login
wrangler login

# 2. KV namespace oluştur
wrangler kv:namespace create "wireframe-projects"

# 3. Proje ekle (legends örneği)
wrangler kv:key put --namespace-id=YOUR_ID "projects/legends" '{"pin":"1234","name":"Legends DXP","pages_project":"legends-wireframes"}'

# 4. Worker deploy
cd cloudflare-worker
wrangler deploy

# 5. Test
curl -I https://legends.wireframes.untitledproduct.com
```
