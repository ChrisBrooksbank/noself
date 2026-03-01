/**
 * Buddhist concept schema and type definitions.
 *
 * Each concept lives in a YAML file in this directory, following
 * the schema defined by the `Concept` type below.
 */

export interface ConceptExample {
    /** Attribution — sutta reference or "Author, Book Title" */
    source: string;
    /** The quote itself (short, fair-use) */
    text: string;
    /** Brief context for why this example illuminates the concept */
    commentary: string;
}

export interface Concept {
    /** URL-safe identifier, matches the filename (e.g. "anatta") */
    id: string;
    /** Human-readable title (e.g. "No-Self") */
    title: string;
    /** Pali term, or null if not applicable */
    pali: string | null;
    /** Sanskrit term, or null if not applicable */
    sanskrit: string | null;
    /** Grouping category */
    category: ConceptCategory;
    /** IDs of related concepts for the concept web */
    related: string[];

    /** 1-2 sentences. Used on concept web cards and quick references. */
    brief: string;
    /** 2-3 paragraphs. Accessible introduction with genuine understanding. */
    essentials: string;
    /** Full exploration with historical context, traditions, and nuances. */
    deep: string;

    /** Illustrative quotes with source attribution and commentary */
    examples: ConceptExample[];
}

export type ConceptCategory =
    | 'foundational'
    | 'three-marks'
    | 'mind-and-practice'
    | 'buddhist-psychology'
    | 'brahmaviharas'
    | 'mahayana'
    | 'liberation';

/** All concept IDs in the library */
export const CONCEPT_IDS = [
    // Foundational
    'four-noble-truths',
    'noble-eightfold-path',
    'three-jewels',
    'middle-way',
    'three-marks',
    // The Three Marks
    'anicca',
    'dukkha',
    'anatta',
    // Mind & Practice
    'sati',
    'bhavana',
    'samatha',
    'vipassana',
    'five-precepts',
    'karma',
    // Buddhist Psychology
    'five-aggregates',
    'three-poisons',
    'dependent-origination',
    'twelve-links',
    // Brahmaviharas
    'metta',
    'karuna',
    'mudita',
    'upekkha',
    // Mahayana
    'sunyata',
    'buddha-nature',
    'bodhisattva',
    'interbeing',
    'prajna',
    // Liberation
    'nirvana',
    'samsara',
    'awakening',
] as const;

export type ConceptId = (typeof CONCEPT_IDS)[number];
