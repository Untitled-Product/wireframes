/**
 * Tool Icons Loader
 * Loads interface icons for Tool UI (toolbar, comments, etc.)
 *
 * Usage:
 *   <span class="tool-icon" data-tool-icon="Home" data-size="20"></span>
 *
 * Icon States:
 *   - Default: Line version (IconName-1.svg) - stroke based
 *   - Hover: Filled version (IconName.svg) - fill based
 *
 * Add data-hover="true" to enable hover state switching
 */

class ToolIcons {
  constructor() {
    this.basePath = this.getBasePath();
    this.cache = new Map();
    this.init();
  }

  getBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
      if (script.src && script.src.includes('tool-icons.js')) {
        return script.src.replace('js/tool-icons.js', 'icons/');
      }
    }
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    let prefix = '';
    for (let i = 0; i < depth; i++) {
      prefix += '../';
    }
    return prefix + 'src/tool/icons/';
  }

  async init() {
    await this.processIcons();
    this.observeDOM();
  }

  async processIcons() {
    const icons = document.querySelectorAll('.tool-icon[data-tool-icon]:not([data-loaded])');
    for (const iconEl of icons) {
      await this.loadIcon(iconEl);
    }
  }

  async loadIcon(iconEl) {
    const iconName = iconEl.getAttribute('data-tool-icon');
    const size = iconEl.getAttribute('data-size') || '20';

    if (!iconName) return;

    try {
      // Load LINE version first (IconName-1.svg)
      const lineIconName = iconName + '-1';
      let svgContent = await this.fetchSVG(lineIconName);

      // Fallback to filled if line version doesn't exist
      if (!svgContent) {
        svgContent = await this.fetchSVG(iconName);
      }

      if (svgContent) {
        const svg = this.parseSVG(svgContent, size);
        if (svg) {
          svg.classList.add('tool-icon-svg');
          iconEl.innerHTML = '';
          iconEl.appendChild(svg);
          iconEl.setAttribute('data-loaded', 'true');
        }
      }
    } catch (error) {
      console.warn(`Tool Icons: Failed to load "${iconName}"`, error);
      iconEl.textContent = '?';
      iconEl.setAttribute('data-loaded', 'error');
    }
  }

  parseSVG(svgContent, size) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (svg) {
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      if (!svg.getAttribute('viewBox')) {
        svg.setAttribute('viewBox', '0 0 24 24');
      }
    }
    return svg;
  }

  async fetchSVG(iconName) {
    if (this.cache.has(iconName)) {
      return this.cache.get(iconName);
    }

    const url = this.basePath + encodeURIComponent(iconName) + '.svg';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      const content = await response.text();
      this.cache.set(iconName, content);
      return content;
    } catch (error) {
      return null;
    }
  }

  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      let hasNewIcons = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList?.contains('tool-icon') && node.hasAttribute('data-tool-icon')) {
                hasNewIcons = true;
              }
              if (node.querySelectorAll) {
                const icons = node.querySelectorAll('.tool-icon[data-tool-icon]:not([data-loaded])');
                if (icons.length > 0) hasNewIcons = true;
              }
            }
          }
        }
      }
      if (hasNewIcons) this.processIcons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.toolIcons = new ToolIcons();
  });
} else {
  window.toolIcons = new ToolIcons();
}
