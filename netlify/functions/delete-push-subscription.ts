import { deleteSubscriptionByEndpoint } from '../lib/pushSubscriptions.js';

export default async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    let body: { endpoint?: string };
    try {
        body = (await request.json()) as { endpoint?: string };
    } catch {
        return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body.endpoint) {
        return Response.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    await deleteSubscriptionByEndpoint(body.endpoint);
    return Response.json({ ok: true });
}
