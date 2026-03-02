import { describe, it, expect, beforeEach } from 'vitest';
import { renderSutrasListView } from './sutrasListView.js';

describe('renderSutrasListView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the Sutras heading', () => {
        renderSutrasListView(container);
        const heading = container.querySelector('h1');
        expect(heading?.textContent).toBe('Sutras');
    });

    it('renders at least one sutra card', () => {
        renderSutrasListView(container);
        const items = container.querySelectorAll('.sutra-item');
        expect(items.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Heart Sutra with link', () => {
        renderSutrasListView(container);
        const link = container.querySelector('a[href="#/sutra/heart-sutra"]');
        expect(link).toBeTruthy();
        expect(link?.textContent).toBe('Heart Sutra');
    });

    it('shows tradition badge', () => {
        renderSutrasListView(container);
        const badges = container.querySelectorAll('.badge');
        const texts = Array.from(badges).map((b) => b.textContent);
        expect(texts).toContain('Mahayana');
    });

    it('shows section count', () => {
        renderSutrasListView(container);
        const meta = container.querySelector('.sutra-item__meta');
        expect(meta?.textContent).toContain('sections');
    });
});
