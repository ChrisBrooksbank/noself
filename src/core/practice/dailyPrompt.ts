import { getAllPrompts } from '../../content/prompts/loader.js';
import type { Prompt } from '../../content/prompts/index.js';
import { daysSinceEpoch } from '../dailyConcept.js';

/**
 * Returns the prompt ID assigned to the given date.
 * Uses a deterministic rotation: daysSinceEpoch % totalPrompts.
 */
export function getDailyPromptId(date: Date = new Date()): string {
    const prompts = getAllPrompts();
    const index = daysSinceEpoch(date) % prompts.length;
    const prompt = prompts[index];
    if (!prompt) {
        throw new Error(`No prompt found at index ${index}`);
    }
    return prompt.id;
}

/**
 * Returns the prompt for today (or the given date).
 * The result is stable for the same calendar day (UTC).
 */
export function getDailyPrompt(date: Date = new Date()): Prompt {
    const id = getDailyPromptId(date);
    const prompt = getAllPrompts().find((p) => p.id === id);
    if (!prompt) {
        throw new Error(`Daily prompt not found: ${id}`);
    }
    return prompt;
}
