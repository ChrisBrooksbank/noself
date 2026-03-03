/**
 * Guided meditation schema and type definitions.
 *
 * Each meditation lives in a YAML file in this directory, following
 * the schema defined by the `Meditation` type below.
 */

/** Duration options in minutes */
export type MeditationDuration = 5 | 10 | 15 | 20 | 30;

/** A single instruction step within a meditation sequence */
export interface MeditationStep {
    /** Instruction text shown to the practitioner during this step */
    instruction: string;
    /** Duration of this step in seconds */
    durationSeconds: number;
}

/** A YouTube video linked to a meditation */
export interface MeditationVideo {
    /** Title of the video */
    title: string;
    /** Teacher or channel name */
    teacher: string;
    /** Full YouTube URL */
    videoUrl: string;
    /** Human-readable duration (e.g. "10:23") */
    duration: string;
    /** Whether this is a teaching talk or a guided session */
    type: 'teaching' | 'guided';
}

export interface Meditation {
    /** URL-safe identifier, matches the filename (e.g. "breath-awareness") */
    id: string;
    /** Human-readable title (e.g. "Breath Awareness") */
    title: string;
    /** 1-2 sentence description shown in the meditation list */
    description: string;
    /** Minimum expertise level required (1=Exploring, 2=Deepening, 3=Immersed). Defaults to 1. */
    level?: 1 | 2 | 3;
    /** Available duration options for this meditation (in minutes) */
    durations: MeditationDuration[];
    /** Optional YouTube videos related to this meditation */
    videos?: MeditationVideo[];
    /**
     * Step sequences keyed by duration (in minutes).
     * Each entry is an ordered list of steps for that session length.
     */
    steps: Partial<Record<MeditationDuration, MeditationStep[]>>;
}

export type MeditationId = (typeof MEDITATION_IDS)[number];

/** All meditation IDs in the library */
export const MEDITATION_IDS = [
    'breath-awareness',
    'metta',
    'body-scan',
    'vipassana',
    'open-awareness',
] as const;
