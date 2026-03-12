import { parse } from 'yaml';
import { z } from 'zod';
import { sacredTermSchema } from '../../types/sacred-terms.js';
import type { Primer } from './index.js';

const primerSectionSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
});

const primerSchema = z.object({
    id: z.string(),
    title: z.string(),
    language: z.enum(['pali', 'sanskrit']),
    description: z.string(),
    brief: z.string(),
    essentials: z.string(),
    deep: z.string(),
    sections: z.array(primerSectionSchema).min(1),
    keyTerms: z.array(sacredTermSchema).default([]),
    relatedConcepts: z.array(z.string()).default([]),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedPrimers: Primer[] | null = null;

export function loadPrimers(): Primer[] {
    if (cachedPrimers) {
        return cachedPrimers;
    }

    const primers: Primer[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = primerSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid primer in ${path}: ${result.error.message}`);
        }

        primers.push(result.data as Primer);
    }

    cachedPrimers = primers;
    return primers;
}

export function getPrimerById(id: string): Primer | undefined {
    return loadPrimers().find((p) => p.id === id);
}

export function resetPrimerCache(): void {
    cachedPrimers = null;
}
