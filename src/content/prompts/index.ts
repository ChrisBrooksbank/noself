/**
 * Contemplation prompt schema and type definitions.
 *
 * Each prompt file is a YAML file in this directory containing reflection
 * questions tied to a specific Buddhist concept, following the schema
 * defined by the `Prompt` type below.
 */

/** Depth level of the contemplation prompt */
export type PromptDepth = 'beginner' | 'intermediate' | 'advanced';

/** A single contemplation prompt */
export interface Prompt {
    /** Unique identifier for this prompt (e.g. "anatta-1") */
    id: string;
    /** ID of the related concept (matches concept YAML id, e.g. "anatta") */
    conceptId: string;
    /** Depth level of the prompt */
    depth: PromptDepth;
    /** The reflection question posed to the practitioner */
    question: string;
    /** Guidance text to support the practitioner's contemplation */
    guidance: string;
}

/** A collection of prompts from a single YAML file */
export interface PromptFile {
    /** Concept area identifier matching the file name (e.g. "anatta-prompts") */
    id: string;
    /** ID of the concept these prompts relate to */
    conceptId: string;
    /** The prompts in this file */
    prompts: Prompt[];
}

export type PromptFileId = (typeof PROMPT_FILE_IDS)[number];

/** All prompt file IDs in the library (one file per concept area) */
export const PROMPT_FILE_IDS = [
    'anatta-prompts',
    'anicca-prompts',
    'dukkha-prompts',
    'metta-prompts',
    'sunyata-prompts',
    'dependent-origination-prompts',
    'five-aggregates-prompts',
    'four-noble-truths-prompts',
] as const;
