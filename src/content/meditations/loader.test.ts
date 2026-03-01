import { describe, it, expect, beforeEach } from 'vitest';
import { loadMeditations, getMeditationById, resetMeditationCache } from './loader.js';

describe('loadMeditations', () => {
    beforeEach(() => {
        resetMeditationCache();
    });

    it('returns an array', () => {
        const meditations = loadMeditations();
        expect(Array.isArray(meditations)).toBe(true);
    });

    it('returns cached result on second call', () => {
        const first = loadMeditations();
        const second = loadMeditations();
        expect(first).toBe(second);
    });

    it('resetMeditationCache clears the cache', () => {
        const first = loadMeditations();
        resetMeditationCache();
        const second = loadMeditations();
        expect(first).not.toBe(second);
    });
});

describe('getMeditationById', () => {
    beforeEach(() => {
        resetMeditationCache();
    });

    it('returns undefined for unknown id', () => {
        expect(getMeditationById('not-a-meditation')).toBeUndefined();
    });
});
