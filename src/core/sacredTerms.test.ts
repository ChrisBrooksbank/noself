import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderSacredTermSpan, initSacredTermTooltips } from './sacredTerms.js';
import type { SacredTerm } from '../types/sacred-terms.js';

const paliTerm: SacredTerm = {
    text: 'Anattā',
    language: 'pali',
    phonetic: 'ah-NAHT-tah',
    literal: 'not-self',
    etymology: 'an (not) + attā (self)',
};

const sanskritTerm: SacredTerm = {
    text: 'Anātman',
    language: 'sanskrit',
    phonetic: 'ah-NAHT-mahn',
    literal: 'not-self',
};

describe('renderSacredTermSpan', () => {
    it('returns a span with the term text', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).toContain('<span');
        expect(html).toContain('Anattā');
    });

    it('includes sacred-term class', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).toContain('class="sacred-term"');
    });

    it('sets tabindex and role for keyboard access', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).toContain('tabindex="0"');
        expect(html).toContain('role="button"');
    });

    it('includes phonetic data attribute', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).toContain('data-phonetic="ah-NAHT-tah"');
    });

    it('includes literal data attribute', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).toContain('data-literal="not-self"');
    });

    it('includes language data attribute', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).toContain('data-language="pali"');
    });

    it('includes etymology data attribute when present', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).toContain('data-etymology="an (not) + attā (self)"');
    });

    it('omits etymology attribute when absent', () => {
        const html = renderSacredTermSpan(sanskritTerm);
        expect(html).not.toContain('data-etymology');
    });

    it('includes counterpart data attributes when provided', () => {
        const html = renderSacredTermSpan(paliTerm, { counterpart: sanskritTerm });
        expect(html).toContain('data-counterpart-text="Anātman"');
        expect(html).toContain('data-counterpart-language="sanskrit"');
        expect(html).toContain('data-counterpart-phonetic="ah-NAHT-mahn"');
        expect(html).toContain('data-counterpart-literal="not-self"');
    });

    it('omits counterpart attributes when not provided', () => {
        const html = renderSacredTermSpan(paliTerm);
        expect(html).not.toContain('data-counterpart');
    });

    it('escapes HTML in term text', () => {
        const term: SacredTerm = { ...paliTerm, text: '<b>test</b>' };
        const html = renderSacredTermSpan(term);
        expect(html).toContain('&lt;b&gt;test&lt;/b&gt;');
    });

    it('escapes quotes in data attributes', () => {
        const term: SacredTerm = { ...paliTerm, phonetic: 'say "ah"' };
        const html = renderSacredTermSpan(term);
        expect(html).toContain('data-phonetic="say &quot;ah&quot;"');
    });
});

describe('initSacredTermTooltips', () => {
    let root: HTMLElement;
    let cleanup: () => void;

    beforeEach(() => {
        root = document.createElement('div');
        document.body.appendChild(root);
    });

    afterEach(() => {
        cleanup?.();
        root.remove();
        // Remove any stray popovers
        document.querySelectorAll('.sacred-term-popover').forEach((el) => el.remove());
    });

    function makeSpan(term: SacredTerm = paliTerm): HTMLElement {
        root.innerHTML = renderSacredTermSpan(term);
        return root.querySelector('.sacred-term') as HTMLElement;
    }

    it('returns a cleanup function', () => {
        cleanup = initSacredTermTooltips(root);
        expect(typeof cleanup).toBe('function');
    });

    it('appends a hidden popover to document.body', () => {
        cleanup = initSacredTermTooltips(root);
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover).toBeTruthy();
        expect(popover.hidden).toBe(true);
    });

    it('shows popover when a sacred-term is clicked', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.hidden).toBe(false);
    });

    it('popover contains phonetic pronunciation', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.textContent).toContain('ah-NAHT-tah');
    });

    it('popover contains literal meaning', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.textContent).toContain('not-self');
    });

    it('popover contains etymology', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.textContent).toContain('an (not) + attā (self)');
    });

    it('sets aria-expanded on active span', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        expect(span.getAttribute('aria-expanded')).toBe('true');
    });

    it('hides popover on second click of same term', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        span.click();
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.hidden).toBe(true);
    });

    it('hides popover on Escape key', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.hidden).toBe(true);
    });

    it('hides popover on outside click', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        span.click();
        document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.hidden).toBe(true);
    });

    it('opens popover with Enter key on focused term', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan();
        // Dispatch keydown from the span element so it bubbles up through root
        span.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.hidden).toBe(false);
    });

    it('removes popover on cleanup', () => {
        cleanup = initSacredTermTooltips(root);
        cleanup();
        const popover = document.querySelector('.sacred-term-popover');
        expect(popover).toBeNull();
    });

    it('shows counterpart language in popover when data present', () => {
        cleanup = initSacredTermTooltips(root);
        root.innerHTML = renderSacredTermSpan(paliTerm, { counterpart: sanskritTerm });
        const span = root.querySelector('.sacred-term') as HTMLElement;
        span.click();
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        expect(popover.textContent).toContain('Anātman');
        expect(popover.textContent).toContain('Sanskrit');
    });

    it('does not show counterpart section when no counterpart data', () => {
        cleanup = initSacredTermTooltips(root);
        const span = makeSpan(sanskritTerm);
        span.click();
        const popover = document.querySelector('.sacred-term-popover') as HTMLElement;
        // No counterpart rows for pure term without counterpart
        const counterpartRow = popover.querySelector('.sacred-term-popover__counterpart');
        expect(counterpartRow).toBeNull();
    });
});
