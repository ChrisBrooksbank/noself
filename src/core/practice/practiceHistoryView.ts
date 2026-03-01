import {
    getMeditationSessions,
    getPromptSessions,
    getPathSessions,
} from '../practiceHistory.js';

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
    type: 'meditation' | 'prompt' | 'path';
}

function buildEntries(): HistoryEntry[] {
    const entries: HistoryEntry[] = [];

    for (const s of getMeditationSessions()) {
        entries.push({
            timestamp: s.completedAt,
            label: s.meditationId,
            detail: `${s.durationMinutes} min meditation`,
            type: 'meditation',
        });
    }

    for (const p of getPromptSessions()) {
        entries.push({
            timestamp: p.satWith,
            label: p.promptId,
            detail: 'Sat with prompt',
            type: 'prompt',
        });
    }

    for (const ps of getPathSessions()) {
        entries.push({
            timestamp: ps.completedAt,
            label: `${ps.pathId} — Session ${ps.sessionIndex + 1}`,
            detail: 'Path session',
            type: 'path',
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
