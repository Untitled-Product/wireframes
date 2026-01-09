-- Wireframe Comments Database Schema

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id TEXT NOT NULL,              -- e.g., "sprint1/login-phone" or "admin/ticket-list"
    x_position REAL,                     -- X coordinate for pinned comments (optional)
    y_position REAL,                     -- Y coordinate for pinned comments (optional)
    element_selector TEXT,               -- CSS selector for element-specific comments (optional)
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'open',          -- open, resolved, wontfix
    priority TEXT DEFAULT 'normal',      -- low, normal, high, critical
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    resolved_by TEXT
);

-- Replies table (threaded comments)
CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- Index for faster page lookups
CREATE INDEX IF NOT EXISTS idx_comments_page ON comments(page_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_replies_comment ON replies(comment_id);
