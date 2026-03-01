import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseHash, navigate, start } from './router.js';

describe('parseHash', () => {
    it('returns home for #/', () => {
        expect(parseHash('#/')).toEqual({ type: 'home' });
    });

    it('returns home for empty hash', () => {
        expect(parseHash('')).toEqual({ type: 'home' });
    });

    it('returns catalog for #/catalog', () => {
        expect(parseHash('#/catalog')).toEqual({ type: 'catalog' });
    });

    it('returns concept with id for #/concept/:id', () => {
        expect(parseHash('#/concept/anatta')).toEqual({ type: 'concept', id: 'anatta' });
    });

    it('returns concept with hyphenated id', () => {
        expect(parseHash('#/concept/four-noble-truths')).toEqual({
            type: 'concept',
            id: 'four-noble-truths',
        });
    });

    it('returns notFound for unknown paths', () => {
        expect(parseHash('#/unknown')).toEqual({ type: 'notFound' });
    });
});

describe('navigate', () => {
    it('sets window.location.hash', () => {
        navigate('/catalog');
        expect(window.location.hash).toBe('#/catalog');
    });
});

describe('start', () => {
    beforeEach(() => {
        window.location.hash = '';
    });

    it('dispatches current route immediately on start', () => {
        window.location.hash = '#/catalog';
        const handler = vi.fn();
        start(handler);
        expect(handler).toHaveBeenCalledWith({ type: 'catalog' });
    });

    it('dispatches home when hash is empty', () => {
        const handler = vi.fn();
        start(handler);
        expect(handler).toHaveBeenCalledWith({ type: 'home' });
    });

    it('dispatches on hashchange event', () => {
        const handler = vi.fn();
        start(handler);
        handler.mockClear();

        window.location.hash = '#/concept/dukkha';
        window.dispatchEvent(new Event('hashchange'));

        expect(handler).toHaveBeenCalledWith({ type: 'concept', id: 'dukkha' });
    });

    it('replaces previous listener when called again', () => {
        const handler1 = vi.fn();
        const handler2 = vi.fn();

        start(handler1);
        start(handler2);

        handler1.mockClear();
        handler2.mockClear();

        window.location.hash = '#/catalog';
        window.dispatchEvent(new Event('hashchange'));

        expect(handler1).not.toHaveBeenCalled();
        expect(handler2).toHaveBeenCalledWith({ type: 'catalog' });
    });
});
