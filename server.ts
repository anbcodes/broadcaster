import { IncomingMessage, createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import serveHandler from 'serve-handler';
import { readFile, writeFile } from 'fs/promises';

const dataFile = './data.json';

const getBody = (req: IncomingMessage) => new Promise<string>((resolve) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    resolve(body);
  });
})

const server = createServer(async (req, res) => {
  if (!req.url) return;

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/data') {
    if (req.method === 'GET') {
      res.setHeader('content-type', 'application/json');
      try {
        res.write(await readFile(dataFile, 'utf-8'));
      } catch (e) {
        console.log(e);
        res.write(JSON.stringify([]));
      }
      res.end();
      return;
    } else if (req.method === 'POST') {
      const body = await getBody(req);
      let current: any[] = [];
      try {
        current = JSON.parse(await readFile(dataFile, 'utf-8'));
      } catch (e) {
        console.log(e);
      }

      current.push(JSON.parse(body))

      await writeFile(dataFile, JSON.stringify(current));
      res.statusCode = 200;
      res.end();
      return;
    }
  }

  return serveHandler(req, res, {
    public: './public',
  });
})

server.listen({ port: +(process.argv[2] ?? 8080), hostname: '0.0.0.0' }, () => {
  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    console.log(`Listening on ${addr}`);
  } else {
    console.log(`Listening on http://0.0.0.0:${addr.port}`)
  }
});
