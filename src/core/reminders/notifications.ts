import { getDailyConcept } from '../dailyConcept.js';
import { getReminderPreferences, setReminderPreferences } from './preferences.js';
import type { ReminderType } from './preferences.js';

interface NotificationPayload {
    title: string;
    body: string;
    url: string;
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

function getPayload(type: ReminderType): NotificationPayload {
    if (type === 'daily-concept') {
        const concept = getDailyConcept();
        return {
            title: "Today's concept",
            body: concept.title,
            url: `#/concept/${concept.id}`,
        };
    }

    if (type === 'meditation') {
        return {
            title: 'A quiet minute is available now',
            body: 'Return to the breath when you are ready.',
            url: '#/practice/meditate',
        };
    }

    return {
        title: "Today's contemplation is ready",
        body: 'Sit with the daily prompt when you are ready.',
        url: '#/practice/prompts',
    };
}

function urlBase64ToUint8Array(value: string): Uint8Array {
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const output = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
        output[i] = rawData.charCodeAt(i);
    }

    return output;
}

function pushApplicationServerKey(value: string): ArrayBuffer {
    const bytes = urlBase64ToUint8Array(value);
    return bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
}

function areNotificationsSupported(): boolean {
    return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
    return areNotificationsSupported() ? Notification.permission : 'unsupported';
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!areNotificationsSupported()) return 'denied';
    const permission = await Notification.requestPermission();
    setReminderPreferences({ browserNotificationsEnabled: permission === 'granted' });
    return permission;
}

export function showPracticeNotification(type: ReminderType): boolean {
    const preferences = getReminderPreferences();
    if (
        !preferences.browserNotificationsEnabled ||
        !areNotificationsSupported() ||
        Notification.permission !== 'granted'
    ) {
        return false;
    }

    const payload = getPayload(type);
    const notification = new Notification(payload.title, {
        body: payload.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: `noself-${type}`,
    });
    notification.addEventListener('click', () => {
        window.focus();
        window.location.hash = payload.url;
        notification.close();
    });

    return true;
}

export async function subscribeToPushReminders(): Promise<boolean> {
    if (
        !VAPID_PUBLIC_KEY ||
        !('serviceWorker' in navigator) ||
        !('PushManager' in window)
    ) {
        return false;
    }

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') return false;

    const registration = await navigator.serviceWorker.ready;
    const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: pushApplicationServerKey(VAPID_PUBLIC_KEY),
        }));

    const preferences = getReminderPreferences();
    const response = await fetch('/.netlify/functions/save-push-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subscription,
            preferences,
        }),
    });

    if (!response.ok) return false;
    setReminderPreferences({ enabled: true, browserNotificationsEnabled: true });
    return true;
}

export async function unsubscribeFromPushReminders(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setReminderPreferences({ browserNotificationsEnabled: false });
        return true;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
        await fetch('/.netlify/functions/delete-push-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
    }

    setReminderPreferences({ browserNotificationsEnabled: false });
    return true;
}
