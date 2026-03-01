import { describe, it, expect, beforeEach } from 'vitest';
import { loadSutras, getSutraById, resetSutraCache } from './loader.js';

describe('loadSutras', () => {
    beforeEach(() => {
        resetSutraCache();
    });

    it('loads all sutras', () => {
        const sutras = loadSutras();
        expect(sutras.length).toBeGreaterThanOrEqual(1);
    });

    it('each sutra has required fields', () => {
        const sutras = loadSutras();
        for (const sutra of sutras) {
            expect(sutra.id).toBeTruthy();
            expect(sutra.title).toBeTruthy();
            expect(sutra.tradition).toBeTruthy();
            expect(sutra.description).toBeTruthy();
            expect(Array.isArray(sutra.sections)).toBe(true);
        }
    });

    it('each section has required fields', () => {
        const sutras = loadSutras();
        for (const sutra of sutras) {
            for (const section of sutra.sections) {
                expect(section.id).toBeTruthy();
                expect(section.title).toBeTruthy();
                expect(section.original).toBeTruthy();
                expect(section.originalLanguage).toBeTruthy();
                expect(section.translation).toBeTruthy();
                expect(section.commentary).toBeTruthy();
                expect(Array.isArray(section.relatedConcepts)).toBe(true);
            }
        }
    });

    it('returns cached result on second call', () => {
        const first = loadSutras();
        const second = loadSutras();
        expect(first).toBe(second);
    });
});

describe('getSutraById', () => {
    beforeEach(() => {
        resetSutraCache();
    });

    it('returns sutra by id', () => {
        const sutra = getSutraById('heart-sutra');
        expect(sutra).toBeDefined();
        expect(sutra?.id).toBe('heart-sutra');
        expect(sutra?.title).toBe('Heart Sutra');
    });

    it('returns undefined for unknown id', () => {
        expect(getSutraById('not-a-sutra')).toBeUndefined();
    });

    it('heart sutra has 9 sections', () => {
        const sutra = getSutraById('heart-sutra');
        expect(sutra?.sections).toHaveLength(9);
    });
});
