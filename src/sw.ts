/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';

interface PushPayload {
    title?: string;
    body?: string;
    url?: string;
}

declare const self: ServiceWorkerGlobalScope & {
    __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
    const payload = (event.data?.json() ?? {}) as PushPayload;
    const title = payload.title ?? "Today's contemplation is ready";
    const options: NotificationOptions = {
        body: payload.body ?? 'Sit with the daily prompt when you are ready.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'noself-practice-reminder',
        data: {
            url: payload.url ?? '/#/practice/prompts',
        },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = String(event.notification.data?.url ?? '/#/practice/prompts');
    const targetUrl = new URL(url, self.location.origin).href;

    event.waitUntil(
        self.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then(async (clients) => {
                for (const client of clients) {
                    if ('focus' in client) {
                        await client.focus();
                        client.postMessage({ type: 'noself:navigate', url: targetUrl });
                        return;
                    }
                }

                await self.clients.openWindow(targetUrl);
            }),
    );
});
