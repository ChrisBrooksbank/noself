import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderMantraChantView } from './mantraChantView.js';
import type { Mantra } from '../../content/mantras/index.js';

const mockMantra: Mantra = {
    id: 'avalokiteshvara',
    title: 'Avalokiteshvara Mantra',
    sanskrit: 'Om Mani Padme Hum',
    pali: null,
    tradition: 'Mahayana',
    description: 'The mantra of compassion.',
    syllables: [{ text: 'Om', meaning: 'Sacred.' }],
    meaning: 'The jewel in the lotus.',
    usage: 'Chant mindfully.',
    defaultRepetitions: 108,
    relatedConcepts: [],
};

vi.mock('../../content/mantras/index.js', () => ({
    getMantraById: vi.fn((id: string) =>
        id === 'avalokiteshvara' ? mockMantra : undefined,
    ),
}));

vi.mock('./bellSound.js', () => ({
    playBell: vi.fn(),
    resumeAudioContext: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../practiceHistory.js', () => ({
    logMantraSession: vi.fn(),
}));

describe('renderMantraChantView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders not-found message for unknown id', () => {
        renderMantraChantView(container, 'unknown');
        expect(container.textContent).toContain('Mantra not found');
        expect(container.textContent).toContain('unknown');
    });

    it('returns a cleanup function for unknown id', () => {
        const cleanup = renderMantraChantView(container, 'unknown');
        expect(typeof cleanup).toBe('function');
    });

    it('renders the mantra title', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const title = container.querySelector('.mantra-chant__title');
        expect(title?.textContent).toBe('Avalokiteshvara Mantra');
    });

    it('renders the sanskrit text', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const sanskrit = container.querySelector('.mantra-chant__sanskrit');
        expect(sanskrit?.textContent).toBe('Om Mani Padme Hum');
    });

    it('renders back link to mantra detail', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/practice/mantra/avalokiteshvara');
    });

    it('renders counter starting at 0', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const count = container.querySelector('.mantra-chant__count');
        expect(count?.textContent).toBe('0');
    });

    it('renders total repetitions from mantra data', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const total = container.querySelector('.mantra-chant__total');
        expect(total?.textContent).toBe('108');
    });

    it('renders 108 mala beads', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const beads = container.querySelectorAll('.mala__bead');
        expect(beads.length).toBe(108);
    });

    it('renders tap button', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector('.mantra-chant__tap-target');
        expect(tapBtn).not.toBeNull();
    });

    it('renders reset button', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const resetBtn = container.querySelector('.js-reset');
        expect(resetBtn).not.toBeNull();
    });

    it('increments counter on tap', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        tapBtn.click();
        const count = container.querySelector('.mantra-chant__count');
        expect(count?.textContent).toBe('1');
    });

    it('marks beads as done when tapped', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        tapBtn.click();
        tapBtn.click();
        tapBtn.click();
        const doneBead = container.querySelector('.mala__bead--done');
        expect(doneBead).not.toBeNull();
        const doneBeads = container.querySelectorAll('.mala__bead--done');
        expect(doneBeads.length).toBe(3);
    });

    it('plays bell on quarter mala (every 27 beads)', async () => {
        const { playBell } = await import('./bellSound.js');
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        for (let i = 0; i < 27; i++) {
            tapBtn.click();
        }
        expect(playBell).toHaveBeenCalled();
    });

    it('shows quarter mala status message at 27', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        for (let i = 0; i < 27; i++) {
            tapBtn.click();
        }
        const status = container.querySelector('.mantra-chant__status');
        expect(status?.textContent).toContain('27');
    });

    it('shows completion message at 108', async () => {
        const { logMantraSession } = await import('../practiceHistory.js');
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        for (let i = 0; i < 108; i++) {
            tapBtn.click();
        }
        const status = container.querySelector('.mantra-chant__status');
        expect(status?.textContent).toContain('Mala complete');
        expect(logMantraSession).toHaveBeenCalledWith('avalokiteshvara', 108);
    });

    it('disables tap button after completion', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        for (let i = 0; i < 108; i++) {
            tapBtn.click();
        }
        expect(tapBtn.disabled).toBe(true);
    });

    it('does not increment past total on further taps', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        for (let i = 0; i < 110; i++) {
            tapBtn.click();
        }
        const count = container.querySelector('.mantra-chant__count');
        expect(count?.textContent).toBe('108');
    });

    it('resets counter on reset button click', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        const resetBtn = container.querySelector<HTMLButtonElement>('.js-reset')!;
        tapBtn.click();
        tapBtn.click();
        tapBtn.click();
        resetBtn.click();
        const count = container.querySelector('.mantra-chant__count');
        expect(count?.textContent).toBe('0');
    });

    it('re-enables tap button after reset', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        const resetBtn = container.querySelector<HTMLButtonElement>('.js-reset')!;
        for (let i = 0; i < 108; i++) {
            tapBtn.click();
        }
        resetBtn.click();
        expect(tapBtn.disabled).toBe(false);
    });

    it('clears done beads on reset', () => {
        renderMantraChantView(container, 'avalokiteshvara');
        const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
        const resetBtn = container.querySelector<HTMLButtonElement>('.js-reset')!;
        tapBtn.click();
        tapBtn.click();
        resetBtn.click();
        const doneBeads = container.querySelectorAll('.mala__bead--done');
        expect(doneBeads.length).toBe(0);
    });

    it('returns a cleanup function', () => {
        const cleanup = renderMantraChantView(container, 'avalokiteshvara');
        expect(typeof cleanup).toBe('function');
        expect(() => cleanup()).not.toThrow();
    });
});
