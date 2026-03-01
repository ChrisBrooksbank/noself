import { describe, it, expect, beforeEach } from 'vitest';
import { loadConcepts, getConceptById, resetConceptCache } from './loader.js';

describe('loadConcepts', () => {
    beforeEach(() => {
        resetConceptCache();
    });

    it('loads all 30 concepts', () => {
        const concepts = loadConcepts();
        expect(concepts).toHaveLength(30);
    });

    it('each concept has required fields', () => {
        const concepts = loadConcepts();
        for (const concept of concepts) {
            expect(concept.id).toBeTruthy();
            expect(concept.title).toBeTruthy();
            expect(concept.category).toBeTruthy();
            expect(concept.brief).toBeTruthy();
            expect(concept.essentials).toBeTruthy();
            expect(concept.deep).toBeTruthy();
            expect(Array.isArray(concept.related)).toBe(true);
            expect(Array.isArray(concept.examples)).toBe(true);
        }
    });

    it('returns cached result on second call', () => {
        const first = loadConcepts();
        const second = loadConcepts();
        expect(first).toBe(second);
    });
});

describe('getConceptById', () => {
    beforeEach(() => {
        resetConceptCache();
    });

    it('returns concept by id', () => {
        const concept = getConceptById('anatta');
        expect(concept).toBeDefined();
        expect(concept?.id).toBe('anatta');
        expect(concept?.title).toBe('No-Self');
    });

    it('returns undefined for unknown id', () => {
        expect(getConceptById('not-a-concept')).toBeUndefined();
    });
});
