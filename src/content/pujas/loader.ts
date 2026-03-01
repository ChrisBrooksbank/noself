import { parse } from 'yaml';
import { z } from 'zod';
import type { Puja } from './index.js';

const pujaSectionSchema = z.object({
    id: z.string(),
    order: z.number().int().positive(),
    title: z.string(),
    original: z.string(),
    originalLanguage: z.string(),
    translation: z.string(),
    commentary: z.string(),
    relatedConcepts: z.array(z.string()).default([]),
});

const ritualStepSchema = z.object({
    id: z.string(),
    order: z.number().int().positive(),
    title: z.string(),
    instruction: z.string(),
    durationSeconds: z
        .number()
        .int()
        .positive()
        .nullish()
        .transform((v) => v ?? null),
    sectionRef: z
        .string()
        .nullish()
        .transform((v) => v ?? null),
});

const pujaSchema = z.object({
    id: z.string(),
    title: z.string(),
    tradition: z.string(),
    description: z.string(),
    sections: z.array(pujaSectionSchema).default([]),
    ritualSteps: z.array(ritualStepSchema).default([]),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedPujas: Puja[] | null = null;

export function loadPujas(): Puja[] {
    if (cachedPujas) {
        return cachedPujas;
    }

    const pujas: Puja[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = pujaSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid puja in ${path}: ${result.error.message}`);
        }

        pujas.push(result.data as Puja);
    }

    cachedPujas = pujas;
    return pujas;
}

export function getPujaById(id: string): Puja | undefined {
    return loadPujas().find((p) => p.id === id);
}

export function resetPujaCache(): void {
    cachedPujas = null;
}
