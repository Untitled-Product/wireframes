/**
 * Tool Floating Toolbar
 * Modern/Minimal style floating action bar
 * Uses: tool.css styles with .tool-* prefix
 * Icons: /src/tool/icons/ (interface icons)
 */

class ToolToolbar {
  constructor() {
    this.versionDropdownOpen = false;

    // Version registry - page version information
    this.versionRegistry = {
      'login-phone': {
        versions: [
          {
            version: 'v1',
            file: 'login-phone.html',
            label: 'V1 - Orijinal',
            isDefault: true
          },
          {
            version: 'v2',
            file: 'login-phone-v2.html',
            label: 'V2 - CHG-001',
            changeId: 'CHG-001',
            changeNote: 'Platform Kullanim Sozlesmesi alt metni eklendi'
          }
        ]
      },
      'user-list': {
        versions: [
          {
            version: 'v1',
            file: 'user-list.html',
            label: 'V1 - Orijinal',
            isDefault: true
          },
          {
            version: 'v2',
            file: 'user-list-v2.html',
            label: 'V2 - K-002/K-003',
            changeId: 'K-003',
            changeNote: 'Hiyerarsi bazli editor listesi, yetki sayisi badge'
          }
        ]
      },
      'siparis-detay': {
        versions: [
          {
            version: 'v1',
            file: 'siparis-detay.html',
            label: 'V1 - Gunluk Bilet',
            isDefault: true
          },
          {
            version: 'v2',
            file: 'siparis-detay-v2.html',
            label: 'V2 - Family Card',
            changeNote: 'Family Card bilet tipi, Ziyaretci Bilgileri, sadece 3 kullanici alani'
          }
        ]
      },
      'kampanya-form': {
        versions: [
          {
            version: 'v1',
            file: 'kampanya-form.html',
            label: 'V1 - Orijinal',
            isDefault: true
          },
          {
            version: 'v2',
            file: 'kampanya-form.html',
            label: 'V2 - ClickUp Fixes',
            changeNote: 'ClickUp yorum duzeltmeleri'
          },
          {
            version: 'v3',
            file: 'kampanya-form-v3.html',
            label: 'V3 - Shopify Esitleme',
            changeNote: 'Shopify discount flow esitlemesi: Tip modal, method tab toggle, tip-bazli kartlar'
          }
        ]
      },
      'user-form': {
        versions: [
          {
            version: 'v1',
            file: 'user-form.html',
            label: 'V1 - Orijinal',
            isDefault: true
          },
          {
            version: 'v2',
            file: 'user-form-v2.html',
            label: 'V2 - K-002/K-003',
            changeId: 'K-002',
            changeNote: 'Granuler yetki checkbox grid, rol dropdown kaldirildi'
          }
        ]
      }
    };

    this.init();
  }

  init() {
    this.loadToolCSS();
    this.createToolbar();
  }

  getToolBasePath() {
    const path = window.location.pathname;

    // 4-level deep: src/pages/public/forms/
    if (path.includes('/src/pages/public/forms/')) return '../../../tool/';
    // 3-level deep: src/pages/X/ (sprint*, admin, public, diagrams)
    if (path.match(/\/src\/pages\/[^/]+\//)) return '../../tool/';
    // 2-level deep: src/components/
    if (path.includes('/src/components/')) return '../tool/';
    return 'src/tool/';
  }

  loadToolCSS() {
    // Load tool.css if not already loaded
    if (!document.querySelector('link[href*="tool.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.getToolBasePath() + 'css/tool.css';
      document.head.appendChild(link);
    }
  }

  createToolbar() {
    // Don't show on index page
    if (window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/')) {
      return;
    }

    // Remove existing toolbar if any
    const existing = document.getElementById('tool-toolbar');
    if (existing) existing.remove();

    const toolbar = document.createElement('div');
    toolbar.className = 'tool-toolbar';
    toolbar.id = 'tool-toolbar';

    // Calculate relative path to index.html
    const indexPath = this.getIndexPath();

    // Home button
    const homeBtn = document.createElement('a');
    homeBtn.href = indexPath;
    homeBtn.className = 'tool-btn tool-btn-icon';
    homeBtn.title = 'Ana Sayfa';
    homeBtn.innerHTML = `
      <span class="tool-icon" data-tool-icon="Home" data-size="20"></span>
    `;
    toolbar.appendChild(homeBtn);

    // Divider
    toolbar.appendChild(this.createDivider());

    // Version Selector (if versions exist for this page)
    const versionSelector = this.createVersionSelector();
    if (versionSelector) {
      toolbar.appendChild(versionSelector);
      toolbar.appendChild(this.createDivider());
    }

    // Comment button
    const commentBtn = document.createElement('button');
    commentBtn.className = 'tool-btn tool-btn-icon';
    commentBtn.id = 'tool-toolbar-comment-btn';
    commentBtn.title = 'Yorum Ekle';
    commentBtn.innerHTML = `
      <span class="tool-icon" data-tool-icon="Megaphone" data-size="20"></span>
    `;
    commentBtn.addEventListener('click', () => this.toggleComments());
    toolbar.appendChild(commentBtn);

    // Comment badge
    const badge = document.createElement('span');
    badge.className = 'tool-badge';
    badge.id = 'tool-toolbar-comment-badge';
    badge.style.display = 'none';
    commentBtn.classList.add('tool-btn-with-badge');
    commentBtn.appendChild(badge);

    // Comment list button
    const listBtn = document.createElement('button');
    listBtn.className = 'tool-btn tool-btn-icon';
    listBtn.id = 'tool-toolbar-list-btn';
    listBtn.title = 'Tum Yorumlar';
    listBtn.innerHTML = `
      <span class="tool-icon" data-tool-icon="Bullet List" data-size="20"></span>
    `;
    listBtn.addEventListener('click', () => this.showCommentList());
    toolbar.appendChild(listBtn);

    document.body.appendChild(toolbar);

    // Process tool icons after toolbar is added to DOM
    if (window.toolIcons) {
      window.toolIcons.processIcons();
    }
  }

  createDivider() {
    const divider = document.createElement('div');
    divider.className = 'tool-divider';
    return divider;
  }

  getIndexPath() {
    const path = window.location.pathname;

    // Dinamik: path'ten klasör adını çıkar, hash olarak kullan
    // src/pages/public/forms/ → 4 level deep, özel durum
    if (path.includes('/src/pages/public/forms/')) return '../../../../index.html';
    // src/components/ → 2 level deep
    if (path.includes('/src/components/')) return '../../index.html';

    // src/pages/X/ → klasör adını çıkar, hash yap
    const folderMatch = path.match(/\/src\/pages\/([^/]+)\//);
    if (folderMatch) {
      const folder = folderMatch[1]; // sprint1, sprint-a, admin, public, diagrams...
      return `../../../index.html#${folder}`;
    }

    return 'index.html';
  }

  toggleComments() {
    if (window.toolComments) {
      window.toolComments.toggleCommentMode();
      this.updateCommentButtonState();
    } else {
      console.warn('ToolComments not loaded yet');
    }
  }

  showCommentList() {
    if (window.toolComments) {
      window.toolComments.showPanel();
    }
  }

  updateCommentButtonState() {
    const btn = document.getElementById('tool-toolbar-comment-btn');
    if (btn && window.toolComments) {
      if (window.toolComments.commentMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  updateCommentBadge(count) {
    const badge = document.getElementById('tool-toolbar-comment-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  // ==================== VERSION SELECTOR ====================

  getCurrentPageInfo() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    let baseName = filename.replace('.html', '');

    // Check if this is a versioned file (e.g., login-phone-v2)
    const versionMatch = baseName.match(/^(.+)-v(\d+)$/);
    if (versionMatch) {
      return {
        baseName: versionMatch[1],
        currentVersion: `v${versionMatch[2]}`,
        filename: filename
      };
    }

    return {
      baseName: baseName,
      currentVersion: 'v1',
      filename: filename
    };
  }

  getPageVersions(baseName) {
    return this.versionRegistry[baseName] || null;
  }

  createVersionSelector() {
    const pageInfo = this.getCurrentPageInfo();
    const versionData = this.getPageVersions(pageInfo.baseName);

    if (!versionData || versionData.versions.length <= 1) {
      return null;
    }

    const container = document.createElement('div');
    container.className = 'tool-version-container';
    container.style.position = 'relative';

    const currentVersion = versionData.versions.find(v => v.version === pageInfo.currentVersion);
    const currentLabel = currentVersion ? currentVersion.label : pageInfo.currentVersion.toUpperCase();

    // Select element styled as tool-select
    const select = document.createElement('select');
    select.className = 'tool-select';
    select.style.minWidth = '140px';

    versionData.versions.forEach(ver => {
      const option = document.createElement('option');
      option.value = ver.file;
      option.textContent = ver.label;
      if (ver.version === pageInfo.currentVersion) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      this.navigateToVersion(e.target.value);
    });

    container.appendChild(select);
    return container;
  }

  navigateToVersion(filename) {
    const currentPath = window.location.pathname;
    const directory = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    window.location.href = directory + filename;
  }
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.toolToolbar = new ToolToolbar();
  });
} else {
  window.toolToolbar = new ToolToolbar();
}

// Backward compatibility
window.wireframeToolbar = window.toolToolbar;
