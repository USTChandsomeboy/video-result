import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, extname, sep} from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 8770);
const host = process.env.HOST || '127.0.0.1';
const types = {'.html':'text/html; charset=utf-8','.mp4':'video/mp4','.jpg':'image/jpeg','.md':'text/plain; charset=utf-8','.json':'application/json'};
http.createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405).end();return;}
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = resolve(root, '.' + (pathname === '/' ? '/compare.html' : pathname));
    if (!file.startsWith(root.endsWith(sep) ? root : root+sep)) {res.writeHead(403).end();return;}
    const info = await stat(file);
    if (!info.isFile()) {res.writeHead(404).end();return;}
    let start=0,end=info.size-1,status=200;
    const headers={'Content-Type':types[extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
    if (req.headers.range) {
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1]&&!match[2])) {res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      start=match[1]?Number(match[1]):Math.max(0,info.size-Number(match[2]));
      end=match[1]&&match[2]?Math.min(end,Number(match[2])):end;
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(status,headers);
    if(req.method==='HEAD'){res.end();return;}
    const stream=createReadStream(file,{start,end});
    stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
  } catch {if(!res.headersSent)res.writeHead(404);res.end();}
}).listen(port,host,()=>console.log(`Compare: http://${host === '0.0.0.0' ? '<本机局域网 IP>' : host}:${port}/compare.html`));
