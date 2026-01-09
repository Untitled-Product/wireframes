var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-RDb3ik/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-RDb3ik/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/index.ts
function corsHeaders(origin, allowedOrigins) {
  const origins = allowedOrigins.split(",");
  const isAllowed = origins.includes(origin) || origins.includes("*");
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : origins[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}
__name(corsHeaders, "corsHeaders");
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(message, status = 400, headers = {}) {
  return jsonResponse({ error: message }, status, headers);
}
__name(errorResponse, "errorResponse");
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS || "*");
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    try {
      const path = url.pathname;
      const method = request.method;
      if (path === "/comments" && method === "GET") {
        const pageId = url.searchParams.get("page_id");
        const status = url.searchParams.get("status");
        let query = "SELECT * FROM comments WHERE 1=1";
        const params = [];
        if (pageId) {
          query += " AND page_id = ?";
          params.push(pageId);
        }
        if (status) {
          query += " AND status = ?";
          params.push(status);
        }
        query += " ORDER BY created_at DESC";
        const { results } = await env.DB.prepare(query).bind(...params).all();
        const commentsWithReplies = await Promise.all(
          results.map(async (comment) => {
            const { results: replies } = await env.DB.prepare("SELECT * FROM replies WHERE comment_id = ? ORDER BY created_at ASC").bind(comment.id).all();
            return { ...comment, replies };
          })
        );
        return jsonResponse({ comments: commentsWithReplies }, 200, cors);
      }
      if (path.match(/^\/comments\/\d+$/) && method === "GET") {
        const id = path.split("/")[2];
        const comment = await env.DB.prepare("SELECT * FROM comments WHERE id = ?").bind(id).first();
        if (!comment) {
          return errorResponse("Comment not found", 404, cors);
        }
        const { results: replies } = await env.DB.prepare("SELECT * FROM replies WHERE comment_id = ? ORDER BY created_at ASC").bind(id).all();
        return jsonResponse({ comment: { ...comment, replies } }, 200, cors);
      }
      if (path === "/comments" && method === "POST") {
        const body = await request.json();
        if (!body.page_id || !body.author_name || !body.content) {
          return errorResponse("page_id, author_name, and content are required", 400, cors);
        }
        const result = await env.DB.prepare(`
            INSERT INTO comments (page_id, x_position, y_position, element_selector, author_name, author_email, content, status, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
          body.page_id,
          body.x_position || null,
          body.y_position || null,
          body.element_selector || null,
          body.author_name,
          body.author_email || null,
          body.content,
          body.status || "open",
          body.priority || "normal"
        ).run();
        const newComment = await env.DB.prepare("SELECT * FROM comments WHERE id = ?").bind(result.meta.last_row_id).first();
        return jsonResponse({ comment: newComment, message: "Comment created" }, 201, cors);
      }
      if (path.match(/^\/comments\/\d+$/) && method === "PUT") {
        const id = path.split("/")[2];
        const body = await request.json();
        const updates = [];
        const values = [];
        if (body.content !== void 0) {
          updates.push("content = ?");
          values.push(body.content);
        }
        if (body.status !== void 0) {
          updates.push("status = ?");
          values.push(body.status);
          if (body.status === "resolved") {
            updates.push("resolved_at = CURRENT_TIMESTAMP");
            if (body.resolved_by) {
              updates.push("resolved_by = ?");
              values.push(body.resolved_by);
            }
          }
        }
        if (body.priority !== void 0) {
          updates.push("priority = ?");
          values.push(body.priority);
        }
        if (updates.length === 0) {
          return errorResponse("No fields to update", 400, cors);
        }
        updates.push("updated_at = CURRENT_TIMESTAMP");
        values.push(id);
        await env.DB.prepare(`UPDATE comments SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
        const updated = await env.DB.prepare("SELECT * FROM comments WHERE id = ?").bind(id).first();
        return jsonResponse({ comment: updated, message: "Comment updated" }, 200, cors);
      }
      if (path.match(/^\/comments\/\d+$/) && method === "DELETE") {
        const id = path.split("/")[2];
        await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
        return jsonResponse({ message: "Comment deleted" }, 200, cors);
      }
      if (path.match(/^\/comments\/\d+\/replies$/) && method === "POST") {
        const commentId = path.split("/")[2];
        const body = await request.json();
        if (!body.author_name || !body.content) {
          return errorResponse("author_name and content are required", 400, cors);
        }
        const comment = await env.DB.prepare("SELECT id FROM comments WHERE id = ?").bind(commentId).first();
        if (!comment) {
          return errorResponse("Comment not found", 404, cors);
        }
        const result = await env.DB.prepare(`
            INSERT INTO replies (comment_id, author_name, author_email, content)
            VALUES (?, ?, ?, ?)
          `).bind(commentId, body.author_name, body.author_email || null, body.content).run();
        const newReply = await env.DB.prepare("SELECT * FROM replies WHERE id = ?").bind(result.meta.last_row_id).first();
        return jsonResponse({ reply: newReply, message: "Reply added" }, 201, cors);
      }
      if (path === "/stats" && method === "GET") {
        const pageId = url.searchParams.get("page_id");
        let whereClause = "";
        const params = [];
        if (pageId) {
          whereClause = "WHERE page_id = ?";
          params.push(pageId);
        }
        const totalResult = await env.DB.prepare(`SELECT COUNT(*) as count FROM comments ${whereClause}`).bind(...params).first();
        const openResult = await env.DB.prepare(`SELECT COUNT(*) as count FROM comments ${whereClause ? whereClause + " AND" : "WHERE"} status = 'open'`).bind(...params).first();
        const resolvedResult = await env.DB.prepare(`SELECT COUNT(*) as count FROM comments ${whereClause ? whereClause + " AND" : "WHERE"} status = 'resolved'`).bind(...params).first();
        const byPageResult = await env.DB.prepare(`
            SELECT page_id, COUNT(*) as count,
                   SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count
            FROM comments
            GROUP BY page_id
            ORDER BY count DESC
          `).all();
        return jsonResponse({
          total: totalResult?.count || 0,
          open: openResult?.count || 0,
          resolved: resolvedResult?.count || 0,
          by_page: byPageResult.results
        }, 200, cors);
      }
      return errorResponse("Not found", 404, cors);
    } catch (error) {
      console.error("Error:", error);
      return errorResponse("Internal server error", 500, cors);
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-RDb3ik/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-RDb3ik/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
