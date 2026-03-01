import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderPujaPerformView } from './pujaPerformView.js';
import type { Puja } from '../../content/pujas/index.js';

const mockPuja: Puja = {
    id: 'sevenfold-puja',
    title: 'The Sevenfold Puja',
    tradition: 'Triratna',
    description: 'A devotional liturgy in seven movements.',
    sections: [],
    ritualSteps: [
        {
            id: 'opening',
            order: 1,
            title: 'Opening',
            instruction: 'Light candles and incense.',
            durationSeconds: 60,
            sectionRef: null,
        },
        {
            id: 'chant',
            order: 2,
            title: 'Chant',
            instruction: 'Recite the opening verse.',
            durationSeconds: null,
            sectionRef: null,
        },
    ],
};

vi.mock('../../content/pujas/index.js', () => ({
    getPujaById: vi.fn((id: string) => (id === 'sevenfold-puja' ? mockPuja : undefined)),
}));

vi.mock('./bellSound.js', () => ({
    playBell: vi.fn(),
    resumeAudioContext: vi.fn(() => Promise.resolve()),
}));

vi.mock('../practiceHistory.js', () => ({
    logPujaSession: vi.fn(),
}));

describe('renderPujaPerformView', () => {
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
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        expect(typeof cleanup).toBe('function');
    });

    it('renders the puja title', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        const title = container.querySelector('.puja-perform__title');
        expect(title?.textContent).toBe('The Sevenfold Puja');
    });

    it('renders the tradition badge', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        const badge = container.querySelector('.badge');
        expect(badge?.textContent).toBe('Triratna');
    });

    it('renders first step instruction initially', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        const instruction = container.querySelector('.puja-perform__instruction-text');
        expect(instruction?.textContent).toBe('Light candles and incense.');
    });

    it('renders a back link to pujas list', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        const link = container.querySelector('.back-link');
        expect(link?.getAttribute('href')).toBe('#/practice/pujas');
    });

    it('renders a "Begin" button in idle state', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        const startBtn = container.querySelector('.js-start');
        expect(startBtn?.textContent).toBe('Begin');
    });

    it('renders not-found message for unknown puja ID', () => {
        cleanup = renderPujaPerformView(container, 'unknown-puja');
        const para = container.querySelector('p');
        expect(para?.textContent).toContain('Puja not found');
    });

    it('renders pause and stop buttons after starting a timed step', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();

        const pauseBtn = container.querySelector('.js-pause');
        const stopBtn = container.querySelector('.js-stop');
        expect(pauseBtn).toBeTruthy();
        expect(stopBtn).toBeTruthy();
    });

    it('renders resume and stop buttons after pausing', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        container.querySelector<HTMLButtonElement>('.js-pause')!.click();

        const resumeBtn = container.querySelector('.js-resume');
        const stopBtn = container.querySelector('.js-stop');
        expect(resumeBtn).toBeTruthy();
        expect(stopBtn).toBeTruthy();
    });

    it('shows paused status text after pausing', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        container.querySelector<HTMLButtonElement>('.js-pause')!.click();

        const status = container.querySelector('.puja-perform__status');
        expect(status?.textContent).toBe('Paused');
    });

    it('returns to idle state with Begin button after stopping', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        container.querySelector<HTMLButtonElement>('.js-stop')!.click();

        const startBtn = container.querySelector('.js-start');
        expect(startBtn?.textContent).toBe('Begin');
    });

    it('updates time display on tick during timed step', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        vi.advanceTimersByTime(5000);

        const timeDisplay = container.querySelector('.puja-perform__time-display');
        // 60 - 5 = 55 seconds remaining
        expect(timeDisplay?.textContent).toBe('00:55');
    });

    it('auto-advances to next step when timed step completes', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        // First step is 60s — advance past it
        vi.advanceTimersByTime(61 * 1000);

        const instruction = container.querySelector('.puja-perform__instruction-text');
        expect(instruction?.textContent).toBe('Recite the opening verse.');
    });

    it('shows Next Step button for open-ended step', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        // Advance past first timed step to reach open-ended step
        vi.advanceTimersByTime(61 * 1000);

        const nextBtn = container.querySelector('.js-next');
        expect(nextBtn).toBeTruthy();
    });

    it('shows "Complete" label on Next Step button for last step', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        vi.advanceTimersByTime(61 * 1000);

        const nextBtn = container.querySelector('.js-next');
        expect(nextBtn?.textContent).toBe('Complete');
    });

    it('shows completion message after completing last step', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        vi.advanceTimersByTime(61 * 1000);
        container.querySelector<HTMLButtonElement>('.js-next')!.click();

        const status = container.querySelector('.puja-perform__status');
        expect(status?.textContent).toContain('Puja complete');
    });

    it('renders Done button after completion', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();
        vi.advanceTimersByTime(61 * 1000);
        container.querySelector<HTMLButtonElement>('.js-next')!.click();

        const doneBtn = container.querySelector('.js-done');
        expect(doneBtn).toBeTruthy();
    });

    it('renders step count when running', () => {
        cleanup = renderPujaPerformView(container, 'sevenfold-puja');
        container.querySelector<HTMLButtonElement>('.js-start')!.click();

        const stepCount = container.querySelector('.puja-perform__step-count');
        expect(stepCount?.textContent).toBe('Step 1 of 2');
    });
});
