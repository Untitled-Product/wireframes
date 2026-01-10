/**
 * Wireframe Icon Loader
 * Lokal SVG ikonlarını yükler ve cache'ler
 *
 * Kullanım:
 * <span class="wf-icon" data-icon="home"></span>
 * <span class="wf-icon" data-icon="conversation-chat" data-size="24"></span>
 *
 * İkon listesi: /icons/ICON-LIST.txt
 */

class WireframeIcons {
  constructor() {
    this.cache = new Map();
    this.basePath = this.getBasePath();
    this.init();
  }

  getBasePath() {
    const path = window.location.pathname;

    if (path.includes('/src/pages/admin/')) {
      return '../../../icons/';
    } else if (path.includes('/src/pages/public/forms/')) {
      return '../../../../icons/';
    } else if (path.includes('/src/pages/public/')) {
      return '../../../icons/';
    } else if (path.includes('/src/pages/sprint1/')) {
      return '../../../icons/';
    } else if (path.includes('/src/components/')) {
      return '../../icons/';
    }
    return 'icons/';
  }

  init() {
    // Process existing icons
    this.processIcons();

    // Watch for new icons added to DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('wf-icon')) {
              this.loadIcon(node);
            }
            const icons = node.querySelectorAll ? node.querySelectorAll('.wf-icon:not([data-loaded])') : [];
            icons.forEach(icon => this.loadIcon(icon));
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  processIcons() {
    document.querySelectorAll('.wf-icon:not([data-loaded])').forEach(icon => {
      this.loadIcon(icon);
    });
  }

  async loadIcon(element) {
    const iconName = element.dataset.icon;
    if (!iconName) return;

    const size = element.dataset.size || '24';

    element.setAttribute('data-loaded', 'true');

    let svg = this.cache.get(iconName);

    if (!svg) {
      try {
        const url = `${this.basePath}${iconName}--Streamline-Freehand.svg`;
        const response = await fetch(url);
        if (response.ok) {
          svg = await response.text();
          this.cache.set(iconName, svg);
        }
      } catch (e) {
        console.warn(`Icon not found: ${iconName}`);
        return;
      }
    }

    if (svg) {
      // Set width/height and remove any fill from SVG to allow CSS styling
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      if (svgEl) {
        svgEl.setAttribute('width', size);
        svgEl.setAttribute('height', size);
        svgEl.style.display = 'block';
        element.innerHTML = svgEl.outerHTML;
      }
    }
  }
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.wireframeIcons = new WireframeIcons();
  });
} else {
  window.wireframeIcons = new WireframeIcons();
}
