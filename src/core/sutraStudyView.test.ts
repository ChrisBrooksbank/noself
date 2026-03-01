import { describe, it, expect, beforeEach } from 'vitest';
import { renderSutraStudyView } from './sutraStudyView.js';

describe('renderSutraStudyView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders heart sutra title', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const title = container.querySelector('.sutra-study__title');
        expect(title?.textContent).toBe('Heart Sutra');
    });

    it('renders Sanskrit name', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const sanskrit = container.querySelector('.sutra-study__sanskrit');
        expect(sanskrit?.textContent).toBe('Prajnaparamitahridaya');
    });

    it('renders table of contents', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const toc = container.querySelector('.sutra-toc');
        expect(toc).toBeTruthy();
        const items = toc?.querySelectorAll('li');
        expect(items?.length).toBe(9);
    });

    it('renders all 9 sections', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const sections = container.querySelectorAll('.sutra-section');
        expect(sections.length).toBe(9);
    });

    it('each section has original text', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const originals = container.querySelectorAll('.sutra-section__original');
        expect(originals.length).toBe(9);
    });

    it('each section has translation', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const translations = container.querySelectorAll('.sutra-section__translation');
        expect(translations.length).toBe(9);
    });

    it('each section has expandable commentary', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const details = container.querySelectorAll('.sutra-section__commentary-details');
        expect(details.length).toBe(9);
    });

    it('renders related concept links', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const related = container.querySelectorAll('.sutra-section__related');
        expect(related.length).toBeGreaterThan(0);
    });

    it('renders back link to sutras list', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/sutras');
    });

    it('renders ornamental dividers between sections', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const ornaments = container.querySelectorAll('.ornament');
        expect(ornaments.length).toBe(8);
    });

    it('shows not found for unknown sutra', () => {
        renderSutraStudyView(container, 'nonexistent');
        expect(container.textContent).toContain('Sutra not found');
    });
});
