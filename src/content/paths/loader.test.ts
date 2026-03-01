import { describe, it, expect, beforeEach } from 'vitest';
import { loadPaths, getPathById, resetPathCache } from './loader.js';

describe('loadPaths', () => {
    beforeEach(() => {
        resetPathCache();
    });

    it('returns an array', () => {
        const paths = loadPaths();
        expect(Array.isArray(paths)).toBe(true);
    });

    it('returns cached result on second call', () => {
        const first = loadPaths();
        const second = loadPaths();
        expect(first).toBe(second);
    });

    it('resetPathCache clears the cache', () => {
        const first = loadPaths();
        resetPathCache();
        const second = loadPaths();
        expect(first).not.toBe(second);
    });
});

describe('getPathById', () => {
    beforeEach(() => {
        resetPathCache();
    });

    it('returns undefined for unknown id', () => {
        expect(getPathById('not-a-path')).toBeUndefined();
    });
});
