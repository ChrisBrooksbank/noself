import { getDailyPrompt } from './dailyPrompt.js';
import { getAllPrompts } from '../../content/prompts/loader.js';
import type { Prompt, PromptDepth } from '../../content/prompts/index.js';
import { logPromptSatWith, isPromptSatWith } from '../practiceHistory.js';
import { getExpertiseLevel } from '../preferences.js';

const DEPTH_LABELS: Record<PromptDepth, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

function renderSatWithButton(prompt: Prompt): string {
    const done = isPromptSatWith(prompt.id);
    return done
        ? `<span class="prompt-card__sat-done" aria-label="Marked as sat with">&#10003; Sat with this</span>`
        : `<button class="prompt-card__sat-btn btn btn--sm" data-prompt-id="${prompt.id}" type="button">Sat with this</button>`;
}

function renderPromptCard(prompt: Prompt): string {
    return `
        <div class="prompt-card card stack-sm" data-prompt-id="${prompt.id}">
            <span class="prompt-card__depth prompt-card__depth--${prompt.depth}">${DEPTH_LABELS[prompt.depth]}</span>
            <p class="prompt-card__question">${prompt.question}</p>
            <details class="prompt-card__guidance-details">
                <summary class="prompt-card__guidance-summary">Guidance</summary>
                <p class="prompt-card__guidance">${prompt.guidance}</p>
            </details>
            ${renderSatWithButton(prompt)}
        </div>`;
}

function renderDailyPromptSection(prompt: Prompt): string {
    return `
        <section class="prompts-daily card stack-sm" aria-label="Prompt of the day">
            <h2 class="prompts-section__heading">Today's Prompt</h2>
            <span class="prompt-card__concept">${prompt.conceptId}</span>
            <span class="prompt-card__depth prompt-card__depth--${prompt.depth}">${DEPTH_LABELS[prompt.depth]}</span>
            <p class="prompts-daily__question">${prompt.question}</p>
            <details class="prompt-card__guidance-details">
                <summary class="prompt-card__guidance-summary">Guidance</summary>
                <p class="prompt-card__guidance">${prompt.guidance}</p>
            </details>
            <div data-prompt-id="${prompt.id}">
                ${renderSatWithButton(prompt)}
            </div>
        </section>`;
}

function renderDepthFilter(activeDepth: PromptDepth | 'all'): string {
    const level = getExpertiseLevel();
    if (level === 1) return '';

    const allOptions: Array<{ value: PromptDepth | 'all'; label: string }> = [
        { value: 'all', label: 'All' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
    ];
    const options =
        level === 2 ? allOptions.filter((o) => o.value !== 'advanced') : allOptions;
    const buttons = options
        .map(({ value, label }) => {
            const active = value === activeDepth ? ' btn--active' : '';
            return `<button class="prompts-filter__btn btn btn--sm${active}" data-depth="${value}" type="button" aria-pressed="${value === activeDepth}">${label}</button>`;
        })
        .join('');
    return `
        <div class="prompts-filter btn-group" role="group" aria-label="Filter by depth">
            ${buttons}
        </div>`;
}

function renderBrowseGroups(prompts: Prompt[], activeDepth: PromptDepth | 'all'): string {
    const filtered =
        activeDepth === 'all' ? prompts : prompts.filter((p) => p.depth === activeDepth);

    if (filtered.length === 0) {
        return `<p class="prompts-browse__empty">No prompts match the selected filter.</p>`;
    }

    // Group by conceptId
    const grouped = new Map<string, Prompt[]>();
    for (const prompt of filtered) {
        const group = grouped.get(prompt.conceptId) ?? [];
        group.push(prompt);
        grouped.set(prompt.conceptId, group);
    }

    return [...grouped.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([conceptId, conceptPrompts]) => {
            const cards = conceptPrompts.map((p) => renderPromptCard(p)).join('');
            return `
                <section class="prompts-concept-group stack-sm" aria-label="${conceptId} prompts">
                    <h3 class="prompts-concept-group__title">${conceptId}</h3>
                    ${cards}
                </section>`;
        })
        .join('');
}

function renderBrowseSection(
    prompts: Prompt[],
    activeDepth: PromptDepth | 'all',
): string {
    return `
        <section class="prompts-browse stack-md" aria-label="Browse prompts">
            <h2 class="prompts-section__heading">All Prompts</h2>
            ${renderDepthFilter(activeDepth)}
            <div class="prompts-browse__groups stack-lg" id="prompts-browse-groups">
                ${renderBrowseGroups(prompts, activeDepth)}
            </div>
        </section>`;
}

function attachEventListeners(container: HTMLElement, allPrompts: Prompt[]): void {
    // "Sat with this" buttons (event delegation)
    container.addEventListener('click', (event) => {
        const btn = (event.target as HTMLElement).closest<HTMLButtonElement>(
            '.prompt-card__sat-btn',
        );
        if (!btn) return;

        const promptId = btn.dataset.promptId;
        if (!promptId) return;

        logPromptSatWith(promptId);

        // Replace every sat-with button for this prompt with the done state
        const btns = container.querySelectorAll<HTMLButtonElement>(
            `.prompt-card__sat-btn[data-prompt-id="${promptId}"]`,
        );
        btns.forEach((b) => {
            const span = document.createElement('span');
            span.className = 'prompt-card__sat-done';
            span.setAttribute('aria-label', 'Marked as sat with');
            span.textContent = '\u2713 Sat with this';
            b.replaceWith(span);
        });
    });

    // Depth filter buttons (event delegation)
    container.addEventListener('click', (event) => {
        const filterBtn = (event.target as HTMLElement).closest<HTMLButtonElement>(
            '.prompts-filter__btn',
        );
        if (!filterBtn) return;

        const depth = filterBtn.dataset.depth as PromptDepth | 'all' | undefined;
        if (!depth) return;

        // Update filter button states
        container
            .querySelectorAll<HTMLButtonElement>('.prompts-filter__btn')
            .forEach((b) => {
                const isActive = b.dataset.depth === depth;
                b.classList.toggle('btn--active', isActive);
                b.setAttribute('aria-pressed', String(isActive));
            });

        // Replace browse groups content
        const groupsContainer = container.querySelector<HTMLElement>(
            '#prompts-browse-groups',
        );
        if (groupsContainer) {
            groupsContainer.innerHTML = renderBrowseGroups(allPrompts, depth);
        }
    });
}

function filterPromptsByLevel(prompts: Prompt[]): Prompt[] {
    const level = getExpertiseLevel();
    if (level === 1) return prompts.filter((p) => p.depth === 'beginner');
    if (level === 2) return prompts.filter((p) => p.depth !== 'advanced');
    return prompts;
}

export function renderPromptsView(container: HTMLElement): void {
    const dailyPrompt = getDailyPrompt();
    const allPrompts = filterPromptsByLevel(getAllPrompts());

    container.innerHTML = `
        <div class="prompts-view page stack-lg" role="main">
            <a href="#/practice" class="back-link">&larr; Practice</a>
            <h1 class="prompts__heading">Contemplate</h1>
            ${renderDailyPromptSection(dailyPrompt)}
            ${renderBrowseSection(allPrompts, 'all')}
        </div>`;

    attachEventListeners(container, allPrompts);
}
