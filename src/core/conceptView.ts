import { getConceptById } from '../content/concepts/index.js';
import type { Concept, ConceptExample } from '../content/concepts/index.js';

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

function buildConceptHTML(concept: Concept): string {
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
        </article>`;
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

    container.innerHTML = buildConceptHTML(concept);
}
