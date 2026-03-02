import { parse } from 'yaml';
import { z } from 'zod';
import type { Prompt, PromptDepth, PromptFile } from './index.js';

const promptDepthValues = [
    'beginner',
    'intermediate',
    'advanced',
] as const satisfies ReadonlyArray<PromptDepth>;

const promptSchema = z.object({
    id: z.string(),
    conceptId: z.string(),
    depth: z.enum(promptDepthValues),
    question: z.string(),
    guidance: z.string(),
});

const promptFileSchema = z.object({
    id: z.string(),
    conceptId: z.string(),
    prompts: z.array(promptSchema),
});

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedPromptFiles: PromptFile[] | null = null;

export function loadPromptFiles(): PromptFile[] {
    if (cachedPromptFiles) {
        return cachedPromptFiles;
    }

    const promptFiles: PromptFile[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = promptFileSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid prompt file in ${path}: ${result.error.message}`);
        }

        promptFiles.push(result.data as PromptFile);
    }

    cachedPromptFiles = promptFiles;
    return promptFiles;
}

export function getAllPrompts(): Prompt[] {
    return loadPromptFiles().flatMap((f) => f.prompts);
}

export function getPromptsByConceptId(conceptId: string): Prompt[] {
    return getAllPrompts().filter((p) => p.conceptId === conceptId);
}

export function getPromptById(id: string): Prompt | undefined {
    return getAllPrompts().find((p) => p.id === id);
}

export function getPromptFileById(id: string): PromptFile | undefined {
    return loadPromptFiles().find((f) => f.id === id);
}

export function resetPromptCache(): void {
    cachedPromptFiles = null;
}
