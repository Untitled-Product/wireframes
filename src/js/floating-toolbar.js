/**
 * Wireframe Floating Toolbar
 * Alt ortada Figma tarzı floating action bar
 * Home, Yorum ve gelecek aksiyonlar için merkezi toolbar
 *
 * İkonlar: /icons/ klasöründeki SVG dosyaları kullanılır
 * İkon listesi: /icons/ICON-LIST.txt
 */

class WireframeToolbar {
  constructor() {
    this.themeColor = '#0d9488'; // Default teal
    this.iconsBasePath = this.getIconsBasePath();
    this.init();
  }

  init() {
    // Load Google Fonts
    this.loadFonts();
    this.createStyles();
    this.createToolbar();
  }

  getIconsBasePath() {
    const path = window.location.pathname;

    // Calculate relative path to icons folder based on current page location
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

  loadFonts() {
    if (!document.querySelector('link[href*="Indie+Flower"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap';
      document.head.appendChild(link);
    }
  }

  createStyles() {
    const style = document.createElement('style');
    style.id = 'wf-toolbar-styles';
    style.textContent = `
      /* ==================== FLOATING TOOLBAR ==================== */
      .wf-toolbar {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border: 2px solid #9CA3AF;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 8px;
        z-index: 9998;
        font-family: 'Indie Flower', cursive;
      }

      .wf-toolbar-btn {
        position: relative;
        width: 40px;
        height: 40px;
        border: 2px dashed transparent;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }

      .wf-toolbar-btn svg {
        width: 24px;
        height: 24px;
      }

      .wf-toolbar-btn svg path {
        fill: #0d9488;
        transition: fill 0.2s;
      }

      .wf-toolbar-btn:hover {
        border-color: #0d9488;
        background: #f0fdfa;
      }

      .wf-toolbar-btn:hover svg path {
        fill: #0f766e;
      }

      .wf-toolbar-btn.active {
        background: #0d9488;
        border-color: #0d9488;
        border-style: solid;
      }

      .wf-toolbar-btn.active svg path {
        fill: white;
      }

      .wf-toolbar-divider {
        width: 2px;
        height: 24px;
        background: #D1D5DB;
        margin: 0 4px;
      }

      .wf-toolbar-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #0d9488;
        color: white;
        font-size: 10px;
        font-weight: 600;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        font-family: 'Indie Flower', cursive;
      }

      /* Tooltip */
      .wf-toolbar-btn[data-tooltip]:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #111827;
        color: white;
        padding: 4px 10px;
        font-size: 13px;
        white-space: nowrap;
        margin-bottom: 8px;
        font-family: 'Indie Flower', cursive;
        border-radius: 0;
        z-index: 10000;
      }

      /* Hide toolbar on index page */
      body[data-page="index"] .wf-toolbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  async loadIcon(iconName) {
    const url = `${this.iconsBasePath}${iconName}--Streamline-Freehand.svg`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.warn(`Icon not found: ${iconName}`);
    }
    return '';
  }

  async createToolbar() {
    // Don't show on index page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      return;
    }

    // Remove existing toolbar if any
    const existing = document.getElementById('wf-toolbar');
    if (existing) existing.remove();

    const toolbar = document.createElement('div');
    toolbar.className = 'wf-toolbar';
    toolbar.id = 'wf-toolbar';

    // Calculate relative path to index.html
    const indexPath = this.getIndexPath();

    // Load icons
    const [homeIcon, chatIcon, listIcon] = await Promise.all([
      this.loadIcon('home'),
      this.loadIcon('conversation-chat'),
      this.loadIcon('task-list-clipboard-check')
    ]);

    // Home button
    const homeBtn = document.createElement('a');
    homeBtn.href = indexPath;
    homeBtn.className = 'wf-toolbar-btn';
    homeBtn.setAttribute('data-tooltip', 'Ana Sayfa');
    homeBtn.innerHTML = homeIcon;
    toolbar.appendChild(homeBtn);

    // Divider
    const divider1 = document.createElement('div');
    divider1.className = 'wf-toolbar-divider';
    toolbar.appendChild(divider1);

    // Comment button
    const commentBtn = document.createElement('button');
    commentBtn.className = 'wf-toolbar-btn';
    commentBtn.id = 'wf-toolbar-comment-btn';
    commentBtn.setAttribute('data-tooltip', 'Yorum Ekle');
    commentBtn.innerHTML = chatIcon;
    commentBtn.addEventListener('click', () => this.toggleComments());
    toolbar.appendChild(commentBtn);

    // Comment badge (will be updated by comments.js)
    this.commentBadge = document.createElement('span');
    this.commentBadge.className = 'wf-toolbar-badge';
    this.commentBadge.style.display = 'none';
    this.commentBadge.id = 'wf-toolbar-comment-badge';
    commentBtn.appendChild(this.commentBadge);

    // Comment list button
    const listBtn = document.createElement('button');
    listBtn.className = 'wf-toolbar-btn';
    listBtn.id = 'wf-toolbar-list-btn';
    listBtn.setAttribute('data-tooltip', 'Tum Yorumlar');
    listBtn.innerHTML = listIcon;
    listBtn.addEventListener('click', () => this.showCommentList());
    toolbar.appendChild(listBtn);

    document.body.appendChild(toolbar);
  }

  getIndexPath() {
    const path = window.location.pathname;

    // Check path depth to calculate relative path
    if (path.includes('/src/pages/admin/')) {
      return '../../../index.html';
    } else if (path.includes('/src/pages/public/forms/')) {
      return '../../../../index.html';
    } else if (path.includes('/src/pages/public/')) {
      return '../../../index.html';
    } else if (path.includes('/src/pages/sprint1/')) {
      return '../../../index.html';
    } else if (path.includes('/src/components/')) {
      return '../../index.html';
    }
    return 'index.html';
  }

  toggleComments() {
    // Wait for comments.js to load
    if (window.wireframeComments) {
      window.wireframeComments.toggleCommentMode();
      this.updateCommentButtonState();
    } else {
      console.warn('WireframeComments not loaded yet');
    }
  }

  showCommentList() {
    if (window.wireframeComments) {
      window.wireframeComments.showPanel();
    }
  }

  updateCommentButtonState() {
    const btn = document.getElementById('wf-toolbar-comment-btn');
    if (btn && window.wireframeComments) {
      if (window.wireframeComments.commentMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  updateCommentBadge(count) {
    const badge = document.getElementById('wf-toolbar-comment-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.wireframeToolbar = new WireframeToolbar();
  });
} else {
  window.wireframeToolbar = new WireframeToolbar();
}
