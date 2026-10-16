/* Offline cache for the iPhone / web version. Map tiles are stored by the app itself. */
const CACHE='fmn-ios-v5';
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(async c=>{
  await c.addAll(CORE);
  for(const u of CDN){ try{ const r=await fetch(u,{mode:'cors'}); if(r.ok) await c.put(u,r); }catch(_){} }
}).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  const lib=u.hostname==='cdnjs.cloudflare.com'||u.hostname==='unpkg.com';
  if(u.origin!==location.origin&&!lib) return;   /* maps, elevation, updates go to the network */
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{ if(r&&r.ok) c.put(e.request,r.clone()); return r; }).catch(()=>hit);
    return hit||net;   /* cached copy first, refreshed in the background */
  }));
});
