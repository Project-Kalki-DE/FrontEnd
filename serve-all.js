/**
 * Local multi-locale server — mirrors the nginx.conf behaviour.
 * Run with: npm run start:all
 * Serves all 3 locales at once so language switching works locally.
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const DIST    = path.join(__dirname, 'dist/front-end/browser');
const PORT    = 4200;
const LOCALES = ['de', 'en', 'tr'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.json': 'application/json',
  '.txt':  'text/plain',
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const BACKEND = { host: '127.0.0.1', port: 3000 };

function proxyToBackend(req, res) {
  const options = {
    hostname: BACKEND.host,
    port: BACKEND.port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };
  const proxy = http.request(options, (backendRes) => {
    res.writeHead(backendRes.statusCode, backendRes.headers);
    backendRes.pipe(res);
  });
  proxy.on('error', () => {
    res.writeHead(502);
    res.end('Backend unavailable');
  });
  req.pipe(proxy);
}

const server = http.createServer((req, res) => {
  const pathname = req.url.split('?')[0];

  // Proxy all /api/* requests to the backend
  if (pathname.startsWith('/api/')) {
    return proxyToBackend(req, res);
  }

  // Redirect bare root → /de/
  if (pathname === '/') {
    res.writeHead(302, { Location: '/de/' });
    return res.end();
  }

  // Detect locale from path prefix
  const locale = LOCALES.find(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!locale) {
    res.writeHead(404);
    return res.end('Not found');
  }

  const localeDir = path.join(DIST, locale);
  let filePath    = path.join(DIST, pathname);

  // Normalise directory requests and unknown files → SPA fallback
  const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
  if (!stat || stat.isDirectory()) {
    filePath = path.join(localeDir, 'index.html');
  }

  serveFile(filePath, res);
});

server.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const lanIp = Object.values(os.networkInterfaces())
    .flat()
    .find(i => i.family === 'IPv4' && !i.internal)?.address || 'YOUR_LAN_IP';

  console.log('\n✓ All locales running at http://localhost:' + PORT);
  console.log('  DE (default): http://localhost:' + PORT + '/de/');
  console.log('  EN:           http://localhost:' + PORT + '/en/');
  console.log('  TR:           http://localhost:' + PORT + '/tr/');
  console.log('\n📱 On your phone (same Wi-Fi):');
  console.log('  http://' + lanIp + ':' + PORT + '/de/');
  console.log('\nLanguage switcher works fully here.\n');
});
