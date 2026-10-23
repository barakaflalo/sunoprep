/* ── AppNest · Cloudflare Pages fix (Oct 2026) ──
   Cloudflare redirects *.html to clean URLs (/index.html -> /). Chrome refuses a
   "redirected" response that a Service Worker hands to a page load (ERR_FAILED).
   This strips the redirect flag from every response the SW fetches or reads from cache. */
(function(){
  var NB={101:1,204:1,205:1,304:1};
  function clean(r){
    if(!r||!r.redirected||NB[r.status])return r;
    return r.blob().then(function(b){return new Response(b,{status:r.status,statusText:r.statusText,headers:r.headers});});
  }
  var _fetch=self.fetch.bind(self);
  self.fetch=function(input,init){
    if(input&&typeof input==='object'&&input.mode==='navigate')input=input.url;
    return _fetch(input,init).then(clean);
  };
  var cm=Cache.prototype.match;
  Cache.prototype.match=function(){return cm.apply(this,arguments).then(clean);};
  var sm=CacheStorage.prototype.match;
  CacheStorage.prototype.match=function(){return sm.apply(this,arguments).then(clean);};
})();

const CACHE = 'sunoprep-v11.1';
const ASSETS = ['./','./index.html','./app.js','./appnest-assistant.js','./manifest.json','./icon-192.png','./icon-512.png',
  './vendor/react.production.min.js','./vendor/react-dom.production.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.anthropic.com') || e.request.url.includes('googleapis.com') || e.request.url.includes('openai.com')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.status === 200) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
