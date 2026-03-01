import { describe, it, expect, beforeEach } from 'vitest';
import { loadMeditations, getMeditationById, resetMeditationCache } from './loader.js';
import { MEDITATION_IDS } from './index.js';

describe('loadMeditations', () => {
    beforeEach(() => {
        resetMeditationCache();
    });

    it(`loads all ${MEDITATION_IDS.length} meditations`, () => {
        const meditations = loadMeditations();
        expect(meditations).toHaveLength(MEDITATION_IDS.length);
    });

    it('every MEDITATION_ID has a corresponding loaded meditation', () => {
        const meditations = loadMeditations();
        const ids = meditations.map((m) => m.id);
        for (const id of MEDITATION_IDS) {
            expect(ids).toContain(id);
        }
    });

    it('each meditation has required fields', () => {
        const meditations = loadMeditations();
        for (const m of meditations) {
            expect(m.id).toBeTruthy();
            expect(m.title).toBeTruthy();
            expect(m.description).toBeTruthy();
            expect(Array.isArray(m.durations)).toBe(true);
            expect(m.durations.length).toBeGreaterThan(0);
            expect(typeof m.steps).toBe('object');
        }
    });

    it('each meditation has steps for every declared duration', () => {
        const meditations = loadMeditations();
        for (const m of meditations) {
            for (const duration of m.durations) {
                const steps = m.steps[duration];
                expect(steps, `${m.id} missing steps for ${duration}min`).toBeDefined();
                expect(
                    steps!.length,
                    `${m.id} has no steps for ${duration}min`,
                ).toBeGreaterThan(0);
                for (const step of steps!) {
                    expect(step.instruction).toBeTruthy();
                    expect(step.durationSeconds).toBeGreaterThan(0);
                }
            }
        }
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

    it('returns meditation for each known MEDITATION_ID', () => {
        for (const id of MEDITATION_IDS) {
            const m = getMeditationById(id);
            expect(m, `meditation '${id}' not found`).toBeDefined();
            expect(m?.id).toBe(id);
        }
    });

    it('returns undefined for unknown id', () => {
        expect(getMeditationById('not-a-meditation')).toBeUndefined();
    });
});
