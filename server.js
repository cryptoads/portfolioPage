const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;
const linkRooms = {};
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request, callback) {
  let body = '';

  request.on('data', chunk => {
    body += chunk;

    if (body.length > 4096) {
      request.destroy();
    }
  });

  request.on('end', () => {
    callback(body);
  });
}

function normalizeRoom(room) {
  return String(room || 'black-vault').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32) || 'black-vault';
}

const server = http.createServer((request, response) => {
  const cleanPath = decodeURIComponent(request.url.split('?')[0]);

  if (cleanPath === '/api/link' && request.method === 'GET') {
    const requestUrl = new URL(request.url, 'http://localhost');
    const room = normalizeRoom(requestUrl.searchParams.get('room'));
    sendJson(response, 200, { messages: linkRooms[room] || [] });
    return;
  }

  if (cleanPath === '/api/link' && request.method === 'POST') {
    readRequestBody(request, body => {
      let payload = {};

      try {
        payload = JSON.parse(body);
      } catch (error) {
        sendJson(response, 400, { error: 'invalid json' });
        return;
      }

      const room = normalizeRoom(payload.room);
      const message = {
        alias: String(payload.alias || 'operator').replace(/[^\w-]/g, '').slice(0, 24) || 'operator',
        text: String(payload.text || '').slice(0, 280),
        at: Date.now()
      };

      if (!message.text.trim()) {
        sendJson(response, 400, { error: 'empty message' });
        return;
      }

      linkRooms[room] = (linkRooms[room] || []).concat(message).slice(-40);
      sendJson(response, 200, { messages: linkRooms[room] });
    });
    return;
  }

  const requestedPath = cleanPath === '/' ? '/index.html' : cleanPath;
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, 'index.html'), (fallbackError, fallback) => {
        if (fallbackError) {
          response.writeHead(404);
          response.end('Not found');
          return;
        }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(fallback);
      });
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
    });
    response.end(data);
  });
});

server.listen(port, () => {
  console.log('Serving portfolio on port ' + port);
});
