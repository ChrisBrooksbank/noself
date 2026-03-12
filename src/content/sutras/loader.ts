import { parse } from 'yaml';
import { z } from 'zod';
import type { Sutra } from './index.js';

const glossEntrySchema = z.object({
    word: z.string(),
    meaning: z.string(),
    phonetic: z.string().optional(),
});

const sutraSectionSchema = z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    original: z.string(),
    originalLanguage: z.string(),
    translation: z.string(),
    commentary: z.string(),
    relatedConcepts: z.array(z.string()).default([]),
    phonetic: z.string().optional(),
    audio: z.string().optional(),
    gloss: z.array(glossEntrySchema).optional(),
});

const sutraSchema = z.object({
    id: z.string(),
    title: z.string(),
    sanskrit: z
        .string()
        .nullish()
        .transform((v) => v ?? null),
    pali: z
        .string()
        .nullish()
        .transform((v) => v ?? null),
    tradition: z.string(),
    description: z.string(),
    sections: z.array(sutraSectionSchema).default([]),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedSutras: Sutra[] | null = null;

export function loadSutras(): Sutra[] {
    if (cachedSutras) {
        return cachedSutras;
    }

    const sutras: Sutra[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = sutraSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid sutra in ${path}: ${result.error.message}`);
        }

        sutras.push(result.data as Sutra);
    }

    cachedSutras = sutras;
    return sutras;
}

export function getSutraById(id: string): Sutra | undefined {
    return loadSutras().find((s) => s.id === id);
}

export function resetSutraCache(): void {
    cachedSutras = null;
}
