/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
// export empty type because of tsc --isolatedModules flag

export type {};

declare const self: ServiceWorkerGlobalScope;
  
// Any other custom service worker logic can go here.
self.addEventListener('push', (event) => {
  const payload = event.data?.json() as {
    title: string;
    options: Record<string, any>;
  }

  event.waitUntil(
    self.registration.showNotification(payload?.title, payload.options)
  )
});