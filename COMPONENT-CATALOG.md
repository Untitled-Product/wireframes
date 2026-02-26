# Wireframe Component Catalog

> Tum wf-* ve wf-v2-* component'lerin referans dokumani.
> V2 component'ler aktif kullanilmaktadir (Sprint A, Sprint C ve sonrasi).

---

## 1. BUTONLAR

### V2 Butonlar (Aktif)

| Class | Gorunum | Kullanim |
|-------|---------|----------|
| `wf-v2-btn` | Beyaz BG, 2px gri border, gri text, 8px/16px padding, rounded 8px | Standart outline buton |
| `wf-v2-btn wf-v2-btn-primary` | Indigo (#6366f1) BG, beyaz text, indigo border | Ana aksiyon (Kaydet, Olustur) |
| `wf-v2-btn wf-v2-btn-outline` | Transparent BG, gri border, gri text | Ikincil aksiyon |
| `wf-v2-btn wf-v2-btn-sm` | Kucuk padding | Satir ici aksiyonlar (tablo, liste) |
| `wf-v2-btn-icon` | Kompakt, sadece ikon | Filtre, kanal toggle |

```html
<button class="wf-v2-btn">Vazgec</button>
<button class="wf-v2-btn wf-v2-btn-primary">Kaydet</button>
<button class="wf-v2-btn bg-red-600 text-white border-red-600 hover:bg-red-700">Sil</button>
```

### V1 Butonlar (Eski Sprint'ler)

| Class | Gorunum |
|-------|---------|
| `wf-btn` | Sketch border, golge, hover translate efekti |
| `wf-btn wf-btn-primary` | Tema rengi acik BG |
| `wf-btn wf-btn-filled` | Koyu gri (#374151) BG, beyaz text |
| `wf-btn wf-btn-danger` | Kirmizi acik BG |
| `wf-btn wf-btn-warning` | Turuncu acik BG |
| `wf-btn wf-btn-info` | Mavi acik BG |

---

## 2. BADGE'LER

### V2 Badge'ler (Aktif)

| Class | Renk | Kullanim |
|-------|------|----------|
| `wf-v2-badge` | Baz class | Her zaman modifier ile |
| `wf-v2-badge-success` | Yesil text, acik yesil BG, yesil border | Aktif, Onaylandi |
| `wf-v2-badge-warning` | Turuncu text, acik turuncu BG | Beklemede |
| `wf-v2-badge-danger` | Kirmizi text, acik kirmizi BG | Hata, Engellendi |
| `wf-v2-badge-info` | Mavi text, acik mavi BG | Bilgi |
| `wf-v2-badge-gray` | Gri text, acik gri BG | Notr (Taslak vb.) |
| `wf-v2-badge-purple` | Mor text, acik mor BG | Tema vurgusu |

```html
<span class="wf-v2-badge wf-v2-badge-success">Aktif</span>
<span class="wf-v2-badge wf-v2-badge-gray">Taslak</span>
```

### V1 Badge'ler (Eski)

`wf-badge`, `wf-badge-primary`, `wf-badge-success`, `wf-badge-warning`, `wf-badge-error`, `wf-badge-info`
Ozel: `wf-badge-combo`, `wf-badge-slot`, `wf-badge-parking`, `wf-badge-locker`, `wf-badge-equipment`, `wf-badge-fnb`, `wf-badge-experience`, `wf-badge-seasonal`, `wf-badge-group`

---

## 3. INPUT & FORM KONTROLLERI

### V2 Input (Aktif)

| Class | Ozellikler |
|-------|-----------|
| `wf-v2-input` | Full width, 10px padding, beyaz BG, 2px gri border, rounded 8px |
| `select.wf-v2-input` | Ayni stil, dropdown |
| `textarea.wf-v2-input` | Ayni stil, resize destegi |

**Focus state:** Indigo border, acik indigo shadow

```html
<input type="text" class="wf-v2-input" placeholder="E-posta adresi">
<select class="wf-v2-input">
  <option>Secin...</option>
</select>
<textarea class="wf-v2-input" rows="3" placeholder="Aciklama..."></textarea>
```

### V1 Input (Eski)

| Class | Ozellikler |
|-------|-----------|
| `wf-input` | Full width, 8px padding, acik gri BG (#fafafa), ince border |
| `wf-select` | Chevron dropdown, acik gri BG |
| `wf-textarea` | Min-height 100px, acik gri BG |
| `wf-label` | Text #374151, 16px font |
| `wf-form-group` | 16px margin-bottom |
| `wf-form-error` | Kirmizi text, uyari ikonu |
| `wf-form-help` | Gri text, italik |

---

## 4. ARAMA

### V2 Arama (Aktif)

| Class | Kullanim |
|-------|----------|
| `wf-v2-search` | Wrapper div (relative) |
| `wf-v2-search-icon` | Sol taraftaki arama ikonu (absolute, gri) |
| `wf-v2-search-input` | Input (sol padding ikon icin) |

```html
<div class="wf-v2-search">
  <svg class="wf-v2-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
  <input type="text" placeholder="Ara..." class="wf-v2-search-input">
</div>
```

---

## 5. TOGGLE SWITCH

| Class | Kullanim |
|-------|----------|
| `wf-toggle` | Container label (inline-flex, cursor pointer) |
| `wf-toggle-input` | Hidden checkbox (sr-only) |
| `wf-toggle-slider` | 48x24px slider, gri BG, checked: yesil BG |
| `wf-toggle-label` | Opsiyonel yazi (sol margin 12px) |

```html
<label class="wf-toggle">
  <input type="checkbox" checked class="wf-toggle-input">
  <div class="wf-toggle-slider"></div>
</label>
```

**KRITIK:** Custom toggle YAZMA. Her zaman `wf-toggle` kullan.

---

## 6. CHECKBOX & RADIO

### Checkbox

| Class | Kullanim |
|-------|----------|
| `wf-checkbox` | Checkbox input |
| `wf-checkbox-label` | Flexbox label (gap, cursor pointer) |
| `wf-checkbox-group` | Dikey grup (column flex, gap 8px) |
| `wf-checkbox-group.horizontal` | Yatay grup (row flex, gap 16px) |

```html
<label class="wf-checkbox-label">
  <input type="checkbox" class="wf-checkbox">
  <span>Aktif Kayitlari Goster</span>
</label>
```

### Radio

| Class | Kullanim |
|-------|----------|
| `wf-radio` | Radio input (yuvarlak) |
| `wf-radio-label` | Flexbox label |
| `wf-radio-group` | Dikey grup |
| `wf-radio-group.horizontal` | Yatay grup |

---

## 7. TABLOLAR

### V2 Tablo (Aktif)

| Class | Ozellikler |
|-------|-----------|
| `wf-v2-table-wrapper` | 2px gri border, rounded 8px, overflow hidden |
| `wf-v2-table` | Full width, 14px font, separate collapse |
| `wf-v2-table thead th` | 12px padding, acik gri BG (#fafafa), 2px alt border |
| `wf-v2-table tbody td` | 12px padding, 2px acik border-bottom |
| `wf-v2-table tbody tr:hover` | Acik gri BG (#f9fafb) |
| `wf-v2-sort-arrow` | Siralama ok ikonu (14x14, opacity) |

```html
<div class="wf-v2-table-wrapper overflow-x-auto">
  <table class="wf-v2-table">
    <thead>
      <tr>
        <th>
          <div class="flex items-center gap-1 cursor-pointer">
            Baslik
            <svg class="wf-v2-sort-arrow">...</svg>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="cursor-pointer hover:bg-gray-50" @click="...">
        <td>Deger</td>
      </tr>
    </tbody>
  </table>
</div>
```

### V1 Tablo (Eski)

`wf-table` — sketch border, gri header BG, 12px padding, hover efekti.

---

## 8. MODAL & DIALOG

### V2 Modal (Aktif)

| Class | Ozellikler |
|-------|-----------|
| `wf-v2-modal` | Max-width 480px, beyaz BG, 2px gri border, rounded 12px, 24px padding |

```html
<div x-show="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="display: none;">
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/30" @click="modalOpen = false"></div>
  <!-- Modal -->
  <div class="wf-v2-modal relative z-10 w-full max-w-sm">
    <h3 class="text-base font-semibold text-gray-900 mb-2">Baslik</h3>
    <p class="text-sm text-gray-500 mb-5">Aciklama metni.</p>
    <div class="flex gap-3 justify-end">
      <button @click="modalOpen = false" class="wf-v2-btn">Vazgec</button>
      <button @click="modalOpen = false" class="wf-v2-btn wf-v2-btn-primary">Onayla</button>
    </div>
  </div>
</div>
```

### Silme Onay Modali (Zorunlu Pattern)

```html
<!-- x-data'ya ekle: deleteConfirmOpen: false, deleteTarget: null -->
<button @click.stop="deleteTarget = item; deleteConfirmOpen = true"
        class="wf-v2-btn wf-v2-btn-sm text-red-600">Sil</button>

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

### Yayinla Onay Modali (Zorunlu Pattern)

```html
<!-- x-data'ya ekle: publishConfirmOpen: false -->
<button @click="publishConfirmOpen = true" class="wf-v2-btn wf-v2-btn-primary">Yayinla</button>

<div x-show="publishConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="display: none;">
  <div class="fixed inset-0 bg-black/30" @click="publishConfirmOpen = false"></div>
  <div class="wf-v2-modal relative z-10 w-full max-w-sm text-center">
    <svg class="w-10 h-10 mx-auto mb-3 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
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

### V1 Modal (Eski)

`wf-modal-overlay`, `wf-modal`, `wf-modal-header`, `wf-modal-body`, `wf-modal-footer`

---

## 9. FILTRE DRAWER

### V2 Filter Drawer (Aktif)

| Class | Ozellikler |
|-------|-----------|
| `wf-v2-filter-drawer` | Fixed sag, 400px (max 90vw), beyaz BG, sol border, z-51, slide-in animasyon |
| `.open` modifier | translateX(0) — gorunur |

```html
<div x-show="filterDrawerOpen" class="fixed inset-0 z-50" style="display: none;">
  <div class="fixed inset-0 bg-black/30" @click="filterDrawerOpen = false"></div>
  <div class="wf-v2-filter-drawer" :class="{ 'open': filterDrawerOpen }">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h2 class="text-base font-semibold text-gray-900">Filtre</h2>
      <button @click="filterDrawerOpen = false">X</button>
    </div>
    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
      <!-- Filtre alanlari -->
    </div>
    <!-- Footer -->
    <div class="flex gap-3 px-6 py-4 border-t border-gray-200">
      <button class="wf-v2-btn flex-1">Temizle</button>
      <button class="wf-v2-btn wf-v2-btn-primary flex-1">Uygula</button>
    </div>
  </div>
</div>
```

---

## 10. SIDEBAR & HEADER

### V2 Sidebar (Aktif)

| Class | Ozellikler |
|-------|-----------|
| `wf-v2-sidebar` | Beyaz BG, 2px gri sag border, transition width 0.2s |
| `wf-v2-sidebar-item` | 8px/12px padding, flex gap 10px, 14px font, rounded 6px |
| `wf-v2-sidebar-item.active` | Yesil BG (#dcfce7), yesil text (#16a34a), weight 500 |
| `wf-v2-sidebar-item.group-active` | Yesil text |
| `wf-v2-sidebar-group` | Acilir/kapanir grup (Alpine.js x-data) |
| `wf-v2-sidebar-group-header` | Tiklanabilir, chevron rotate |
| `wf-v2-sidebar-nested` | 22px sol padding, 13px font |

**Sidebar asla custom yazilmaz, component kullanilir:**
```html
<div data-component="sidebar"></div>
```

### V2 Header (Aktif)

| Class | Ozellikler |
|-------|-----------|
| `wf-v2-header` | Sticky top, z-30, flex items-center, beyaz BG, 2px alt border |

**Header asla custom yazilmaz, component kullanilir:**
```html
<div data-component="header"></div>
```

---

## 11. SAG PANEL / DETAY KARTI (Collapsible Card)

Siparis-detay ve sayfa-builder'da kullanilan sag panel pattern'i:

```html
<!-- Kart container -->
<div class="border-2 border-gray-300 rounded-lg bg-white">
  <!-- Kart Header (tiklanabilir, daraltilabilir) -->
  <div class="px-6 py-4 border-b border-gray-200 cursor-pointer" @click="expanded = !expanded">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500"><!-- Ikon --></svg>
        <h2 class="text-base font-semibold text-gray-900">Kart Basligi</h2>
      </div>
      <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': !expanded }"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </div>
    <div class="text-xs text-gray-400 mt-0.5">Alt baslik</div>
  </div>

  <!-- Kart Icerik -->
  <div x-show="expanded" class="px-6 py-5 space-y-4">
    <!-- Alan: Label + Deger pattern -->
    <div>
      <p class="text-xs text-gray-500 mb-0.5">Alan Adi</p>
      <p class="text-sm font-medium text-gray-900">Deger</p>
    </div>
    <!-- Daha fazla alan... -->
  </div>
</div>
```

**Kullanim yerleri:**
- `siparis-detay.html` — Kullanici Bilgileri, Ziyaretci paneli
- `sayfa-builder.html` — Block Config paneli

---

## 12. EMPTY STATE

| Class | Kullanim |
|-------|----------|
| `wf-v2-empty-state` | Text-center container, 80px dikey padding |
| `wf-v2-empty-state-icon` | Ortalanmis gri ikon |

```html
<div class="wf-v2-empty-state">
  <div class="wf-v2-empty-state-icon">
    <svg class="w-8 h-8 text-gray-400">...</svg>
  </div>
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Kayit Bulunamadi</h3>
  <p class="text-sm text-gray-500 max-w-sm mx-auto">Aciklama metni.</p>
</div>
```

---

## 13. OZEL V2 COMPONENT'LER

### Copy Button

```html
<button class="wf-v2-copy-btn" title="Kopyala">
  <svg class="w-3.5 h-3.5">...</svg>
</button>
```

### Country Badge

```html
<span class="wf-v2-country-badge">TR</span>
<span class="wf-v2-country-badge" style="background: #dbeafe; color: #2563eb;">RU</span>
```

---

## 14. V1 GELISMIS COMPONENT'LER (Referans)

| Component | Class'lar | Kullanim |
|-----------|----------|----------|
| **Stepper** | `wf-stepper`, `wf-step`, `wf-step-number`, `wf-step.active/.completed` | Wizard adimlari |
| **Calendar** | `wf-calendar`, `wf-calendar-header`, `wf-calendar-days`, `wf-calendar-day` | Tarih secici |
| **Timeline** | `wf-timeline`, `wf-timeline-item`, `wf-timeline-dot` | Islem gecmisi |
| **Tabs** | `wf-tabs`, `wf-tab`, `wf-tab.active`, `wf-tab-content` | Sekme gecisleri |
| **Alerts** | `wf-alert`, `wf-alert-info/-success/-warning/-error` | Bildirim kutulari |
| **Number Input** | `wf-number-input`, `wf-number-btn`, `wf-number-value` | +/- sayisal giris |
| **Card** | `wf-card` | 2px sketch border, golge, 16px padding |

---

## 15. WIREFRAME.CSS EKLENEN YARDIMCI CLASS'LAR

output.css'te bulunmayan, wireframe.css'e eklenmis utility class'lar:

### Opacity & Hover

```css
.opacity-0 { opacity: 0; }
.opacity-100 { opacity: 1; }
.bg-black\/30 { background: rgba(0,0,0,0.3); }
.bg-black\/40 { background: rgba(0,0,0,0.4); }
.bg-black\/50 { background: rgba(0,0,0,0.5); }
.bg-white\/80 { background: rgba(255,255,255,0.8); }
.group:hover .group-hover\:opacity-100 { opacity: 1; }
.group:hover .group-hover\:text-gray-500 { color: #6b7280; }
.transition-opacity { transition: opacity 0.15s ease; }
```

### Responsive Grid (sm/md/lg/xl prefix'leri)

```css
@media (min-width: 640px)  { .sm\:grid-cols-2, -3, -4, -6 + .sm\:gap-6 }
@media (min-width: 768px)  { .md\:grid-cols-2, -3, -4 }
@media (min-width: 1024px) { .lg\:grid-cols-2, -3, -4, -5 }
@media (min-width: 1280px) { .xl\:grid-cols-4 }
```

**ONEMLI:** output.css responsive prefix icermiyor. Yeni responsive class gerekiyorsa wireframe.css'e ekle.

---

## 16. IKON SISTEMI

### V1 Wireframe Ikonlari (Streamline Freehand)

```html
<span class="wf-icon" data-icon="search-magnifier" data-size="16"></span>
```

Sik kullanilan: `search-magnifier`, `edit-pencil`, `delete-bin-2`, `add-sign-bold`, `alert-alarm-bell`, `upload-1`, `download-1`, `dashboard-layout`, `coupon-cut`, `shop-cart`, `calendar-grid`, `discount-badge`, `settings-gear`

### V2 Inline SVG Ikonlari

V2 sayfalarda dogrudan inline SVG kullanilir (wf-icon degil):
```html
<svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="..."/>
</svg>
```

---

## 17. TEMA & RENK SISTEMI

### CSS Degiskenleri

```css
:root {
  --theme-primary: #3b82f6;
  --theme-primary-light: #dbeafe;
  --theme-primary-dark: #1d4ed8;
}
```

### Tema Class'lari

`theme-blue`, `theme-teal`, `theme-purple`, `theme-orange`, `theme-pink`, `theme-green`

### V2 Sabit Renkler

- **Primary buton:** Indigo (#6366f1)
- **Sidebar active:** Yesil (#22c55e / #dcfce7)
- **Badge success:** Yesil (#16a34a)
- **Badge danger:** Kirmizi (#ef4444)

---

## 18. Z-INDEX KATMANLARI

| Katman | Z-Index | Kullanim |
|--------|---------|----------|
| Header | 30 | Sticky header |
| Modal/Overlay | 50 | Tum modaller |
| Filter Drawer | 51 | Modal ustunde |
| Tool Toolbar | 9000 | Wireframe toolbar |
| Tool Pins | 9100 | Yorum pinleri |
| Tool Panel | 9300 | Yorum paneli |
| Tool Overlay | 9400 | Yorum modu |

---

## 19. SAYFA YAPISI SABLONU (V2)

```html
<!DOCTYPE html>
<html lang="tr" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sayfa Adi - Legends DXP Admin</title>
  <!-- Font -->
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
  <!-- CSS -->
  <link rel="stylesheet" href="../../../dist/output.css">
  <link rel="stylesheet" href="../../wireframe/css/wireframe.css">
  <!-- JS -->
  <script src="../../wireframe/js/icons.js"></script>
  <script src="../../wireframe/js/layout-components-v2.js"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <!-- Theme -->
  <script>
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme') || 'teal';
    document.documentElement.classList.add('theme-' + theme);
  </script>
</head>
<body class="min-h-screen wireframe-page" x-data="{
  sidebarOpen: true,
  mobileMenu: false,
  deleteConfirmOpen: false,
  deleteTarget: null
}">
  <div class="flex min-h-screen">
    <div data-component="sidebar"></div>
    <div class="flex-1 flex flex-col min-w-0">
      <div data-component="header"></div>
      <main class="p-6 flex-1">
        <!-- Sayfa icerigi -->
      </main>
    </div>
  </div>

  <!-- Modaller buraya -->

  <!-- Tool scripts -->
  <script src="../../tool/js/tool-icons.js"></script>
  <script src="../../tool/js/toolbar.js"></script>
  <script src="../../tool/js/comments.js"></script>
</body>
</html>
```

---

## 20. ALPINE.JS PATTERN'LERI

| Pattern | State | Kullanim |
|---------|-------|----------|
| Sidebar toggle | `sidebarOpen: true` | `@click="sidebarOpen = !sidebarOpen"` |
| Mobile menu | `mobileMenu: false` | `@click="mobileMenu = !mobileMenu"` |
| Filter drawer | `filterDrawerOpen: false` | `@click="filterDrawerOpen = true"` |
| Modal | `modalOpen: false` | `@click="modalOpen = true"` |
| Silme onay | `deleteConfirmOpen: false` | `@click.stop="deleteConfirmOpen = true"` |
| Yayinla onay | `publishConfirmOpen: false` | `@click="publishConfirmOpen = true"` |
| Collapsible | `expanded: true` | `@click="expanded = !expanded"` + `x-show="expanded"` |
| Dil tab | `configLang: 'tr'` | `@click="configLang = lang"` + `x-show="configLang === 'tr'"` |

---

## 21. UX KURALLARI

1. **Silme butonlari** ASLA dogrudan silmez → onay modali acar
2. **Yayinla butonlari** ASLA dogrudan yayinlamaz → onay modali acar
3. **Liste row'lari** tamamen tiklanabilir → ayri "Duzenle" butonu YOK
4. **Sag detay paneli** → collapsible card pattern (siparis-detay ile tutarli)
5. **Toggle switch** → her zaman `wf-toggle` kullan (custom YAZMA)
6. **Badge** → her zaman `wf-v2-badge` kullan (custom YAZMA)
7. **Modal** → her zaman `wf-v2-modal` kullan (custom YAZMA)
8. **Tailwind arbitrary value** → KULLANMA (output.css derlemez)
9. **Responsive grid** → wireframe.css'teki class'lari kullan

---

*Son Guncelleme: 2026-02-26*
