/**
 * Wireframe Comments System - Figma Style
 * Click anywhere to add comments with pin markers
 */

class WireframeComments {
  constructor(options = {}) {
    // Use production API unless on localhost
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const defaultApi = isLocal ? 'http://localhost:8787' : 'https://wireframe-comments-api.untitledproduct.workers.dev';
    this.apiUrl = options.apiUrl || defaultApi;
    this.pageId = options.pageId || this.getPageId();
    this.userName = options.userName || localStorage.getItem('wf_comment_user') || '';
    this.userEmail = options.userEmail || localStorage.getItem('wf_comment_email') || '';
    this.comments = [];
    this.commentMode = false;
    this.activeComment = null;
    this.pendingPosition = null;

    this.init();
  }

  getPageId() {
    const path = window.location.pathname;
    const match = path.match(/\/src\/pages\/(.+)\.html/) || path.match(/\/src\/components\/(.+)\.html/);
    return match ? match[1].replace(/\//g, '-') : path.replace(/\//g, '-');
  }

  async init() {
    this.createStyles();
    this.createUI();
    this.bindEvents();
    await this.loadComments();
  }

  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ==================== COMMENT TOGGLE BUTTON ==================== */
      .wfc-toggle {
        position: fixed;
        bottom: 24px;
        left: 24px;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: white;
        border: 2px solid #e5e7eb;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 9998;
        transition: all 0.2s;
      }
      .wfc-toggle:hover {
        border-color: #6366f1;
        box-shadow: 0 4px 16px rgba(99,102,241,0.2);
      }
      .wfc-toggle.active {
        background: #6366f1;
        border-color: #6366f1;
        color: white;
      }
      .wfc-toggle .wfc-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ef4444;
        color: white;
        font-size: 11px;
        font-weight: 600;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
      }

      /* ==================== COMMENT MODE OVERLAY ==================== */
      .wfc-mode-active {
        cursor: crosshair !important;
      }
      .wfc-mode-active * {
        cursor: crosshair !important;
      }
      .wfc-mode-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 12px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 12px rgba(99,102,241,0.3);
      }
      .wfc-mode-banner button {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: background 0.2s;
      }
      .wfc-mode-banner button:hover {
        background: rgba(255,255,255,0.3);
      }

      /* ==================== PIN MARKERS ==================== */
      .wfc-pin {
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        background: #6366f1;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        z-index: 9990;
        box-shadow: 0 2px 8px rgba(99,102,241,0.4);
        transform: translate(-50%, -100%) rotate(-45deg);
        transition: all 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .wfc-pin:hover {
        transform: translate(-50%, -100%) rotate(-45deg) scale(1.15);
        box-shadow: 0 4px 12px rgba(99,102,241,0.5);
      }
      .wfc-pin.resolved {
        background: #22c55e;
        box-shadow: 0 2px 8px rgba(34,197,94,0.4);
      }
      .wfc-pin.active {
        transform: translate(-50%, -100%) rotate(-45deg) scale(1.2);
        box-shadow: 0 4px 16px rgba(99,102,241,0.6);
      }
      .wfc-pin span {
        transform: rotate(45deg);
      }

      /* ==================== COMMENT POPUP ==================== */
      .wfc-popup {
        position: absolute;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow: hidden;
        animation: wfc-popup-in 0.2s ease-out;
      }
      @keyframes wfc-popup-in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .wfc-popup-header {
        padding: 14px 16px;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .wfc-popup-header h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }
      .wfc-popup-close {
        width: 28px;
        height: 28px;
        border: none;
        background: #f3f4f6;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 16px;
        transition: all 0.15s;
      }
      .wfc-popup-close:hover {
        background: #e5e7eb;
        color: #374151;
      }

      .wfc-popup-body {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }

      /* ==================== NEW COMMENT FORM ==================== */
      .wfc-form {}
      .wfc-form-row {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }
      .wfc-input {
        flex: 1;
        padding: 10px 12px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.15s;
      }
      .wfc-input:focus {
        outline: none;
        border-color: #6366f1;
      }
      .wfc-input::placeholder {
        color: #9ca3af;
      }
      .wfc-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        resize: none;
        min-height: 80px;
        transition: border-color 0.15s;
      }
      .wfc-textarea:focus {
        outline: none;
        border-color: #6366f1;
      }
      .wfc-form-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
      }
      .wfc-btn {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        font-family: inherit;
      }
      .wfc-btn-secondary {
        background: #f3f4f6;
        border: none;
        color: #374151;
      }
      .wfc-btn-secondary:hover {
        background: #e5e7eb;
      }
      .wfc-btn-primary {
        background: #6366f1;
        border: none;
        color: white;
      }
      .wfc-btn-primary:hover {
        background: #4f46e5;
      }

      /* ==================== COMMENT THREAD ==================== */
      .wfc-thread {}
      .wfc-comment {
        margin-bottom: 16px;
      }
      .wfc-comment:last-child {
        margin-bottom: 0;
      }
      .wfc-comment-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;
      }
      .wfc-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
      }
      .wfc-comment-meta {
        flex: 1;
      }
      .wfc-comment-author {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
      }
      .wfc-comment-time {
        font-size: 11px;
        color: #9ca3af;
      }
      .wfc-comment-content {
        font-size: 14px;
        color: #374151;
        line-height: 1.5;
        padding-left: 38px;
      }
      .wfc-comment-actions {
        padding-left: 38px;
        margin-top: 8px;
        display: flex;
        gap: 12px;
      }
      .wfc-comment-action {
        background: none;
        border: none;
        color: #6b7280;
        font-size: 12px;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
        transition: color 0.15s;
      }
      .wfc-comment-action:hover {
        color: #6366f1;
      }

      /* Replies */
      .wfc-replies {
        margin-top: 12px;
        padding-left: 38px;
        border-left: 2px solid #e5e7eb;
        margin-left: 14px;
      }
      .wfc-reply {
        padding: 10px 0 10px 12px;
      }
      .wfc-reply-form {
        padding: 12px 0 0 12px;
      }
      .wfc-reply-input {
        width: 100%;
        padding: 8px 10px;
        border: 1.5px solid #e5e7eb;
        border-radius: 6px;
        font-size: 13px;
        font-family: inherit;
      }
      .wfc-reply-input:focus {
        outline: none;
        border-color: #6366f1;
      }

      /* Status badge */
      .wfc-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
      }
      .wfc-status-open {
        background: #fef3c7;
        color: #92400e;
      }
      .wfc-status-resolved {
        background: #dcfce7;
        color: #166534;
      }

      /* Resolve button in popup */
      .wfc-resolve-btn {
        width: 100%;
        padding: 10px;
        margin-top: 12px;
        background: #f0fdf4;
        border: 1.5px solid #22c55e;
        color: #166534;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
      }
      .wfc-resolve-btn:hover {
        background: #dcfce7;
      }

      /* ==================== COMMENT LIST PANEL ==================== */
      .wfc-panel {
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        width: 360px;
        background: white;
        box-shadow: -4px 0 24px rgba(0,0,0,0.1);
        z-index: 10000;
        display: none;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .wfc-panel.open {
        display: flex;
      }
      .wfc-panel-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .wfc-panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .wfc-panel-tabs {
        display: flex;
        gap: 4px;
        padding: 12px 20px;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
      }
      .wfc-panel-tab {
        padding: 6px 12px;
        border: none;
        background: transparent;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.15s;
      }
      .wfc-panel-tab:hover {
        background: #e5e7eb;
      }
      .wfc-panel-tab.active {
        background: white;
        color: #111827;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .wfc-panel-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
      }
      .wfc-panel-item {
        padding: 14px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .wfc-panel-item:hover {
        border-color: #6366f1;
        background: #faf5ff;
      }
      .wfc-panel-item.resolved {
        opacity: 0.6;
      }
      .wfc-panel-empty {
        text-align: center;
        padding: 48px 24px;
        color: #9ca3af;
      }
      .wfc-panel-empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
      }
    `;
    document.head.appendChild(style);
  }

  createUI() {
    // Toggle button
    this.toggleBtn = document.createElement('button');
    this.toggleBtn.className = 'wfc-toggle';
    this.toggleBtn.innerHTML = '💬';
    this.toggleBtn.title = 'Yorum modu';
    document.body.appendChild(this.toggleBtn);

    // Comment mode banner
    this.modeBanner = document.createElement('div');
    this.modeBanner.className = 'wfc-mode-banner';
    this.modeBanner.style.display = 'none';
    this.modeBanner.innerHTML = `
      <span>💬 Yorum eklemek için sayfada bir noktaya tıklayın</span>
      <button class="wfc-mode-cancel">İptal (Esc)</button>
      <button class="wfc-mode-list">Tüm Yorumlar</button>
    `;
    document.body.appendChild(this.modeBanner);

    // Side panel for all comments
    this.panel = document.createElement('div');
    this.panel.className = 'wfc-panel';
    this.panel.innerHTML = `
      <div class="wfc-panel-header">
        <h3>Yorumlar</h3>
        <button class="wfc-popup-close wfc-panel-close">✕</button>
      </div>
      <div class="wfc-panel-tabs">
        <button class="wfc-panel-tab active" data-filter="all">Tümü</button>
        <button class="wfc-panel-tab" data-filter="open">Açık</button>
        <button class="wfc-panel-tab" data-filter="resolved">Çözülmüş</button>
      </div>
      <div class="wfc-panel-list"></div>
    `;
    document.body.appendChild(this.panel);

    // Pin container
    this.pinContainer = document.createElement('div');
    this.pinContainer.className = 'wfc-pin-container';
    document.body.appendChild(this.pinContainer);
  }

  bindEvents() {
    // Toggle comment mode
    this.toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.panel.classList.contains('open')) {
        this.closePanel();
      }
      this.toggleCommentMode();
    });

    // Cancel mode
    this.modeBanner.querySelector('.wfc-mode-cancel').addEventListener('click', () => {
      this.toggleCommentMode(false);
    });

    // Open panel from banner
    this.modeBanner.querySelector('.wfc-mode-list').addEventListener('click', () => {
      this.toggleCommentMode(false);
      this.openPanel();
    });

    // Close panel
    this.panel.querySelector('.wfc-panel-close').addEventListener('click', () => {
      this.closePanel();
    });

    // Panel tabs
    this.panel.querySelectorAll('.wfc-panel-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.panel.querySelectorAll('.wfc-panel-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.renderPanelList(e.target.dataset.filter);
      });
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.commentMode) this.toggleCommentMode(false);
        if (this.activeComment) this.closePopup();
        if (this.panel.classList.contains('open')) this.closePanel();
      }
    });

    // Click on page to add comment
    document.addEventListener('click', (e) => {
      if (!this.commentMode) return;
      if (e.target.closest('.wfc-toggle, .wfc-mode-banner, .wfc-popup, .wfc-pin, .wfc-panel')) return;

      e.preventDefault();
      e.stopPropagation();

      this.pendingPosition = {
        x: e.pageX,
        y: e.pageY
      };

      this.showNewCommentPopup(e.pageX, e.pageY);
    });

    // Click outside popup to close
    document.addEventListener('click', (e) => {
      if (this.activeComment && !e.target.closest('.wfc-popup, .wfc-pin')) {
        this.closePopup();
      }
    });

    // Save user info
    document.addEventListener('change', (e) => {
      if (e.target.matches('.wfc-input-name')) {
        this.userName = e.target.value;
        localStorage.setItem('wf_comment_user', this.userName);
      }
      if (e.target.matches('.wfc-input-email')) {
        this.userEmail = e.target.value;
        localStorage.setItem('wf_comment_email', this.userEmail);
      }
    });
  }

  toggleCommentMode(force) {
    this.commentMode = force !== undefined ? force : !this.commentMode;

    this.toggleBtn.classList.toggle('active', this.commentMode);
    this.modeBanner.style.display = this.commentMode ? 'flex' : 'none';
    document.body.classList.toggle('wfc-mode-active', this.commentMode);

    if (!this.commentMode) {
      this.closePopup();
      this.pendingPosition = null;
    }
  }

  openPanel() {
    this.panel.classList.add('open');
    this.renderPanelList('all');
  }

  closePanel() {
    this.panel.classList.remove('open');
  }

  async loadComments() {
    try {
      const response = await fetch(`${this.apiUrl}/comments?page_id=${encodeURIComponent(this.pageId)}`);
      const data = await response.json();
      this.comments = data.comments || [];
      this.renderPins();
      this.updateBadge();
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  renderPins() {
    this.pinContainer.innerHTML = '';

    this.comments.forEach((comment, index) => {
      if (comment.x_position && comment.y_position) {
        const pin = document.createElement('div');
        pin.className = `wfc-pin ${comment.status}`;
        pin.dataset.id = comment.id;
        pin.style.left = `${comment.x_position}px`;
        pin.style.top = `${comment.y_position}px`;
        pin.innerHTML = `<span>${index + 1}</span>`;
        pin.title = comment.content.substring(0, 50);

        pin.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showCommentPopup(comment, pin);
        });

        this.pinContainer.appendChild(pin);
      }
    });
  }

  updateBadge() {
    const openCount = this.comments.filter(c => c.status === 'open').length;
    let badge = this.toggleBtn.querySelector('.wfc-badge');

    if (openCount > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'wfc-badge';
        this.toggleBtn.appendChild(badge);
      }
      badge.textContent = openCount > 9 ? '9+' : openCount;
    } else if (badge) {
      badge.remove();
    }
  }

  showNewCommentPopup(x, y) {
    this.closePopup();

    const popup = document.createElement('div');
    popup.className = 'wfc-popup';
    popup.style.left = `${Math.min(x, window.innerWidth - 340)}px`;
    popup.style.top = `${y + 20}px`;

    popup.innerHTML = `
      <div class="wfc-popup-header">
        <h4>Yeni Yorum</h4>
        <button class="wfc-popup-close">✕</button>
      </div>
      <div class="wfc-popup-body">
        <div class="wfc-form">
          <div class="wfc-form-row">
            <input type="text" class="wfc-input wfc-input-name" placeholder="Adınız" value="${this.escapeHtml(this.userName)}">
          </div>
          <textarea class="wfc-textarea wfc-input-content" placeholder="Yorumunuzu yazın..." autofocus></textarea>
          <div class="wfc-form-footer">
            <button class="wfc-btn wfc-btn-secondary wfc-cancel">İptal</button>
            <button class="wfc-btn wfc-btn-primary wfc-submit">Gönder</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    this.activePopup = popup;

    // Focus textarea
    setTimeout(() => popup.querySelector('.wfc-input-content').focus(), 100);

    // Close button
    popup.querySelector('.wfc-popup-close').addEventListener('click', () => this.closePopup());
    popup.querySelector('.wfc-cancel').addEventListener('click', () => this.closePopup());

    // Submit
    popup.querySelector('.wfc-submit').addEventListener('click', () => this.submitNewComment(popup));

    // Ctrl+Enter to submit
    popup.querySelector('.wfc-input-content').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.submitNewComment(popup);
      }
    });
  }

  async submitNewComment(popup) {
    const name = popup.querySelector('.wfc-input-name').value.trim();
    const content = popup.querySelector('.wfc-input-content').value.trim();

    if (!name) {
      popup.querySelector('.wfc-input-name').focus();
      return;
    }
    if (!content) {
      popup.querySelector('.wfc-input-content').focus();
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: this.pageId,
          author_name: name,
          content: content,
          x_position: this.pendingPosition.x,
          y_position: this.pendingPosition.y,
          priority: 'normal'
        })
      });

      if (!response.ok) throw new Error('Failed to post');

      this.closePopup();
      this.toggleCommentMode(false);
      this.pendingPosition = null;
      await this.loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Yorum gönderilemedi');
    }
  }

  showCommentPopup(comment, pinEl) {
    this.closePopup();

    // Mark pin as active
    document.querySelectorAll('.wfc-pin').forEach(p => p.classList.remove('active'));
    pinEl.classList.add('active');

    const popup = document.createElement('div');
    popup.className = 'wfc-popup';

    const pinRect = pinEl.getBoundingClientRect();
    const left = Math.min(pinRect.left + window.scrollX + 40, window.innerWidth - 340);
    const top = pinRect.top + window.scrollY;

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    const replies = comment.replies || [];

    popup.innerHTML = `
      <div class="wfc-popup-header">
        <h4>Yorum #${comment.id}</h4>
        <button class="wfc-popup-close">✕</button>
      </div>
      <div class="wfc-popup-body">
        <div class="wfc-thread">
          <div class="wfc-comment">
            <div class="wfc-comment-header">
              <div class="wfc-avatar">${this.getInitials(comment.author_name)}</div>
              <div class="wfc-comment-meta">
                <div class="wfc-comment-author">${this.escapeHtml(comment.author_name)}</div>
                <div class="wfc-comment-time">${this.formatTimeAgo(comment.created_at)}</div>
              </div>
              <span class="wfc-status wfc-status-${comment.status}">${comment.status === 'open' ? '● Açık' : '✓ Çözüldü'}</span>
            </div>
            <div class="wfc-comment-content">${this.escapeHtml(comment.content)}</div>
            <div class="wfc-comment-actions">
              <button class="wfc-comment-action wfc-action-reply">↩ Yanıtla</button>
              <button class="wfc-comment-action wfc-action-delete">🗑 Sil</button>
            </div>
          </div>

          ${replies.length > 0 ? `
            <div class="wfc-replies">
              ${replies.map(reply => `
                <div class="wfc-reply">
                  <div class="wfc-comment-header">
                    <div class="wfc-avatar" style="width:24px;height:24px;font-size:10px;">${this.getInitials(reply.author_name)}</div>
                    <div class="wfc-comment-meta">
                      <div class="wfc-comment-author" style="font-size:12px;">${this.escapeHtml(reply.author_name)}</div>
                      <div class="wfc-comment-time">${this.formatTimeAgo(reply.created_at)}</div>
                    </div>
                  </div>
                  <div class="wfc-comment-content" style="padding-left:32px;font-size:13px;">${this.escapeHtml(reply.content)}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="wfc-reply-form" style="display:none;">
            <input type="text" class="wfc-reply-input" placeholder="Yanıtınızı yazın...">
          </div>
        </div>

        ${comment.status === 'open' ? `
          <button class="wfc-resolve-btn">✓ Çözüldü Olarak İşaretle</button>
        ` : ''}
      </div>
    `;

    document.body.appendChild(popup);
    this.activePopup = popup;
    this.activeComment = comment;

    // Close
    popup.querySelector('.wfc-popup-close').addEventListener('click', () => this.closePopup());

    // Reply toggle
    popup.querySelector('.wfc-action-reply').addEventListener('click', () => {
      const replyForm = popup.querySelector('.wfc-reply-form');
      replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      if (replyForm.style.display === 'block') {
        replyForm.querySelector('.wfc-reply-input').focus();
      }
    });

    // Reply submit
    const replyInput = popup.querySelector('.wfc-reply-input');
    replyInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && replyInput.value.trim()) {
        await this.submitReply(comment.id, replyInput.value.trim());
      }
    });

    // Delete
    popup.querySelector('.wfc-action-delete').addEventListener('click', () => this.deleteComment(comment.id));

    // Resolve
    const resolveBtn = popup.querySelector('.wfc-resolve-btn');
    if (resolveBtn) {
      resolveBtn.addEventListener('click', () => this.resolveComment(comment.id));
    }
  }

  closePopup() {
    if (this.activePopup) {
      this.activePopup.remove();
      this.activePopup = null;
    }
    this.activeComment = null;
    document.querySelectorAll('.wfc-pin').forEach(p => p.classList.remove('active'));
  }

  async submitReply(commentId, content) {
    try {
      await fetch(`${this.apiUrl}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: this.userName || 'Anonim',
          content: content
        })
      });

      this.closePopup();
      await this.loadComments();

      // Reopen the comment
      const comment = this.comments.find(c => c.id === commentId);
      const pin = document.querySelector(`.wfc-pin[data-id="${commentId}"]`);
      if (comment && pin) {
        this.showCommentPopup(comment, pin);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  }

  async resolveComment(id) {
    try {
      await fetch(`${this.apiUrl}/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved', resolved_by: this.userName })
      });
      this.closePopup();
      await this.loadComments();
    } catch (error) {
      console.error('Error resolving comment:', error);
    }
  }

  async deleteComment(id) {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      await fetch(`${this.apiUrl}/comments/${id}`, { method: 'DELETE' });
      this.closePopup();
      await this.loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  renderPanelList(filter = 'all') {
    const listEl = this.panel.querySelector('.wfc-panel-list');
    let filtered = this.comments;

    if (filter === 'open') filtered = this.comments.filter(c => c.status === 'open');
    if (filter === 'resolved') filtered = this.comments.filter(c => c.status === 'resolved');

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="wfc-panel-empty">
          <div class="wfc-panel-empty-icon">💬</div>
          <p>Henüz yorum yok</p>
          <p style="font-size:13px;margin-top:4px;">Yorum eklemek için sol alttaki butona tıklayın</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(comment => `
      <div class="wfc-panel-item ${comment.status}" data-id="${comment.id}">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="wfc-avatar" style="width:24px;height:24px;font-size:10px;">${this.getInitials(comment.author_name)}</div>
            <span style="font-weight:600;font-size:13px;">${this.escapeHtml(comment.author_name)}</span>
          </div>
          <span class="wfc-status wfc-status-${comment.status}" style="font-size:10px;">${comment.status === 'open' ? 'Açık' : 'Çözüldü'}</span>
        </div>
        <p style="font-size:13px;color:#374151;margin:0;line-height:1.4;">${this.escapeHtml(comment.content.substring(0, 100))}${comment.content.length > 100 ? '...' : ''}</p>
        <div style="font-size:11px;color:#9ca3af;margin-top:8px;">${this.formatTimeAgo(comment.created_at)}</div>
      </div>
    `).join('');

    // Click to scroll to pin
    listEl.querySelectorAll('.wfc-panel-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const comment = this.comments.find(c => c.id == id);
        const pin = document.querySelector(`.wfc-pin[data-id="${id}"]`);

        if (comment && pin) {
          this.closePanel();
          window.scrollTo({
            left: comment.x_position - window.innerWidth / 2,
            top: comment.y_position - window.innerHeight / 2,
            behavior: 'smooth'
          });
          setTimeout(() => this.showCommentPopup(comment, pin), 300);
        }
      });
    });
  }

  getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  formatTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
    return date.toLocaleDateString('tr-TR');
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.wireframeComments = new WireframeComments();
  });
} else {
  window.wireframeComments = new WireframeComments();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WireframeComments;
}
