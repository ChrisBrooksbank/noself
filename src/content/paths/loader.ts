import { parse } from 'yaml';
import { z } from 'zod';
import type { PracticePath } from './index.js';

const pathSessionSchema = z.object({
    day: z.number().int().positive(),
    title: z.string(),
    conceptId: z.string().optional(),
    promptId: z.string().optional(),
    meditationId: z.string().optional(),
});

const practicePathSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    sessions: z.array(pathSessionSchema),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedPaths: PracticePath[] | null = null;

export function loadPaths(): PracticePath[] {
    if (cachedPaths) {
        return cachedPaths;
    }

    const paths: PracticePath[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = practicePathSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid practice path in ${path}: ${result.error.message}`);
        }

        paths.push(result.data as PracticePath);
    }

    cachedPaths = paths;
    return paths;
}

export function getPathById(id: string): PracticePath | undefined {
    return loadPaths().find((p) => p.id === id);
}

export function resetPathCache(): void {
    cachedPaths = null;
}
