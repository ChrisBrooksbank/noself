import { CONCEPT_IDS, getConceptById } from '../content/concepts/index.js';
import type { Concept } from '../content/concepts/index.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Returns the number of days since the Unix epoch for the given UTC date.
 * Stable for all instants within the same calendar day (UTC).
 */
export function daysSinceEpoch(date: Date = new Date()): number {
    return Math.floor(date.getTime() / MS_PER_DAY);
}

/**
 * Returns the concept ID assigned to the given date.
 * Uses a deterministic rotation: daysSinceEpoch % 30.
 */
export function getDailyConceptId(date: Date = new Date()): string {
    const index = daysSinceEpoch(date) % CONCEPT_IDS.length;
    return CONCEPT_IDS[index] as string;
}

/**
 * Returns the concept for today (or the given date).
 * The result is stable for the same calendar day (UTC).
 */
export function getDailyConcept(date: Date = new Date()): Concept {
    const id = getDailyConceptId(date);
    const concept = getConceptById(id);
    if (!concept) {
        throw new Error(`Daily concept not found: ${id}`);
    }
    return concept;
}
