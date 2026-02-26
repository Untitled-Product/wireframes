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
- **Stil:** Inter font, dashed borders, shadow effects
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

---

## 16. V2 Component Sistemi (Sprint A ve Sonrasi)

> **Sprint A'dan itibaren tum yeni sayfalar V2 component sistemini kullanir.**
> Eski sprint sayfalari (S1/S2/S3) mevcut V1 sistemiyle kalir.

### Mimari

V2 component sistemi ayri dosyalarda yasar:
- `src/wireframe/js/layout-components-v2.js` - V2 sidebar (gruplu) + header (sade breadcrumb)
- `src/wireframe/css/wireframe.css` - `.wf-v2-*` prefix'li stiller

V1 dosyalarina (`layout-components.js`) DOKUNULMAZ.

### V2 Sayfa Yapisi (Sprint A Template)

```html
<!DOCTYPE html>
<html lang="tr" class="h-full">
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    .fonts-loading { opacity: 0; }
    .fonts-loaded { opacity: 1; transition: opacity 0.1s ease-in; }
  </style>
  <script>
    document.documentElement.classList.add('fonts-loading');
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      window.addEventListener('load', () => {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
      });
    }
  </script>
  <link rel="stylesheet" href="../../../dist/output.css">
  <link rel="stylesheet" href="../../wireframe/css/wireframe.css">
  <script src="../../wireframe/js/icons.js"></script>
  <script src="../../wireframe/js/layout-components-v2.js"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="min-h-screen wireframe-page"
  x-data="{ sidebarOpen: true, mobileMenu: false }">

  <div class="flex min-h-screen">
    <div data-component="sidebar"></div>
    <div class="flex-1 flex flex-col min-w-0">
      <div data-component="header"></div>
      <main class="p-6 flex-1">
        <!-- Sayfa icerigi -->
      </main>
    </div>
  </div>

  <script src="../../tool/js/tool-icons.js"></script>
  <script src="../../tool/js/toolbar.js"></script>
  <script src="../../tool/js/comments.js"></script>
</body>
```

### V1 vs V2 Farklari

| Ozellik | V1 (S1/S2/S3) | V2 (Sprint A+) |
|---------|---------------|-----------------|
| Font | Inter (sketchy) | Inter (AYNI - wireframe hissi korunur) |
| Sidebar | Flat liste | Gruplu/expandable |
| Header | Breadcrumb + Sprint badge + Avatar | Breadcrumb only + sidebar toggle |
| CSS Prefix | `.wf-*` | `.wf-v2-*` |
| JS Dosyasi | `layout-components.js` | `layout-components-v2.js` |
| Body Class | `wireframe-page` | `wireframe-page` (AYNI) |
| Border | `2px solid` / dashed | `2px solid` (AYNI wireframe stil) |
| Primary Color | Theme-based | Mor (#6366f1) |
| Active Color | Theme-based | Yesil (#22c55e) |
| Pagination | Standart pagination | YOK - lazy load (gosterilmez) |

### V2 CSS Siniflari

| Sinif | Kullanim |
|-------|----------|
| `.wf-v2-sidebar` | Sidebar container |
| `.wf-v2-sidebar-item` | Sidebar menu item |
| `.wf-v2-sidebar-group` | Expandable grup container |
| `.wf-v2-sidebar-group-header` | Grup basligi (tiklanabilir) |
| `.wf-v2-sidebar-group-items` | Grup ic ogeleri container |
| `.wf-v2-sidebar-nested` | Indent'li ic oge |
| `.wf-v2-header` | Header bar |
| `.wf-v2-table-wrapper` | Tablo container (border, radius) |
| `.wf-v2-table` | Tablo |
| `.wf-v2-btn` | Buton (outline) |
| `.wf-v2-btn-primary` | Primary buton (mor) |
| `.wf-v2-btn-sm` | Kucuk buton |
| `.wf-v2-btn-icon` | Icon-only buton |
| `.wf-v2-badge` | Badge |
| `.wf-v2-badge-success` | Yesil badge |
| `.wf-v2-badge-warning` | Turuncu badge |
| `.wf-v2-badge-danger` | Kirmizi badge |
| `.wf-v2-badge-info` | Mavi badge |
| `.wf-v2-input` | Text input |
| `.wf-v2-search` | Arama input wrapper |
| `.wf-v2-search-input` | Arama input |
| `.wf-v2-search-icon` | Arama ikonu |
| `.wf-v2-filter-drawer` | Filtre drawer (sag panel) |
| `.wf-v2-modal` | Modal dialog |
| `.wf-v2-empty-state` | Bos durum container |
| `.wf-v2-empty-state-icon` | Bos durum ikonu |
| `.wf-v2-copy-btn` | Kopyalama butonu (PNR gibi) |
| `.wf-v2-country-badge` | Ulke kodu badge'i (TR, RU) |

### V2 Sidebar Menu Yapisi

```
The Land of Legends          [toggle]
─────────────────────────────
Dashboard
Kullanicilar
Tema Park Urunleri            ▸
Kampanyalar                   ▸
Eklentiler                    ▸
Siparisler                    ▸ (expandable)
   ├── Tema Park Siparisleri
   └── Store Siparisleri
Iptal/Iade Formlari           ▸
Content Management (CM...)    ▸
─────────────────────────────
Entegrasyonlar                ▸
Loglar                        ▸
Ayarlar                       ▸
─────────────────────────────
Elif Kaya
elif@thelandoflegends.com
```

### Yeni V2 Sayfa Eklerken

1. `layout-components-v2.js` > `pageConfigsV2` objesine config ekle:
```javascript
'yeni-sayfa': {
  activeItem: 'menuItemId',
  parentGroup: 'grupId',  // veya null (grup disiysa)
  breadcrumb: ['Ust Menu', 'Alt Menu']
}
```

2. `menuItems` array'ine yeni menu item ekle (gerekiyorsa)
3. Sayfada `layout-components-v2.js` kullan (V1 DEGIL!)
4. V2 CSS siniflarini kullan (`.wf-v2-*`)
5. Inter font + `wireframe-page` body class kullan (V1 ile AYNI wireframe hissi)

### V2 Checklist

- [ ] `layout-components-v2.js` kullaniliyor (V1 degil)
- [ ] `wireframe.css` MUTLAKA link edilmis (`<link rel="stylesheet" href="../../wireframe/css/wireframe.css">`)
- [ ] Inter font yukleniyor (preload + Google Fonts)
- [ ] `fonts-loading`/`fonts-loaded` script'leri var
- [ ] Body class: `wireframe-page` (inline font-family YOK)
- [ ] `pageConfigsV2`'ye config eklendi
- [ ] V2 CSS siniflari kullaniliyor (`.wf-v2-*`)
- [ ] Filtre drawer varsa `.wf-v2-filter-drawer` kullaniyor
- [ ] Badge'ler `.wf-v2-badge` kullaniyor
- [ ] Pagination YOK (lazy load kullanilir)

> **UYARI:** `wireframe.css` link edilmezse V2 stilleri (`.wf-v2-*`) CALISMAZ!
> `output.css` (Tailwind build) icinde V2 stilleri YOKTUR. Iki CSS dosyasi da gerekli:
> 1. `output.css` - Tailwind utility siniflari
> 2. `wireframe.css` - V2 component stilleri (sidebar, header, tablo, badge, modal, filtre drawer)

---

## 17. TAILWIND ARBITRARY VALUE YASAGI (KRITIK!)

> **output.css PRE-BUILT'tir. Tailwind arbitrary value class'lari (`h-[200px]`, `w-[40%]`, `text-[10px]`, `min-h-[480px]`, `max-h-[90vh]`, `-mb-[2px]`, `after:top-[2px]` vb.) output.css'te YOKTUR ve CALISMAZ.**

### YASAK: Arbitrary Value Class'lar

```html
<!-- YANLIS - Calismaz! -->
<div class="h-[200px]">...</div>
<div class="w-[40%]">...</div>
<div class="min-h-[480px]">...</div>
<div class="max-h-[90vh]">...</div>
<div class="-mb-[2px]">...</div>
<span class="text-[10px]">...</span>
<div class="after:top-[2px] after:left-[2px]">...</div>

<!-- DOGRU - Inline style kullan -->
<div style="height: 200px">...</div>
<div style="width: 40%">...</div>
<div style="min-height: 480px">...</div>
<div style="max-height: 90vh">...</div>
<div style="margin-bottom: -2px">...</div>
<span style="font-size: 10px">...</span>
```

### Kural: Eger Tailwind class'inda koseli parantez `[` goruyorsan → inline style kullan.

### AYRICA YASAK: Opacity Modifier (`/`) ve `group-hover:` Variant

output.css'te su Tailwind ozellikleri de YOKTUR:

```html
<!-- YANLIS - Calismaz! -->
<div class="bg-black/40">...</div>        <!-- opacity modifier /40 yok -->
<div class="bg-black/30">...</div>        <!-- opacity modifier /30 yok -->
<div class="bg-white/80">...</div>        <!-- opacity modifier /80 yok -->
<div class="opacity-0">...</div>          <!-- opacity-0 yok -->
<div class="group-hover:opacity-100">     <!-- group-hover variant yok -->
```

**COZUM:** Bu class'lar `wireframe.css`'e eklenmistir. `wireframe.css` MUTLAKA link edilmelidir.
Yeni bir opacity/group-hover class'i gerekiyorsa → wireframe.css'e ekle, output.css'e guvenme.

---

## 17b. LISTE SAYFALARI - ROW TIKLANABILIRLIK KURALI (KRITIK!)

> **Liste sayfalarinda edit butonu KULLANMA. Satirin tamami tiklanabilir olmali.**
> **Icerisinde baska buton varsa (sil, durum degistir) z-index ile yerlestir.**

### Dogru Pattern: Tamami Tiklanabilir Row

```html
<!-- DOGRU: Row tamami link -->
<tr class="cursor-pointer hover:bg-gray-50" @click="window.location.href='edit-page.html'">
  <td>Icerik...</td>
  <td>
    <!-- Aksiyonlar z-index ile -->
    <button @click.stop class="relative z-10 wf-v2-btn wf-v2-btn-sm text-red-500">Sil</button>
  </td>
</tr>
```

### Yanlis Pattern: Ayri Edit Butonu

```html
<!-- YANLIS: Row tiklanmaz, ayri edit butonu -->
<tr>
  <td>Icerik...</td>
  <td>
    <a href="edit.html" class="wf-v2-btn wf-v2-btn-sm">Duzenle</a>
    <button class="wf-v2-btn wf-v2-btn-sm text-red-500">Sil</button>
  </td>
</tr>
```

### Kart Grid'leri Icin (Medya Kutuphanesi vb.)

```html
<!-- Kart tamami tiklanabilir -->
<div class="cursor-pointer" @click="openDetail(item)">
  <!-- Overlay aksiyonlari @click.stop ile -->
  <button @click.stop="deleteItem(item)">Sil</button>
</div>
```

---

## 18. V2 COMPONENT KULLANIM ZORUNLULUKLARI (KRITIK!)

> **Mevcut bir wf-v2-* veya wf-* component'i varken ASLA kendi pattern'ini icat etme.**
> **Tutarlilik > Estetik. Her zaman mevcut component'i kullan.**

### Zorunlu Component Eslestirme Tablosu

| Ihtiyac | DOGRU Component | YANLIS Pattern |
|---------|----------------|----------------|
| Toggle switch | `wf-toggle` + `wf-toggle-input` + `wf-toggle-slider` | `w-9 h-5 bg-green-500 rounded-full` |
| Badge (durum) | `wf-v2-badge` + modifier (`-success`, `-warning`, `-danger`, `-info`) | `text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded` |
| Modal | `wf-v2-modal` (icerik) | `bg-white rounded-lg shadow-xl` (raw div) |
| Checkbox | `wf-checkbox` | `rounded border-gray-300 text-indigo-600` |
| Buton | `wf-v2-btn` + `wf-v2-btn-primary` | Custom Tailwind buton pattern |
| Input | `wf-v2-input` | Custom Tailwind input pattern |
| Tablo | `wf-v2-table-wrapper` + `wf-v2-table` | Custom Tailwind tablo |
| Arama | `wf-v2-search` + `wf-v2-search-input` + `wf-v2-search-icon` | Custom arama pattern |
| Bos durum | `wf-v2-empty-state` + `wf-v2-empty-state-icon` | Custom bos durum div |

### Toggle Switch (Tam Ornek)

```html
<!-- DOGRU -->
<label class="wf-toggle">
  <input type="checkbox" checked class="wf-toggle-input">
  <div class="wf-toggle-slider"></div>
</label>

<!-- YANLIS - ASLA KULLANMA -->
<div class="w-9 h-5 bg-green-500 rounded-full relative cursor-pointer">
  <div class="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
</div>

<!-- YANLIS - ASLA KULLANMA (Tailwind peer pattern) -->
<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer">
  <div class="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px]..."></div>
</label>
```

### Badge (Tam Ornek)

```html
<!-- DOGRU -->
<span class="wf-v2-badge wf-v2-badge-success">Aktif</span>
<span class="wf-v2-badge wf-v2-badge-warning">Beklemede</span>
<span class="wf-v2-badge wf-v2-badge-danger">Pasif</span>
<span class="wf-v2-badge wf-v2-badge-info">Bilgi</span>
<span class="wf-v2-badge">Varsayilan</span>

<!-- YANLIS -->
<span class="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded">Bilgi</span>
<span class="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded">Aktif</span>
```

### Modal (Tam Ornek)

```html
<!-- DOGRU -->
<div x-show="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="display: none;">
  <div class="fixed inset-0 bg-black/30" @click="modalOpen = false"></div>
  <div class="wf-v2-modal relative z-10 w-full max-w-lg">
    <!-- Modal icerik -->
  </div>
</div>

<!-- YANLIS -->
<div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg">
  <!-- wf-v2-modal class'i eksik! -->
</div>
```

---

## 19. SUBAGENT / PARALEL WIREFRAME OLUSTURMA KURALLARI

> **Wireframe olusturma isi subagent'lara (Task tool) delege edildiginde, subagent'lar bu kurallari bilmez. Prompt'a asagidaki kurallari EKLEMEN zorunludur.**

### Subagent Prompt'una EKLENMESI GEREKEN Kurallar

Wireframe olusturma prompt'larinda su kurallarin her birinin belirtilmesi ZORUNLUDUR:

1. **Tailwind arbitrary value YASAK.** `h-[200px]` degil `style="height: 200px"` kullan.
2. **Toggle:** `wf-toggle` + `wf-toggle-input` + `wf-toggle-slider` kullan.
3. **Badge:** `wf-v2-badge` + modifier kullan. Raw Tailwind renk badge'i YASAK.
4. **Modal:** `wf-v2-modal` class'i kullan. Raw `bg-white rounded-lg shadow-xl` YASAK.
5. **Checkbox:** `wf-checkbox` class'i kullan.
6. **Input:** `wf-v2-input` kullan. Custom input pattern YASAK.
7. **Buton:** `wf-v2-btn` / `wf-v2-btn-primary` / `wf-v2-btn-sm` kullan.
8. **Tablo:** `wf-v2-table-wrapper` + `wf-v2-table` kullan.
9. **Arama:** `wf-v2-search` + `wf-v2-search-input` kullan.

### Ornek Subagent Prompt Sablonu

```
Wireframe HTML dosyasi olustur: [dosya-adi].html

ZORUNLU KURALLAR (ihlal edilemez):
- Tailwind arbitrary value class KULLANMA (h-[200px] gibi). Inline style kullan.
- Toggle switch icin: <label class="wf-toggle"><input class="wf-toggle-input" checked><div class="wf-toggle-slider"></div></label>
- Badge icin: <span class="wf-v2-badge wf-v2-badge-success">Text</span>
- Modal icin: <div class="wf-v2-modal">icerik</div>
- Input icin: <input class="wf-v2-input">
- Buton icin: <button class="wf-v2-btn wf-v2-btn-primary">Text</button>
- Checkbox icin: <input type="checkbox" class="wf-checkbox">
- Tablo icin: <div class="wf-v2-table-wrapper"><table class="wf-v2-table">...</table></div>

Referans dosya oku: wireframe-kit/src/pages/sprint-a/[benzer-sayfa].html
```

---

## 17c. SILME ISLEMLERI - ONAY MODALI ZORUNLU (KRITIK!)

Tum silme butonlari **onay modali** gostermeli. Kullaniciya "Emin misiniz?" diye sorulmadan silme ASLA gerceklesmez.

### Pattern:

```html
<!-- x-data'ya ekle: deleteConfirmOpen: false, deleteTarget: null -->

<!-- Sil butonu — SADECE modal acar, silmez -->
<button @click.stop="deleteTarget = item; deleteConfirmOpen = true"
        class="wf-v2-btn wf-v2-btn-sm text-red-600 ...">
  Sil
</button>

<!-- Silme Onay Modali (sayfanin ALTINA, diger modallarla birlikte) -->
<div x-show="deleteConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="display: none;">
  <div class="fixed inset-0 bg-black/30" @click="deleteConfirmOpen = false"></div>
  <div class="wf-v2-modal relative z-10 w-full max-w-sm text-center">
    <svg class="w-10 h-10 mx-auto mb-3 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <h3 class="text-base font-semibold text-gray-900 mb-1">Silmek istediginize emin misiniz?</h3>
    <p class="text-sm text-gray-500 mb-5">Bu islem geri alinamaz.</p>
    <div class="flex gap-3 justify-center">
      <button @click="deleteConfirmOpen = false" class="wf-v2-btn">Vazgec</button>
      <button @click="deleteConfirmOpen = false; deleteTarget = null"
              class="wf-v2-btn bg-red-600 text-white border-red-600 hover:bg-red-700">Sil</button>
    </div>
  </div>
</div>
```

### Kurallar:
- Sil butonu **ASLA** dogrudan aksiyona baglanmaz
- Her zaman `deleteConfirmOpen` state ile onay modali acar
- Onay modali: uyari ikonu + "Emin misiniz?" + "Bu islem geri alinamaz." + Vazgec/Sil
- Inline satirda kucuk silme ikonlari (menu item, slide) icin de gecerli
- `deleteTarget` ile hangi ogenin silinecegi takip edilir

### YANLIS:
```html
<button @click="items.splice(index, 1)">Sil</button>
<button @click.stop>Sil</button>  <!-- Onaysiz -->
```

### DOGRU:
```html
<button @click.stop="deleteTarget = item; deleteConfirmOpen = true">Sil</button>
<!-- + sayfa altinda onay modali -->
```

### Yayinla (Publish) Onay:

"Yayinla" butonu canli siteyi etkileyen major aksiyondur. Onay modali ZORUNLU:

```html
<!-- x-data'ya ekle: publishConfirmOpen: false -->

<!-- Yayinla butonu — SADECE modal acar -->
<button @click="publishConfirmOpen = true" class="wf-v2-btn wf-v2-btn-primary">Yayinla</button>

<!-- Yayinla Onay Modali -->
<div x-show="publishConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="display: none;">
  <div class="fixed inset-0 bg-black/30" @click="publishConfirmOpen = false"></div>
  <div class="wf-v2-modal relative z-10 w-full max-w-sm text-center">
    <svg class="w-10 h-10 mx-auto mb-3 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <h3 class="text-base font-semibold text-gray-900 mb-1">Sayfayi yayinlamak istiyor musunuz?</h3>
    <p class="text-sm text-gray-500 mb-5">Bu sayfa canli siteye yansiyacaktir.</p>
    <div class="flex gap-3 justify-center">
      <button @click="publishConfirmOpen = false" class="wf-v2-btn">Vazgec</button>
      <button @click="publishConfirmOpen = false" class="wf-v2-btn wf-v2-btn-primary">Yayinla</button>
    </div>
  </div>
</div>
```

**Kurallar:**
- `publishConfirmOpen` state kullan (kirmizi degil, tema rengi — indigo)
- Onay modali: indigo ikon + "Sayfayi yayinlamak istiyor musunuz?" + "Bu sayfa canli siteye yansiyacaktir."
- Buton `wf-v2-btn-primary` (kirmizi degil)

---

## 21. Yeni Sayfa Olusturma Checklist (V2 - GENISLETILMIS)

### Yapi:
- [ ] Sprint A'daki benzer sayfa incelendi (ZORUNLU)
- [ ] `layout-components-v2.js`'e pageConfigsV2 eklendi
- [ ] Sayfada `data-component="sidebar"` var
- [ ] Sayfada `data-component="header"` var
- [ ] Page Header (h1 + subtitle + aksiyon butonu) var

### Component Kullanimi (KRITIK):
- [ ] Toggle switch → `wf-toggle` kullanildi
- [ ] Badge → `wf-v2-badge` kullanildi
- [ ] Modal → `wf-v2-modal` kullanildi
- [ ] Checkbox → `wf-checkbox` kullanildi
- [ ] Input → `wf-v2-input` kullanildi
- [ ] Buton → `wf-v2-btn` kullanildi
- [ ] Tablo → `wf-v2-table` kullanildi

### UX Davranislari:
- [ ] Silme butonlari onay modali aciyor (dogrudan silme YOK)
- [ ] Yayinla butonlari onay modali aciyor (canli siteyi etkiler)
- [ ] Liste row'lari tamamen tiklanabilir (ayri edit butonu YOK)

### Tailwind Kullanimi:
- [ ] Hicbir arbitrary value class kullanilmadi (`[...]` iceren class YOK)
- [ ] `after:`, `before:` pseudo-element arbitrary degerleri YOK
- [ ] Sabit boyutlar icin inline `style` kullanildi

### Teknik:
- [ ] Script yukleme sirasi dogru
- [ ] Custom sidebar/header YAZILMADI
- [ ] `wireframe.css` link edilmis
- [ ] `output.css` link edilmis

---

**Son Guncelleme:** 2026-02-26
