/**
 * Primer schema and type definitions.
 *
 * Each primer lives in a YAML file in this directory, following
 * the schema defined by the types below.
 */

import type { SacredTerm } from '../../types/sacred-terms.js';

/** A titled section of a primer */
export interface PrimerSection {
    /** URL-safe section identifier */
    id: string;
    /** Human-readable section title */
    title: string;
    /** Markdown content */
    content: string;
}

export interface Primer {
    /** URL-safe identifier, matches the filename (e.g. "pali") */
    id: string;
    /** Human-readable title */
    title: string;
    /** Language covered by this primer */
    language: 'pali' | 'sanskrit';
    /** Brief description shown in primer lists */
    description: string;
    /** One-paragraph overview */
    brief: string;
    /** Key essentials summary */
    essentials: string;
    /** Deep-dive content */
    deep: string;
    /** Ordered content sections */
    sections: PrimerSection[];
    /** Key terms introduced in this primer */
    keyTerms: SacredTerm[];
    /** IDs of related concepts for cross-linking */
    relatedConcepts: string[];
}

export type PrimerId = (typeof PRIMER_IDS)[number];

/** All primer IDs in the library */
export const PRIMER_IDS = ['pali', 'sanskrit'] as const;

export { loadPrimers, getPrimerById, resetPrimerCache } from './loader.js';
