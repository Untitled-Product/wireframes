/**
 * Wireframe PIN Authentication Worker
 *
 * Path-based routing: wireframes.untitledproduct.com/{project}
 * Ornek: wireframes.untitledproduct.com/legends -> PIN: 1234
 */

const COOKIE_NAME = 'wireframe_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 gun

// Bilinen asset uzantilari (static + html)
const ASSET_EXTENSIONS = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.html', '.htm'];

// Bilinen proje disindaki path'ler (ornegin /src, /dist, /index.html)
const NON_PROJECT_PATHS = ['src', 'dist', 'index.html', 'assets', 'js', 'css', 'images', 'fonts'];

// Login sayfasi HTML - Modern Dark Style
function getLoginPage(project, error = null) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wireframe Erisimi - ${project}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f0f;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #1a1a1a;
      border-radius: 12px;
      border: 1px solid #2d2d2d;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
      padding: 48px 40px;
      width: 100%;
      max-width: 400px;
    }
    .logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto;
      background: #0d9488;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-icon svg {
      width: 32px;
      height: 32px;
    }
    h1 {
      text-align: center;
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .subtitle {
      text-align: center;
      color: #888888;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .project-badge {
      display: inline-block;
      background: rgba(13, 148, 136, 0.15);
      color: #0d9488;
      padding: 6px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      text-transform: capitalize;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #888888;
      margin-bottom: 8px;
    }
    input {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid #3d3d3d;
      border-radius: 8px;
      font-size: 18px;
      font-family: inherit;
      text-align: center;
      letter-spacing: 8px;
      font-weight: 500;
      background: #252525;
      color: #ffffff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    input:focus {
      outline: none;
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2);
    }
    input::placeholder {
      color: #555555;
      letter-spacing: 4px;
    }
    button {
      width: 100%;
      padding: 14px;
      background: #0d9488;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      margin-top: 24px;
      transition: background 0.15s, transform 0.1s;
    }
    button:hover {
      background: #0f766e;
    }
    button:active {
      transform: scale(0.98);
    }
    .error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 12px 16px;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #555555;
      font-size: 12px;
      padding-top: 24px;
      border-top: 1px solid #2d2d2d;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <h1>Wireframe Access</h1>
    <p class="subtitle">
      <span class="project-badge">${project}</span>
    </p>
    ${error ? `<div class="error">${error}</div>` : ''}
    <form method="POST">
      <label for="pin">PIN Code</label>
      <input type="password" id="pin" name="pin" maxlength="6" pattern="[0-9]{4,6}" required autofocus placeholder="••••">
      <button type="submit">Continue</button>
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

// Asset dosyasi mi? (html dahil)
function isAssetFile(pathname) {
  return ASSET_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));
}

// Proje olmayan path mi? (src, dist gibi)
function isNonProjectPath(firstSegment) {
  return NON_PROJECT_PATHS.includes(firstSegment.toLowerCase());
}

// Referer'dan proje adini cikar
function getProjectFromReferer(request) {
  const referer = request.headers.get('Referer');
  if (!referer) return null;

  try {
    const refUrl = new URL(referer);
    const refPath = refUrl.pathname;
    const firstSegment = getProjectFromPath(refPath);

    // Eger referer'in ilk segmenti de bilinen non-project path ise, null don
    // (ornegin /src/pages/admin/ticket-list.html -> src -> non-project)
    if (firstSegment && isNonProjectPath(firstSegment)) {
      return null;
    }

    return firstSegment;
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

    // Eger path bir proje degil ama asset ise (ornegin /dist/output.css, /src/pages/admin/ticket-list.html)
    // Referer'dan veya cookie'den proje bulmaya calis
    if (project) {
      // Oncelikle bu bir bilinen non-project path mi kontrol et (src, dist, vs)
      const isKnownNonProject = isNonProjectPath(project);

      // Ya da KV'de proje olarak kayitli degil ve asset dosyasi mi?
      let projectData = null;
      if (!isKnownNonProject) {
        projectData = await env.WIREFRAME_PROJECTS.get(`projects/${project}`, 'json');
      }

      if (isKnownNonProject || (!projectData && isAssetFile(pathname))) {
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
          subPath = pathname; // /src/pages/admin/ticket-list.html oldugu gibi kalsin
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
