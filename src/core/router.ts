export type Route =
    | { type: 'home' }
    | { type: 'catalog' }
    | { type: 'concept'; id: string }
    | { type: 'notFound' };

export type RouteHandler = (route: Route) => void;

let currentDispatch: (() => void) | null = null;

export function parseHash(hash: string): Route {
    const path = hash.replace(/^#/, '') || '/';

    if (path === '/') return { type: 'home' };
    if (path === '/catalog') return { type: 'catalog' };

    const m = path.match(/^\/concept\/([^/]+)$/);
    if (m?.[1]) return { type: 'concept', id: m[1] };

    return { type: 'notFound' };
}

export function navigate(path: string): void {
    window.location.hash = path;
}

export function start(handler: RouteHandler): void {
    if (currentDispatch) {
        window.removeEventListener('hashchange', currentDispatch);
    }

    currentDispatch = (): void => {
        handler(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', currentDispatch);
    currentDispatch();
}
