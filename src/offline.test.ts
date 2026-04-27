import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    CONCEPT_IDS,
    loadConcepts,
    getConceptById,
    resetConceptCache,
} from './content/concepts/index.js';

describe('offline smoke test', () => {
    beforeEach(() => {
        resetConceptCache();
        // Simulate offline by mocking navigator.onLine
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('loads all concepts when offline', () => {
        expect(navigator.onLine).toBe(false);
        const concepts = loadConcepts();
        expect(concepts).toHaveLength(CONCEPT_IDS.length);
    });

    it('retrieves a specific concept by id when offline', () => {
        expect(navigator.onLine).toBe(false);
        const concept = getConceptById('anatta');
        expect(concept).toBeDefined();
        expect(concept?.title).toBe('No-Self');
        expect(concept?.brief).toBeTruthy();
        expect(concept?.essentials).toBeTruthy();
    });

    it('all concepts have content accessible without network', () => {
        expect(navigator.onLine).toBe(false);
        const concepts = loadConcepts();
        for (const concept of concepts) {
            expect(concept.brief.length).toBeGreaterThan(0);
            expect(concept.essentials.length).toBeGreaterThan(0);
            expect(concept.deep.length).toBeGreaterThan(0);
        }
    });
});
