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

describe('Sutra terms field', () => {
    beforeEach(() => {
        resetSutraCache();
    });

    it('heart-sutra has terms.sanskrit with required fields', () => {
        const sutra = getSutraById('heart-sutra');
        expect(sutra?.terms?.sanskrit).toBeDefined();
        expect(sutra?.terms?.sanskrit?.text).toBeTruthy();
        expect(sutra?.terms?.sanskrit?.phonetic).toBeTruthy();
        expect(sutra?.terms?.sanskrit?.literal).toBeTruthy();
    });

    it('all sutras with terms have at least one term entry', () => {
        const sutras = loadSutras();
        for (const sutra of sutras) {
            if (sutra.terms) {
                const hasPali = sutra.terms.pali !== undefined;
                const hasSanskrit = sutra.terms.sanskrit !== undefined;
                expect(
                    hasPali || hasSanskrit,
                    `${sutra.id} has terms object but no pali or sanskrit entry`,
                ).toBe(true);
            }
        }
    });
});

describe('Sanskrit/Pali enrichment — sutras', () => {
    beforeEach(() => {
        resetSutraCache();
    });

    it('all sutra sections have phonetic', () => {
        const sutras = loadSutras();
        for (const sutra of sutras) {
            for (const section of sutra.sections) {
                expect(
                    section.phonetic,
                    `${sutra.id} section '${section.id}' missing phonetic`,
                ).toBeTruthy();
            }
        }
    });

    it('heart sutra key passages have gloss', () => {
        const sutra = getSutraById('heart-sutra');
        const glossedIds = ['the-setting', 'form-is-emptiness', 'the-mantra'];
        for (const id of glossedIds) {
            const section = sutra?.sections.find((s) => s.id === id);
            expect(section, `heart-sutra section '${id}' not found`).toBeDefined();
            expect(
                section?.gloss,
                `heart-sutra section '${id}' missing gloss`,
            ).toBeDefined();
            expect(
                section?.gloss?.length,
                `heart-sutra section '${id}' gloss is empty`,
            ).toBeGreaterThan(0);
        }
    });

    it('diamond sutra key passages have gloss', () => {
        const sutra = getSutraById('diamond-sutra');
        expect(sutra, 'diamond-sutra not found').toBeDefined();
        const glossedSections = sutra!.sections.filter(
            (s) => s.gloss && s.gloss.length > 0,
        );
        expect(
            glossedSections.length,
            'diamond-sutra should have at least one section with gloss',
        ).toBeGreaterThan(0);
    });

    it('dhammapada twin-verses opening has gloss', () => {
        const sutra = getSutraById('dhammapada');
        expect(sutra, 'dhammapada not found').toBeDefined();
        const glossedSections = sutra!.sections.filter(
            (s) => s.gloss && s.gloss.length > 0,
        );
        expect(
            glossedSections.length,
            'dhammapada should have at least one section with gloss',
        ).toBeGreaterThan(0);
    });
});
