import { normalizeSubscription, saveSubscription } from '../lib/pushSubscriptions.js';

export default async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        const body = (await request.json()) as {
            subscription?: Parameters<typeof normalizeSubscription>[0];
            preferences?: Parameters<typeof normalizeSubscription>[1];
        };
        const subscription = normalizeSubscription(
            body.subscription ?? {},
            body.preferences ?? {},
        );
        await saveSubscription(subscription);
        return Response.json({ ok: true });
    } catch (error) {
        return Response.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unable to save subscription',
            },
            { status: 400 },
        );
    }
}
