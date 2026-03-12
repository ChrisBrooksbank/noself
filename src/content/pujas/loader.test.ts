import { describe, it, expect, beforeEach } from 'vitest';
import { loadPujas, getPujaById, resetPujaCache } from './loader.js';
import { PUJA_IDS } from './index.js';

describe('loadPujas', () => {
    beforeEach(() => {
        resetPujaCache();
    });

    it(`loads all ${PUJA_IDS.length} pujas`, () => {
        const pujas = loadPujas();
        expect(pujas).toHaveLength(PUJA_IDS.length);
    });

    it('every PUJA_ID has a corresponding loaded puja', () => {
        const pujas = loadPujas();
        const ids = pujas.map((p) => p.id);
        for (const id of PUJA_IDS) {
            expect(ids).toContain(id);
        }
    });

    it('each puja has required fields', () => {
        const pujas = loadPujas();
        for (const p of pujas) {
            expect(p.id).toBeTruthy();
            expect(p.title).toBeTruthy();
            expect(p.tradition).toBeTruthy();
            expect(p.description).toBeTruthy();
            expect(Array.isArray(p.sections)).toBe(true);
            expect(Array.isArray(p.ritualSteps)).toBe(true);
        }
    });

    it('each puja has at least one section', () => {
        const pujas = loadPujas();
        for (const p of pujas) {
            expect(p.sections.length, `${p.id} has no sections`).toBeGreaterThan(0);
            for (const section of p.sections) {
                expect(section.id).toBeTruthy();
                expect(section.title).toBeTruthy();
                expect(section.original).toBeTruthy();
                expect(section.translation).toBeTruthy();
                expect(section.order).toBeGreaterThan(0);
            }
        }
    });

    it('each puja section has phonetic enrichment', () => {
        const pujas = loadPujas();
        for (const p of pujas) {
            for (const section of p.sections) {
                expect(
                    section.phonetic,
                    `${p.id} section '${section.id}' missing phonetic`,
                ).toBeTruthy();
            }
        }
    });

    it('each puja section has gloss word-by-word enrichment', () => {
        const pujas = loadPujas();
        for (const p of pujas) {
            for (const section of p.sections) {
                expect(
                    section.gloss,
                    `${p.id} section '${section.id}' missing gloss`,
                ).toBeDefined();
                expect(
                    section.gloss!.length,
                    `${p.id} section '${section.id}' gloss is empty`,
                ).toBeGreaterThan(0);
                for (const entry of section.gloss!) {
                    expect(
                        entry.word,
                        `${p.id}/${section.id} gloss entry missing word`,
                    ).toBeTruthy();
                    expect(
                        entry.meaning,
                        `${p.id}/${section.id} gloss entry missing meaning`,
                    ).toBeTruthy();
                }
            }
        }
    });

    it('each puja has at least one ritual step', () => {
        const pujas = loadPujas();
        for (const p of pujas) {
            expect(p.ritualSteps.length, `${p.id} has no ritual steps`).toBeGreaterThan(
                0,
            );
            for (const step of p.ritualSteps) {
                expect(step.id).toBeTruthy();
                expect(step.title).toBeTruthy();
                expect(step.instruction).toBeTruthy();
                expect(step.order).toBeGreaterThan(0);
            }
        }
    });

    it('returns cached result on second call', () => {
        const first = loadPujas();
        const second = loadPujas();
        expect(first).toBe(second);
    });

    it('resetPujaCache clears the cache', () => {
        const first = loadPujas();
        resetPujaCache();
        const second = loadPujas();
        expect(first).not.toBe(second);
    });
});

describe('getPujaById', () => {
    beforeEach(() => {
        resetPujaCache();
    });

    it('returns puja for each known PUJA_ID', () => {
        for (const id of PUJA_IDS) {
            const p = getPujaById(id);
            expect(p, `puja '${id}' not found`).toBeDefined();
            expect(p?.id).toBe(id);
        }
    });

    it('returns undefined for unknown id', () => {
        expect(getPujaById('not-a-puja')).toBeUndefined();
    });
});
