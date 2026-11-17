const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {'.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { res.writeHead(400).end('Solicitud inválida'); return; }
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = path.resolve(root, '.' + requested);
  if (!file.startsWith(root + path.sep) || !types[path.extname(file).toLowerCase()]) {
    res.writeHead(404).end('No encontrado');
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end('No encontrado'); return; }
    res.writeHead(200, {'Content-Type': types[path.extname(file).toLowerCase()], 'X-Content-Type-Options': 'nosniff'});
    if (req.method === 'HEAD') res.end(); else res.end(data);
  });
}).listen(port, '0.0.0.0', () => console.log('REX escuchando en puerto ' + port));
