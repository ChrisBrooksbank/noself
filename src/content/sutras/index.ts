/**
 * Sutra schema and type definitions.
 *
 * Each sutra lives in a YAML file in this directory, following
 * the schema defined by the types below.
 */

import type { GlossEntry, SacredTerm } from '../../types/sacred-terms.js';
export type { GlossEntry, SacredTerm };

export interface SutraSection {
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

export interface SutraTerms {
    pali?: SacredTerm;
    sanskrit?: SacredTerm;
}

export interface Sutra {
    /** URL-safe identifier, matches the filename */
    id: string;
    /** Human-readable title */
    title: string;
    /** Sanskrit name, or null */
    sanskrit: string | null;
    /** Pali name, or null */
    pali: string | null;
    /** Buddhist tradition (e.g. "Mahayana") */
    tradition: string;
    /** Brief description of the sutra */
    description: string;
    /** Ordered study sections */
    sections: SutraSection[];
    /** Sanskrit/Pali sacred term metadata */
    terms?: SutraTerms;
}

export { loadSutras, getSutraById, resetSutraCache } from './loader.js';
