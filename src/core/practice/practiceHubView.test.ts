import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPracticeHubView } from './practiceHubView.js';

vi.mock('../preferences.js', () => ({
    getExpertiseLevel: vi.fn(() => 3),
}));

vi.mock('../practiceHistory.js', () => ({
    getTotalSessionCount: vi.fn(() => 0),
    getMeditationSessions: vi.fn(() => []),
    getPromptSessions: vi.fn(() => []),
    getPujaSessions: vi.fn(() => []),
    getMantraSessions: vi.fn(() => []),
}));

import * as practiceHistory from '../practiceHistory.js';

describe('renderPracticeHubView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        vi.mocked(practiceHistory.getTotalSessionCount).mockReturnValue(0);
        vi.mocked(practiceHistory.getMeditationSessions).mockReturnValue([]);
        vi.mocked(practiceHistory.getPromptSessions).mockReturnValue([]);
        vi.mocked(practiceHistory.getPujaSessions).mockReturnValue([]);
        vi.mocked(practiceHistory.getMantraSessions).mockReturnValue([]);
    });

    it('renders the Practice heading', () => {
        renderPracticeHubView(container);
        const heading = container.querySelector('.practice-hub__heading');
        expect(heading?.textContent).toBe('Practice');
    });

    it('renders five section cards', () => {
        renderPracticeHubView(container);
        const cards = container.querySelectorAll('.practice-hub__card');
        expect(cards.length).toBe(5);
    });

    it('renders Meditate card with link to /practice/meditate', () => {
        renderPracticeHubView(container);
        const links = Array.from(container.querySelectorAll('.practice-hub__card-link'));
        const meditateLink = links.find(
            (l) => l.getAttribute('href') === '#/practice/meditate',
        );
        expect(meditateLink).toBeTruthy();
    });

    it('renders Contemplate card with link to /practice/prompts', () => {
        renderPracticeHubView(container);
        const links = Array.from(container.querySelectorAll('.practice-hub__card-link'));
        const promptsLink = links.find(
            (l) => l.getAttribute('href') === '#/practice/prompts',
        );
        expect(promptsLink).toBeTruthy();
    });

    it('renders Paths card with link to /practice/paths', () => {
        renderPracticeHubView(container);
        const links = Array.from(container.querySelectorAll('.practice-hub__card-link'));
        const pathsLink = links.find(
            (l) => l.getAttribute('href') === '#/practice/paths',
        );
        expect(pathsLink).toBeTruthy();
    });

    it('renders Puja card with link to /practice/pujas', () => {
        renderPracticeHubView(container);
        const links = Array.from(container.querySelectorAll('.practice-hub__card-link'));
        const pujaLink = links.find((l) => l.getAttribute('href') === '#/practice/pujas');
        expect(pujaLink).toBeTruthy();
    });

    it('renders Mantras card with link to /practice/mantras', () => {
        renderPracticeHubView(container);
        const links = Array.from(container.querySelectorAll('.practice-hub__card-link'));
        const mantraLink = links.find(
            (l) => l.getAttribute('href') === '#/practice/mantras',
        );
        expect(mantraLink).toBeTruthy();
    });

    it('renders history link', () => {
        renderPracticeHubView(container);
        const historyLink = container.querySelector('.practice-hub__history-link');
        expect(historyLink?.getAttribute('href')).toBe('#/practice/history');
    });

    it('shows empty message when no sessions', () => {
        renderPracticeHubView(container);
        const empty = container.querySelector('.practice-hub__empty');
        expect(empty).toBeTruthy();
    });

    it('shows stats when sessions exist', () => {
        vi.mocked(practiceHistory.getTotalSessionCount).mockReturnValue(7);
        vi.mocked(practiceHistory.getMeditationSessions).mockReturnValue([
            {
                meditationId: 'breath-awareness',
                durationMinutes: 10,
                completedAt: '2026-03-01T00:00:00Z',
            },
            {
                meditationId: 'metta',
                durationMinutes: 15,
                completedAt: '2026-03-01T01:00:00Z',
            },
            {
                meditationId: 'body-scan',
                durationMinutes: 20,
                completedAt: '2026-03-01T02:00:00Z',
            },
        ]);
        vi.mocked(practiceHistory.getPromptSessions).mockReturnValue([
            { promptId: 'anatta-beginner', satWith: '2026-03-01T03:00:00Z' },
            { promptId: 'anicca-beginner', satWith: '2026-03-01T04:00:00Z' },
        ]);
        vi.mocked(practiceHistory.getPujaSessions).mockReturnValue([
            { pujaId: 'sevenfold-puja', completedAt: '2026-03-01T05:00:00Z' },
        ]);
        vi.mocked(practiceHistory.getMantraSessions).mockReturnValue([
            {
                mantraId: 'avalokiteshvara',
                repetitions: 108,
                completedAt: '2026-03-01T06:00:00Z',
            },
        ]);

        renderPracticeHubView(container);
        const stats = container.querySelector('.practice-hub__stats');
        expect(stats).toBeTruthy();
        expect(stats?.textContent).toContain('7 sessions total');
        expect(stats?.textContent).toContain('3 meditations');
        expect(stats?.textContent).toContain('2 prompts');
        expect(stats?.textContent).toContain('1 puja');
        expect(stats?.textContent).toContain('1 mantra');
    });

    it('uses singular form for single session', () => {
        vi.mocked(practiceHistory.getTotalSessionCount).mockReturnValue(1);
        vi.mocked(practiceHistory.getMeditationSessions).mockReturnValue([
            {
                meditationId: 'breath-awareness',
                durationMinutes: 10,
                completedAt: '2026-03-01T00:00:00Z',
            },
        ]);
        vi.mocked(practiceHistory.getPromptSessions).mockReturnValue([]);

        renderPracticeHubView(container);
        const stats = container.querySelector('.practice-hub__stats');
        expect(stats?.textContent).toContain('1 session total');
        expect(stats?.textContent).toContain('1 meditation,');
    });
});
