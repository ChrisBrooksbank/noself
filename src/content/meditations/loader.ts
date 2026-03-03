import { parse } from 'yaml';
import { z } from 'zod';
import type { Meditation, MeditationDuration } from './index.js';

const meditationDurationValues = [
    5, 10, 15, 20, 30,
] as const satisfies ReadonlyArray<MeditationDuration>;

const meditationDurationSchema = z.union([
    z.literal(5),
    z.literal(10),
    z.literal(15),
    z.literal(20),
    z.literal(30),
]);

const meditationStepSchema = z.object({
    instruction: z.string(),
    durationSeconds: z.number().int().positive(),
});

const meditationVideoSchema = z.object({
    title: z.string(),
    teacher: z.string(),
    videoUrl: z.string().url(),
    duration: z.string(),
    type: z.enum(['teaching', 'guided']),
});

const meditationSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    durations: z.array(meditationDurationSchema),
    videos: z.array(meditationVideoSchema).optional(),
    steps: z.record(z.string(), z.array(meditationStepSchema)).transform((record) => {
        const result: Partial<
            Record<MeditationDuration, (typeof meditationStepSchema._type)[]>
        > = {};
        for (const [key, steps] of Object.entries(record)) {
            const duration = Number(key) as MeditationDuration;
            if ((meditationDurationValues as ReadonlyArray<number>).includes(duration)) {
                result[duration] = steps;
            }
        }
        return result;
    }),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedMeditations: Meditation[] | null = null;

export function loadMeditations(): Meditation[] {
    if (cachedMeditations) {
        return cachedMeditations;
    }

    const meditations: Meditation[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = meditationSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid meditation in ${path}: ${result.error.message}`);
        }

        meditations.push(result.data as Meditation);
    }

    cachedMeditations = meditations;
    return meditations;
}

export function getMeditationById(id: string): Meditation | undefined {
    return loadMeditations().find((m) => m.id === id);
}

export function resetMeditationCache(): void {
    cachedMeditations = null;
}
