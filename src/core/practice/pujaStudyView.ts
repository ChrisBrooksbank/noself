import { getPujaById } from '../../content/pujas/index.js';
import { getConceptById } from '../../content/concepts/index.js';
import type { PujaSection } from '../../content/pujas/index.js';

function renderRelatedConcepts(ids: string[]): string {
    if (ids.length === 0) return '';

    const links = ids
        .map((id) => {
            const concept = getConceptById(id);
            const label = concept ? concept.title : id;
            return `<a href="#/concept/${id}" class="puja-section__concept-link">${label}</a>`;
        })
        .join(', ');

    return `<p class="puja-section__related">Related: ${links}</p>`;
}

function renderSection(section: PujaSection): string {
    return `
        <section class="puja-section stack-sm" id="section-${section.id}">
            <h2 class="puja-section__title">${section.title}</h2>
            <div class="puja-section__original">
                <p class="puja-section__original-lang">${section.originalLanguage}</p>
                <blockquote class="puja-section__original-text">${section.original}</blockquote>
            </div>
            <div class="puja-section__translation">
                <h3 class="puja-section__subheading">Translation</h3>
                <p class="puja-section__translation-text">${section.translation}</p>
            </div>
            <div class="puja-section__commentary">
                <h3 class="puja-section__subheading">Commentary</h3>
                <p class="puja-section__commentary-text">${section.commentary}</p>
            </div>
            ${renderRelatedConcepts(section.relatedConcepts)}
        </section>`;
}

export function renderPujaStudyView(container: HTMLElement, id: string): void {
    const puja = getPujaById(id);

    if (!puja) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <p>Puja not found: <strong>${id}</strong></p>
                <a href="#/practice/pujas">Return to Pujas</a>
            </div>`;
        return;
    }

    const sorted = [...puja.sections].sort((a, b) => a.order - b.order);

    container.innerHTML = `
        <div class="puja-study-view page stack-lg" role="main">
            <a href="#/practice/pujas" class="back-link">&larr; Pujas</a>
            <header class="puja-study__header stack-sm">
                <span class="badge">${puja.tradition}</span>
                <h1 class="puja-study__title">${puja.title}</h1>
                <p class="puja-study__desc">${puja.description}</p>
                <a href="#/practice/puja/${puja.id}/perform" class="btn btn--sm puja-study__perform-link">Perform Ritual</a>
            </header>
            <div class="puja-study__sections stack-lg">
                ${sorted.map(renderSection).join('')}
            </div>
        </div>`;
}
