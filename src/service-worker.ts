/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import * as constants from './constants/app';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
cleanupOutdatedCaches();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  }),
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    (async () => {
      const keys = await caches.keys();
      keys.forEach(async (key) => {
        if (key.startsWith('workbox-precache')) {
          await caches.delete(key);
        }
      });
      self.skipWaiting();
    })();
  }
});

// Any other custom service worker logic can go here.

// handling fetch
self.addEventListener('fetch', (event) => {
  // send request
  const response = (async () => await fetch(event.request))();

  // not get method
  if (event.request.method !== 'GET') {
    event.respondWith(response);
    return;
  }

  const host = `${self.location.protocol}//${self.location.host}`;
  const cacheKey = `${constants.CACHE_NAME}-${constants.CACHE_VERSION}-${host}`;

  event.respondWith(
    response
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        const cacheRequest =
          constants.CACHE_REQUEST_PATH_PREFIX.filter((prefix) =>
            event.request.url.includes(prefix),
          ).length > 0;

        // update cache
        if (cacheRequest) {
          const cacheResponse = response.clone();
          // open cacheStorage.
          caches
            .open(cacheKey)
            .then((cache) => cache.put(event.request, cacheResponse));
        }
        return response;
      })
      .catch(() => {
        // open cacheStorage.
        return caches.open(cacheKey).then((cache) =>
          cache.match(event.request).then((cacheResponse) => {
            // found cache.
            if (cacheResponse) {
              return cacheResponse;
            }
            return response;
          }),
        );
      }),
  );
});

// handling activate
self.addEventListener('activate', (event) => {
  const host = `${self.location.protocol}//${self.location.host}`;

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => {
            const [cacheName, cacheVersion] = key.split('-');
            const cacheHost = key.substring(
              `${cacheName}-${cacheVersion}-`.length,
            );
            return (
              cacheName === constants.CACHE_NAME &&
              cacheVersion !== constants.CACHE_VERSION &&
              cacheHost === host
            );
          })
          .map((key) => caches.delete(key)),
      );
    }),
  );
});
