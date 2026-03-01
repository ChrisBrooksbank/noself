import { describe, it, expect, beforeEach } from 'vitest';
import { loadMantras, getMantraById, resetMantraCache } from './loader.js';
import { MANTRA_IDS } from './index.js';

describe('loadMantras', () => {
    beforeEach(() => {
        resetMantraCache();
    });

    it(`loads all ${MANTRA_IDS.length} mantras`, () => {
        const mantras = loadMantras();
        expect(mantras).toHaveLength(MANTRA_IDS.length);
    });

    it('every MANTRA_ID has a corresponding loaded mantra', () => {
        const mantras = loadMantras();
        const ids = mantras.map((m) => m.id);
        for (const id of MANTRA_IDS) {
            expect(ids).toContain(id);
        }
    });

    it('each mantra has required fields', () => {
        const mantras = loadMantras();
        for (const m of mantras) {
            expect(m.id).toBeTruthy();
            expect(m.title).toBeTruthy();
            expect(m.sanskrit).toBeTruthy();
            expect(m.tradition).toBeTruthy();
            expect(m.description).toBeTruthy();
            expect(m.meaning).toBeTruthy();
            expect(m.usage).toBeTruthy();
            expect(m.defaultRepetitions).toBeGreaterThan(0);
            expect(Array.isArray(m.syllables)).toBe(true);
            expect(Array.isArray(m.relatedConcepts)).toBe(true);
        }
    });

    it('each mantra has at least one syllable with text and meaning', () => {
        const mantras = loadMantras();
        for (const m of mantras) {
            expect(m.syllables.length, `${m.id} has no syllables`).toBeGreaterThan(0);
            for (const syllable of m.syllables) {
                expect(syllable.text).toBeTruthy();
                expect(syllable.meaning).toBeTruthy();
            }
        }
    });

    it('returns cached result on second call', () => {
        const first = loadMantras();
        const second = loadMantras();
        expect(first).toBe(second);
    });

    it('resetMantraCache clears the cache', () => {
        const first = loadMantras();
        resetMantraCache();
        const second = loadMantras();
        expect(first).not.toBe(second);
    });
});

describe('getMantraById', () => {
    beforeEach(() => {
        resetMantraCache();
    });

    it('returns mantra for each known MANTRA_ID', () => {
        for (const id of MANTRA_IDS) {
            const m = getMantraById(id);
            expect(m, `mantra '${id}' not found`).toBeDefined();
            expect(m?.id).toBe(id);
        }
    });

    it('returns undefined for unknown id', () => {
        expect(getMantraById('not-a-mantra')).toBeUndefined();
    });
});
