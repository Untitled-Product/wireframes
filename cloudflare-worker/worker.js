/**
 * Wireframe PIN Authentication Worker
 *
 * Path-based routing: wireframes.untitledproduct.com/{project}
 * Ornek: wireframes.untitledproduct.com/legends -> PIN: 1234
 */

const COOKIE_NAME = 'wireframe_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 gun

// Bilinen static asset uzantilari
const STATIC_EXTENSIONS = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

// Login sayfasi HTML
function getLoginPage(project, error = null) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wireframe Erisimi - ${project}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo svg {
      width: 48px;
      height: 48px;
      color: #14b8a6;
    }
    h1 {
      text-align: center;
      font-size: 24px;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .subtitle {
      text-align: center;
      color: #64748b;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .project-badge {
      display: inline-block;
      background: #f0fdfa;
      color: #0d9488;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 500;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      text-align: center;
      letter-spacing: 8px;
      font-weight: 600;
    }
    input:focus {
      outline: none;
      border-color: #14b8a6;
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
    }
    button {
      width: 100%;
      padding: 12px;
      background: #14b8a6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 24px;
      transition: background 0.2s;
    }
    button:hover {
      background: #0d9488;
    }
    .error {
      background: #fef2f2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      color: #94a3b8;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
    </div>
    <h1>Wireframe Erisimi</h1>
    <p class="subtitle">
      <span class="project-badge">${project}</span>
    </p>
    ${error ? `<div class="error">${error}</div>` : ''}
    <form method="POST">
      <label for="pin">PIN Kodu</label>
      <input type="password" id="pin" name="pin" maxlength="6" pattern="[0-9]{4,6}" required autofocus placeholder="••••">
      <button type="submit">Giris Yap</button>
    </form>
    <p class="footer">Untitled Product Wireframes</p>
  </div>
</body>
</html>`;
}

// Cookie olustur (proje bazli)
function createAuthCookie(project, pin) {
  const token = btoa(JSON.stringify({ project, pin, ts: Date.now() }));
  return `${COOKIE_NAME}_${project}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`;
}

// Cookie'den auth bilgisi al
function getAuthFromCookie(request, project) {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;

  const cookieName = `${COOKIE_NAME}_${project}`;
  const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`));
  if (!match) return null;

  try {
    return JSON.parse(atob(match[1]));
  } catch {
    return null;
  }
}

// Herhangi bir proje icin auth cookie var mi?
function getAnyAuthFromCookie(request) {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;

  const match = cookie.match(new RegExp(`${COOKIE_NAME}_([^=]+)=([^;]+)`));
  if (!match) return null;

  try {
    return JSON.parse(atob(match[2]));
  } catch {
    return null;
  }
}

// Path'den proje adini cikar
function getProjectFromPath(pathname) {
  // /legends/index.html -> legends
  // /legends -> legends
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0) {
    return parts[0].toLowerCase();
  }
  return null;
}

// Proje path'inden sonraki path'i al
function getSubPath(pathname, project) {
  // /legends/src/pages/admin/ticket-list.html -> /src/pages/admin/ticket-list.html
  const prefix = `/${project}`;
  if (pathname.startsWith(prefix)) {
    const subPath = pathname.slice(prefix.length);
    return subPath || '/';
  }
  return '/';
}

// Static asset mi?
function isStaticAsset(pathname) {
  return STATIC_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));
}

// Referer'dan proje adini cikar
function getProjectFromReferer(request) {
  const referer = request.headers.get('Referer');
  if (!referer) return null;

  try {
    const refUrl = new URL(referer);
    return getProjectFromPath(refUrl.pathname);
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Root path - proje listesi (opsiyonel)
    if (pathname === '/' || pathname === '') {
      return new Response('Wireframes - Proje secin: /legends', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Proje adini al
    let project = getProjectFromPath(pathname);
    let subPath = pathname;
    let isOrphanAsset = false;

    // Eger path bir proje degil ama static asset ise (ornegin /dist/output.css)
    // Referer'dan veya cookie'den proje bulmaya calis
    if (project) {
      const projectData = await env.WIREFRAME_PROJECTS.get(`projects/${project}`, 'json');

      if (!projectData && isStaticAsset(pathname)) {
        // Bu bir proje degil, asset path - referer veya cookie'den proje bul
        isOrphanAsset = true;
        project = getProjectFromReferer(request);

        if (!project) {
          // Cookie'den dene
          const auth = getAnyAuthFromCookie(request);
          if (auth && auth.project) {
            project = auth.project;
          }
        }

        if (project) {
          subPath = pathname; // /dist/output.css oldugu gibi kalsin
        }
      }
    }

    if (!project) {
      return new Response('Project not found', { status: 404 });
    }

    // KV'den proje bilgisini al
    const projectData = await env.WIREFRAME_PROJECTS.get(`projects/${project}`, 'json');

    if (!projectData) {
      return new Response('Project not found', { status: 404 });
    }

    // Auth kontrolu
    const auth = getAuthFromCookie(request, project);
    const isAuthenticated = auth && auth.project === project && auth.pin === projectData.pin;

    // Static asset ve authenticated ise direkt serve et
    if (isOrphanAsset && isAuthenticated) {
      const pagesUrl = `https://${projectData.pages_project}.pages.dev${subPath}${url.search}`;
      const response = await fetch(pagesUrl, {
        method: request.method,
        headers: request.headers
      });
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    }

    // POST - Login islemi
    if (request.method === 'POST' && !isAuthenticated) {
      const formData = await request.formData();
      const pin = formData.get('pin');

      if (pin === projectData.pin) {
        // Basarili giris
        return new Response(null, {
          status: 302,
          headers: {
            'Location': pathname,
            'Set-Cookie': createAuthCookie(project, pin)
          }
        });
      } else {
        // Yanlis PIN
        return new Response(getLoginPage(projectData.name || project, 'Yanlis PIN kodu'), {
          status: 401,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // Authenticated degilse login sayfasi goster
    if (!isAuthenticated) {
      return new Response(getLoginPage(projectData.name || project), {
        status: 401,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Authenticated - Cloudflare Pages'e proxy yap
    if (!isOrphanAsset) {
      subPath = getSubPath(pathname, project);
    }
    const pagesUrl = `https://${projectData.pages_project}.pages.dev${subPath}${url.search}`;

    const response = await fetch(pagesUrl, {
      method: request.method,
      headers: request.headers
    });

    // Response'u dondur
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });
  }
};
