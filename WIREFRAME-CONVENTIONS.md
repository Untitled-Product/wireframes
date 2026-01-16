# Wireframe-Kit Gelistirme Kurallari

Bu dokuman, wireframe-kit projesinin tutarliligini saglamak icin uyulmasi gereken kurallari icerir.
**Her yeni sayfa olusturmadan once bu dokumani oku.**

---

## ALTIN KURAL

> **Sprint 2 (admin/) onaylanmis referans noktasidir. Yeni sprint/sayfa eklerken MUTLAKA Sprint 2 yapisini referans al.**

---

## 1. Sayfa Yapisi (ZORUNLU)

Tum admin/dashboard sayfalari asagidaki yapida olmali:

```html
<body class="min-h-screen wireframe-page" x-data="{ sidebarOpen: true, mobileMenu: false }">
  <div class="flex min-h-screen">

    <!-- Sidebar: COMPONENT KULLAN -->
    <div data-component="sidebar"></div>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col">

      <!-- Header: COMPONENT KULLAN -->
      <div data-component="header"></div>

      <!-- Page Content -->
      <main class="p-6 flex-1">
        <!-- Page Header (baslik + aksiyon butonu) -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl">[Sayfa Basligi]</h1>
            <p class="text-gray-500 mt-1">[Sayfa aciklamasi]</p>
          </div>
          <!-- AKSIYON BUTONU BURAYA (header'a DEGIL!) -->
          <a href="..." class="wf-btn wf-btn-primary inline-flex items-center gap-2">
            <span>+</span>
            Yeni Kayit Ekle
          </a>
        </div>

        <!-- Sayfa icerigi buraya -->
      </main>
    </div>
  </div>
</body>
```

### ASLA YAPMA:
- Custom sidebar yazma - her zaman `data-component="sidebar"` kullan
- Custom header yazma - her zaman `data-component="header"` kullan
- Header component'e aksiyon butonu ekleme - butonlar Page Header'da olmali
- Nested `<main>` tag'leri kullanma
- Farkli menu yapilari olusturma

---

## 2. Page Header Kurallari (KRITIK)

Page Header = Sayfa basligi + Aksiyon butonlari. Header component'ten FARKLI.

### Referans: Sprint 2 ticket-list.html (satir 146-155)

```html
<!-- Page Header -->
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <div>
    <h1 class="text-3xl">Biletler</h1>
    <p class="text-gray-500 mt-1">Tum bilet tiplerini yonetin</p>
  </div>
  <a href="ticket-form.html" class="wf-btn wf-btn-primary inline-flex items-center gap-2">
    <span>+</span>
    Yeni Bilet Ekle
  </a>
</div>
```

### Kurallar:
1. Aksiyon butonu (Yeni Ekle, Import, Export) HER ZAMAN Page Header'da olmali
2. Header component SADECE: breadcrumb, bildirim, avatar icermeli
3. Buton stili: `wf-btn wf-btn-primary inline-flex items-center gap-2`
4. Birden fazla buton varsa: `<div class="flex gap-2">` ile sarmala

---

## 3. Component Sistemi

### Dosyalar:
- `src/js/layout-components.js` - Sidebar ve header component'leri
- `src/js/icons.js` - SVG ikon yukleyici

### Yeni Sayfa Eklerken:
1. `layout-components.js` icindeki `pageConfigs` objesine sayfa ekle
2. `mainSidebar` array'ini DEGISTIRME (merkezi menu)
3. Sadece `activeItem` ve `breadcrumb` ekle - headerAction KULLANMA!

```javascript
'yeni-sayfa': {
  sidebar: mainSidebar,        // HER ZAMAN mainSidebar kullan
  activeItem: 'ilgili-menu',   // Sidebar'da hangi item aktif
  breadcrumb: ['Dashboard', 'Yeni Sayfa']
  // headerAction YOK - buton sayfa iceriginde olmali!
}
```

---

## 4. Sidebar Menu Yapisi

Merkezi menu `layout-components.js` icinde tanimli. Tum sayfalar AYNI menuyu kullanir:

| Menu Item | Icon | Hedef |
|-----------|------|-------|
| Dashboard | dashboard-layout | sprint1/layout-sidebar-open.html |
| Biletler | coupon-cut | admin/ticket-list.html |
| Eklentiler | add-sign-bold | admin/addon-list.html |
| Siparisler | shop-cart | admin/order-detail.html |
| Slot Takvimi | calendar-grid | admin/slot-calendar.html |
| --- | --- | --- |
| Kampanyalar | discount-badge | sprint3/campaign-list.html |
| Kuponlar | receipt-slip-1 | sprint3/coupon-list.html |
| --- | --- | --- |
| Kullanicilar | app-window-user | sprint1/user-list.html |

### Yeni Menu Item Eklemek:
`layout-components.js` > `mainSidebar` array'ine ekle. TUM SAYFALAR otomatik guncellenir.

---

## 5. Header Yapisi

Header component otomatik olusturur:
- Mobile menu toggle
- Breadcrumb (sayfa yolu)
- Ana Sayfa linki
- Bildirim ikonu
- Kullanici avatari

**ONEMLI:** Header'da aksiyon butonu OLMAMALI. Butonlar Page Header'da.

---

## 6. Tablo Aksiyonlari

### Referans: Sprint 2 ticket-list.html (satir 257-262)

```html
<td class="text-right">
  <div class="flex items-center justify-end gap-2">
    <button class="wf-btn py-1 px-2 text-sm" title="Duzenle">
      <span class="wf-icon" data-icon="edit-pencil" data-size="16"></span>
    </button>
    <button class="wf-btn py-1 px-2 text-sm" title="Kopyala">
      <span class="wf-icon" data-icon="content-paper-edit" data-size="16"></span>
    </button>
    <button class="wf-btn py-1 px-2 text-sm" title="Devre Disi">
      <span class="wf-icon" data-icon="delete-disable-block-1" data-size="16"></span>
    </button>
  </div>
</td>
```

### Standart Aksiyon Seti:
1. **Duzenle** - `edit-pencil`
2. **Kopyala** - `content-paper-edit`
3. **Devre Disi/Durdur** - `delete-disable-block-1`

### Opsiyonel Aksiyonlar:
- **Sil (kirmizi)** - `delete-bin-2` + `text-red-600`
- **Rapor** - `analytics-graph-bar-horizontal`
- **Detay** - `information-circle`

---

## 7. Ikon Sistemi

### Kullanim:
```html
<span class="wf-icon" data-icon="icon-adi" data-size="20"></span>
```

### Path Kurali:
`icons.js` tum sprint path'lerini biliyor. Yeni klasor eklenirse `getBasePath()` metoduna ekle.

### Standart Ikon Listesi (ZORUNLU)

| Aksiyon | Ikon Adi | Kullanim |
|---------|----------|----------|
| Duzenle | `edit-pencil` | Kayit duzenleme butonu |
| Kopyala/Yeni Versiyon | `content-paper-edit` | Kaydi kopyalama |
| Sil/Durdur | `delete-disable-block-1` | Aktif kaydi durdurma |
| Iptal/Kaldir | `delete-bin-2` | Kaydi silme (kirmizi) |
| Rapor/Analiz | `analytics-graph-bar-horizontal` | Rapor goruntuleme |
| Bilgi/Detay | `edit-pen-write-paper` | Detay goruntuleme |
| Yukle/Import | `upload-1` | Dosya yukleme |
| Indir/Export | `download-1` | Dosya indirme |
| Ekle | `add-sign-bold` | Yeni kayit ekleme |
| Bildirim | `alert-alarm-bell` | Bildirim ikonu |
| Menu | `menu-navigation-2` | Mobil menu toggle |
| Arama | `search-magnifier` | Arama inputu |

### Sidebar Ikonlari (Referans)

| Menu | Ikon Adi |
|------|----------|
| Dashboard | `dashboard-layout` |
| Biletler | `coupon-cut` |
| Eklentiler | `add-sign-bold` |
| Siparisler | `shop-cart` |
| Slot Takvimi | `calendar-grid` |
| Kampanyalar | `discount-badge` |
| Kuponlar | `receipt-slip-1` |
| Kullanicilar | `app-window-user` |

### ASLA KULLANMA (Yanlis Isimler):

| YANLIS | DOGRU |
|--------|-------|
| `pencil-write` | `edit-pencil` |
| `copy-paste-2` | `content-paper-edit` |
| `stop-sign` | `delete-disable-block-1` |
| `analytics-graph-bar` | `analytics-graph-bar-horizontal` |
| `info-circle` | `edit-pen-write-paper` |
| `check-circle` | `checkmark-circle-2` |

---

## 8. Filtre ve Arama Yapisi

### Referans: Sprint 2 ticket-list.html (satir 157-196)

```html
<!-- Filters -->
<div class="wf-card mb-6">
  <div class="flex flex-wrap gap-4">
    <!-- Search -->
    <div class="flex-1 min-w-[200px]">
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <span class="wf-icon" data-icon="search-magnifier" data-size="16"></span>
        </span>
        <input type="text" placeholder="..." class="wf-input pl-10">
      </div>
    </div>

    <!-- Dropdown Filters -->
    <div class="w-40">
      <select class="wf-select">
        <option>Tum Tipler</option>
        ...
      </select>
    </div>

    <!-- Clear Button -->
    <button class="wf-btn text-gray-500">Temizle</button>
  </div>
</div>
```

---

## 9. Badge Stilleri

### Referans: Sprint 2 ticket-list.html

```html
<!-- Durum Badge'leri -->
<span class="wf-badge wf-badge-success">Aktif</span>
<span class="wf-badge wf-badge-warning">Pasif</span>
<span class="wf-badge">Taslak</span>

<!-- Tip Badge'leri -->
<span class="wf-badge wf-badge-primary">Gunluk</span>
<span class="wf-badge wf-badge-warning">VIP</span>
<span class="wf-badge wf-badge-info">Indirim</span>
```

---

## 10. Pagination

### Referans: Sprint 2 ticket-list.html (satir 389-401)

```html
<div class="px-4 py-3 border-t-2 border-gray-300 flex items-center justify-between">
  <div class="text-sm text-gray-500">
    6 bilet goruntuluyor
  </div>
  <div class="flex items-center gap-2">
    <button class="wf-btn py-1 text-sm opacity-50" disabled>Onceki</button>
    <span class="wf-btn wf-btn-primary py-1 text-sm">1</span>
    <button class="wf-btn py-1 text-sm">2</button>
    <button class="wf-btn py-1 text-sm">3</button>
    <button class="wf-btn py-1 text-sm">Sonraki</button>
  </div>
</div>
```

---

## 11. Tool vs Wireframe Ayrimi

Projede iki farkli stil sistemi var:

### Tool UI (Modern/Minimal)
- **Kullanim:** Toolbar, comments, pins, panels
- **Stil:** System font, dark theme, solid borders, rounded corners
- **Prefix:** `.tool-*`
- **Ikonlar:** `src/tool/icons/` (Interface icons)

### Wireframe UI (Sketchy)
- **Kullanim:** Sayfa icerigi (formlar, tablolar, cardlar)
- **Stil:** Indie Flower font, dashed borders, shadow effects
- **Prefix:** `.wf-*`
- **Ikonlar:** `src/wireframe/icons/` (Streamline Freehand)

### Ikon Kullanimi

```html
<!-- Wireframe icerigi icin (sayfa icinde) -->
<span class="wf-icon" data-icon="edit-pencil" data-size="16"></span>

<!-- Tool UI icin (toolbar, comments) -->
<span class="tool-icon" data-tool-icon="Arrow Down" data-size="20"></span>
```

### Script Yukleme Sirasi

```html
<head>
  <!-- Wireframe scripts (HEAD'de) -->
  <script src="../../wireframe/js/icons.js"></script>
  <script src="../../wireframe/js/layout-components.js"></script>
</head>
<body>
  ...
  <!-- Tool UI scripts (BODY sonunda) -->
  <script src="../../tool/js/tool-icons.js"></script>
  <script src="../../tool/js/toolbar.js"></script>
  <script src="../../tool/js/comments.js"></script>
</body>
```

---

## 12. Yeni Sprint Klasoru Eklerken

1. `wireframe/js/icons.js` > `getBasePath()` - sprint path'i ekle
2. `tool/js/toolbar.js` > `getToolBasePath()` ve `getIndexPath()` - sprint path'i ekle
3. `wireframe/js/layout-components.js` > `pageConfigs` - sayfa config'leri ekle
4. Sayfalarda component placeholder'lari kullan
5. **Sprint 2 sayfalarini referans al!**

---

## 13. Dosya Yapisi

```
wireframe-kit/
├── src/
│   ├── tool/                     # Tool UI (Modern/Minimal)
│   │   ├── css/
│   │   │   └── tool.css          # Tool stilleri
│   │   ├── js/
│   │   │   ├── tool-icons.js     # Interface ikon loader
│   │   │   ├── toolbar.js        # Floating toolbar
│   │   │   └── comments.js       # Yorum sistemi
│   │   └── icons/                # Interface ikonlar (238 SVG)
│   │
│   ├── wireframe/                # Wireframe UI (Sketchy)
│   │   ├── css/
│   │   │   └── wireframe.css     # Wireframe stilleri
│   │   ├── js/
│   │   │   ├── icons.js          # Streamline ikon loader
│   │   │   └── layout-components.js
│   │   └── icons/                # Streamline Freehand ikonlar
│   │
│   ├── styles/
│   │   └── base.css              # Tailwind directives
│   │
│   └── pages/
│       ├── admin/                # Sprint 2 - Ticketing (REFERANS!)
│       ├── sprint1/              # Sprint 1 - Auth & Users
│       ├── sprint3/              # Sprint 3 - Campaigns
│       └── public/               # Public sayfalar
│
├── dist/                         # Tailwind output
└── index.html                    # Ana sayfa
```

### Z-Index Katmanlari

| Katman | Z-Index | Kullanim |
|--------|---------|----------|
| Wireframe content | 1-100 | Sayfa icerigi |
| Wireframe modals | 100-500 | Modal/dropdown |
| Tool toolbar | 9000 | Alt toolbar |
| Tool pins | 9100 | Comment pinleri |
| Tool popups | 9200 | Comment popup |
| Tool panel | 9300 | Sag panel |
| Tool overlay | 9400 | Comment mode banner |

---

## 14. Checklist - Yeni Sayfa Olusturma

### Yapi:
- [ ] Sprint 2'deki benzer sayfa incelendi (ZORUNLU)
- [ ] `layout-components.js`'e pageConfig eklendi (sadece activeItem + breadcrumb)
- [ ] Sayfada `data-component="sidebar"` var
- [ ] Sayfada `data-component="header"` var
- [ ] Page Header (h1 + subtitle + aksiyon butonu) var
- [ ] Aksiyon butonu Page Header'da (header component'te DEGIL)

### Stilller:
- [ ] Tablo aksiyonlari Sprint 2 formatinda
- [ ] Ikonlar standart listeden secildi
- [ ] Badge stilleri uygun
- [ ] Pagination Sprint 2 formatinda

### Teknik:
- [ ] Script yukleme sirasi dogru: icons.js > layout-components.js > alpinejs
- [ ] Custom sidebar/header YAZILMADI
- [ ] Nested main tag YOK

---

## 15. Deploy

```bash
cd wireframe-kit && npx tailwindcss -i ./src/styles/base.css -o ./dist/output.css --minify && npx wrangler pages deploy . --project-name=legends-wireframes
```

URL: https://legends-wireframes.pages.dev

---

**Son Guncelleme:** 2026-01-11
