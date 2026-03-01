/**
 * Mantra schema and type definitions.
 *
 * Each mantra lives in a YAML file in this directory, following
 * the schema defined by the types below.
 */

/** A single syllable of a mantra with its meaning */
export interface MantraSyllable {
    /** The syllable text (e.g. "Om", "Mani") */
    text: string;
    /** Meaning or significance of this syllable */
    meaning: string;
}

export interface Mantra {
    /** URL-safe identifier, matches the filename (e.g. "avalokiteshvara") */
    id: string;
    /** Human-readable title */
    title: string;
    /** The mantra text in Sanskrit */
    sanskrit: string;
    /** The mantra text in Pali, or null if not applicable */
    pali: string | null;
    /** Buddhist tradition (e.g. "Mahayana") */
    tradition: string;
    /** Brief description shown in the mantra list */
    description: string;
    /** Syllable-by-syllable breakdown */
    syllables: MantraSyllable[];
    /** Overall meaning of the mantra */
    meaning: string;
    /** Guidance on how and when to use the mantra */
    usage: string;
    /** Default number of repetitions per session (typically 108 or 42) */
    defaultRepetitions: number;
    /** IDs of related concepts for cross-linking */
    relatedConcepts: string[];
}

export type MantraId = (typeof MANTRA_IDS)[number];

/** All mantra IDs in the library */
export const MANTRA_IDS = ['avalokiteshvara'] as const;

export { loadMantras, getMantraById, resetMantraCache } from './loader.js';
