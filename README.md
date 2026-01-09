# Legends DXP - HTML Wireframe Kit

**Amac:** Frame0'a bagimli olmadan, kod tabanli wireframe sistemi
**Stack:** HTML + Tailwind CSS + Alpine.js (minimal interaktivite)
**Yaklasim:** Low-fidelity wireframe -> High-fidelity toggle

---

## Proje Yapisi

```
wireframe-kit/
├── index.html                    # Sayfa listesi (navigation hub)
├── package.json                  # Tailwind + dev server
├── tailwind.config.js            # Wireframe theme
├── src/
│   ├── styles/
│   │   ├── base.css              # Tailwind imports
│   │   ├── wireframe.css         # Low-fi overrides
│   │   └── tokens.css            # Radix renk tokenlari
│   ├── components/               # Yeniden kullanilabilir parcalar
│   │   ├── sidebar.html
│   │   ├── header.html
│   │   ├── table.html
│   │   ├── card.html
│   │   ├── form-elements.html
│   │   ├── modal.html
│   │   ├── badge.html
│   │   ├── button.html
│   │   └── calendar.html
│   └── pages/                    # Wireframe sayfalari
│       ├── admin/
│       │   ├── ticket-list.html
│       │   ├── ticket-form.html
│       │   ├── addon-list.html
│       │   ├── addon-form.html
│       │   ├── order-detail.html
│       │   └── slot-calendar.html
│       ├── public/
│       │   ├── ticket-catalog.html
│       │   ├── addon-selection.html
│       │   └── forms/
│       │       ├── school-form.html
│       │       ├── agency-form.html
│       │       └── ticket-request.html
│       └── modals/
│           ├── cancel-modal.html
│           ├── refund-modal.html
│           └── reschedule-modal.html
└── dist/                         # Build output
```

---

## Ozellikler

### 1. Wireframe Mode Toggle
- `[W]` tusuna bas -> Low-fi / High-fi gecisi
- Low-fi: Gri tonlar, dashed border, sketch font
- High-fi: Radix renkleri, normal gorunum

### 2. Responsive Preview
- Desktop (1280px)
- Tablet (768px)
- Mobile (375px)
- Keyboard shortcuts: `1`, `2`, `3`

### 3. Component Include Sistemi
- Alpine.js x-html directive ile
- Tek component degisince tum sayfalarda guncellenir

### 4. Dark Mode Toggle
- Wireframe'de bile test edilebilir

---

## Renk Sistemi (Radix Tokens)

### Primary
- `--teal-9`: #0d9488 (Primary actions)
- `--teal-10`: #0f766e (Hover)
- `--teal-12`: #134e4a (Text)

### Status
- `--mint-5`: #d1fae5 (Success bg)
- `--mint-11`: #059669 (Success text)
- `--amber-5`: #fef3c7 (Warning bg)
- `--amber-11`: #b45309 (Warning text)
- `--red-5`: #fee2e2 (Error bg)
- `--red-11`: #dc2626 (Error text)

### Bilet Tipleri
- Gunluk: `--indigo-4` / `--indigo-11`
- VIP: `--amber-4` / `--amber-11`
- Combo: `--pink-4` / `--crimson-11`
- Slot: `--orange-4` / `--orange-11`
- Grup: `--green-4` / `--green-11`
- Sezonluk: `--violet-4` / `--violet-11`

### Add-on Kategorileri
- Parking: `--blue-4` / `--blue-11`
- Locker: `--cyan-4` / `--cyan-11`
- Equipment: `--orange-4` / `--orange-11`
- F&B: `--red-4` / `--red-11`
- Experience: `--purple-4` / `--purple-11`

---

## Kurulum

```bash
cd wireframe-kit
npm install
npm run dev
```

Tarayicida: http://localhost:3000

---

## Kullanim

### Yeni Sayfa Ekleme
1. `src/pages/` altina yeni HTML dosyasi olustur
2. Layout component'larini include et
3. `index.html`'e link ekle

### Component Kullanimi
```html
<!-- Sidebar include -->
<div x-data x-html="await (await fetch('/src/components/sidebar.html')).text()"></div>

<!-- veya basit copy-paste ile -->
```

### Wireframe Mode
```html
<body class="wireframe"> <!-- Low-fi mode -->
<body>                   <!-- High-fi mode -->
```

---

## Frame0'dan Migrasyon

| Frame0 Sayfa | HTML Sayfa | Durum |
|--------------|------------|-------|
| S2-001-Ticket-List-Desktop | admin/ticket-list.html | Pending |
| S2-001-Ticket-List-Mobile | admin/ticket-list.html (responsive) | Pending |
| S2-002-Ticket-Form-Desktop | admin/ticket-form.html | Pending |
| S2-004-Addon-List-Desktop | admin/addon-list.html | Pending |
| S2-005-Addon-Form-Desktop | admin/addon-form.html | Pending |
| S2-007-Order-Detail | admin/order-detail.html | Pending |
| S2-011-Ticket-Catalog-Desktop | public/ticket-catalog.html | Pending |

---

## Sonraki Adimlar

1. [x] Proje yapisi olustur
2. [ ] Tailwind + Alpine.js kurulumu
3. [ ] Base styles ve tokens
4. [ ] Core components (sidebar, header, table, card)
5. [ ] Ilk sayfa: ticket-list.html
6. [ ] Wireframe toggle sistemi
7. [ ] Diger sayfalari migrate et

---

## Notlar

- shadcn/ui kullanmiyoruz (dependency overhead)
- Pure Tailwind + custom components
- Amac: Hizli iteration, kod ciktisi, responsive test
