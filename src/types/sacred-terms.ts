import { z } from 'zod';

export const sacredTermSchema = z.object({
    text: z.string(),
    language: z.enum(['pali', 'sanskrit', 'hybrid']),
    literal: z.string(),
    etymology: z.string().optional(),
    phonetic: z.string(),
    ipa: z.string().optional(),
    audio: z.string().optional(),
});

/** Reusable metadata for any Sanskrit or Pali term/phrase */
export interface SacredTerm {
    /** The term itself: "Anattā", "Pratītyasamutpāda" */
    text: string;
    /** Language of origin */
    language: 'pali' | 'sanskrit' | 'hybrid';
    /** Bare literal meaning: "not-self" */
    literal: string;
    /** Root breakdown: "an (not) + attā (self)" */
    etymology?: string;
    /** English phonetic: "ah-NAHT-tah" (stressed syllable in CAPS) */
    phonetic: string;
    /** IPA transcription for precision */
    ipa?: string;
    /** Path to curated audio file */
    audio?: string;
}

/** Word-level gloss entry for passage study */
export interface GlossEntry {
    /** The original word (Sanskrit/Pali) */
    word: string;
    /** Meaning or grammatical note */
    meaning: string;
    /** Phonetic pronunciation of this word */
    phonetic?: string;
}
