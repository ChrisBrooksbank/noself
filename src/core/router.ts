export type Route =
    | { type: 'home' }
    | { type: 'catalog' }
    | { type: 'concept'; id: string }
    | { type: 'sutras' }
    | { type: 'sutraDetail'; id: string }
    | { type: 'practice' }
    | { type: 'practiceMediate' }
    | { type: 'practiceMeditateSession'; id: string }
    | { type: 'practicePrompts' }
    | { type: 'practicePaths' }
    | { type: 'practicePathDetail'; id: string }
    | { type: 'practiceHistory' }
    | { type: 'practicePujas' }
    | { type: 'practicePujaStudy'; id: string }
    | { type: 'practicePujaPerform'; id: string }
    | { type: 'practiceMantras' }
    | { type: 'practiceMantraDetail'; id: string }
    | { type: 'practiceMantraChant'; id: string }
    | { type: 'notFound' };

export type RouteHandler = (route: Route) => void;

let currentDispatch: (() => void) | null = null;

export function parseHash(hash: string): Route {
    const path = hash.replace(/^#/, '') || '/';

    if (path === '/') return { type: 'home' };
    if (path === '/catalog') return { type: 'catalog' };

    const conceptMatch = path.match(/^\/concept\/([^/]+)$/);
    if (conceptMatch?.[1]) return { type: 'concept', id: conceptMatch[1] };

    if (path === '/sutras') return { type: 'sutras' };

    const sutraMatch = path.match(/^\/sutra\/([^/]+)$/);
    if (sutraMatch?.[1]) return { type: 'sutraDetail', id: sutraMatch[1] };

    if (path === '/practice') return { type: 'practice' };
    if (path === '/practice/meditate') return { type: 'practiceMediate' };
    if (path === '/practice/prompts') return { type: 'practicePrompts' };
    if (path === '/practice/paths') return { type: 'practicePaths' };
    if (path === '/practice/history') return { type: 'practiceHistory' };

    const meditateSessionMatch = path.match(/^\/practice\/meditate\/([^/]+)$/);
    if (meditateSessionMatch?.[1])
        return { type: 'practiceMeditateSession', id: meditateSessionMatch[1] };

    const pathDetailMatch = path.match(/^\/practice\/paths\/([^/]+)$/);
    if (pathDetailMatch?.[1])
        return { type: 'practicePathDetail', id: pathDetailMatch[1] };

    if (path === '/practice/pujas') return { type: 'practicePujas' };
    if (path === '/practice/mantras') return { type: 'practiceMantras' };

    const pujaPerformMatch = path.match(/^\/practice\/puja\/([^/]+)\/perform$/);
    if (pujaPerformMatch?.[1])
        return { type: 'practicePujaPerform', id: pujaPerformMatch[1] };

    const pujaStudyMatch = path.match(/^\/practice\/puja\/([^/]+)$/);
    if (pujaStudyMatch?.[1]) return { type: 'practicePujaStudy', id: pujaStudyMatch[1] };

    const mantraChantMatch = path.match(/^\/practice\/mantra\/([^/]+)\/chant$/);
    if (mantraChantMatch?.[1])
        return { type: 'practiceMantraChant', id: mantraChantMatch[1] };

    const mantraDetailMatch = path.match(/^\/practice\/mantra\/([^/]+)$/);
    if (mantraDetailMatch?.[1])
        return { type: 'practiceMantraDetail', id: mantraDetailMatch[1] };

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
