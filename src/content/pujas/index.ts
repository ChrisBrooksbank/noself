/**
 * Puja schema and type definitions.
 *
 * Each puja lives in a YAML file in this directory, following
 * the schema defined by the types below.
 */

import type { GlossEntry, SacredTerm } from '../../types/sacred-terms.js';
export type { GlossEntry, SacredTerm };

/** A YouTube video linked to a puja */
export interface PujaVideo {
    /** Title of the video */
    title: string;
    /** Teacher or channel name */
    teacher: string;
    /** Full YouTube URL */
    videoUrl: string;
    /** Human-readable duration (e.g. "1h 5m") */
    duration: string;
}

/** A study section within a puja (same shape as SutraSection) */
export interface PujaSection {
    /** URL-safe identifier for in-page anchoring */
    id: string;
    /** Display order */
    order: number;
    /** Section heading */
    title: string;
    /** Original text (Sanskrit/Pali) */
    original: string;
    /** Language of the original text */
    originalLanguage: string;
    /** English translation */
    translation: string;
    /** Explanatory commentary */
    commentary: string;
    /** IDs of related concepts for cross-linking */
    relatedConcepts: string[];
    /** Full passage pronunciation guide */
    phonetic?: string;
    /** Path to curated audio file */
    audio?: string;
    /** Word-by-word gloss for study */
    gloss?: GlossEntry[];
}

/** A single step in the ritual performance sequence */
export interface RitualStep {
    /** URL-safe identifier for this step */
    id: string;
    /** Display order */
    order: number;
    /** Step heading shown during ritual flow */
    title: string;
    /** Instruction text displayed to the practitioner */
    instruction: string;
    /** Duration for this step in seconds, or null for open-ended steps */
    durationSeconds: number | null;
    /** ID of the associated study section, or null */
    sectionRef: string | null;
}

export interface PujaTerms {
    pali?: SacredTerm;
    sanskrit?: SacredTerm;
}

export interface Puja {
    /** URL-safe identifier, matches the filename (e.g. "sevenfold-puja") */
    id: string;
    /** Human-readable title */
    title: string;
    /** Buddhist tradition (e.g. "Triratna") */
    tradition: string;
    /** Brief description shown in the puja list */
    description: string;
    /** Optional YouTube videos related to this puja */
    videos?: PujaVideo[];
    /** Ordered study sections (for study view) */
    sections: PujaSection[];
    /** Ordered ritual steps (for perform view) */
    ritualSteps: RitualStep[];
    /** Sanskrit/Pali sacred term metadata */
    terms?: PujaTerms;
}

export type PujaId = (typeof PUJA_IDS)[number];

/** All puja IDs in the library */
export const PUJA_IDS = ['sevenfold-puja'] as const;

export { loadPujas, getPujaById, resetPujaCache } from './loader.js';
