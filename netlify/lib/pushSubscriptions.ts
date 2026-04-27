import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';

export type StoredReminderType = 'daily-prompt' | 'daily-concept' | 'meditation';

export interface StoredPushSubscription {
    id: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    timezone: string;
    reminderHour: number;
    reminderType: StoredReminderType;
    lastSentDate?: string;
    createdAt: string;
    updatedAt: string;
}

interface BrowserPushSubscription {
    endpoint?: string;
    keys?: {
        p256dh?: string;
        auth?: string;
    };
}

interface BrowserReminderPreferences {
    reminderHour?: number;
    reminderType?: string;
    timezone?: string;
}

const STORE_NAME = 'push-subscriptions';

function getSubscriptionStore() {
    return getStore(STORE_NAME);
}

function subscriptionId(endpoint: string): string {
    return createHash('sha256').update(endpoint).digest('hex');
}

function isReminderType(value: unknown): value is StoredReminderType {
    return (
        value === 'daily-prompt' || value === 'daily-concept' || value === 'meditation'
    );
}

function normalizeReminderHour(value: unknown): number {
    const hour = Number(value);
    return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : 9;
}

export function normalizeSubscription(
    subscription: BrowserPushSubscription,
    preferences: BrowserReminderPreferences,
): StoredPushSubscription {
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys.auth) {
        throw new Error('Invalid push subscription');
    }

    const now = new Date().toISOString();
    return {
        id: subscriptionId(subscription.endpoint),
        endpoint: subscription.endpoint,
        keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
        },
        timezone: preferences.timezone || 'UTC',
        reminderHour: normalizeReminderHour(preferences.reminderHour),
        reminderType: isReminderType(preferences.reminderType)
            ? preferences.reminderType
            : 'daily-prompt',
        createdAt: now,
        updatedAt: now,
    };
}

export async function saveSubscription(
    subscription: StoredPushSubscription,
): Promise<void> {
    const store = getSubscriptionStore();
    const existing = await store.get(subscription.id, { type: 'json' });
    const createdAt =
        existing && typeof existing === 'object' && 'createdAt' in existing
            ? String(existing.createdAt)
            : subscription.createdAt;

    await store.setJSON(subscription.id, {
        ...subscription,
        createdAt,
        updatedAt: new Date().toISOString(),
    });
}

export async function deleteSubscriptionByEndpoint(endpoint: string): Promise<void> {
    const store = getSubscriptionStore();
    await store.delete(subscriptionId(endpoint));
}

export async function listSubscriptions(): Promise<StoredPushSubscription[]> {
    const store = getSubscriptionStore();
    const result = await store.list();
    const subscriptions: StoredPushSubscription[] = [];

    for (const blob of result.blobs) {
        const subscription = await store.get(blob.key, { type: 'json' });
        if (subscription) subscriptions.push(subscription as StoredPushSubscription);
    }

    return subscriptions;
}

export async function updateSubscription(
    subscription: StoredPushSubscription,
): Promise<void> {
    await getSubscriptionStore().setJSON(subscription.id, {
        ...subscription,
        updatedAt: new Date().toISOString(),
    });
}

export async function deleteSubscriptionById(id: string): Promise<void> {
    await getSubscriptionStore().delete(id);
}
