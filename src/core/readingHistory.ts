const STORAGE_KEY = 'noself:readingHistory';

type ConceptStatus = 'viewed' | 'contemplated' | 'revisit';

interface HistoryStore {
    viewed: string[];
    statuses: Record<string, ConceptStatus>;
}

function load(): HistoryStore {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw) as HistoryStore;
        }
    } catch {
        // ignore parse errors
    }
    return { viewed: [], statuses: {} };
}

function save(store: HistoryStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function markViewed(id: string): void {
    const store = load();
    if (!store.viewed.includes(id)) {
        store.viewed.push(id);
    }
    if (!store.statuses[id]) {
        store.statuses[id] = 'viewed';
    }
    save(store);
}

export function isViewed(id: string): boolean {
    return load().viewed.includes(id);
}

export function getViewedIds(): string[] {
    return load().viewed;
}

export function markContemplated(id: string): void {
    const store = load();
    if (!store.viewed.includes(id)) {
        store.viewed.push(id);
    }
    store.statuses[id] = 'contemplated';
    save(store);
}

export function markRevisit(id: string): void {
    const store = load();
    if (!store.viewed.includes(id)) {
        store.viewed.push(id);
    }
    store.statuses[id] = 'revisit';
    save(store);
}

export function getStatus(id: string): ConceptStatus | null {
    const store = load();
    return store.statuses[id] ?? null;
}
