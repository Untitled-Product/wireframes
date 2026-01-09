/**
 * Wireframe PIN Authentication Worker
 *
 * Bu worker proje bazli subdomain'leri PIN ile korur.
 * Ornek: legends.wireframes.untitledproduct.com -> PIN: 1234
 *
 * KV Namespace'de saklanacak veriler:
 * - projects/{project}: { pin: "1234", name: "Legends DXP", pages_project: "legends-wireframes" }
 */

const COOKIE_NAME = 'wireframe_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 gun

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

// Cookie olustur
function createAuthCookie(project, pin) {
  const token = btoa(JSON.stringify({ project, pin, ts: Date.now() }));
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`;
}

// Cookie'den auth bilgisi al
function getAuthFromCookie(request) {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;

  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;

  try {
    return JSON.parse(atob(match[1]));
  } catch {
    return null;
  }
}

// Subdomain'den proje adini cikar
function getProjectFromHost(host) {
  // legends.wireframes.untitledproduct.com -> legends
  const parts = host.split('.');
  if (parts.length >= 4 && parts[1] === 'wireframes') {
    return parts[0].toLowerCase();
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname;

    // Proje adini al
    const project = getProjectFromHost(host);

    if (!project) {
      return new Response('Invalid subdomain', { status: 400 });
    }

    // KV'den proje bilgisini al
    const projectData = await env.WIREFRAME_PROJECTS.get(`projects/${project}`, 'json');

    if (!projectData) {
      return new Response('Project not found', { status: 404 });
    }

    // Auth kontrolu
    const auth = getAuthFromCookie(request);
    const isAuthenticated = auth && auth.project === project && auth.pin === projectData.pin;

    // POST - Login islemi
    if (request.method === 'POST' && !isAuthenticated) {
      const formData = await request.formData();
      const pin = formData.get('pin');

      if (pin === projectData.pin) {
        // Basarili giris - Cloudflare Pages'e yonlendir
        const pagesUrl = `https://${projectData.pages_project}.pages.dev${url.pathname}`;

        return new Response(null, {
          status: 302,
          headers: {
            'Location': url.pathname,
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
    const pagesUrl = `https://${projectData.pages_project}.pages.dev${url.pathname}${url.search}`;

    const response = await fetch(pagesUrl, {
      method: request.method,
      headers: request.headers
    });

    // Response'u dondur (cache header'lari koruyarak)
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });
  }
};
