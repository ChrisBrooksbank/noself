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

interface PracticeDaySummary {
    date: string;
    meditationCount: number;
    promptCount: number;
    pathSessionCount: number;
    pujaCount: number;
    mantraCount: number;
    totalCount: number;
}

function toLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function isoToLocalDateKey(iso: string): string | null {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return toLocalDateKey(date);
}

function addDayCounts(
    days: Map<string, Omit<PracticeDaySummary, 'date' | 'totalCount'>>,
    date: string | null,
    key: keyof Omit<PracticeDaySummary, 'date' | 'totalCount'>,
): void {
    if (!date) return;
    const current = days.get(date) ?? {
        meditationCount: 0,
        promptCount: 0,
        pathSessionCount: 0,
        pujaCount: 0,
        mantraCount: 0,
    };
    current[key] += 1;
    days.set(date, current);
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

export function getPracticeDaySummaries(): PracticeDaySummary[] {
    const store = load();
    const days = new Map<string, Omit<PracticeDaySummary, 'date' | 'totalCount'>>();

    store.meditations.forEach((session) => {
        addDayCounts(days, isoToLocalDateKey(session.completedAt), 'meditationCount');
    });
    store.prompts.forEach((session) => {
        addDayCounts(days, isoToLocalDateKey(session.satWith), 'promptCount');
    });
    store.pathSessions.forEach((session) => {
        addDayCounts(days, isoToLocalDateKey(session.completedAt), 'pathSessionCount');
    });
    store.pujas.forEach((session) => {
        addDayCounts(days, isoToLocalDateKey(session.completedAt), 'pujaCount');
    });
    store.mantras.forEach((session) => {
        addDayCounts(days, isoToLocalDateKey(session.completedAt), 'mantraCount');
    });

    return [...days.entries()]
        .map(([date, counts]) => ({
            date,
            ...counts,
            totalCount:
                counts.meditationCount +
                counts.promptCount +
                counts.pathSessionCount +
                counts.pujaCount +
                counts.mantraCount,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export function hasPracticedToday(now: Date = new Date()): boolean {
    const today = toLocalDateKey(now);
    return getPracticeDaySummaries().some((day) => day.date === today);
}

export function getLastPracticeDate(): string | null {
    const days = getPracticeDaySummaries();
    return days.at(-1)?.date ?? null;
}

function shiftLocalDateKey(date: Date, offsetDays: number): string {
    const shifted = new Date(date);
    shifted.setDate(shifted.getDate() + offsetDays);
    return toLocalDateKey(shifted);
}

export function getCurrentStreak(now: Date = new Date()): number {
    const practicedDates = new Set(getPracticeDaySummaries().map((day) => day.date));
    if (practicedDates.size === 0) return 0;

    let offset = practicedDates.has(toLocalDateKey(now)) ? 0 : -1;
    let streak = 0;

    while (practicedDates.has(shiftLocalDateKey(now, offset))) {
        streak += 1;
        offset -= 1;
    }

    return streak;
}

export function getLongestStreak(): number {
    const days = getPracticeDaySummaries();
    if (days.length === 0) return 0;

    let longest = 1;
    let current = 1;

    for (let i = 1; i < days.length; i += 1) {
        const previous = new Date(`${days[i - 1]!.date}T00:00:00`);
        previous.setDate(previous.getDate() + 1);

        if (toLocalDateKey(previous) === days[i]!.date) {
            current += 1;
        } else {
            current = 1;
        }

        longest = Math.max(longest, current);
    }

    return longest;
}

export function getInactiveDayCount(now: Date = new Date()): number {
    const lastPracticeDate = getLastPracticeDate();
    if (!lastPracticeDate) return 0;

    const today = new Date(`${toLocalDateKey(now)}T00:00:00`);
    const last = new Date(`${lastPracticeDate}T00:00:00`);
    const diffMs = today.getTime() - last.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
