import { describe, it, expect, beforeEach } from 'vitest';
import {
    loadPromptFiles,
    getAllPrompts,
    getPromptsByConceptId,
    getPromptFileById,
    resetPromptCache,
} from './loader.js';
import { PROMPT_FILE_IDS } from './index.js';

describe('loadPromptFiles', () => {
    beforeEach(() => {
        resetPromptCache();
    });

    it(`loads all ${PROMPT_FILE_IDS.length} prompt files`, () => {
        const files = loadPromptFiles();
        expect(files).toHaveLength(PROMPT_FILE_IDS.length);
    });

    it('every PROMPT_FILE_ID has a corresponding loaded file', () => {
        const files = loadPromptFiles();
        const ids = files.map((f) => f.id);
        for (const id of PROMPT_FILE_IDS) {
            expect(ids).toContain(id);
        }
    });

    it('each prompt file has required fields', () => {
        const files = loadPromptFiles();
        for (const f of files) {
            expect(f.id).toBeTruthy();
            expect(f.conceptId).toBeTruthy();
            expect(Array.isArray(f.prompts)).toBe(true);
            expect(f.prompts.length).toBeGreaterThan(0);
        }
    });

    it('each prompt has required fields', () => {
        const files = loadPromptFiles();
        for (const f of files) {
            for (const p of f.prompts) {
                expect(p.id).toBeTruthy();
                expect(p.conceptId).toBeTruthy();
                expect(['beginner', 'intermediate', 'advanced']).toContain(p.depth);
                expect(p.question).toBeTruthy();
                expect(p.guidance).toBeTruthy();
            }
        }
    });

    it('returns cached result on second call', () => {
        const first = loadPromptFiles();
        const second = loadPromptFiles();
        expect(first).toBe(second);
    });

    it('resetPromptCache clears the cache', () => {
        const first = loadPromptFiles();
        resetPromptCache();
        const second = loadPromptFiles();
        expect(first).not.toBe(second);
    });
});

describe('getAllPrompts', () => {
    beforeEach(() => {
        resetPromptCache();
    });

    it('returns all prompts across all files', () => {
        const prompts = getAllPrompts();
        expect(Array.isArray(prompts)).toBe(true);
        expect(prompts.length).toBeGreaterThan(0);
    });

    it('every prompt has an id and a question', () => {
        for (const p of getAllPrompts()) {
            expect(p.id).toBeTruthy();
            expect(p.question).toBeTruthy();
        }
    });
});

describe('getPromptsByConceptId', () => {
    beforeEach(() => {
        resetPromptCache();
    });

    it('returns prompts for a known conceptId', () => {
        const prompts = getPromptsByConceptId('anatta');
        expect(prompts.length).toBeGreaterThan(0);
        for (const p of prompts) {
            expect(p.conceptId).toBe('anatta');
        }
    });

    it('returns empty array for unknown conceptId', () => {
        expect(getPromptsByConceptId('not-a-concept')).toEqual([]);
    });
});

describe('getPromptFileById', () => {
    beforeEach(() => {
        resetPromptCache();
    });

    it('returns prompt file for each known PROMPT_FILE_ID', () => {
        for (const id of PROMPT_FILE_IDS) {
            const file = getPromptFileById(id);
            expect(file, `prompt file '${id}' not found`).toBeDefined();
            expect(file?.id).toBe(id);
        }
    });

    it('returns undefined for unknown id', () => {
        expect(getPromptFileById('not-a-file')).toBeUndefined();
    });
});
