import webpush from 'web-push';
import {
    deleteSubscriptionById,
    listSubscriptions,
    updateSubscription,
    type StoredPushSubscription,
} from '../lib/pushSubscriptions.js';

interface ZonedNow {
    date: string;
    hour: number;
}

const SUBJECT = process.env.VAPID_SUBJECT;
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

function getZonedNow(timezone: string, now: Date): ZonedNow {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
    }).formatToParts(now);
    const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

    return {
        date: `${lookup.year}-${lookup.month}-${lookup.day}`,
        hour: Number(lookup.hour),
    };
}

function isDue(subscription: StoredPushSubscription, now: Date): boolean {
    const zonedNow = getZonedNow(subscription.timezone, now);
    return (
        zonedNow.hour === subscription.reminderHour &&
        subscription.lastSentDate !== zonedNow.date
    );
}

function payloadFor(subscription: StoredPushSubscription): string {
    if (subscription.reminderType === 'daily-concept') {
        return JSON.stringify({
            title: "Today's concept is ready",
            body: 'Open noself for the concept of the day.',
            url: '/#/',
        });
    }

    if (subscription.reminderType === 'meditation') {
        return JSON.stringify({
            title: 'A quiet minute is available now',
            body: 'Return to the breath when you are ready.',
            url: '/#/practice/meditate',
        });
    }

    return JSON.stringify({
        title: "Today's contemplation is ready",
        body: 'Sit with the daily prompt when you are ready.',
        url: '/#/practice/prompts',
    });
}

async function sendReminder(
    subscription: StoredPushSubscription,
): Promise<'sent' | 'gone'> {
    try {
        await webpush.sendNotification(
            {
                endpoint: subscription.endpoint,
                keys: subscription.keys,
            },
            payloadFor(subscription),
        );
        return 'sent';
    } catch (error) {
        const statusCode =
            typeof error === 'object' && error && 'statusCode' in error
                ? Number(error.statusCode)
                : 0;
        if (statusCode === 404 || statusCode === 410) return 'gone';
        throw error;
    }
}

export default async function handler(): Promise<Response> {
    if (!SUBJECT || !PUBLIC_KEY || !PRIVATE_KEY) {
        return Response.json(
            { error: 'Missing VAPID environment variables' },
            { status: 500 },
        );
    }

    webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);

    const now = new Date();
    const subscriptions = await listSubscriptions();
    let sent = 0;
    let removed = 0;

    for (const subscription of subscriptions) {
        if (!isDue(subscription, now)) continue;

        const result = await sendReminder(subscription);
        if (result === 'gone') {
            await deleteSubscriptionById(subscription.id);
            removed += 1;
            continue;
        }

        const zonedNow = getZonedNow(subscription.timezone, now);
        await updateSubscription({ ...subscription, lastSentDate: zonedNow.date });
        sent += 1;
    }

    return Response.json({ ok: true, checked: subscriptions.length, sent, removed });
}
