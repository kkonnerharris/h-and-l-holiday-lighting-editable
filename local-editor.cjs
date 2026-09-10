// Local-only preview editor. Production editing uses Pages CMS and GitHub login.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const origin = 'http://localhost:3002';
const contentFile = path.join(__dirname, 'content/site.json');
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '.pages.yml'), 'utf8'));
function validate(value, fields, location = 'site') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(location + ' must be an object');
  for (const field of fields) {
    const entry = value[field.name];
    const label = location + '.' + field.name;
    if (field.list) {
      if (!Array.isArray(entry)) throw Error(label + ' must be a list');
      entry.forEach(item => validate(item, field.fields, label));
    } else if (field.type === 'object') validate(entry, field.fields, label);
    else {
      if (typeof entry !== 'string' || (field.required && !entry.trim())) throw Error(field.label + ' is required');
      if (field.pattern && !new RegExp(field.pattern).test(entry)) throw Error(field.label + ' is invalid');
      if (field.type === 'select' && !field.options.values.includes(entry)) throw Error(field.label + ' is invalid');
      if (field.type === 'image') {
        if (!entry.startsWith('/images/projects/')) throw Error('Choose a photo from the gallery image folder');
        const base = path.resolve(__dirname, 'public/images/projects');
        const image = path.resolve(__dirname, 'public', entry.slice(1));
        if (!image.startsWith(base + path.sep) || !fs.existsSync(image)) throw Error('Image does not exist');
      }
    }
  }
}
http.createServer(async (req, res) => {
  const reply = (status, body, type = 'application/json') => { res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };
  if (!['localhost:3002', '127.0.0.1:3002'].includes(req.headers.host)) return reply(403, { error: 'Local access only' });
  try {
    if (req.method === 'GET' && req.url === '/') return reply(200, fs.readFileSync(path.join(__dirname, 'local-editor.html'), 'utf8'), 'text/html; charset=utf-8');
    if (req.method === 'GET' && req.url === '/content') return reply(200, { schema, content: JSON.parse(fs.readFileSync(contentFile, 'utf8')) });
    if (req.method !== 'POST' || req.headers.origin !== origin) return reply(403, { error: 'Open the local editor to save changes' });
    const chunks = []; let bytes = 0;
    for await (const chunk of req) { bytes += chunk.length; if (bytes > 15 * 1024 * 1024) return reply(413, { error: 'Maximum upload size is 15 MB' }); chunks.push(chunk); }
    const buffer = Buffer.concat(chunks);
    if (req.url === '/content') {
      const content = JSON.parse(buffer.toString()); validate(content, schema.content[0].fields);
      const temporary = contentFile + '.tmp'; fs.writeFileSync(temporary, JSON.stringify(content, null, 2) + '\n'); fs.renameSync(temporary, contentFile);
      return reply(200, { ok: true });
    }
    if (req.url === '/upload') {
      const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
      const ext = extensions[req.headers['content-type']]; if (!ext) return reply(400, { error: 'Choose JPG, PNG, WebP, GIF, or AVIF' });
      const name = 'upload-' + require('node:crypto').randomUUID() + '.' + ext;
      fs.writeFileSync(path.join(__dirname, 'public/images/projects', name), buffer, { flag: 'wx' });
      return reply(200, { path: '/images/projects/' + name });
    }
    reply(404, { error: 'Not found' });
  } catch (error) { reply(400, { error: error.message }); }
}).listen(3002, '127.0.0.1', () => console.log('Separate site editor: ' + origin));
