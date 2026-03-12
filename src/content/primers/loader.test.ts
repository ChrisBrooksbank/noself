import { describe, it, expect, beforeEach } from 'vitest';
import { loadPrimers, getPrimerById, resetPrimerCache } from './loader.js';
import { PRIMER_IDS } from './index.js';

describe('loadPrimers', () => {
    beforeEach(() => {
        resetPrimerCache();
    });

    it(`loads all ${PRIMER_IDS.length} primers`, () => {
        const primers = loadPrimers();
        expect(primers).toHaveLength(PRIMER_IDS.length);
    });

    it('every PRIMER_ID has a corresponding loaded primer', () => {
        const primers = loadPrimers();
        const ids = primers.map((p) => p.id);
        for (const id of PRIMER_IDS) {
            expect(ids).toContain(id);
        }
    });

    it('each primer has required fields', () => {
        const primers = loadPrimers();
        for (const p of primers) {
            expect(p.id).toBeTruthy();
            expect(p.title).toBeTruthy();
            expect(p.language).toMatch(/^(pali|sanskrit)$/);
            expect(p.description).toBeTruthy();
            expect(p.brief).toBeTruthy();
            expect(p.essentials).toBeTruthy();
            expect(p.deep).toBeTruthy();
            expect(Array.isArray(p.sections)).toBe(true);
            expect(Array.isArray(p.keyTerms)).toBe(true);
            expect(Array.isArray(p.relatedConcepts)).toBe(true);
        }
    });

    it('each primer has at least one section with id, title, and content', () => {
        const primers = loadPrimers();
        for (const p of primers) {
            expect(p.sections.length, `${p.id} has no sections`).toBeGreaterThan(0);
            for (const section of p.sections) {
                expect(section.id).toBeTruthy();
                expect(section.title).toBeTruthy();
                expect(section.content).toBeTruthy();
            }
        }
    });

    it('each primer has valid keyTerms with text, language, literal, and phonetic', () => {
        const primers = loadPrimers();
        for (const p of primers) {
            expect(p.keyTerms.length, `${p.id} has no keyTerms`).toBeGreaterThan(0);
            for (const term of p.keyTerms) {
                expect(term.text, `${p.id} term missing text`).toBeTruthy();
                expect(
                    term.language,
                    `${p.id} term '${term.text}' missing language`,
                ).toMatch(/^(pali|sanskrit|hybrid)$/);
                expect(
                    term.literal,
                    `${p.id} term '${term.text}' missing literal`,
                ).toBeTruthy();
                expect(
                    term.phonetic,
                    `${p.id} term '${term.text}' missing phonetic`,
                ).toBeTruthy();
            }
        }
    });

    it('returns cached result on second call', () => {
        const first = loadPrimers();
        const second = loadPrimers();
        expect(first).toBe(second);
    });

    it('resetPrimerCache clears the cache', () => {
        const first = loadPrimers();
        resetPrimerCache();
        const second = loadPrimers();
        expect(first).not.toBe(second);
    });
});

describe('getPrimerById', () => {
    beforeEach(() => {
        resetPrimerCache();
    });

    it('returns primer for each known PRIMER_ID', () => {
        for (const id of PRIMER_IDS) {
            const p = getPrimerById(id);
            expect(p, `primer '${id}' not found`).toBeDefined();
            expect(p?.id).toBe(id);
        }
    });

    it('returns undefined for unknown id', () => {
        expect(getPrimerById('not-a-primer')).toBeUndefined();
    });
});
