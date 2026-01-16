/**
 * Wireframe Layout Components
 * Merkezi sidebar ve header component sistemi
 * Sprint bazlı menü görünürlüğü destekler
 */

// Modül tanımları - her modül bir sprint'e ait
const modules = {
  // Sprint 1 - IAM
  anasayfa: { id: 'anasayfa', icon: 'home', label: 'Anasayfa', href: '../sprint1/anasayfa.html', sprint: 1 },
  users: { id: 'users', icon: 'app-window-user', label: 'Kullanicilar', href: '../sprint1/user-list.html', sprint: 1 },

  // Sprint 2 - Ticketing
  tickets: { id: 'tickets', icon: 'coupon-cut', label: 'Biletler', href: '../admin/ticket-list.html', sprint: 2 },
  addons: { id: 'addons', icon: 'add-sign-bold', label: 'Eklentiler', href: '../admin/addon-list.html', sprint: 2 },
  orders: { id: 'orders', icon: 'shop-cart', label: 'Siparisler', href: '../admin/order-detail.html', sprint: 2 },
  slots: { id: 'slots', icon: 'calendar-grid', label: 'Slot Takvimi', href: '../admin/slot-calendar.html', sprint: 2 },

  // Sprint 3 - Campaign
  campaigns: { id: 'campaigns', icon: 'discount-percent-bubble', label: 'Kampanyalar', href: '../sprint3/campaign-list.html', sprint: 3 },
  coupons: { id: 'coupons', icon: 'coupon-percent', label: 'Kuponlar', href: '../sprint3/coupon-list.html', sprint: 3 },
};

// Sayfa konfigürasyonları
const pageConfigs = {
  // Sprint 1 - IAM
  'anasayfa': { activeItem: 'anasayfa', breadcrumb: ['Anasayfa'] },
  'user-list': { activeItem: 'users', breadcrumb: ['Anasayfa', 'Kullanicilar'] },
  'user-list-v2': { activeItem: 'users', breadcrumb: ['Anasayfa', 'Editorler'] },
  'user-form': { activeItem: 'users', breadcrumb: ['Anasayfa', 'Kullanicilar', 'Duzenle'] },
  'user-form-v2': { activeItem: 'users', breadcrumb: ['Anasayfa', 'Editorler', 'Ekle'] },
  'layout-sidebar-open': { activeItem: 'anasayfa', breadcrumb: ['Anasayfa'] },
  'layout-sidebar-collapsed': { activeItem: 'anasayfa', breadcrumb: ['Anasayfa'] },
  'layout-mobile': { activeItem: 'anasayfa', breadcrumb: ['Anasayfa'] },

  // Sprint 2 - Ticketing (Admin)
  'ticket-list': { activeItem: 'tickets', breadcrumb: ['Anasayfa', 'Biletler'] },
  'ticket-form': { activeItem: 'tickets', breadcrumb: ['Anasayfa', 'Biletler', 'Duzenle'] },
  'addon-list': { activeItem: 'addons', breadcrumb: ['Anasayfa', 'Eklentiler'] },
  'addon-form': { activeItem: 'addons', breadcrumb: ['Anasayfa', 'Eklentiler', 'Duzenle'] },
  'order-detail': { activeItem: 'orders', breadcrumb: ['Anasayfa', 'Siparisler', 'Detay'] },
  'slot-calendar': { activeItem: 'slots', breadcrumb: ['Anasayfa', 'Slot Takvimi'] },

  // Sprint 3 - Campaign
  'campaign-list': { activeItem: 'campaigns', breadcrumb: ['Anasayfa', 'Kampanyalar'] },
  'campaign-wizard': { activeItem: 'campaigns', breadcrumb: ['Anasayfa', 'Kampanyalar', 'Yeni'] },
  'coupon-list': { activeItem: 'coupons', breadcrumb: ['Anasayfa', 'Kuponlar'] },
  'campaign-dashboard': { activeItem: 'campaigns', breadcrumb: ['Anasayfa', 'Kampanyalar', 'Raporlar'] },
};

// Sprint bazlı sidebar menü oluştur
function buildSidebar(currentSprint) {
  const items = [];

  // Her zaman Anasayfa
  items.push(modules.anasayfa);

  // Sprint 1 modülleri
  if (currentSprint >= 1) {
    items.push({ type: 'divider' });
    items.push(modules.users);
  }

  // Sprint 2 modülleri
  if (currentSprint >= 2) {
    items.push({ type: 'divider' });
    items.push(modules.tickets);
    items.push(modules.addons);
    items.push(modules.orders);
    items.push(modules.slots);
  }

  // Sprint 3 modülleri
  if (currentSprint >= 3) {
    items.push({ type: 'divider' });
    items.push(modules.campaigns);
    items.push(modules.coupons);
  }

  return items;
}

class WireframeLayout {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.config = this.getLayoutConfig();
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
    const filename = path.split('/').pop().replace('.html', '');

    // Sprint belirleme - path bazlı
    let sprint = 3; // Default: tüm modüller görünür
    if (path.includes('/sprint1/')) sprint = 1;
    else if (path.includes('/sprint2/') || path.includes('/admin/')) sprint = 2;
    else if (path.includes('/sprint3/')) sprint = 3;

    // URL param override (?sprint=1, ?sprint=2, ?sprint=sprint3)
    const urlParams = new URLSearchParams(window.location.search);
    const sprintParam = urlParams.get('sprint');
    if (sprintParam) {
      const parsed = parseInt(sprintParam.replace('sprint', ''));
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
        sprint = parsed;
      }
    }

    return { path, filename, sprint };
  }

  getLayoutConfig() {
    const config = pageConfigs[this.currentPage.filename];
    if (!config) return null;

    // Sprint bazlı sidebar oluştur
    return {
      ...config,
      sidebar: buildSidebar(this.currentPage.sprint)
    };
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

    // İkonları yeniden işle
    requestAnimationFrame(() => {
      if (window.wireframeIcons) {
        window.wireframeIcons.init();
      }
    });
  }

  renderSidebar() {
    const items = this.config.sidebar;
    const activeItem = this.config.activeItem;
    const currentSprint = this.currentPage.sprint;

    // Linklere sprint param ekle
    const addSprintParam = (href) => {
      const url = new URL(href, window.location.href);
      url.searchParams.set('sprint', currentSprint);
      // Relative path döndür
      return href + (href.includes('?') ? '&' : '?') + 'sprint=' + currentSprint;
    };

    let navItems = '';
    items.forEach(item => {
      if (item.type === 'divider') {
        navItems += '<div class="border-t border-gray-300 my-2 mx-3"></div>';
      } else {
        const isActive = item.id === activeItem;
        const href = addSprintParam(item.href);
        navItems += `
          <a href="${href}" class="wf-sidebar-item${isActive ? ' active' : ''}" :class="{ 'justify-center': !sidebarOpen }">
            <span class="wf-icon" data-icon="${item.icon}" data-size="20"></span>
            <span x-show="sidebarOpen">${item.label}</span>
          </a>
        `;
      }
    });

    return `
    <aside class="wf-sidebar hidden lg:flex" :class="{ 'w-56': sidebarOpen, 'w-16': !sidebarOpen }">
      <!-- Logo + Collapse -->
      <div class="p-4 border-b-2 border-gray-300 flex items-center" :class="{ 'justify-between': sidebarOpen, 'flex-col gap-2': !sidebarOpen }">
        <div class="flex items-center gap-2" x-show="sidebarOpen">
          <div class="w-6 h-6 border-2 border-current"></div>
          <span class="font-medium">Legends DXP</span>
        </div>
        <div class="w-6 h-6 border-2 border-current" x-show="!sidebarOpen"></div>
        <button @click="sidebarOpen = !sidebarOpen" class="wf-btn py-1 px-2 text-sm">
          <span x-text="sidebarOpen ? '<<' : '>>'"></span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 overflow-y-auto">
        ${navItems}
      </nav>

      <!-- User -->
      <div class="p-4 border-t-2 border-gray-300">
        <div class="flex items-center gap-3" x-show="sidebarOpen">
          <div class="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center text-sm">AY</div>
          <div>
            <p class="font-medium text-sm">Admin User</p>
            <p class="text-xs text-gray-500">admin@legends.com</p>
          </div>
        </div>
        <div class="flex justify-center" x-show="!sidebarOpen">
          <div class="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs">AY</div>
        </div>
      </div>
    </aside>
    `;
  }

  renderHeader() {
    const { breadcrumb } = this.config;
    const currentSprint = this.currentPage.sprint;

    // Breadcrumb HTML
    let breadcrumbHtml = '';
    if (breadcrumb && breadcrumb.length > 0) {
      breadcrumb.forEach((item, index) => {
        if (index < breadcrumb.length - 1) {
          breadcrumbHtml += `<a href="#" class="text-gray-500 hover:text-gray-700">${item}</a>`;
          breadcrumbHtml += '<span class="text-gray-400">/</span>';
        } else {
          breadcrumbHtml += `<span class="font-medium">${item}</span>`;
        }
      });
    }

    return `
    <header class="wf-header sticky top-0 z-30">
      <!-- Mobile Menu Toggle -->
      <button @click="mobileMenu = !mobileMenu" class="lg:hidden p-2 -ml-2 border-2 border-gray-400">
        <span class="wf-icon" data-icon="menu-navigation-2" data-size="20"></span>
      </button>

      <!-- Breadcrumb -->
      <div class="hidden sm:flex items-center gap-2 text-base">
        ${breadcrumbHtml}
        <span class="ml-2 px-2 py-0.5 text-xs border border-gray-400 rounded">Sprint ${currentSprint}</span>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-4">
        <!-- Back to Home -->
        <a href="../../../index.html" class="wf-btn text-sm py-1">
          ← Ana Sayfa
        </a>

        <!-- Notifications -->
        <button class="relative p-2 border-2 border-gray-400">
          <span class="wf-icon" data-icon="alert-alarm-bell" data-size="20"></span>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"></span>
        </button>

        <!-- User Avatar -->
        <div class="w-8 h-8 border-2 border-gray-500 flex items-center justify-center text-sm">AY</div>
      </div>
    </header>
    `;
  }
}

// Auto-init
window.wireframeLayout = new WireframeLayout();
