import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderMeditationListView } from './meditationListView.js';
import type { Meditation } from '../../content/meditations/index.js';

vi.mock('../preferences.js', () => ({
    getExpertiseLevel: vi.fn(() => 3),
    getShowVideoLinks: vi.fn(() => true),
}));

const mockMeditations: Meditation[] = [
    {
        id: 'breath-awareness',
        title: 'Breath Awareness',
        description: 'A foundational meditation on the breath.',
        durations: [5, 10, 20],
        steps: {
            5: [{ instruction: 'Settle in.', durationSeconds: 300 }],
            10: [{ instruction: 'Settle in.', durationSeconds: 600 }],
            20: [{ instruction: 'Settle in.', durationSeconds: 1200 }],
        },
    },
    {
        id: 'metta',
        title: 'Metta',
        description: 'Loving-kindness meditation.',
        durations: [10, 15, 20],
        steps: {
            10: [{ instruction: 'Begin with yourself.', durationSeconds: 600 }],
            15: [{ instruction: 'Begin with yourself.', durationSeconds: 900 }],
            20: [{ instruction: 'Begin with yourself.', durationSeconds: 1200 }],
        },
    },
];

vi.mock('../../content/meditations/loader.js', () => ({
    loadMeditations: vi.fn(() => mockMeditations),
}));

describe('renderMeditationListView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the heading', () => {
        renderMeditationListView(container);
        const heading = container.querySelector('.meditation-list__heading');
        expect(heading?.textContent).toBe('Guided Meditations');
    });

    it('renders a list item for each meditation', () => {
        renderMeditationListView(container);
        const items = container.querySelectorAll('.meditation-item');
        expect(items.length).toBe(2);
    });

    it('renders each meditation title', () => {
        renderMeditationListView(container);
        const titles = Array.from(
            container.querySelectorAll('.meditation-item__title'),
        ).map((el) => el.textContent);
        expect(titles).toContain('Breath Awareness');
        expect(titles).toContain('Metta');
    });

    it('renders each meditation description', () => {
        renderMeditationListView(container);
        const descs = Array.from(
            container.querySelectorAll('.meditation-item__desc'),
        ).map((el) => el.textContent);
        expect(descs).toContain('A foundational meditation on the breath.');
        expect(descs).toContain('Loving-kindness meditation.');
    });

    it('renders duration links for each meditation', () => {
        renderMeditationListView(container);
        const durationLinks = container.querySelectorAll(
            '.meditation-item__duration-link',
        );
        // 3 durations for breath-awareness + 3 for metta = 6
        expect(durationLinks.length).toBe(6);
    });

    it('renders duration links with correct hrefs', () => {
        renderMeditationListView(container);
        const hrefs = Array.from(
            container.querySelectorAll('.meditation-item__duration-link'),
        ).map((el) => el.getAttribute('href'));
        expect(hrefs).toContain('#/practice/meditate/breath-awareness?duration=5');
        expect(hrefs).toContain('#/practice/meditate/breath-awareness?duration=10');
        expect(hrefs).toContain('#/practice/meditate/metta?duration=20');
    });

    it('renders duration link labels as "X min"', () => {
        renderMeditationListView(container);
        const labels = Array.from(
            container.querySelectorAll('.meditation-item__duration-link'),
        ).map((el) => el.textContent?.trim());
        expect(labels).toContain('5 min');
        expect(labels).toContain('10 min');
        expect(labels).toContain('15 min');
        expect(labels).toContain('20 min');
    });

    it('renders a back link to practice hub', () => {
        renderMeditationListView(container);
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/practice');
    });

    it('renders meditations sorted alphabetically', () => {
        renderMeditationListView(container);
        const titles = Array.from(
            container.querySelectorAll('.meditation-item__title'),
        ).map((el) => el.textContent);
        expect(titles[0]).toBe('Breath Awareness');
        expect(titles[1]).toBe('Metta');
    });
});
