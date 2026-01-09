/**
 * Wireframe Comments API
 * Cloudflare Worker with D1 Database
 */

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
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
  async fetch(request: Request, env: Env): Promise<Response> {
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

        let query = 'SELECT * FROM comments WHERE 1=1';
        const params: any[] = [];

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

        return jsonResponse({ comment: updated, message: 'Comment updated' }, 200, cors);
      }

      // DELETE /comments/:id - Delete comment
      if (path.match(/^\/comments\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[2];

        await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();

        return jsonResponse({ message: 'Comment deleted' }, 200, cors);
      }

      // POST /comments/:id/replies - Add reply
      if (path.match(/^\/comments\/\d+\/replies$/) && method === 'POST') {
        const commentId = path.split('/')[2];
        const body = await request.json() as Reply;

        if (!body.author_name || !body.content) {
          return errorResponse('author_name and content are required', 400, cors);
        }

        // Check if comment exists
        const comment = await env.DB
          .prepare('SELECT id FROM comments WHERE id = ?')
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

        return jsonResponse({ reply: newReply, message: 'Reply added' }, 201, cors);
      }

      // GET /stats - Get comment statistics
      if (path === '/stats' && method === 'GET') {
        const pageId = url.searchParams.get('page_id');

        let whereClause = '';
        const params: any[] = [];

        if (pageId) {
          whereClause = 'WHERE page_id = ?';
          params.push(pageId);
        }

        const totalResult = await env.DB
          .prepare(`SELECT COUNT(*) as count FROM comments ${whereClause}`)
          .bind(...params)
          .first();

        const openResult = await env.DB
          .prepare(`SELECT COUNT(*) as count FROM comments ${whereClause ? whereClause + ' AND' : 'WHERE'} status = 'open'`)
          .bind(...params)
          .first();

        const resolvedResult = await env.DB
          .prepare(`SELECT COUNT(*) as count FROM comments ${whereClause ? whereClause + ' AND' : 'WHERE'} status = 'resolved'`)
          .bind(...params)
          .first();

        const byPageResult = await env.DB
          .prepare(`
            SELECT page_id, COUNT(*) as count,
                   SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count
            FROM comments
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
