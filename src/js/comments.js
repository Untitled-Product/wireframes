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
        background: #0d9488;
        color: white;
        padding: 12px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        z-index: 10001;
        font-family: 'Indie Flower', cursive;
        font-size: 16px;
        font-weight: 400;
        box-shadow: none;
        border-bottom: 2px dashed #0f766e;
      }
      .wfc-mode-banner button {
        background: rgba(255,255,255,0.2);
        border: 2px dashed rgba(255,255,255,0.5);
        color: white;
        padding: 6px 14px;
        border-radius: 0;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        font-family: 'Indie Flower', cursive;
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
        background: #0d9488;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        z-index: 9990;
        box-shadow: none;
        border: 2px solid #0f766e;
        transform: translate(-50%, -100%) rotate(-45deg);
        transition: all 0.2s;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-pin:hover {
        transform: translate(-50%, -100%) rotate(-45deg) scale(1.15);
        background: #0f766e;
      }
      .wfc-pin.resolved {
        background: #22c55e;
        border-color: #16a34a;
      }
      .wfc-pin.active {
        transform: translate(-50%, -100%) rotate(-45deg) scale(1.2);
        background: #0f766e;
      }
      .wfc-pin span {
        transform: rotate(45deg);
      }

      /* ==================== COMMENT POPUP ==================== */
      .wfc-popup {
        position: absolute;
        width: 320px;
        background: #F9FAFB;
        border-radius: 0;
        border: 2px solid #9CA3AF;
        box-shadow: none;
        z-index: 9999;
        font-family: 'Indie Flower', cursive;
        overflow: hidden;
        animation: wfc-popup-in 0.2s ease-out;
      }
      @keyframes wfc-popup-in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .wfc-popup-header {
        padding: 14px 16px;
        border-bottom: 2px dashed #D1D5DB;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #F3F4F6;
      }
      .wfc-popup-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 400;
        color: #111827;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-popup-close {
        width: 28px;
        height: 28px;
        border: 2px dashed #9CA3AF;
        background: white;
        border-radius: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 16px;
        transition: all 0.15s;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-popup-close:hover {
        background: #E5E7EB;
        color: #374151;
        border-color: #6B7280;
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
        border: 2px solid #D1D5DB;
        border-radius: 0;
        font-size: 15px;
        font-family: 'Indie Flower', cursive;
        transition: border-color 0.15s;
        background: white;
      }
      .wfc-input:focus {
        outline: none;
        border-color: #0d9488;
      }
      .wfc-input::placeholder {
        color: #9ca3af;
      }
      .wfc-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #D1D5DB;
        border-radius: 0;
        font-size: 15px;
        font-family: 'Indie Flower', cursive;
        resize: none;
        min-height: 80px;
        transition: border-color 0.15s;
        background: white;
      }
      .wfc-textarea:focus {
        outline: none;
        border-color: #0d9488;
      }
      .wfc-form-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
      }
      .wfc-btn {
        padding: 8px 16px;
        border-radius: 0;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.15s;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-btn-secondary {
        background: white;
        border: 2px dashed #9CA3AF;
        color: #374151;
      }
      .wfc-btn-secondary:hover {
        background: #F3F4F6;
        border-color: #6B7280;
      }
      .wfc-btn-primary {
        background: #0d9488;
        border: 2px solid #0d9488;
        color: white;
      }
      .wfc-btn-primary:hover {
        background: #0f766e;
        border-color: #0f766e;
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
        background: #0d9488;
        border: 2px solid #0f766e;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 400;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-comment-meta {
        flex: 1;
      }
      .wfc-comment-author {
        font-size: 14px;
        font-weight: 400;
        color: #111827;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-comment-time {
        font-size: 12px;
        color: #9ca3af;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-comment-content {
        font-size: 15px;
        color: #374151;
        line-height: 1.5;
        padding-left: 38px;
        font-family: 'Indie Flower', cursive;
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
        font-size: 13px;
        cursor: pointer;
        padding: 0;
        font-family: 'Indie Flower', cursive;
        transition: color 0.15s;
      }
      .wfc-comment-action:hover {
        color: #0d9488;
      }

      /* Replies */
      .wfc-replies {
        margin-top: 12px;
        padding-left: 38px;
        border-left: 2px dashed #D1D5DB;
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
        border: 2px solid #D1D5DB;
        border-radius: 0;
        font-size: 14px;
        font-family: 'Indie Flower', cursive;
        background: white;
      }
      .wfc-reply-input:focus {
        outline: none;
        border-color: #0d9488;
      }

      /* Status badge */
      .wfc-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 0;
        font-size: 12px;
        font-weight: 400;
        font-family: 'Indie Flower', cursive;
        border: 2px dashed;
      }
      .wfc-status-open {
        background: #fef3c7;
        color: #92400e;
        border-color: #F59E0B;
      }
      .wfc-status-resolved {
        background: #dcfce7;
        color: #166534;
        border-color: #22c55e;
      }

      /* Resolve button in popup */
      .wfc-resolve-btn {
        width: 100%;
        padding: 10px;
        margin-top: 12px;
        background: #f0fdf4;
        border: 2px dashed #22c55e;
        color: #166534;
        border-radius: 0;
        font-size: 14px;
        font-weight: 400;
        font-family: 'Indie Flower', cursive;
        cursor: pointer;
        transition: all 0.15s;
      }
      .wfc-resolve-btn:hover {
        background: #dcfce7;
        border-style: solid;
      }

      /* ==================== COMMENT LIST PANEL ==================== */
      .wfc-panel {
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        width: 360px;
        background: #F9FAFB;
        border-left: 2px solid #9CA3AF;
        box-shadow: none;
        z-index: 10000;
        display: none;
        flex-direction: column;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-panel.open {
        display: flex;
      }
      .wfc-panel-header {
        padding: 16px 20px;
        border-bottom: 2px dashed #D1D5DB;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #F3F4F6;
      }
      .wfc-panel-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 400;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-panel-tabs {
        display: flex;
        gap: 4px;
        padding: 12px 20px;
        background: #F3F4F6;
        border-bottom: 2px dashed #D1D5DB;
      }
      .wfc-panel-tab {
        padding: 6px 12px;
        border: 2px dashed transparent;
        background: transparent;
        border-radius: 0;
        font-size: 14px;
        font-weight: 400;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.15s;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-panel-tab:hover {
        background: #E5E7EB;
        border-color: #9CA3AF;
      }
      .wfc-panel-tab.active {
        background: white;
        color: #111827;
        border-color: #9CA3AF;
        border-style: solid;
      }
      .wfc-panel-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
      }
      .wfc-panel-item {
        padding: 14px;
        border: 2px solid #D1D5DB;
        border-radius: 0;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.15s;
        background: white;
      }
      .wfc-panel-item:hover {
        border-color: #0d9488;
        background: #f0fdfa;
      }
      .wfc-panel-item.resolved {
        opacity: 0.6;
      }
      .wfc-panel-empty {
        text-align: center;
        padding: 48px 24px;
        color: #9ca3af;
        font-family: 'Indie Flower', cursive;
      }
      .wfc-panel-empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
      }
    `;
    // Add Google Fonts for Indie Flower
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap';
    document.head.appendChild(link);
    document.head.appendChild(style);
  }

  createUI() {
    // Comment mode banner (toggle button moved to floating-toolbar.js)
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
      if (e.target.closest('.wf-toolbar, .wfc-mode-banner, .wfc-popup, .wfc-pin, .wfc-panel')) return;

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

    // Update toolbar button state if available
    if (window.wireframeToolbar) {
      window.wireframeToolbar.updateCommentButtonState();
    }

    this.modeBanner.style.display = this.commentMode ? 'flex' : 'none';
    document.body.classList.toggle('wfc-mode-active', this.commentMode);

    if (!this.commentMode) {
      this.closePopup();
      this.pendingPosition = null;
    }
  }

  // Public method for toolbar to show panel
  showPanel() {
    this.openPanel();
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

    // Update toolbar badge if available
    if (window.wireframeToolbar) {
      window.wireframeToolbar.updateCommentBadge(openCount);
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
