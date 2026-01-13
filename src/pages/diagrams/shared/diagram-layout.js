/**
 * Diagram Layout - Collapsible Sidebar & Fullscreen Viewer
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    createSidebarToggle();
    createFullscreenOverlay();
    restoreSidebarState();
    initExpandButtons();
  }

  // Create sidebar toggle button
  function createSidebarToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Toggle sidebar');
    toggle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;
    toggle.addEventListener('click', toggleSidebar);
    document.body.appendChild(toggle);
  }

  // Toggle sidebar collapsed state
  function toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    // Save state to localStorage
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    localStorage.setItem('diagram-sidebar-collapsed', isCollapsed);
  }

  // Restore sidebar state from localStorage
  function restoreSidebarState() {
    const isCollapsed = localStorage.getItem('diagram-sidebar-collapsed') === 'true';
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    }
  }

  // Create fullscreen overlay
  function createFullscreenOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'diagram-fullscreen-overlay';
    overlay.id = 'fullscreen-overlay';
    overlay.innerHTML = `
      <div class="diagram-fullscreen-header">
        <h3 id="fullscreen-title">Diagram</h3>
        <div class="diagram-fullscreen-controls">
          <button class="diagram-fullscreen-btn" onclick="DiagramLayout.zoomIn()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            Zoom In
          </button>
          <button class="diagram-fullscreen-btn" onclick="DiagramLayout.zoomOut()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            Zoom Out
          </button>
          <button class="diagram-fullscreen-btn" onclick="DiagramLayout.resetZoom()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Reset
          </button>
          <button class="diagram-fullscreen-btn close-btn" onclick="DiagramLayout.closeFullscreen()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Close
          </button>
        </div>
      </div>
      <div class="diagram-fullscreen-content" id="fullscreen-content">
        <div class="mermaid-container" id="fullscreen-diagram"></div>
      </div>
      <div class="zoom-indicator" id="zoom-indicator">100%</div>
    `;
    document.body.appendChild(overlay);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        DiagramLayout.closeFullscreen();
      }
    });

    // Mouse wheel zoom
    const content = overlay.querySelector('#fullscreen-content');
    content.addEventListener('wheel', (e) => {
      if (overlay.classList.contains('active')) {
        e.preventDefault();
        if (e.deltaY < 0) {
          DiagramLayout.zoomIn(0.1);
        } else {
          DiagramLayout.zoomOut(0.1);
        }
      }
    }, { passive: false });
  }

  // Initialize expand buttons on diagram sections
  function initExpandButtons() {
    const headers = document.querySelectorAll('.diagram-section__header');
    headers.forEach(header => {
      // Check if expand button already exists
      if (header.querySelector('.diagram-expand-btn')) return;

      const section = header.closest('.diagram-section');
      const title = header.querySelector('h2, h3')?.textContent || 'Diagram';
      const mermaidDiv = section.querySelector('.mermaid, .diagram-content');

      if (mermaidDiv) {
        const expandBtn = document.createElement('button');
        expandBtn.className = 'diagram-expand-btn';
        expandBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
          Expand
        `;
        expandBtn.addEventListener('click', () => {
          DiagramLayout.openFullscreen(mermaidDiv.innerHTML, title);
        });

        // Add to header actions area or create one
        let actionsArea = header.querySelector('.diagram-section__actions');
        if (!actionsArea) {
          actionsArea = document.createElement('div');
          actionsArea.className = 'diagram-section__actions';
          actionsArea.style.cssText = 'display: flex; gap: 8px; align-items: center;';
          header.appendChild(actionsArea);
        }
        actionsArea.appendChild(expandBtn);
      }
    });
  }

  // Current zoom level
  let currentZoom = 1;
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 3;

  // Public API
  window.DiagramLayout = {
    openFullscreen: function(content, title) {
      const overlay = document.getElementById('fullscreen-overlay');
      const diagram = document.getElementById('fullscreen-diagram');
      const titleEl = document.getElementById('fullscreen-title');

      diagram.innerHTML = content;
      titleEl.textContent = title || 'Diagram';
      currentZoom = 1;
      this.updateZoom();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeFullscreen: function() {
      const overlay = document.getElementById('fullscreen-overlay');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    },

    zoomIn: function(amount = 0.25) {
      currentZoom = Math.min(MAX_ZOOM, currentZoom + amount);
      this.updateZoom();
    },

    zoomOut: function(amount = 0.25) {
      currentZoom = Math.max(MIN_ZOOM, currentZoom - amount);
      this.updateZoom();
    },

    resetZoom: function() {
      currentZoom = 1;
      this.updateZoom();
    },

    updateZoom: function() {
      const diagram = document.getElementById('fullscreen-diagram');
      const indicator = document.getElementById('zoom-indicator');
      diagram.style.transform = `scale(${currentZoom})`;
      indicator.textContent = Math.round(currentZoom * 100) + '%';
    },

    toggleSidebar: toggleSidebar
  };

})();
