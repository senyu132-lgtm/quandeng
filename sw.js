// 全等题库的离线缓存。版本 3b1c88c21cda（由 web/scripts/make-pages.mjs 生成，别手改）
const VERSION = '3b1c88c21cda';
const CACHE = 'qd-' + VERSION;
const FILES = ['./', './manifest.webmanifest', './icon-180.png', './icon-512.png'];
self.addEventListener('install', function (e) {
  // no-cache：有缓存时先问服务器有没有变（没变只回一个 304，不重新下载 11 MB）
  e.waitUntil(caches.open(CACHE)
    .then(function (c) { return c.addAll(FILES.map(function (u) { return new Request(u, { cache: 'no-cache' }); })); })
    .then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys()
    .then(function (keys) { return Promise.all(keys.filter(function (k) { return k.indexOf('qd-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
    .then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match('./').then(function (hit) { return hit || fetch(req); });
    }));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || fetch(req); }));
});
