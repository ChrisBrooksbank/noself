/**
 * Sutra schema and type definitions.
 *
 * Each sutra lives in a YAML file in this directory, following
 * the schema defined by the types below.
 */

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
}

export { loadSutras, getSutraById, resetSutraCache } from './loader.js';
