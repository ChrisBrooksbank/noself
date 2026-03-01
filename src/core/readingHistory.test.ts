import { describe, it, expect, beforeEach } from 'vitest';
import {
    markViewed,
    isViewed,
    getViewedIds,
    markContemplated,
    markRevisit,
    getStatus,
} from './readingHistory.js';

beforeEach(() => {
    localStorage.clear();
});

describe('markViewed / isViewed', () => {
    it('returns false before marking', () => {
        expect(isViewed('anatta')).toBe(false);
    });

    it('returns true after marking', () => {
        markViewed('anatta');
        expect(isViewed('anatta')).toBe(true);
    });

    it('does not duplicate entries on repeated marks', () => {
        markViewed('anatta');
        markViewed('anatta');
        expect(getViewedIds().filter((id) => id === 'anatta').length).toBe(1);
    });
});

describe('getViewedIds', () => {
    it('returns empty array when nothing viewed', () => {
        expect(getViewedIds()).toEqual([]);
    });

    it('returns all viewed ids', () => {
        markViewed('anatta');
        markViewed('dukkha');
        expect(getViewedIds()).toContain('anatta');
        expect(getViewedIds()).toContain('dukkha');
    });
});

describe('markContemplated', () => {
    it('sets status to contemplated', () => {
        markContemplated('sati');
        expect(getStatus('sati')).toBe('contemplated');
    });

    it('also adds id to viewed list', () => {
        markContemplated('sati');
        expect(isViewed('sati')).toBe(true);
    });
});

describe('markRevisit', () => {
    it('sets status to revisit', () => {
        markViewed('karma');
        markRevisit('karma');
        expect(getStatus('karma')).toBe('revisit');
    });
});

describe('getStatus', () => {
    it('returns null for unvisited concept', () => {
        expect(getStatus('metta')).toBeNull();
    });

    it('returns viewed for newly marked concept', () => {
        markViewed('metta');
        expect(getStatus('metta')).toBe('viewed');
    });

    it('returns contemplated after markContemplated', () => {
        markViewed('metta');
        markContemplated('metta');
        expect(getStatus('metta')).toBe('contemplated');
    });

    it('does not override existing status on repeated markViewed', () => {
        markContemplated('metta');
        markViewed('metta');
        expect(getStatus('metta')).toBe('contemplated');
    });
});

describe('persistence', () => {
    it('persists data to localStorage', () => {
        markViewed('nirvana');
        const raw = localStorage.getItem('noself:readingHistory');
        expect(raw).not.toBeNull();
        expect(raw).toContain('nirvana');
    });
});
