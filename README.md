# Legends DXP - HTML Wireframe Kit

**Amac:** Kod tabanli wireframe sistemi
**Stack:** HTML + Tailwind CSS + Alpine.js (minimal interaktivite)
**Yaklasim:** Low-fidelity wireframe -> High-fidelity toggle
**Live:** https://wireframes.untitledproduct.com/legends

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

## Tamamlanan Sayfalar

### Sprint 1 - Auth & Users
| Sayfa | Dosya | Durum |
|-------|-------|-------|
| Login Phone | sprint1/login-phone.html | Tamamlandi |
| Login OTP | sprint1/login-otp.html | Tamamlandi |
| Login Locked | sprint1/login-locked.html | Tamamlandi |
| User List | sprint1/user-list.html | Tamamlandi |
| User Form | sprint1/user-form.html | Tamamlandi |
| Layout Sidebar Open | sprint1/layout-sidebar-open.html | Tamamlandi |
| Layout Sidebar Collapsed | sprint1/layout-sidebar-collapsed.html | Tamamlandi |
| Layout Mobile | sprint1/layout-mobile.html | Tamamlandi |

### Sprint 2 - Ticketing & Add-ons
| Sayfa | Dosya | Durum |
|-------|-------|-------|
| Ticket List | admin/ticket-list.html | Tamamlandi |
| Ticket Form | admin/ticket-form.html | Tamamlandi |
| Addon List | admin/addon-list.html | Tamamlandi |
| Addon Form | admin/addon-form.html | Tamamlandi |
| Order Detail | admin/order-detail.html | Tamamlandi |
| Slot Calendar | admin/slot-calendar.html | Tamamlandi |
| Ticket Catalog (Public) | public/ticket-catalog.html | Tamamlandi |
| Addon Selection (Public) | public/addon-selection.html | Tamamlandi |
| School Form | public/forms/school-form.html | Tamamlandi |
| Agency Form | public/forms/agency-form.html | Tamamlandi |
| Ticket Request | public/forms/ticket-request.html | Tamamlandi |

---

## Notlar

- Pure Tailwind + custom components (shadcn/ui kullanmiyoruz)
- Wireframe mode toggle: Low-fi / High-fi gecisi
- Responsive test: Desktop, Tablet, Mobile
