import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderMeditationSessionView } from './meditationSessionView.js';
import type { Meditation } from '../../content/meditations/index.js';

const mockMeditation: Meditation = {
    id: 'breath-awareness',
    title: 'Breath Awareness',
    description: 'A foundational meditation on the breath.',
    durations: [5, 10],
    steps: {
        5: [
            { instruction: 'Settle in and close your eyes.', durationSeconds: 150 },
            { instruction: 'Focus on the breath.', durationSeconds: 150 },
        ],
        10: [
            { instruction: 'Settle in and close your eyes.', durationSeconds: 300 },
            { instruction: 'Focus on the breath.', durationSeconds: 300 },
        ],
    },
};

vi.mock('../../content/meditations/loader.js', () => ({
    loadMeditations: vi.fn(() => [mockMeditation]),
}));

vi.mock('./bellSound.js', () => ({
    playBell: vi.fn(),
    resumeAudioContext: vi.fn(() => Promise.resolve()),
}));

vi.mock('../practiceHistory.js', () => ({
    logMeditationSession: vi.fn(),
}));

describe('renderMeditationSessionView', () => {
    let container: HTMLElement;
    let cleanup: () => void;

    beforeEach(() => {
        container = document.createElement('div');
        vi.useFakeTimers();
    });

    afterEach(() => {
        cleanup?.();
        vi.useRealTimers();
    });

    it('returns a cleanup function', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        expect(typeof cleanup).toBe('function');
    });

    it('renders the meditation title', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const title = container.querySelector('.meditation-session__title');
        expect(title?.textContent).toBe('Breath Awareness');
    });

    it('renders the selected duration', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const duration = container.querySelector('.meditation-session__duration');
        expect(duration?.textContent).toBe('5 minutes');
    });

    it('renders the first step instruction', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const instruction = container.querySelector(
            '.meditation-session__instruction-text',
        );
        expect(instruction?.textContent).toBe('Settle in and close your eyes.');
    });

    it('renders a back link to meditation list', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const link = container.querySelector('.back-link');
        expect(link?.getAttribute('href')).toBe('#/practice/meditate');
    });

    it('renders the initial time display as 00:00', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const time = container.querySelector('.meditation-session__time-display');
        expect(time?.textContent).toBe('00:00');
    });

    it('renders the total duration', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const total = container.querySelector('.meditation-session__time-total');
        // 5 min = 300 seconds = 05:00
        expect(total?.textContent).toBe('/ 05:00');
    });

    it('renders a "Begin" button in idle state', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const startBtn = container.querySelector('.js-start');
        expect(startBtn?.textContent).toBe('Begin');
    });

    it('falls back to first available duration when requested duration is missing', () => {
        // duration=20 is not in the mock (only 5 and 10)
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=20');
        const duration = container.querySelector('.meditation-session__duration');
        expect(duration?.textContent).toBe('5 minutes');
    });

    it('uses requested duration when it is available', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=10');
        const duration = container.querySelector('.meditation-session__duration');
        expect(duration?.textContent).toBe('10 minutes');
    });

    it('renders not-found message for unknown meditation ID', () => {
        cleanup = renderMeditationSessionView(container, 'unknown-meditation?duration=5');
        const notFound = container.querySelector('p');
        expect(notFound?.textContent).toContain('Meditation not found');
    });

    it('renders pause and stop buttons after starting', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        const startBtn = container.querySelector<HTMLButtonElement>('.js-start')!;
        startBtn.click();

        const pauseBtn = container.querySelector('.js-pause');
        const stopBtn = container.querySelector('.js-stop');
        expect(pauseBtn).toBeTruthy();
        expect(stopBtn).toBeTruthy();
    });

    it('renders resume and stop buttons after pausing', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        container.querySelector<HTMLButtonElement>('.js-pause')!.click();

        const resumeBtn = container.querySelector('.js-resume');
        const stopBtn = container.querySelector('.js-stop');
        expect(resumeBtn).toBeTruthy();
        expect(stopBtn).toBeTruthy();
    });

    it('shows paused status text after pausing', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        container.querySelector<HTMLButtonElement>('.js-pause')!.click();

        const status = container.querySelector('.meditation-session__status');
        expect(status?.textContent).toBe('Paused');
    });

    it('returns to idle state and Begin button after stopping', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        container.querySelector<HTMLButtonElement>('.js-stop')!.click();

        const startBtn = container.querySelector('.js-start');
        expect(startBtn?.textContent).toBe('Begin');
    });

    it('updates time display on tick', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        vi.advanceTimersByTime(3000);

        const time = container.querySelector('.meditation-session__time-display');
        expect(time?.textContent).toBe('00:03');
    });

    it('shows "Session complete" message when timer finishes', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        // Advance past the total duration (300 seconds)
        vi.advanceTimersByTime(301 * 1000);

        const status = container.querySelector('.meditation-session__status');
        expect(status?.textContent).toContain('Session complete');
    });

    it('renders a Done button when session is complete', () => {
        cleanup = renderMeditationSessionView(container, 'breath-awareness?duration=5');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        vi.advanceTimersByTime(301 * 1000);

        const doneBtn = container.querySelector('.js-done');
        expect(doneBtn).toBeTruthy();
    });
});
