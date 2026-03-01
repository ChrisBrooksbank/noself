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
    logPujaSession,
    getPujaSessions,
    logMantraSession,
    getMantraSessions,
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

describe('logPujaSession / getPujaSessions', () => {
    it('returns empty array initially', () => {
        expect(getPujaSessions()).toEqual([]);
    });

    it('records a puja session', () => {
        logPujaSession('sevenfold-puja');
        const sessions = getPujaSessions();
        expect(sessions).toHaveLength(1);
        const session = sessions[0]!;
        expect(session.pujaId).toBe('sevenfold-puja');
        expect(session.completedAt).toBeTruthy();
    });

    it('records multiple puja sessions', () => {
        logPujaSession('sevenfold-puja');
        logPujaSession('sevenfold-puja');
        expect(getPujaSessions()).toHaveLength(2);
    });
});

describe('logMantraSession / getMantraSessions', () => {
    it('returns empty array initially', () => {
        expect(getMantraSessions()).toEqual([]);
    });

    it('records a mantra session with repetitions', () => {
        logMantraSession('avalokiteshvara', 108);
        const sessions = getMantraSessions();
        expect(sessions).toHaveLength(1);
        const session = sessions[0]!;
        expect(session.mantraId).toBe('avalokiteshvara');
        expect(session.repetitions).toBe(108);
        expect(session.completedAt).toBeTruthy();
    });

    it('records multiple mantra sessions', () => {
        logMantraSession('avalokiteshvara', 108);
        logMantraSession('avalokiteshvara', 42);
        expect(getMantraSessions()).toHaveLength(2);
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

    it('counts puja and mantra sessions', () => {
        logPujaSession('sevenfold-puja');
        logMantraSession('avalokiteshvara', 108);
        expect(getTotalSessionCount()).toBe(2);
    });

    it('counts all session types together', () => {
        logMeditationSession('breath-awareness', 10);
        logPromptSatWith('anatta-1');
        logPujaSession('sevenfold-puja');
        logMantraSession('avalokiteshvara', 108);
        expect(getTotalSessionCount()).toBe(4);
    });
});

describe('persistence', () => {
    it('persists data to localStorage', () => {
        logMeditationSession('vipassana', 20);
        const raw = localStorage.getItem('noself:practiceHistory');
        expect(raw).not.toBeNull();
        expect(raw).toContain('vipassana');
    });

    it('handles legacy data without pujas/mantras fields', () => {
        const legacy = JSON.stringify({
            meditations: [
                {
                    meditationId: 'metta',
                    durationMinutes: 10,
                    completedAt: '2024-01-01T00:00:00.000Z',
                },
            ],
            prompts: [],
            pathSessions: [],
        });
        localStorage.setItem('noself:practiceHistory', legacy);
        expect(getPujaSessions()).toEqual([]);
        expect(getMantraSessions()).toEqual([]);
        expect(getMeditationSessions()).toHaveLength(1);
    });
});
