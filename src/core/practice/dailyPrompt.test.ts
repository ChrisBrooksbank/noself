import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDailyPromptId, getDailyPrompt } from './dailyPrompt.js';

const MOCK_PROMPTS = [
    {
        id: 'anatta-1',
        conceptId: 'anatta',
        depth: 'beginner' as const,
        question: 'Can you find a fixed self?',
        guidance: 'Look carefully.',
    },
    {
        id: 'anatta-2',
        conceptId: 'anatta',
        depth: 'intermediate' as const,
        question: 'Who is observing?',
        guidance: 'Notice the observer.',
    },
    {
        id: 'anicca-1',
        conceptId: 'anicca',
        depth: 'beginner' as const,
        question: 'What is changing right now?',
        guidance: 'Notice impermanence.',
    },
];

vi.mock('../../content/prompts/loader.js', () => ({
    getAllPrompts: () => MOCK_PROMPTS,
}));

beforeEach(() => {
    vi.restoreAllMocks();
});

describe('getDailyPromptId', () => {
    it('returns a valid prompt ID', () => {
        const id = getDailyPromptId(new Date('2024-01-01T00:00:00Z'));
        expect(MOCK_PROMPTS.map((p) => p.id)).toContain(id);
    });

    it('is deterministic for the same date', () => {
        const date1 = new Date('2024-06-15T08:00:00Z');
        const date2 = new Date('2024-06-15T20:00:00Z');
        expect(getDailyPromptId(date1)).toBe(getDailyPromptId(date2));
    });

    it('returns different IDs on different days (when prompts count > 1)', () => {
        const day1 = new Date('2024-01-01T00:00:00Z');
        const day2 = new Date('2024-01-02T00:00:00Z');
        expect(getDailyPromptId(day1)).not.toBe(getDailyPromptId(day2));
    });

    it('cycles through all prompt IDs', () => {
        const baseDate = new Date(0);
        const seen = new Set<string>();
        for (let i = 0; i < MOCK_PROMPTS.length; i++) {
            const date = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
            seen.add(getDailyPromptId(date));
        }
        expect(seen.size).toBe(MOCK_PROMPTS.length);
    });

    it('uses epoch day index modulo prompt count', () => {
        const epoch = new Date(0);
        expect(getDailyPromptId(epoch)).toBe(MOCK_PROMPTS[0]!.id);

        const dayN = new Date(MOCK_PROMPTS.length * 24 * 60 * 60 * 1000);
        expect(getDailyPromptId(dayN)).toBe(MOCK_PROMPTS[0]!.id);
    });
});

describe('getDailyPrompt', () => {
    it('returns a prompt with the expected id', () => {
        const date = new Date('2024-01-01T00:00:00Z');
        const prompt = getDailyPrompt(date);
        expect(prompt.id).toBe(getDailyPromptId(date));
    });

    it('returns a prompt with required fields', () => {
        const prompt = getDailyPrompt(new Date('2024-03-10T00:00:00Z'));
        expect(prompt).toHaveProperty('id');
        expect(prompt).toHaveProperty('conceptId');
        expect(prompt).toHaveProperty('question');
        expect(prompt).toHaveProperty('guidance');
        expect(prompt).toHaveProperty('depth');
    });

    it('defaults to today when no date is provided', () => {
        const now = new Date();
        const expectedId = getDailyPromptId(now);
        const prompt = getDailyPrompt();
        expect(prompt.id).toBe(expectedId);
    });
});
