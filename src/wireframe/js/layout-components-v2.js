/**
 * Wireframe Layout Components V2
 * Figma tasarimiyla birebir eslesen sidebar ve header
 * Gruplu/expandable sidebar, sade breadcrumb header
 * Sprint A ve sonrasi sayfalar icin
 */

// V2 Menu yapisi - Figma'dan birebir
const menuItems = [
  { id: 'dashboard', icon: 'home', label: 'Dashboard', href: '#' },
  { id: 'kullanicilar', icon: 'app-window-user', label: 'Kullanicilar', href: '#' },
  { id: 'temaParkUrunleri', icon: 'coupon-cut', label: 'Tema Park Urunleri', href: '#', hasChevron: true },
  { id: 'kampanyalar', icon: 'discount-percent-bubble', label: 'Kampanyalar', href: '#', hasChevron: true },
  { id: 'eklentiler', icon: 'add-sign-bold', label: 'Eklentiler', href: '#', hasChevron: true },
  {
    id: 'siparisler',
    icon: 'shop-cart',
    label: 'Siparisler',
    type: 'group',
    children: [
      { id: 'temaParkSiparisleri', label: 'Tema Park Siparisleri', href: 'siparis-listesi.html', folder: 'sprint-a' },
      { id: 'kampanyaSepetAyarlari', label: 'Kampanya Sepet Ayarlari', href: '#' }
    ]
  },
  { id: 'iptalIade', icon: 'remove-delete-sign-bold', label: 'Iptal/Iade Formlari', href: 'iptal-iade-listesi.html', folder: 'sprint-a', hasChevron: true },
  {
    id: 'cms',
    icon: 'content-paper-edit',
    label: 'Content Management',
    type: 'group',
    children: [
      { id: 'cmsSayfalar', label: 'Sayfalar', href: 'sayfa-listesi.html', folder: 'sprint-c' },
      { id: 'cmsBannerlar', label: 'Bannerlar', href: 'banner-listesi.html', folder: 'sprint-c' },
      { id: 'cmsMedya', label: 'Medya Kutuphanesi', href: 'medya-kutuphanesi.html', folder: 'sprint-c' },
      { id: 'cmsMenuler', label: 'Menuler', href: 'menu-yonetimi.html', folder: 'sprint-c' },
      { id: 'cmsFaq', label: 'FAQ', href: 'faq-listesi.html', folder: 'sprint-c' },
      { id: 'cmsKoleksiyonlar', label: 'Koleksiyonlar', href: 'koleksiyon-listesi.html', folder: 'sprint-c' },
      { id: 'cmsEtkinlikTakvimi', label: 'Etkinlik Takvimi', href: 'etkinlik-takvimi.html', folder: 'sprint-c' },
      { id: 'cmsSiteAyarlari', label: 'Site Ayarlari', href: 'site-ayarlari.html', folder: 'sprint-c' }
    ]
  },
  { type: 'divider' },
  { id: 'entegrasyonlar', icon: 'arrow-data-transfer-vertical', label: 'Entegrasyonlar', href: '#', hasChevron: true },
  { id: 'loglar', icon: 'content-paper-edit', label: 'Loglar', href: '#', hasChevron: true },
  { id: 'ayarlar', icon: 'settings-gear', label: 'Ayarlar', href: '#', hasChevron: true }
];

// V2 Sayfa konfigurasyonlari
const pageConfigsV2 = {
  'siparis-listesi': {
    activeItem: 'temaParkSiparisleri',
    parentGroup: 'siparisler',
    breadcrumb: ['Siparisler', 'Tema Park Siparisleri']
  },
  'siparis-detay': {
    activeItem: 'temaParkSiparisleri',
    parentGroup: 'siparisler',
    breadcrumb: ['Siparisler', 'Tema Park Siparisleri', 'PNR-2026-ABC123']
  },
  'siparis-detay-v2': {
    activeItem: 'temaParkSiparisleri',
    parentGroup: 'siparisler',
    breadcrumb: ['Siparisler', 'Tema Park Siparisleri', 'PNR-2026-ABC123']
  },
  'iptal-iade-listesi': {
    activeItem: 'iptalIade',
    parentGroup: null,
    breadcrumb: ['Iptal/Iade Formlari']
  },
  'iptal-iade-detay': {
    activeItem: 'iptalIade',
    parentGroup: null,
    breadcrumb: ['Iptal Iade Formlari', 'PNR-2026-ABC123']
  },
  // Sprint C - CMS Pages
  'sayfa-listesi': {
    activeItem: 'cmsSayfalar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Sayfalar']
  },
  'sayfa-builder': {
    activeItem: 'cmsSayfalar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Sayfalar', 'Ana Sayfa']
  },
  'medya-kutuphanesi': {
    activeItem: 'cmsMedya',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Medya Kutuphanesi']
  },
  'icerik-editoru': {
    activeItem: 'cmsSayfalar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Sayfalar', 'Icerik Editoru']
  },
  'banner-listesi': {
    activeItem: 'cmsBannerlar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Bannerlar']
  },
  'banner-form': {
    activeItem: 'cmsBannerlar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Bannerlar', 'Hero Banner']
  },
  'menu-yonetimi': {
    activeItem: 'cmsMenuler',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Menuler']
  },
  'site-ayarlari': {
    activeItem: 'cmsSiteAyarlari',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Site Ayarlari']
  },
  'faq-listesi': {
    activeItem: 'cmsFaq',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'FAQ']
  },
  'faq-form': {
    activeItem: 'cmsFaq',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'FAQ', 'Soru Duzenle']
  },
  'cms-dashboard': {
    activeItem: 'cms',
    parentGroup: null,
    breadcrumb: ['Content Management', 'Dashboard']
  },
  'etkinlik-takvimi': {
    activeItem: 'cmsEtkinlikTakvimi',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Etkinlik Takvimi']
  },
  'etkinlik-zamanlama': {
    activeItem: 'cmsEtkinlikTakvimi',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Etkinlik Takvimi', 'Zamanlama']
  },
  'onizleme': {
    activeItem: 'cmsSayfalar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Onizleme']
  },
  'koleksiyon-listesi': {
    activeItem: 'cmsKoleksiyonlar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Koleksiyonlar']
  },
  'koleksiyon-form': {
    activeItem: 'cmsKoleksiyonlar',
    parentGroup: 'cms',
    breadcrumb: ['Content Management', 'Koleksiyonlar', 'Koleksiyon Duzenle']
  }
};

class WireframeLayoutV2 {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.config = pageConfigsV2[this.currentPage.filename] || null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.render());
    } else {
      this.render();
    }
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const filename = parts.pop().replace('.html', '');
    // Detect sprint folder (e.g. 'sprint-a', 'sprint-c')
    const folder = parts.pop() || '';
    return { path, filename, folder };
  }

  resolveHref(href, targetFolder) {
    if (!href || href === '#') return '#';
    if (!targetFolder) return href;
    const currentFolder = this.currentPage.folder;
    if (currentFolder === targetFolder) return href;
    // Cross-sprint link: go up one level then into target folder
    return '../' + targetFolder + '/' + href;
  }

  render() {
    if (!this.config) return;

    const sidebarPlaceholder = document.querySelector('[data-component="sidebar"]');
    const headerPlaceholder = document.querySelector('[data-component="header"]');

    if (sidebarPlaceholder) {
      sidebarPlaceholder.outerHTML = this.renderSidebar();
    }

    if (headerPlaceholder) {
      headerPlaceholder.outerHTML = this.renderHeader();
    }

    // Ikonlari yeniden isle
    requestAnimationFrame(() => {
      if (window.wireframeIcons) {
        window.wireframeIcons.init();
      }
    });
  }

  renderSidebar() {
    const activeItem = this.config.activeItem;
    const parentGroup = this.config.parentGroup;

    let navItems = '';
    menuItems.forEach(item => {
      if (item.type === 'divider') {
        navItems += '<div class="border-t border-gray-300 my-2 mx-4"></div>';
        return;
      }

      if (item.type === 'group') {
        // Expandable group
        const isGroupActive = item.children.some(child => child.id === activeItem);
        const groupOpenState = parentGroup === item.id ? 'true' : 'false';

        navItems += `
          <div class="wf-v2-sidebar-group" x-data="{ groupOpen: ${groupOpenState} }">
            <button @click="groupOpen = !groupOpen" class="wf-v2-sidebar-item wf-v2-sidebar-group-header${isGroupActive ? ' group-active' : ''}">
              <span class="wf-icon" data-icon="${item.icon}" data-size="18"></span>
              <span class="flex-1 text-left" x-show="sidebarOpen">${item.label}</span>
              <svg x-show="sidebarOpen" class="w-4 h-4 transition-transform" :class="{ 'rotate-90': groupOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <div x-show="groupOpen && sidebarOpen" x-collapse class="wf-v2-sidebar-group-items">
        `;

        item.children.forEach(child => {
          const isActive = child.id === activeItem;
          const resolvedHref = this.resolveHref(child.href, child.folder);
          navItems += `
              <a href="${resolvedHref}" class="wf-v2-sidebar-item wf-v2-sidebar-nested${isActive ? ' active' : ''}">
                <span class="w-[18px]"></span>
                <span>${child.label}</span>
              </a>
          `;
        });

        navItems += `
            </div>
          </div>
        `;
        return;
      }

      // Regular item
      const isActive = item.id === activeItem;
      const resolvedHref = this.resolveHref(item.href, item.folder);
      navItems += `
        <a href="${resolvedHref}" class="wf-v2-sidebar-item${isActive ? ' active' : ''}">
          <span class="wf-icon" data-icon="${item.icon}" data-size="18"></span>
          <span x-show="sidebarOpen">${item.label}</span>
          ${item.hasChevron ? '<svg x-show="sidebarOpen" class="w-4 h-4 ml-auto opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>' : ''}
        </a>
      `;
    });

    return `
    <aside class="wf-v2-sidebar hidden lg:flex" :class="{ 'w-60': sidebarOpen, 'w-16': !sidebarOpen }">
      <!-- Logo / Branding -->
      <div class="px-4 py-4 border-b border-gray-300 flex items-center gap-3" :class="{ 'justify-between': sidebarOpen, 'justify-center': !sidebarOpen }">
        <div class="flex items-center gap-3" x-show="sidebarOpen">
          <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <span class="font-semibold text-sm text-gray-900">The Land of Legends</span>
        </div>
        <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center" x-show="!sidebarOpen">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <button x-show="sidebarOpen" @click="sidebarOpen = !sidebarOpen" class="p-1 rounded hover:bg-gray-100 text-gray-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12l9-9 9 9"/></svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-3 overflow-y-auto px-3 space-y-0.5">
        ${navItems}
      </nav>

      <!-- User Section -->
      <div class="px-4 py-3 border-t border-gray-300">
        <div class="flex items-center gap-3" x-show="sidebarOpen">
          <div class="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">EK</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">Elif Kaya</p>
            <p class="text-xs text-gray-500 truncate">elif@thelandoflegends.com</p>
          </div>
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 10l5 5 5-5"/></svg>
        </div>
        <div class="flex justify-center" x-show="!sidebarOpen">
          <div class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">EK</div>
        </div>
      </div>
    </aside>
    `;
  }

  renderHeader() {
    const { breadcrumb } = this.config;

    // Breadcrumb HTML - ">" ile ayrilmis
    let breadcrumbHtml = '';
    if (breadcrumb && breadcrumb.length > 0) {
      breadcrumb.forEach((item, index) => {
        if (index < breadcrumb.length - 1) {
          breadcrumbHtml += `<span class="text-gray-400">${item}</span>`;
          breadcrumbHtml += '<span class="text-gray-300 mx-2">›</span>';
        } else {
          breadcrumbHtml += `<span class="font-medium text-gray-900">${item}</span>`;
        }
      });
    }

    return `
    <header class="wf-v2-header sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <!-- Sidebar Toggle -->
        <button @click="sidebarOpen = !sidebarOpen" class="hidden lg:flex p-1.5 rounded hover:bg-gray-100 text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
        </button>

        <!-- Mobile Menu Toggle -->
        <button @click="mobileMenu = !mobileMenu" class="lg:hidden p-1.5 rounded hover:bg-gray-100 text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>

        <!-- Breadcrumb -->
        <div class="flex items-center text-sm">
          ${breadcrumbHtml}
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center cursor-pointer">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </div>
      </div>
    </header>
    `;
  }
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.wireframeLayout = new WireframeLayoutV2();
  });
} else {
  window.wireframeLayout = new WireframeLayoutV2();
}
