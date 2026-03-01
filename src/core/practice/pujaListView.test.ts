import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPujaListView } from './pujaListView.js';
import type { Puja } from '../../content/pujas/index.js';

const mockPujas: Puja[] = [
    {
        id: 'sevenfold-puja',
        title: 'The Sevenfold Puja',
        tradition: 'Triratna',
        description: 'A devotional liturgy in seven movements.',
        sections: [],
        ritualSteps: [],
    },
    {
        id: 'another-puja',
        title: 'Another Puja',
        tradition: 'Theravada',
        description: 'A second puja for testing.',
        sections: [],
        ritualSteps: [],
    },
];

vi.mock('../../content/pujas/index.js', () => ({
    loadPujas: vi.fn(() => mockPujas),
}));

describe('renderPujaListView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the heading', () => {
        renderPujaListView(container);
        const heading = container.querySelector('.puja-list__heading');
        expect(heading?.textContent).toBe('Pujas');
    });

    it('renders a list item for each puja', () => {
        renderPujaListView(container);
        const items = container.querySelectorAll('.puja-item');
        expect(items.length).toBe(2);
    });

    it('renders each puja title', () => {
        renderPujaListView(container);
        const titles = Array.from(container.querySelectorAll('.puja-item__title')).map(
            (el) => el.textContent,
        );
        expect(titles).toContain('The Sevenfold Puja');
        expect(titles).toContain('Another Puja');
    });

    it('renders each puja tradition', () => {
        renderPujaListView(container);
        const traditions = Array.from(
            container.querySelectorAll('.puja-item__tradition'),
        ).map((el) => el.textContent);
        expect(traditions).toContain('Triratna');
        expect(traditions).toContain('Theravada');
    });

    it('renders each puja description', () => {
        renderPujaListView(container);
        const descs = Array.from(container.querySelectorAll('.puja-item__desc')).map(
            (el) => el.textContent,
        );
        expect(descs).toContain('A devotional liturgy in seven movements.');
        expect(descs).toContain('A second puja for testing.');
    });

    it('renders study links for each puja', () => {
        renderPujaListView(container);
        const studyLinks = container.querySelectorAll('.puja-item__study-link');
        expect(studyLinks.length).toBe(2);
    });

    it('renders study links with correct hrefs', () => {
        renderPujaListView(container);
        const hrefs = Array.from(
            container.querySelectorAll('.puja-item__study-link'),
        ).map((el) => el.getAttribute('href'));
        expect(hrefs).toContain('#/practice/puja/sevenfold-puja');
        expect(hrefs).toContain('#/practice/puja/another-puja');
    });

    it('renders perform links for each puja', () => {
        renderPujaListView(container);
        const performLinks = container.querySelectorAll('.puja-item__perform-link');
        expect(performLinks.length).toBe(2);
    });

    it('renders perform links with correct hrefs', () => {
        renderPujaListView(container);
        const hrefs = Array.from(
            container.querySelectorAll('.puja-item__perform-link'),
        ).map((el) => el.getAttribute('href'));
        expect(hrefs).toContain('#/practice/puja/sevenfold-puja/perform');
        expect(hrefs).toContain('#/practice/puja/another-puja/perform');
    });

    it('renders a back link to practice hub', () => {
        renderPujaListView(container);
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/practice');
    });

    it('renders pujas sorted alphabetically', () => {
        renderPujaListView(container);
        const titles = Array.from(container.querySelectorAll('.puja-item__title')).map(
            (el) => el.textContent,
        );
        expect(titles[0]).toBe('Another Puja');
        expect(titles[1]).toBe('The Sevenfold Puja');
    });
});
