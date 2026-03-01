import { parse } from 'yaml';
import { z } from 'zod';
import type { Mantra } from './index.js';

const mantraSyllableSchema = z.object({
    text: z.string(),
    meaning: z.string(),
});

const mantraSchema = z.object({
    id: z.string(),
    title: z.string(),
    sanskrit: z.string(),
    pali: z
        .string()
        .nullish()
        .transform((v) => v ?? null),
    tradition: z.string(),
    description: z.string(),
    syllables: z.array(mantraSyllableSchema).default([]),
    meaning: z.string(),
    usage: z.string(),
    defaultRepetitions: z.number().int().positive(),
    relatedConcepts: z.array(z.string()).default([]),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedMantras: Mantra[] | null = null;

export function loadMantras(): Mantra[] {
    if (cachedMantras) {
        return cachedMantras;
    }

    const mantras: Mantra[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = mantraSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid mantra in ${path}: ${result.error.message}`);
        }

        mantras.push(result.data as Mantra);
    }

    cachedMantras = mantras;
    return mantras;
}

export function getMantraById(id: string): Mantra | undefined {
    return loadMantras().find((m) => m.id === id);
}

export function resetMantraCache(): void {
    cachedMantras = null;
}
