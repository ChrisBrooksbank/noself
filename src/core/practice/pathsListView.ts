import { loadPaths } from '../../content/paths/loader.js';
import type { PracticePath } from '../../content/paths/index.js';
import { getPathSessions } from '../practiceHistory.js';

function getPathProgress(path: PracticePath): { completed: number; total: number } {
    const sessions = getPathSessions();
    const total = path.sessions.length;
    const completed = new Set(
        sessions.filter((s) => s.pathId === path.id).map((s) => s.sessionIndex),
    ).size;
    return { completed, total };
}

function renderProgressIndicator(completed: number, total: number): string {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const label =
        completed === 0
            ? 'Not started'
            : completed === total
              ? 'Complete'
              : `${completed} of ${total} sessions`;
    return `
        <div class="path-item__progress" aria-label="Progress: ${label}">
            <div class="path-item__progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
                <div class="path-item__progress-fill" style="width:${pct}%"></div>
            </div>
            <span class="path-item__progress-label">${label}</span>
        </div>`;
}

function renderPathItem(path: PracticePath): string {
    const { completed, total } = getPathProgress(path);
    return `
        <li class="path-item card stack-sm">
            <h2 class="path-item__title">
                <a href="#/practice/paths/${path.id}" class="path-item__link">${path.title}</a>
            </h2>
            <p class="path-item__desc">${path.description}</p>
            <p class="path-item__session-count">${total} session${total !== 1 ? 's' : ''}</p>
            ${renderProgressIndicator(completed, total)}
        </li>`;
}

export function renderPathsListView(container: HTMLElement): void {
    const paths = loadPaths();

    container.innerHTML = `
        <div class="paths-list-view page stack-lg" role="main">
            <a href="#/practice" class="back-link">&larr; Practice</a>
            <h1 class="paths-list__heading">Practice Paths</h1>
            <p class="paths-list__intro">Structured multi-session curricula combining concept study, prompts, and meditations.</p>
            <ul class="paths-list stack-md" aria-label="Practice paths">
                ${paths.map(renderPathItem).join('')}
            </ul>
        </div>`;
}
