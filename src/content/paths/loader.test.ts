import { describe, it, expect, beforeEach } from 'vitest';
import { loadPaths, getPathById, resetPathCache } from './loader.js';
import { PATH_IDS } from './index.js';

describe('loadPaths', () => {
    beforeEach(() => {
        resetPathCache();
    });

    it(`loads all ${PATH_IDS.length} paths`, () => {
        const paths = loadPaths();
        expect(paths).toHaveLength(PATH_IDS.length);
    });

    it('every PATH_ID has a corresponding loaded path', () => {
        const paths = loadPaths();
        const ids = paths.map((p) => p.id);
        for (const id of PATH_IDS) {
            expect(ids).toContain(id);
        }
    });

    it('each path has required fields', () => {
        const paths = loadPaths();
        for (const p of paths) {
            expect(p.id).toBeTruthy();
            expect(p.title).toBeTruthy();
            expect(p.description).toBeTruthy();
            expect(Array.isArray(p.sessions)).toBe(true);
            expect(p.sessions.length).toBeGreaterThan(0);
        }
    });

    it('each session has required fields', () => {
        const paths = loadPaths();
        for (const path of paths) {
            for (const session of path.sessions) {
                expect(session.day).toBeGreaterThan(0);
                expect(session.title).toBeTruthy();
            }
        }
    });

    it('returns cached result on second call', () => {
        const first = loadPaths();
        const second = loadPaths();
        expect(first).toBe(second);
    });

    it('resetPathCache clears the cache', () => {
        const first = loadPaths();
        resetPathCache();
        const second = loadPaths();
        expect(first).not.toBe(second);
    });
});

describe('getPathById', () => {
    beforeEach(() => {
        resetPathCache();
    });

    it('returns path for each known PATH_ID', () => {
        for (const id of PATH_IDS) {
            const path = getPathById(id);
            expect(path, `path '${id}' not found`).toBeDefined();
            expect(path?.id).toBe(id);
        }
    });

    it('returns undefined for unknown id', () => {
        expect(getPathById('not-a-path')).toBeUndefined();
    });
});
