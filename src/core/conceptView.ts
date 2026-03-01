import { getConceptById } from '../content/concepts/index.js';
import type { Concept, ConceptExample } from '../content/concepts/index.js';
import {
    markViewed,
    markContemplated,
    markRevisit,
    getStatus,
} from './readingHistory.js';

function renderExamples(examples: ConceptExample[]): string {
    if (examples.length === 0) return '';

    const items = examples
        .map(
            (ex) => `
        <div class="concept-example card stack-sm">
            <blockquote>${ex.text}</blockquote>
            <p class="concept-example__source">${ex.source}</p>
            <p class="concept-example__commentary">${ex.commentary}</p>
        </div>`,
        )
        .join('');

    return `
        <section class="concept-section stack">
            <h2 class="concept-section__heading">Source Teachings</h2>
            <div class="stack">${items}</div>
        </section>`;
}

function renderRelated(related: string[]): string {
    if (related.length === 0) return '';

    const links = related
        .map((id) => {
            const concept = getConceptById(id);
            const label = concept ? concept.title : id;
            return `<a href="#/concept/${id}" class="concept-related__link">${label}</a>`;
        })
        .join(', ');

    return `
        <section class="concept-section">
            <h3 class="concept-section__heading">Related Concepts</h3>
            <p class="concept-related">${links}</p>
        </section>`;
}

function renderToggle(id: string): string {
    return `
        <section class="concept-section concept-toggle" aria-label="Practice status">
            <h3 class="concept-section__heading">Your Practice</h3>
            <div class="btn-group">
                <button class="btn js-toggle-contemplated" data-id="${id}" aria-pressed="false" type="button">
                    Contemplated
                </button>
                <button class="btn js-toggle-revisit" data-id="${id}" aria-pressed="false" type="button">
                    Revisit
                </button>
            </div>
        </section>`;
}

function buildConceptHTML(concept: Concept, id: string): string {
    const terms = [concept.pali, concept.sanskrit].filter(Boolean);
    const termStr =
        terms.length > 0 ? `<p class="concept-terms">${terms.join(' · ')}</p>` : '';

    return `
        <article class="concept-view page stack-lg" aria-label="${concept.title}">
            <header class="concept-header stack-sm">
                <span class="badge">${concept.category}</span>
                <h1 class="concept-title">${concept.title}</h1>
                ${termStr}
                <p class="concept-brief">${concept.brief}</p>
            </header>

            <section class="concept-section stack">
                <h2 class="concept-section__heading">Essentials</h2>
                <div class="concept-body">${concept.essentials}</div>
            </section>

            <section class="concept-section stack">
                <h2 class="concept-section__heading">Deep Teaching</h2>
                <div class="concept-body">${concept.deep}</div>
            </section>

            ${renderExamples(concept.examples)}
            ${renderRelated(concept.related)}
            ${renderToggle(id)}
        </article>`;
}

function applyToggleState(
    contemBtn: HTMLButtonElement,
    revisitBtn: HTMLButtonElement,
    status: ReturnType<typeof getStatus>,
): void {
    const contemActive = status === 'contemplated';
    const revisitActive = status === 'revisit';

    contemBtn.classList.toggle('btn-primary', contemActive);
    contemBtn.setAttribute('aria-pressed', String(contemActive));

    revisitBtn.classList.toggle('btn-primary', revisitActive);
    revisitBtn.setAttribute('aria-pressed', String(revisitActive));
}

export function renderConceptView(container: HTMLElement, id: string): void {
    const concept = getConceptById(id);

    if (!concept) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <p>Concept not found: <strong>${id}</strong></p>
                <a href="#/">Return home</a>
            </div>`;
        return;
    }

    markViewed(id);
    container.innerHTML = buildConceptHTML(concept, id);

    const contemBtn = container.querySelector<HTMLButtonElement>(
        '.js-toggle-contemplated',
    );
    const revisitBtn = container.querySelector<HTMLButtonElement>('.js-toggle-revisit');

    if (!contemBtn || !revisitBtn) return;

    applyToggleState(contemBtn, revisitBtn, getStatus(id));

    contemBtn.addEventListener('click', () => {
        markContemplated(id);
        applyToggleState(contemBtn, revisitBtn, getStatus(id));
    });

    revisitBtn.addEventListener('click', () => {
        markRevisit(id);
        applyToggleState(contemBtn, revisitBtn, getStatus(id));
    });
}
