// The prototype has been replaced by the actual Pages CMS editor.
const http = require('node:http');
http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(302, { Location: 'https://app.pagescms.org', 'Cache-Control': 'no-store' });
    res.end();
  } else {
    res.writeHead(410, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Use Pages CMS to edit this website.' }));
  }
}).listen(3002, '127.0.0.1', () => console.log('Open https://app.pagescms.org to edit the website.'));
