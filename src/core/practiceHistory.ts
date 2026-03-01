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

interface PujaSession {
    pujaId: string;
    completedAt: string; // ISO 8601
}

interface MantraSession {
    mantraId: string;
    repetitions: number;
    completedAt: string; // ISO 8601
}

interface PracticeStore {
    meditations: MeditationSession[];
    prompts: PromptSession[];
    pathSessions: PathSessionCompletion[];
    pujas: PujaSession[];
    mantras: MantraSession[];
}

function load(): PracticeStore {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Partial<PracticeStore>;
            return {
                meditations: parsed.meditations ?? [],
                prompts: parsed.prompts ?? [],
                pathSessions: parsed.pathSessions ?? [],
                pujas: parsed.pujas ?? [],
                mantras: parsed.mantras ?? [],
            };
        }
    } catch {
        // ignore parse errors
    }
    return { meditations: [], prompts: [], pathSessions: [], pujas: [], mantras: [] };
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

export function logPujaSession(pujaId: string): void {
    const store = load();
    store.pujas.push({ pujaId, completedAt: new Date().toISOString() });
    save(store);
}

export function getPujaSessions(): PujaSession[] {
    return load().pujas;
}

export function logMantraSession(mantraId: string, repetitions: number): void {
    const store = load();
    store.mantras.push({ mantraId, repetitions, completedAt: new Date().toISOString() });
    save(store);
}

export function getMantraSessions(): MantraSession[] {
    return load().mantras;
}

export function getTotalSessionCount(): number {
    const store = load();
    return (
        store.meditations.length +
        store.prompts.length +
        store.pujas.length +
        store.mantras.length
    );
}
