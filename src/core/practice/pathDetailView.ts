import { getPathById } from '../../content/paths/loader.js';
import type { PathSession } from '../../content/paths/index.js';
import { getConceptById } from '../../content/concepts/loader.js';
import { getPromptById } from '../../content/prompts/loader.js';
import { getMeditationById } from '../../content/meditations/loader.js';
import { isPathSessionComplete, logPathSessionComplete } from '../practiceHistory.js';

function renderSessionItem(pathId: string, session: PathSession, index: number): string {
    const done = isPathSessionComplete(pathId, index);
    const checkedAttr = done ? ' checked' : '';
    const doneClass = done ? ' path-session--done' : '';
    const sections: string[] = [];

    if (session.conceptId) {
        const concept = getConceptById(session.conceptId);
        if (concept) {
            sections.push(`
                <div class="path-session__concept">
                    <h4 class="path-session__section-title">${concept.title}</h4>
                    <p class="path-session__brief">${concept.brief}</p>
                    <a href="#/concept/${session.conceptId}" class="path-session__link">Read more</a>
                </div>`);
        }
    }

    if (session.promptId) {
        const prompt = getPromptById(session.promptId);
        if (prompt) {
            sections.push(`
                <div class="path-session__prompt">
                    <p class="path-session__question">${prompt.question}</p>
                    <details class="path-session__guidance">
                        <summary>Guidance</summary>
                        <p>${prompt.guidance}</p>
                    </details>
                </div>`);
        }
    }

    if (session.meditationId) {
        const meditation = getMeditationById(session.meditationId);
        if (meditation) {
            sections.push(`
                <div class="path-session__meditation">
                    <h4 class="path-session__section-title">${meditation.title}</h4>
                    <p class="path-session__description">${meditation.description}</p>
                    <a href="#/practice/meditate/${session.meditationId}" class="path-session__link">Start session</a>
                </div>`);
        }
    }

    const contentHtml =
        sections.length > 0
            ? `<div class="path-session__content">${sections.join('')}</div>`
            : '';

    return `
        <li class="path-session${doneClass}" data-index="${index}">
            <label class="path-session__label">
                <input
                    class="path-session__checkbox"
                    type="checkbox"
                    data-path-id="${pathId}"
                    data-session-index="${index}"
                    ${checkedAttr}
                    aria-label="Mark session ${session.day} complete"
                />
                <span class="path-session__day">Day ${session.day}</span>
                <span class="path-session__title">${session.title}</span>
            </label>
            ${contentHtml}
        </li>`;
}

function attachEventListeners(container: HTMLElement): void {
    container.addEventListener('change', (event) => {
        const checkbox = (event.target as HTMLElement).closest<HTMLInputElement>(
            '.path-session__checkbox',
        );
        if (!checkbox) return;

        const pathId = checkbox.dataset.pathId;
        const indexStr = checkbox.dataset.sessionIndex;
        if (!pathId || indexStr === undefined) return;

        const index = parseInt(indexStr, 10);
        if (isNaN(index)) return;

        if (checkbox.checked) {
            logPathSessionComplete(pathId, index);
            const li = checkbox.closest<HTMLElement>('.path-session');
            li?.classList.add('path-session--done');
        } else {
            // Re-render checkbox as checked — completion is not reversible
            checkbox.checked = true;
        }
    });
}

export function renderPathDetailView(container: HTMLElement, pathId: string): void {
    const path = getPathById(pathId);

    if (!path) {
        container.innerHTML = `
            <div class="path-detail-view page stack-lg" role="main">
                <a href="#/practice/paths" class="back-link">&larr; Paths</a>
                <p class="path-detail__not-found">Path not found.</p>
            </div>`;
        return;
    }

    const sessionItems = path.sessions
        .map((session, index) => renderSessionItem(path.id, session, index))
        .join('');

    const completed = path.sessions.filter((_, i) =>
        isPathSessionComplete(path.id, i),
    ).length;
    const total = path.sessions.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const progressLabel =
        completed === 0
            ? 'Not started'
            : completed === total
              ? 'Complete'
              : `${completed} of ${total} sessions`;

    container.innerHTML = `
        <div class="path-detail-view page stack-lg" role="main">
            <a href="#/practice/paths" class="back-link">&larr; Paths</a>
            <h1 class="path-detail__title">${path.title}</h1>
            <p class="path-detail__desc">${path.description}</p>
            <div class="path-detail__progress" aria-label="Progress: ${progressLabel}">
                <div class="path-item__progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
                    <div class="path-item__progress-fill" style="width:${pct}%"></div>
                </div>
                <span class="path-item__progress-label">${progressLabel}</span>
            </div>
            <ul class="path-sessions stack-sm" aria-label="Sessions">
                ${sessionItems}
            </ul>
        </div>`;

    attachEventListeners(container);
}
