import { describe, it, expect, vi } from 'vitest';
import { daysSinceEpoch, getDailyConceptId, getDailyConcept } from './dailyConcept.js';
import { CONCEPT_IDS } from '../content/concepts/index.js';

vi.mock('../content/concepts/index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../content/concepts/index.js')>();
    return {
        ...actual,
        getConceptById: (id: string) => ({
            id,
            title: `Title for ${id}`,
            pali: null,
            sanskrit: null,
            category: 'foundational' as const,
            related: [],
            brief: 'Brief.',
            essentials: 'Essentials.',
            deep: 'Deep.',
            examples: [],
        }),
    };
});

describe('daysSinceEpoch', () => {
    it('returns 0 for the Unix epoch', () => {
        expect(daysSinceEpoch(new Date(0))).toBe(0);
    });

    it('returns 1 for one day after the epoch', () => {
        expect(daysSinceEpoch(new Date(24 * 60 * 60 * 1000))).toBe(1);
    });

    it('is stable for any instant within the same UTC day', () => {
        const startOfDay = new Date('2024-01-15T00:00:00Z');
        const midDay = new Date('2024-01-15T12:00:00Z');
        const endOfDay = new Date('2024-01-15T23:59:59Z');
        expect(daysSinceEpoch(startOfDay)).toBe(daysSinceEpoch(midDay));
        expect(daysSinceEpoch(midDay)).toBe(daysSinceEpoch(endOfDay));
    });

    it('increments by 1 across a day boundary', () => {
        const beforeMidnight = new Date('2024-01-15T23:59:59Z');
        const afterMidnight = new Date('2024-01-16T00:00:00Z');
        expect(daysSinceEpoch(afterMidnight)).toBe(daysSinceEpoch(beforeMidnight) + 1);
    });
});

describe('getDailyConceptId', () => {
    it('returns a valid concept ID', () => {
        const id = getDailyConceptId(new Date('2024-01-01T00:00:00Z'));
        expect(CONCEPT_IDS).toContain(id);
    });

    it('is deterministic for the same date', () => {
        const date1 = new Date('2024-06-15T08:00:00Z');
        const date2 = new Date('2024-06-15T20:00:00Z');
        expect(getDailyConceptId(date1)).toBe(getDailyConceptId(date2));
    });

    it('returns different IDs on different days', () => {
        const day1 = new Date('2024-01-01T00:00:00Z');
        const day2 = new Date('2024-01-02T00:00:00Z');
        expect(getDailyConceptId(day1)).not.toBe(getDailyConceptId(day2));
    });

    it('cycles through all 30 concept IDs over 30 consecutive days', () => {
        const baseDate = new Date('2024-01-01T00:00:00Z');
        const seen = new Set<string>();
        for (let i = 0; i < 30; i++) {
            const date = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
            seen.add(getDailyConceptId(date));
        }
        expect(seen.size).toBe(CONCEPT_IDS.length);
    });

    it('uses epoch day index modulo concept count', () => {
        const epoch = new Date(0);
        expect(getDailyConceptId(epoch)).toBe(CONCEPT_IDS[0]);

        const day30 = new Date(30 * 24 * 60 * 60 * 1000);
        expect(getDailyConceptId(day30)).toBe(CONCEPT_IDS[0]);
    });
});

describe('getDailyConcept', () => {
    it('returns a concept object with the expected id', () => {
        const date = new Date('2024-01-01T00:00:00Z');
        const concept = getDailyConcept(date);
        expect(concept.id).toBe(getDailyConceptId(date));
    });

    it('returns a concept with required fields', () => {
        const concept = getDailyConcept(new Date('2024-03-10T00:00:00Z'));
        expect(concept).toHaveProperty('id');
        expect(concept).toHaveProperty('title');
        expect(concept).toHaveProperty('brief');
    });

    it('defaults to today when no date is provided', () => {
        const now = new Date();
        const expectedId = getDailyConceptId(now);
        const concept = getDailyConcept();
        expect(concept.id).toBe(expectedId);
    });
});
