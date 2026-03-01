import { describe, it, expect, beforeEach } from 'vitest';
import {
    loadPromptFiles,
    getAllPrompts,
    getPromptsByConceptId,
    getPromptFileById,
    resetPromptCache,
} from './loader.js';

describe('loadPromptFiles', () => {
    beforeEach(() => {
        resetPromptCache();
    });

    it('returns an array', () => {
        const files = loadPromptFiles();
        expect(Array.isArray(files)).toBe(true);
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

    it('returns an array', () => {
        expect(Array.isArray(getAllPrompts())).toBe(true);
    });
});

describe('getPromptsByConceptId', () => {
    beforeEach(() => {
        resetPromptCache();
    });

    it('returns empty array for unknown conceptId', () => {
        expect(getPromptsByConceptId('not-a-concept')).toEqual([]);
    });
});

describe('getPromptFileById', () => {
    beforeEach(() => {
        resetPromptCache();
    });

    it('returns undefined for unknown id', () => {
        expect(getPromptFileById('not-a-file')).toBeUndefined();
    });
});
