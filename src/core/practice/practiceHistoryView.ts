import {
    getMeditationSessions,
    getPromptSessions,
    getPathSessions,
    getPujaSessions,
    getMantraSessions,
} from '../practiceHistory.js';
import { getMeditationById } from '../../content/meditations/loader.js';
import { getPromptById } from '../../content/prompts/loader.js';
import { getPathById } from '../../content/paths/loader.js';
import { getPujaById } from '../../content/pujas/loader.js';
import { getMantraById } from '../../content/mantras/loader.js';

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

interface HistoryEntry {
    timestamp: string;
    label: string;
    detail: string;
    type: 'meditation' | 'prompt' | 'path' | 'puja' | 'mantra';
}

function buildEntries(): HistoryEntry[] {
    const entries: HistoryEntry[] = [];

    for (const s of getMeditationSessions()) {
        entries.push({
            timestamp: s.completedAt,
            label: getMeditationById(s.meditationId)?.title ?? s.meditationId,
            detail: `${s.durationMinutes} min meditation`,
            type: 'meditation',
        });
    }

    for (const p of getPromptSessions()) {
        entries.push({
            timestamp: p.satWith,
            label: getPromptById(p.promptId)?.question ?? p.promptId,
            detail: 'Sat with prompt',
            type: 'prompt',
        });
    }

    for (const ps of getPathSessions()) {
        entries.push({
            timestamp: ps.completedAt,
            label: `${getPathById(ps.pathId)?.title ?? ps.pathId} — Session ${ps.sessionIndex + 1}`,
            detail: 'Path session',
            type: 'path',
        });
    }

    for (const pj of getPujaSessions()) {
        entries.push({
            timestamp: pj.completedAt,
            label: getPujaById(pj.pujaId)?.title ?? pj.pujaId,
            detail: 'Puja performed',
            type: 'puja',
        });
    }

    for (const m of getMantraSessions()) {
        entries.push({
            timestamp: m.completedAt,
            label: getMantraById(m.mantraId)?.title ?? m.mantraId,
            detail: `${m.repetitions} repetitions`,
            type: 'mantra',
        });
    }

    entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return entries;
}

function renderEntry(entry: HistoryEntry): string {
    return `
        <li class="history-entry history-entry--${entry.type}">
            <span class="history-entry__label">${entry.label}</span>
            <span class="history-entry__detail">${entry.detail}</span>
            <span class="history-entry__date">${formatDate(entry.timestamp)} ${formatTime(entry.timestamp)}</span>
        </li>`;
}

export function renderPracticeHistoryView(container: HTMLElement): void {
    const entries = buildEntries();

    const listHtml =
        entries.length === 0
            ? `<p class="practice-history__empty">No practice sessions recorded yet.</p>`
            : `<ul class="practice-history__list stack-sm" aria-label="Practice history">
            ${entries.map(renderEntry).join('')}
        </ul>`;

    container.innerHTML = `
        <div class="practice-history-view page stack-lg" role="main">
            <a href="#/practice" class="back-link">&larr; Practice</a>
            <h1 class="practice-history__heading">Practice History</h1>
            ${listHtml}
        </div>`;
}
