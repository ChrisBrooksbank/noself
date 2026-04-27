import { deleteSubscriptionByEndpoint } from '../lib/pushSubscriptions.js';

export default async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = (await request.json()) as { endpoint?: string };
    if (!body.endpoint) {
        return Response.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    await deleteSubscriptionByEndpoint(body.endpoint);
    return Response.json({ ok: true });
}
