import { describe, it, expect, beforeEach } from 'vitest';
import {
    logMeditationSession,
    getMeditationSessions,
    logPromptSatWith,
    getPromptSessions,
    isPromptSatWith,
    logPathSessionComplete,
    isPathSessionComplete,
    getPathSessions,
    getTotalSessionCount,
} from './practiceHistory.js';

beforeEach(() => {
    localStorage.clear();
});

describe('logMeditationSession / getMeditationSessions', () => {
    it('returns empty array initially', () => {
        expect(getMeditationSessions()).toEqual([]);
    });

    it('records a meditation session', () => {
        logMeditationSession('breath-awareness', 10);
        const sessions = getMeditationSessions();
        expect(sessions).toHaveLength(1);
        const session = sessions[0]!;
        expect(session.meditationId).toBe('breath-awareness');
        expect(session.durationMinutes).toBe(10);
        expect(session.completedAt).toBeTruthy();
    });

    it('records multiple sessions including duplicates', () => {
        logMeditationSession('breath-awareness', 10);
        logMeditationSession('breath-awareness', 20);
        logMeditationSession('metta', 15);
        expect(getMeditationSessions()).toHaveLength(3);
    });
});

describe('logPromptSatWith / getPromptSessions / isPromptSatWith', () => {
    it('returns empty array initially', () => {
        expect(getPromptSessions()).toEqual([]);
    });

    it('returns false before marking', () => {
        expect(isPromptSatWith('anatta-1')).toBe(false);
    });

    it('records a prompt sat-with and returns true', () => {
        logPromptSatWith('anatta-1');
        expect(isPromptSatWith('anatta-1')).toBe(true);
    });

    it('records multiple prompt sat-withs', () => {
        logPromptSatWith('anatta-1');
        logPromptSatWith('dukkha-2');
        expect(getPromptSessions()).toHaveLength(2);
    });

    it('allows sitting with the same prompt multiple times', () => {
        logPromptSatWith('metta-1');
        logPromptSatWith('metta-1');
        expect(getPromptSessions()).toHaveLength(2);
    });
});

describe('logPathSessionComplete / isPathSessionComplete / getPathSessions', () => {
    it('returns false for uncompleted session', () => {
        expect(isPathSessionComplete('seven-day-metta', 0)).toBe(false);
    });

    it('marks a path session complete', () => {
        logPathSessionComplete('seven-day-metta', 0);
        expect(isPathSessionComplete('seven-day-metta', 0)).toBe(true);
    });

    it('does not duplicate path session completions', () => {
        logPathSessionComplete('seven-day-metta', 0);
        logPathSessionComplete('seven-day-metta', 0);
        expect(getPathSessions()).toHaveLength(1);
    });

    it('tracks different sessions independently', () => {
        logPathSessionComplete('seven-day-metta', 0);
        logPathSessionComplete('seven-day-metta', 1);
        expect(isPathSessionComplete('seven-day-metta', 0)).toBe(true);
        expect(isPathSessionComplete('seven-day-metta', 1)).toBe(true);
        expect(isPathSessionComplete('seven-day-metta', 2)).toBe(false);
    });

    it('tracks different paths independently', () => {
        logPathSessionComplete('seven-day-metta', 0);
        expect(isPathSessionComplete('exploring-non-self', 0)).toBe(false);
    });
});

describe('getTotalSessionCount', () => {
    it('returns 0 initially', () => {
        expect(getTotalSessionCount()).toBe(0);
    });

    it('counts meditation and prompt sessions', () => {
        logMeditationSession('breath-awareness', 10);
        logMeditationSession('metta', 15);
        logPromptSatWith('anatta-1');
        expect(getTotalSessionCount()).toBe(3);
    });

    it('does not count path sessions', () => {
        logPathSessionComplete('seven-day-metta', 0);
        expect(getTotalSessionCount()).toBe(0);
    });
});

describe('persistence', () => {
    it('persists data to localStorage', () => {
        logMeditationSession('vipassana', 20);
        const raw = localStorage.getItem('noself:practiceHistory');
        expect(raw).not.toBeNull();
        expect(raw).toContain('vipassana');
    });
});
