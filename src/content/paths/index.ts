/**
 * Practice path schema and type definitions.
 *
 * Each path is a multi-session curriculum combining concept study,
 * contemplation prompts, and guided meditations, following the schema
 * defined by the `PracticePath` type below.
 */

/** A single session within a structured practice path */
export interface PathSession {
    /** Session number (1-based) */
    day: number;
    /** Session title shown in the path detail view */
    title: string;
    /** Optional concept ID for study (matches concept YAML id) */
    conceptId?: string;
    /** Optional prompt ID for contemplation (matches prompt id) */
    promptId?: string;
    /** Optional meditation ID for guided practice (matches meditation YAML id) */
    meditationId?: string;
}

/** A structured multi-session practice curriculum */
export interface PracticePath {
    /** URL-safe identifier, matches the filename (e.g. "seven-day-metta") */
    id: string;
    /** Human-readable title (e.g. "7-Day Metta") */
    title: string;
    /** 1-2 sentence description shown in the paths list */
    description: string;
    /** Ordered list of sessions */
    sessions: PathSession[];
}

export type PathId = (typeof PATH_IDS)[number];

/** All practice path IDs in the library */
export const PATH_IDS = [
    'seven-day-metta',
    'foundations-of-mindfulness',
    'exploring-non-self',
] as const;
