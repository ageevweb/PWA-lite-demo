const staticCacheName = 's-app-v3' // при изменении версии чистим кеши
const dynamicCacheName = 'd-app-v3'

const assetUrls = [
  'index.html',
  'index.js',
  'style.css',
  'offline.html'
]

self.addEventListener('install', async event => {
  
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
})

self.addEventListener('activate', async event => {
  console.log('SW: activate')

  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', event => {
  // вначале загружаем данные из кеша и если их там нету, то из сети
  // casheFirst
  // networkFirs

  const {request} = event

  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})


async function cacheFirst(request) {
  // кэш проверяет есть ли в нем данные которые мы запрашиваем, если нет - то вызываем fetch 
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/offline.html')
  }
}