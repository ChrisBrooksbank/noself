const STORAGE_KEY = 'noself:practiceHistory';

interface MeditationSession {
    meditationId: string;
    durationMinutes: number;
    completedAt: string; // ISO 8601
}

interface PromptSession {
    promptId: string;
    satWith: string; // ISO 8601
}

interface PathSessionCompletion {
    pathId: string;
    sessionIndex: number;
    completedAt: string; // ISO 8601
}

interface PracticeStore {
    meditations: MeditationSession[];
    prompts: PromptSession[];
    pathSessions: PathSessionCompletion[];
}

function load(): PracticeStore {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw) as PracticeStore;
        }
    } catch {
        // ignore parse errors
    }
    return { meditations: [], prompts: [], pathSessions: [] };
}

function save(store: PracticeStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function logMeditationSession(
    meditationId: string,
    durationMinutes: number,
): void {
    const store = load();
    store.meditations.push({
        meditationId,
        durationMinutes,
        completedAt: new Date().toISOString(),
    });
    save(store);
}

export function getMeditationSessions(): MeditationSession[] {
    return load().meditations;
}

export function logPromptSatWith(promptId: string): void {
    const store = load();
    store.prompts.push({ promptId, satWith: new Date().toISOString() });
    save(store);
}

export function getPromptSessions(): PromptSession[] {
    return load().prompts;
}

export function isPromptSatWith(promptId: string): boolean {
    return load().prompts.some((p) => p.promptId === promptId);
}

export function logPathSessionComplete(pathId: string, sessionIndex: number): void {
    const store = load();
    const alreadyDone = store.pathSessions.some(
        (ps) => ps.pathId === pathId && ps.sessionIndex === sessionIndex,
    );
    if (!alreadyDone) {
        store.pathSessions.push({
            pathId,
            sessionIndex,
            completedAt: new Date().toISOString(),
        });
        save(store);
    }
}

export function isPathSessionComplete(pathId: string, sessionIndex: number): boolean {
    return load().pathSessions.some(
        (ps) => ps.pathId === pathId && ps.sessionIndex === sessionIndex,
    );
}

export function getPathSessions(): PathSessionCompletion[] {
    return load().pathSessions;
}

export function getTotalSessionCount(): number {
    const store = load();
    return store.meditations.length + store.prompts.length;
}
