import { parse } from 'yaml';
import { z } from 'zod';
import type { Concept, ConceptCategory } from './index.js';
import { sacredTermSchema } from '../../types/sacred-terms.js';

const conceptCategoryValues = [
    'foundational',
    'three-marks',
    'mind-and-practice',
    'buddhist-psychology',
    'brahmaviharas',
    'mahayana',
    'liberation',
] as const satisfies ReadonlyArray<ConceptCategory>;

const conceptExampleSchema = z.object({
    source: z.string(),
    text: z.string(),
    commentary: z.string(),
});

const conceptSchema = z.object({
    id: z.string(),
    title: z.string(),
    pali: z
        .string()
        .nullish()
        .transform((v) => v ?? null),
    sanskrit: z
        .string()
        .nullish()
        .transform((v) => v ?? null),
    category: z.enum(conceptCategoryValues),
    related: z.array(z.string()).default([]),
    simpleBrief: z.string().optional(),
    brief: z.string(),
    essentials: z.string(),
    deep: z.string(),
    examples: z.array(conceptExampleSchema).default([]),
    terms: z
        .object({
            pali: sacredTermSchema.optional(),
            sanskrit: sacredTermSchema.optional(),
        })
        .optional(),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedConcepts: Concept[] | null = null;

export function loadConcepts(): Concept[] {
    if (cachedConcepts) {
        return cachedConcepts;
    }

    const concepts: Concept[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = conceptSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid concept in ${path}: ${result.error.message}`);
        }

        concepts.push(result.data as Concept);
    }

    cachedConcepts = concepts;
    return concepts;
}

export function getConceptById(id: string): Concept | undefined {
    return loadConcepts().find((c) => c.id === id);
}

export function resetConceptCache(): void {
    cachedConcepts = null;
}
