/**
 * Tool Comments System - Modern/Minimal Style
 * Click anywhere to add comments with pin markers
 * Uses: tool.css styles with .tool-* prefix
 */

class ToolComments {
  constructor(options = {}) {
    // Use production API unless on localhost
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const defaultApi = isLocal ? 'http://localhost:8787' : 'https://wireframe-comments-api.untitledproduct.workers.dev';
    this.apiUrl = options.apiUrl || defaultApi;
    this.pageId = options.pageId || this.getPageId();
    this.userName = options.userName || localStorage.getItem('tool_comment_user') || '';
    this.userEmail = options.userEmail || localStorage.getItem('tool_comment_email') || '';
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
    this.createUI();
    this.bindEvents();
    await this.loadComments();
  }

  createUI() {
    // Comment mode banner (uses tool-mode-banner from tool.css)
    this.modeBanner = document.createElement('div');
    this.modeBanner.className = 'tool-mode-banner';
    this.modeBanner.style.display = 'none';
    this.modeBanner.innerHTML = `
      <div class="tool-mode-banner-text">
        <span class="tool-icon" data-tool-icon="Cursor" data-size="16"></span>
        <span>Click anywhere to add a comment</span>
      </div>
      <button class="tool-btn tool-mode-cancel">Cancel (Esc)</button>
    `;
    document.body.appendChild(this.modeBanner);

    // Side panel for all comments (uses tool-panel from tool.css)
    this.panel = document.createElement('div');
    this.panel.className = 'tool-panel';
    this.panel.innerHTML = `
      <div class="tool-panel-header">
        <span class="tool-panel-title">Comments</span>
        <button class="tool-popup-close tool-panel-close">
          <span class="tool-icon" data-tool-icon="Close" data-size="16"></span>
        </button>
      </div>
      <div class="tool-panel-body tool-panel-list"></div>
    `;
    document.body.appendChild(this.panel);

    // Pin container
    this.pinContainer = document.createElement('div');
    this.pinContainer.className = 'tool-pin-container';
    document.body.appendChild(this.pinContainer);

    // Process tool icons
    if (window.toolIcons) {
      window.toolIcons.processIcons();
    }
  }

  bindEvents() {
    // Cancel mode
    this.modeBanner.querySelector('.tool-mode-cancel').addEventListener('click', () => {
      this.toggleCommentMode(false);
    });

    // Close panel
    this.panel.querySelector('.tool-panel-close').addEventListener('click', () => {
      this.closePanel();
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
      if (e.target.closest('.tool-toolbar, .tool-mode-banner, .tool-popup, .tool-pin, .tool-panel')) return;

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
      if (this.activeComment && !e.target.closest('.tool-popup, .tool-pin')) {
        this.closePopup();
      }
    });

    // Save user info
    document.addEventListener('change', (e) => {
      if (e.target.matches('.tool-input-name')) {
        this.userName = e.target.value;
        localStorage.setItem('tool_comment_user', this.userName);
      }
      if (e.target.matches('.tool-input-email')) {
        this.userEmail = e.target.value;
        localStorage.setItem('tool_comment_email', this.userEmail);
      }
    });
  }

  toggleCommentMode(force) {
    this.commentMode = force !== undefined ? force : !this.commentMode;

    // Update toolbar button state if available
    if (window.toolToolbar) {
      window.toolToolbar.updateCommentButtonState();
    }

    this.modeBanner.style.display = this.commentMode ? 'flex' : 'none';
    document.body.classList.toggle('tool-comment-mode', this.commentMode);

    if (!this.commentMode) {
      this.closePopup();
      this.pendingPosition = null;
    }
  }

  showPanel() {
    this.openPanel();
  }

  openPanel() {
    this.panel.classList.add('open');
    this.renderPanelList();
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
        pin.className = `tool-pin ${comment.status === 'resolved' ? 'resolved' : ''}`;
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
    if (window.toolToolbar) {
      window.toolToolbar.updateCommentBadge(openCount);
    }
  }

  showNewCommentPopup(x, y) {
    this.closePopup();

    const popup = document.createElement('div');
    popup.className = 'tool-popup';
    popup.style.position = 'absolute';
    popup.style.left = `${Math.min(x, window.innerWidth - 340)}px`;
    popup.style.top = `${y + 20}px`;

    popup.innerHTML = `
      <div class="tool-popup-header">
        <span class="tool-popup-title">New Comment</span>
        <button class="tool-popup-close">
          <span class="tool-icon" data-tool-icon="Close" data-size="14"></span>
        </button>
      </div>
      <div class="tool-popup-body">
        <input type="text" class="tool-input tool-input-name" placeholder="Your name" value="${this.escapeHtml(this.userName)}" style="margin-bottom: 8px;">
        <textarea class="tool-input tool-textarea" placeholder="Write your comment..." autofocus></textarea>
      </div>
      <div class="tool-popup-footer">
        <button class="tool-btn tool-cancel">Cancel</button>
        <button class="tool-btn tool-btn-primary tool-submit">Submit</button>
      </div>
    `;

    document.body.appendChild(popup);
    this.activePopup = popup;

    // Process tool icons
    if (window.toolIcons) {
      window.toolIcons.processIcons();
    }

    // Focus textarea
    setTimeout(() => popup.querySelector('.tool-textarea').focus(), 100);

    // Close button
    popup.querySelector('.tool-popup-close').addEventListener('click', () => this.closePopup());
    popup.querySelector('.tool-cancel').addEventListener('click', () => this.closePopup());

    // Submit
    popup.querySelector('.tool-submit').addEventListener('click', () => this.submitNewComment(popup));

    // Ctrl+Enter to submit
    popup.querySelector('.tool-textarea').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.submitNewComment(popup);
      }
    });
  }

  async submitNewComment(popup) {
    const name = popup.querySelector('.tool-input-name').value.trim();
    const content = popup.querySelector('.tool-textarea').value.trim();

    if (!name) {
      popup.querySelector('.tool-input-name').focus();
      return;
    }
    if (!content) {
      popup.querySelector('.tool-textarea').focus();
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
      alert('Failed to post comment');
    }
  }

  showCommentPopup(comment, pinEl) {
    this.closePopup();

    // Mark pin as active
    document.querySelectorAll('.tool-pin').forEach(p => p.classList.remove('active'));
    pinEl.classList.add('active');

    const popup = document.createElement('div');
    popup.className = 'tool-popup';
    popup.style.position = 'absolute';

    const pinRect = pinEl.getBoundingClientRect();
    const left = Math.min(pinRect.left + window.scrollX + 40, window.innerWidth - 340);
    const top = pinRect.top + window.scrollY;

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    const replies = comment.replies || [];
    const statusClass = comment.status === 'open' ? 'tool-badge-warning' : 'tool-badge-success';
    const statusText = comment.status === 'open' ? 'Open' : 'Resolved';

    popup.innerHTML = `
      <div class="tool-popup-header">
        <span class="tool-popup-title">Comment #${comment.id}</span>
        <button class="tool-popup-close">
          <span class="tool-icon" data-tool-icon="Close" data-size="14"></span>
        </button>
      </div>
      <div class="tool-popup-body">
        <div class="tool-thread">
          <div class="tool-comment">
            <div class="tool-comment-header">
              <div class="tool-comment-avatar">${this.getInitials(comment.author_name)}</div>
              <span class="tool-comment-author">${this.escapeHtml(comment.author_name)}</span>
              <span class="tool-comment-time">${this.formatTimeAgo(comment.created_at)}</span>
            </div>
            <div class="tool-comment-text">${this.escapeHtml(comment.content)}</div>
          </div>

          ${replies.map(reply => `
            <div class="tool-comment" style="padding-left: 32px; border-left: 2px solid var(--tool-border);">
              <div class="tool-comment-header">
                <div class="tool-comment-avatar" style="width: 20px; height: 20px; font-size: 9px;">${this.getInitials(reply.author_name)}</div>
                <span class="tool-comment-author">${this.escapeHtml(reply.author_name)}</span>
                <span class="tool-comment-time">${this.formatTimeAgo(reply.created_at)}</span>
              </div>
              <div class="tool-comment-text" style="font-size: 12px;">${this.escapeHtml(reply.content)}</div>
            </div>
          `).join('')}

          <div class="tool-reply-form" style="display: none; margin-top: 12px;">
            <input type="text" class="tool-input tool-reply-input" placeholder="Write a reply...">
          </div>
        </div>
      </div>
      <div class="tool-popup-footer" style="flex-wrap: wrap;">
        <button class="tool-btn tool-action-reply">Reply</button>
        <button class="tool-btn tool-action-delete" style="color: #ef4444;">Delete</button>
        ${comment.status === 'open' ? `
          <button class="tool-btn tool-btn-primary tool-resolve-btn" style="margin-left: auto;">Mark Resolved</button>
        ` : ''}
      </div>
    `;

    document.body.appendChild(popup);
    this.activePopup = popup;
    this.activeComment = comment;

    // Process tool icons
    if (window.toolIcons) {
      window.toolIcons.processIcons();
    }

    // Close
    popup.querySelector('.tool-popup-close').addEventListener('click', () => this.closePopup());

    // Reply toggle
    popup.querySelector('.tool-action-reply').addEventListener('click', () => {
      const replyForm = popup.querySelector('.tool-reply-form');
      replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      if (replyForm.style.display === 'block') {
        replyForm.querySelector('.tool-reply-input').focus();
      }
    });

    // Reply submit
    const replyInput = popup.querySelector('.tool-reply-input');
    replyInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && replyInput.value.trim()) {
        await this.submitReply(comment.id, replyInput.value.trim());
      }
    });

    // Delete
    popup.querySelector('.tool-action-delete').addEventListener('click', () => this.deleteComment(comment.id));

    // Resolve
    const resolveBtn = popup.querySelector('.tool-resolve-btn');
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
    document.querySelectorAll('.tool-pin').forEach(p => p.classList.remove('active'));
  }

  async submitReply(commentId, content) {
    try {
      await fetch(`${this.apiUrl}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: this.userName || 'Anonymous',
          content: content
        })
      });

      this.closePopup();
      await this.loadComments();

      // Reopen the comment
      const comment = this.comments.find(c => c.id === commentId);
      const pin = document.querySelector(`.tool-pin[data-id="${commentId}"]`);
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
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await fetch(`${this.apiUrl}/comments/${id}`, { method: 'DELETE' });
      this.closePopup();
      await this.loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  renderPanelList() {
    const listEl = this.panel.querySelector('.tool-panel-list');

    if (this.comments.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 48px 24px; color: var(--tool-text-muted);">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;">
            <span class="tool-icon" data-tool-icon="Chat Bubble" data-size="32"></span>
          </div>
          <p>No comments yet</p>
          <p style="font-size: 12px; margin-top: 4px;">Click the comment button to add one</p>
        </div>
      `;
      if (window.toolIcons) {
        window.toolIcons.processIcons();
      }
      return;
    }

    listEl.innerHTML = this.comments.map(comment => `
      <div class="tool-thread" data-id="${comment.id}" style="cursor: pointer; padding: 12px; border-bottom: 1px solid var(--tool-border);">
        <div class="tool-comment">
          <div class="tool-comment-header">
            <div class="tool-comment-avatar" style="width: 20px; height: 20px; font-size: 9px;">${this.getInitials(comment.author_name)}</div>
            <span class="tool-comment-author">${this.escapeHtml(comment.author_name)}</span>
            <span class="tool-comment-time">${this.formatTimeAgo(comment.created_at)}</span>
          </div>
          <div class="tool-comment-text" style="font-size: 12px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${this.escapeHtml(comment.content.substring(0, 80))}${comment.content.length > 80 ? '...' : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Click to scroll to pin
    listEl.querySelectorAll('.tool-thread').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const comment = this.comments.find(c => c.id == id);
        const pin = document.querySelector(`.tool-pin[data-id="${id}"]`);

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

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}

// Add comment mode cursor style
const style = document.createElement('style');
style.textContent = `
  .tool-comment-mode {
    cursor: crosshair !important;
  }
  .tool-comment-mode * {
    cursor: crosshair !important;
  }
`;
document.head.appendChild(style);

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.toolComments = new ToolComments();
  });
} else {
  window.toolComments = new ToolComments();
}

// Backward compatibility
window.wireframeComments = window.toolComments;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToolComments;
}
