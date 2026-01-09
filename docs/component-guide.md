# Wireframe Kit Component Guide

Bu dokuman, Legends DXP wireframe kit'indeki component'lerin dogru kullanimi icin bir referans kilavuzudur.

## Icindekiler

1. [Badge'ler](#badgeler)
2. [Button'lar](#buttonlar)
3. [Form Element'leri](#form-elementleri)
4. [Layout Pattern'leri](#layout-patternleri)
5. [Responsive Kurallar](#responsive-kurallar)
6. [Yeni Sayfa Olusturma](#yeni-sayfa-olusturma)

---

## Badge'ler

### Temel Badge'ler

| Class | Kullanim | Renk |
|-------|----------|------|
| `.wf-badge` | Default badge | Gri |
| `.wf-badge-primary` | Tema rengi | Theme color |
| `.wf-badge-success` | Basari/Aktif | Yesil |
| `.wf-badge-warning` | Uyari | Sari |
| `.wf-badge-error` | Hata/Pasif | Kirmizi |

### Kategori Badge'leri

| Class | Kullanim | Renk |
|-------|----------|------|
| `.wf-badge-combo` | Combo biletler | Pembe |
| `.wf-badge-slot` | Slot bazli biletler | Turuncu |
| `.wf-badge-parking` | Otopark | Mavi |
| `.wf-badge-locker` | Dolap | Cyan |
| `.wf-badge-equipment` | Ekipman kiralama | Turuncu |
| `.wf-badge-fnb` | Yiyecek & Icecek | Kirmizi |
| `.wf-badge-experience` | Deneyim | Mor |
| `.wf-badge-seasonal` | Sezonluk | Mor |
| `.wf-badge-group` | Grup biletleri | Yesil |

### Ornek Kullanim

```html
<span class="wf-badge wf-badge-success">Aktif</span>
<span class="wf-badge wf-badge-error">Pasif</span>
<span class="wf-badge wf-badge-slot text-xs">Slot</span>
```

---

## Button'lar

### Button Variant'lari

| Class | Kullanim | Renk |
|-------|----------|------|
| `.wf-btn` | Default button | Beyaz/Gri border |
| `.wf-btn-primary` | Ana aksiyon | Theme color |
| `.wf-btn-danger` | Tehlikeli islem (Sil, Iptal) | Kirmizi |
| `.wf-btn-warning` | Dikkat gerektiren (Iade) | Turuncu |
| `.wf-btn-info` | Bilgi/Duzenle | Mavi |

### Ornek Kullanim

```html
<button class="wf-btn">Varsayilan</button>
<button class="wf-btn wf-btn-primary">Kaydet</button>
<button class="wf-btn wf-btn-danger">Sil</button>
<button class="wf-btn wf-btn-warning">Iade Baslat</button>
<button class="wf-btn wf-btn-info">Duzenle</button>
```

### Full Width Button

```html
<button class="wf-btn wf-btn-primary w-full justify-center">
  Tam Genislik
</button>
```

---

## Form Element'leri

### Input & Select

```html
<input type="text" class="wf-input" placeholder="Placeholder text">
<select class="wf-select">
  <option>Secin...</option>
</select>
<textarea class="wf-textarea" rows="3"></textarea>
```

### Checkbox & Radio

```html
<input type="checkbox" class="wf-checkbox">
<input type="radio" class="wf-radio" name="group">
```

### Form Group

```html
<div class="wf-form-group">
  <label class="block text-sm font-medium mb-1">Label *</label>
  <input type="text" class="wf-input" required>
  <p class="wf-form-help">Yardimci metin</p>
</div>
```

### Fieldset

```html
<fieldset class="wf-fieldset">
  <legend class="wf-fieldset-legend">Bolum Basligi</legend>
  <!-- Form icerigi -->
</fieldset>
```

---

## Layout Pattern'leri

### Admin Sidebar Layout

Tum admin sayfalarinda kullanilan standart layout:

```html
<body class="min-h-screen wireframe-page" x-data="{ sidebarOpen: true, mobileMenu: false }">
  <div class="flex min-h-screen">
    <!-- Desktop Sidebar -->
    <aside class="wf-sidebar hidden lg:flex" :class="{ 'w-56': sidebarOpen, 'w-16': !sidebarOpen }">
      <!-- Sidebar icerigi -->
    </aside>

    <!-- Mobile Menu Overlay -->
    <div x-show="mobileMenu" class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" @click="mobileMenu = false"></div>

    <!-- Mobile Sidebar -->
    <aside x-show="mobileMenu" class="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 border-r-2 border-gray-300 flex flex-col lg:hidden">
      <!-- Mobile sidebar icerigi -->
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <header class="wf-header sticky top-0 z-30">
        <!-- Mobile toggle -->
        <button @click="mobileMenu = !mobileMenu" class="lg:hidden p-2 -ml-2 border-2 border-gray-400">
          <span class="text-lg">=</span>
        </button>
        <!-- Header icerigi -->
      </header>
      <main class="p-4 sm:p-6 flex-1">
        <!-- Sayfa icerigi -->
      </main>
    </div>
  </div>
</body>
```

### Alpine.js State Naming

| State | Kullanim |
|-------|----------|
| `sidebarOpen` | Desktop sidebar acik/kapali |
| `mobileMenu` | Mobile menu acik/kapali |

**ONEMLI:** Tum sayfalarda ayni state isimlerini kullanin!

---

## Responsive Kurallar

### Breakpoint'ler

| Breakpoint | Genislik | Kullanim |
|------------|----------|----------|
| Default | < 640px | Mobil |
| `sm:` | >= 640px | Kucuk tablet |
| `lg:` | >= 1024px | Desktop |

**Not:** `md:` ve `xl:` kullanilmiyor. Tutarlilik icin sadece `sm:` ve `lg:` kullanin.

### Grid Responsive Pattern

```html
<!-- Yanlis -->
<div class="grid grid-cols-2 gap-4">

<!-- Dogru -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

### Table Responsive Pattern

Desktop'ta table, mobilde card gorunumu:

```html
<!-- Desktop Table -->
<div class="hidden sm:block">
  <table class="wf-table">
    <!-- Table icerigi -->
  </table>
</div>

<!-- Mobile Cards -->
<div class="sm:hidden space-y-3">
  <div class="wf-card">
    <!-- Card icerigi -->
  </div>
</div>
```

### Sidebar Responsive Pattern

```html
<!-- Desktop: gizli lg'de gorunur -->
<aside class="wf-sidebar hidden lg:flex">

<!-- Mobile toggle: lg'de gizli -->
<button class="lg:hidden">

<!-- Breadcrumb: mobilde gizli -->
<nav class="hidden sm:flex">
```

### Spacing Responsive

```html
<!-- Padding -->
<main class="p-4 sm:p-6">

<!-- Gap -->
<div class="gap-2 sm:gap-4">
```

---

## Yeni Sayfa Olusturma

### Admin Sayfasi Checklist

- [ ] `x-data="{ sidebarOpen: true, mobileMenu: false }"` ekle
- [ ] Desktop sidebar: `hidden lg:flex` class'i
- [ ] Mobile overlay: `z-40 lg:hidden`
- [ ] Mobile sidebar: `fixed ... z-50 lg:hidden`
- [ ] Mobile toggle button: `lg:hidden`
- [ ] Breadcrumb: `hidden sm:flex`
- [ ] Main padding: `p-4 sm:p-6`
- [ ] Grid'ler: `grid-cols-1 sm:grid-cols-2`
- [ ] Table pattern: Desktop table + Mobile cards

### Menu Item'lari (Standart Sira)

1. Dashboard (H)
2. Biletler (T)
3. Eklentiler (+)
4. Siparisler (S)
5. Slot Takvimi (C)
6. ---divider---
7. Kullanicilar (U)

### Sprint Link'leri

Ana sayfa link'lerinde sprint parametresi ekleyin:

```html
<a href="../../../index.html?sprint=sprint1">Ana Sayfa</a>
```

---

## Dosya Yapisi

```
wireframe-kit/
├── src/
│   ├── styles/
│   │   └── base.css          # Tum CSS component'leri
│   └── pages/
│       ├── sprint1/          # Sprint 1 sayfalari
│       │   ├── layout-*.html # Layout ornekleri
│       │   ├── login-*.html  # Auth sayfalari
│       │   └── user-*.html   # Kullanici yonetimi
│       ├── admin/            # Admin paneli sayfalari
│       │   ├── ticket-*.html
│       │   ├── addon-*.html
│       │   ├── order-*.html
│       │   └── slot-*.html
│       └── public/           # Public sayfalari
│           ├── ticket-catalog.html
│           ├── addon-selection.html
│           └── forms/
├── dist/
│   └── output.css            # Compiled CSS
└── docs/
    └── component-guide.md    # Bu dosya
```

---

## Versiyon Gecmisi

- **v1.0** - Ilk surum
  - 9 badge variant
  - 4 button variant (primary, danger, warning, info)
  - Responsive admin layout
  - Mobile drawer menu
  - Form component'leri
