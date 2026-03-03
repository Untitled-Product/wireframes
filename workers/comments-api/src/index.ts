/**
 * Wireframe Comments API
 * Cloudflare Worker with D1 Database
 */

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  CLICKUP_API_KEY: string;
  CLICKUP_WORKSPACE_ID: string;
  CLICKUP_CHANNEL_ID: string;
  WIREFRAME_BASE_URL: string;
  REACT_APP_BASE_URL: string;
}

interface Comment {
  id?: number;
  page_id: string;
  x_position?: number;
  y_position?: number;
  element_selector?: string;
  author_name: string;
  author_email?: string;
  content: string;
  status?: string;
  priority?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string;
  resolved_by?: string;
}

interface Reply {
  id?: number;
  comment_id: number;
  author_name: string;
  author_email?: string;
  content: string;
  created_at?: string;
}

// Page → Task code mapping (from index.html card badges)
const PAGE_TASK_MAP: Record<string, string[]> = {
  'sprint1-login-phone': ['K-001'],
  'sprint1-login-otp': ['K-001'],
  'sprint1-login-locked': ['K-001'],
  'sprint1-user-list-v2': ['K-002', 'K-003'],
  'sprint1-user-form-v2': ['K-002', 'K-003'],
  'sprint-a-siparis-listesi': ['D-A01', 'A-004'],
  'sprint-a-siparis-detay': ['D-A01', 'A-005'],
  'sprint-a-iptal-iade-listesi': ['D-A03', 'A-011'],
  'sprint-a-iptal-iade-detay': ['D-A03', 'A-011'],
  'sprint-c-sayfa-listesi': ['C-001', 'C-003'],
  'sprint-c-sayfa-builder': ['C-003'],
  'sprint-c-icerik-editoru': ['C-002'],
  'sprint-c-onizleme': ['C-007'],
  'sprint-c-banner-listesi': ['C-001'],
  'sprint-c-banner-form': ['C-002'],
  'sprint-c-medya-kutuphanesi': ['C-006'],
  'sprint-c-faq-listesi': ['C-001'],
  'sprint-c-faq-form': ['C-002'],
  'sprint-c-koleksiyon-listesi': ['C-001'],
  'sprint-c-koleksiyon-form': ['C-002'],
  'sprint-c-menu-yonetimi': ['C-004'],
  'sprint-c-site-ayarlari': ['C-004'],
  'sprint-c-cms-dashboard': ['D-C01'],
  'sprint-c-etkinlik-takvimi': ['C-005'],
  'sprint-c-etkinlik-zamanlama': ['C-005'],
  'sprint-b-urun-listesi': ['D-B01'],
  'sprint-b-bilet-form': ['D-B01'],
  'sprint-b-fiyat-takvimi': ['D-B01'],
  'sprint-b-eklenti-form': ['D-B01'],
  'sprint-b-fnb-form': ['D-B01'],
  'sprint-b-experience-form': ['D-B01'],
  'sprint-b-kullanici-davet': ['D-B01'],
  'public-forms-school-form': ['F1-170'],
  'public-forms-agency-form': ['F1-171'],
  'public-forms-ticket-request': ['F1-172'],
  // Sprint D - Kampanya & Raporlama
  'sprint-d-kampanya-listesi': ['D-001', 'D-003'],
  'sprint-d-kampanya-form': ['D-002', 'D-003'],
  'sprint-d-kampanya-dashboard': ['D-004'],
  'sprint-d-satis-raporlari': ['D-005'],
  'sprint-d-gelir-analizi': ['D-006'],
};

// ClickUp Chat notification
async function notifyClickUpChat(env: Env, data: {
  type: 'comment' | 'reply';
  commentId: number;
  pageId: string;
  authorName: string;
  content: string;
  priority?: string;
  originalAuthor?: string;
  clickupMessageId?: string;
}): Promise<void> {
  if (!env.CLICKUP_API_KEY || !env.CLICKUP_WORKSPACE_ID || !env.CLICKUP_CHANNEL_ID) return;

  // pageId format: "sprint-c-site-ayarlari" → path: "sprint-c/site-ayarlari"
  // Klasör adını regex ile tanı (sprint1, sprint-a, admin, public-forms, diagrams vb.)
  const folderMatch = data.pageId.match(/^(sprint\d+|sprint-[a-z]+|admin|public-forms|public|diagrams)-(.+)$/);
  const pagePath = folderMatch
    ? `${folderMatch[1]}/${folderMatch[2]}`
    : data.pageId;

  // React app'e migrate edilmiş sayfalar için React URL kullan
  const isReactMigrated = data.pageId.startsWith('sprint-a-');
  const pageUrl = isReactMigrated && env.REACT_APP_BASE_URL
    ? `${env.REACT_APP_BASE_URL}/${pagePath}`
    : `${env.WIREFRAME_BASE_URL}/src/pages/${pagePath.replace('public-forms', 'public/forms')}.html`;
  const taskCodes = PAGE_TASK_MAP[data.pageId];
  const taskLabel = taskCodes ? ` | ${taskCodes.join(', ')}` : '';

  try {
    const headers = {
      'Authorization': env.CLICKUP_API_KEY,
      'Content-Type': 'application/json',
    };

    if (data.type === 'reply' && data.clickupMessageId) {
      // Thread reply — parent mesajın altına yanıt olarak gider
      const replyContent = `💬 ${data.authorName}:\n"${data.content.slice(0, 800)}"`;
      const url = `https://api.clickup.com/api/v3/workspaces/${env.CLICKUP_WORKSPACE_ID}/chat/messages/${data.clickupMessageId}/replies`;
      await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: replyContent }),
      });
    } else {
      // Yeni top-level mesaj
      const content = data.type === 'comment'
        ? `📝 ${data.authorName} yorum bıraktı` +
          (data.priority && data.priority !== 'normal' ? ` [${data.priority.toUpperCase()}]` : '') +
          `\n📄 ${data.pageId}${taskLabel}\n\n"${data.content.slice(0, 600)}"\n\n🔗 ${pageUrl}`
        : `💬 ${data.authorName} yanıt verdi` +
          (data.originalAuthor ? ` (→ ${data.originalAuthor})` : '') +
          `\n📄 ${data.pageId}${taskLabel}\n\n"${data.content.slice(0, 600)}"\n\n🔗 ${pageUrl}`;

      const url = `https://api.clickup.com/api/v3/workspaces/${env.CLICKUP_WORKSPACE_ID}/chat/channels/${env.CLICKUP_CHANNEL_ID}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content }),
      });

      if (res.ok && data.type === 'comment') {
        const resData = await res.json() as any;
        const messageId = resData?.id || resData?.data?.id;
        if (messageId) {
          await env.DB.prepare('UPDATE comments SET clickup_message_id = ? WHERE id = ?')
            .bind(String(messageId), data.commentId)
            .run();
        }
      }
    }
  } catch (err) {
    console.error('ClickUp Chat notification failed:', err);
  }
}

// ClickUp Chat reaction
async function addClickUpReaction(env: Env, messageId: string, emoji = 'white_check_mark'): Promise<void> {
  if (!env.CLICKUP_API_KEY || !env.CLICKUP_WORKSPACE_ID || !messageId) return;

  try {
    await fetch(
      `https://api.clickup.com/api/v3/workspaces/${env.CLICKUP_WORKSPACE_ID}/chat/messages/${messageId}/reactions`,
      {
        method: 'POST',
        headers: {
          'Authorization': env.CLICKUP_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction: emoji }),
      }
    );
  } catch (err) {
    console.error('ClickUp reaction failed:', err);
  }
}

// CORS headers
function corsHeaders(origin: string, allowedOrigins: string): HeadersInit {
  const origins = allowedOrigins.split(',');
  const isAllowed = origins.includes(origin) || origins.includes('*');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : origins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// JSON response helper
function jsonResponse(data: any, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

// Error response helper
function errorResponse(message: string, status = 400, headers: HeadersInit = {}): Response {
  return jsonResponse({ error: message }, status, headers);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS || '*');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    try {
      // Route handling
      const path = url.pathname;
      const method = request.method;

      // GET /comments?page_id=xxx - Get comments for a page
      if (path === '/comments' && method === 'GET') {
        const pageId = url.searchParams.get('page_id');
        const status = url.searchParams.get('status');

        let query = 'SELECT * FROM comments WHERE status != ?';
        const params: any[] = ['deleted'];

        if (pageId) {
          query += ' AND page_id = ?';
          params.push(pageId);
        }

        if (status) {
          query += ' AND status = ?';
          params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const { results } = await env.DB.prepare(query).bind(...params).all();

        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
          (results as Comment[]).map(async (comment) => {
            const { results: replies } = await env.DB
              .prepare('SELECT * FROM replies WHERE comment_id = ? ORDER BY created_at ASC')
              .bind(comment.id)
              .all();
            return { ...comment, replies };
          })
        );

        return jsonResponse({ comments: commentsWithReplies }, 200, cors);
      }

      // GET /comments/:id - Get single comment
      if (path.match(/^\/comments\/\d+$/) && method === 'GET') {
        const id = path.split('/')[2];

        const comment = await env.DB
          .prepare('SELECT * FROM comments WHERE id = ?')
          .bind(id)
          .first();

        if (!comment) {
          return errorResponse('Comment not found', 404, cors);
        }

        const { results: replies } = await env.DB
          .prepare('SELECT * FROM replies WHERE comment_id = ? ORDER BY created_at ASC')
          .bind(id)
          .all();

        return jsonResponse({ comment: { ...comment, replies } }, 200, cors);
      }

      // POST /comments - Create new comment
      if (path === '/comments' && method === 'POST') {
        const body = await request.json() as Comment;

        if (!body.page_id || !body.author_name || !body.content) {
          return errorResponse('page_id, author_name, and content are required', 400, cors);
        }

        const result = await env.DB
          .prepare(`
            INSERT INTO comments (page_id, x_position, y_position, element_selector, author_name, author_email, content, status, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            body.page_id,
            body.x_position || null,
            body.y_position || null,
            body.element_selector || null,
            body.author_name,
            body.author_email || null,
            body.content,
            body.status || 'open',
            body.priority || 'normal'
          )
          .run();

        const newComment = await env.DB
          .prepare('SELECT * FROM comments WHERE id = ?')
          .bind(result.meta.last_row_id)
          .first();

        ctx.waitUntil(notifyClickUpChat(env, {
          type: 'comment',
          commentId: result.meta.last_row_id as number,
          pageId: body.page_id,
          authorName: body.author_name,
          content: body.content,
          priority: body.priority,
        }));

        return jsonResponse({ comment: newComment, message: 'Comment created' }, 201, cors);
      }

      // PUT /comments/:id - Update comment
      if (path.match(/^\/comments\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[2];
        const body = await request.json() as Partial<Comment>;

        const updates: string[] = [];
        const values: any[] = [];

        if (body.content !== undefined) {
          updates.push('content = ?');
          values.push(body.content);
        }
        if (body.status !== undefined) {
          updates.push('status = ?');
          values.push(body.status);
          if (body.status === 'resolved') {
            updates.push('resolved_at = CURRENT_TIMESTAMP');
            if (body.resolved_by) {
              updates.push('resolved_by = ?');
              values.push(body.resolved_by);
            }
          }
        }
        if (body.priority !== undefined) {
          updates.push('priority = ?');
          values.push(body.priority);
        }

        if (updates.length === 0) {
          return errorResponse('No fields to update', 400, cors);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await env.DB
          .prepare(`UPDATE comments SET ${updates.join(', ')} WHERE id = ?`)
          .bind(...values)
          .run();

        const updated = await env.DB
          .prepare('SELECT * FROM comments WHERE id = ?')
          .bind(id)
          .first();

        if (body.status === 'resolved' && (updated as any)?.clickup_message_id) {
          ctx.waitUntil(addClickUpReaction(env, (updated as any).clickup_message_id));
        }

        return jsonResponse({ comment: updated, message: 'Comment updated' }, 200, cors);
      }

      // DELETE /comments/:id - Soft delete comment
      if (path.match(/^\/comments\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[2];

        const comment = await env.DB
          .prepare('SELECT * FROM comments WHERE id = ?')
          .bind(id)
          .first();

        if (!comment) {
          return errorResponse('Comment not found', 404, cors);
        }

        await env.DB
          .prepare('UPDATE comments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .bind('deleted', id)
          .run();

        const msgId = (comment as any).clickup_message_id;
        if (msgId) {
          ctx.waitUntil(addClickUpReaction(env, msgId, 'x'));
        }

        return jsonResponse({ message: 'Comment deleted' }, 200, cors);
      }

      // POST /comments/:id/replies - Add reply
      if (path.match(/^\/comments\/\d+\/replies$/) && method === 'POST') {
        const commentId = path.split('/')[2];
        const body = await request.json() as Reply;

        if (!body.author_name || !body.content) {
          return errorResponse('author_name and content are required', 400, cors);
        }

        // Check if comment exists (also fetch page_id, author, clickup_message_id for notification)
        const comment = await env.DB
          .prepare('SELECT id, page_id, author_name, clickup_message_id FROM comments WHERE id = ?')
          .bind(commentId)
          .first();

        if (!comment) {
          return errorResponse('Comment not found', 404, cors);
        }

        const result = await env.DB
          .prepare(`
            INSERT INTO replies (comment_id, author_name, author_email, content)
            VALUES (?, ?, ?, ?)
          `)
          .bind(commentId, body.author_name, body.author_email || null, body.content)
          .run();

        const newReply = await env.DB
          .prepare('SELECT * FROM replies WHERE id = ?')
          .bind(result.meta.last_row_id)
          .first();

        ctx.waitUntil(notifyClickUpChat(env, {
          type: 'reply',
          commentId: Number(commentId),
          pageId: (comment as any).page_id,
          authorName: body.author_name,
          content: body.content,
          originalAuthor: (comment as any).author_name,
          clickupMessageId: (comment as any).clickup_message_id || undefined,
        }));

        return jsonResponse({ reply: newReply, message: 'Reply added' }, 201, cors);
      }

      // GET /stats - Get comment statistics
      if (path === '/stats' && method === 'GET') {
        const pageId = url.searchParams.get('page_id');

        const deletedFilter = "status != 'deleted'";
        let whereClause = `WHERE ${deletedFilter}`;
        const params: any[] = [];

        if (pageId) {
          whereClause += ' AND page_id = ?';
          params.push(pageId);
        }

        const totalResult = await env.DB
          .prepare(`SELECT COUNT(*) as count FROM comments ${whereClause}`)
          .bind(...params)
          .first();

        const openResult = await env.DB
          .prepare(`SELECT COUNT(*) as count FROM comments ${whereClause} AND status = 'open'`)
          .bind(...params)
          .first();

        const resolvedResult = await env.DB
          .prepare(`SELECT COUNT(*) as count FROM comments ${whereClause} AND status = 'resolved'`)
          .bind(...params)
          .first();

        const byPageResult = await env.DB
          .prepare(`
            SELECT page_id, COUNT(*) as count,
                   SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count
            FROM comments
            WHERE ${deletedFilter}
            GROUP BY page_id
            ORDER BY count DESC
          `)
          .all();

        return jsonResponse({
          total: (totalResult as any)?.count || 0,
          open: (openResult as any)?.count || 0,
          resolved: (resolvedResult as any)?.count || 0,
          by_page: byPageResult.results,
        }, 200, cors);
      }

      // 404 for unknown routes
      return errorResponse('Not found', 404, cors);

    } catch (error) {
      console.error('Error:', error);
      return errorResponse('Internal server error', 500, cors);
    }
  },
};
