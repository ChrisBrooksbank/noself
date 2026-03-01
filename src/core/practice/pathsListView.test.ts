import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPathsListView } from './pathsListView.js';
import type { PracticePath } from '../../content/paths/index.js';

const mockPaths: PracticePath[] = [
    {
        id: 'seven-day-metta',
        title: '7-Day Metta',
        description: 'A week of loving-kindness practice.',
        sessions: [
            { day: 1, title: 'Introduction to Metta', conceptId: 'metta' },
            { day: 2, title: 'Metta for Self', meditationId: 'metta' },
            { day: 3, title: 'Expanding Metta', promptId: 'metta-1' },
        ],
    },
    {
        id: 'exploring-non-self',
        title: 'Exploring Non-Self',
        description: 'A path through the teaching of anatta.',
        sessions: [
            { day: 1, title: 'What is the self?', conceptId: 'anatta' },
            { day: 2, title: 'The observer observed', promptId: 'anatta-1' },
        ],
    },
];

vi.mock('../../content/paths/loader.js', () => ({
    loadPaths: vi.fn(() => mockPaths),
    getPathById: vi.fn((id: string) => mockPaths.find((p) => p.id === id)),
}));

vi.mock('../practiceHistory.js', () => ({
    getPathSessions: vi.fn(() => []),
}));

import * as practiceHistory from '../practiceHistory.js';

describe('renderPathsListView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        vi.mocked(practiceHistory.getPathSessions).mockReturnValue([]);
    });

    it('renders the heading', () => {
        renderPathsListView(container);
        const heading = container.querySelector('.paths-list__heading');
        expect(heading?.textContent).toBe('Practice Paths');
    });

    it('renders a back link to practice hub', () => {
        renderPathsListView(container);
        const link = container.querySelector('.back-link');
        expect(link?.getAttribute('href')).toBe('#/practice');
    });

    it('renders an intro description', () => {
        renderPathsListView(container);
        const intro = container.querySelector('.paths-list__intro');
        expect(intro?.textContent).toBeTruthy();
    });

    it('renders a list item for each path', () => {
        renderPathsListView(container);
        const items = container.querySelectorAll('.path-item');
        expect(items.length).toBe(2);
    });

    it('renders each path title', () => {
        renderPathsListView(container);
        const titles = Array.from(container.querySelectorAll('.path-item__title')).map(
            (el) => el.textContent?.trim(),
        );
        expect(titles).toContain('7-Day Metta');
        expect(titles).toContain('Exploring Non-Self');
    });

    it('renders each path description', () => {
        renderPathsListView(container);
        const descs = Array.from(container.querySelectorAll('.path-item__desc')).map(
            (el) => el.textContent,
        );
        expect(descs).toContain('A week of loving-kindness practice.');
        expect(descs).toContain('A path through the teaching of anatta.');
    });

    it('renders path links with correct hrefs', () => {
        renderPathsListView(container);
        const links = Array.from(container.querySelectorAll('.path-item__link'));
        const hrefs = links.map((l) => l.getAttribute('href'));
        expect(hrefs).toContain('#/practice/paths/seven-day-metta');
        expect(hrefs).toContain('#/practice/paths/exploring-non-self');
    });

    it('renders session count for each path', () => {
        renderPathsListView(container);
        const counts = Array.from(
            container.querySelectorAll('.path-item__session-count'),
        ).map((el) => el.textContent);
        expect(counts).toContain('3 sessions');
        expect(counts).toContain('2 sessions');
    });

    it('renders progress indicators', () => {
        renderPathsListView(container);
        const progress = container.querySelectorAll('.path-item__progress');
        expect(progress.length).toBe(2);
    });

    it('shows "Not started" label when no sessions completed', () => {
        renderPathsListView(container);
        const labels = Array.from(
            container.querySelectorAll('.path-item__progress-label'),
        ).map((el) => el.textContent);
        expect(labels.every((l) => l === 'Not started')).toBe(true);
    });

    it('shows progress label when some sessions completed', () => {
        vi.mocked(practiceHistory.getPathSessions).mockReturnValue([
            {
                pathId: 'seven-day-metta',
                sessionIndex: 0,
                completedAt: '2026-03-01T00:00:00Z',
            },
        ]);
        renderPathsListView(container);
        const labels = Array.from(
            container.querySelectorAll('.path-item__progress-label'),
        ).map((el) => el.textContent);
        expect(labels).toContain('1 of 3 sessions');
    });

    it('shows "Complete" label when all sessions completed', () => {
        vi.mocked(practiceHistory.getPathSessions).mockReturnValue([
            {
                pathId: 'exploring-non-self',
                sessionIndex: 0,
                completedAt: '2026-03-01T00:00:00Z',
            },
            {
                pathId: 'exploring-non-self',
                sessionIndex: 1,
                completedAt: '2026-03-01T01:00:00Z',
            },
        ]);
        renderPathsListView(container);
        const labels = Array.from(
            container.querySelectorAll('.path-item__progress-label'),
        ).map((el) => el.textContent);
        expect(labels).toContain('Complete');
    });
});
