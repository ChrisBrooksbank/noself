import { loadConcepts } from '../content/concepts/index.js';
import { isViewed } from './readingHistory.js';
import type { Concept } from '../content/concepts/index.js';

function renderConceptItem(concept: Concept): string {
    const viewed = isViewed(concept.id);
    const paliLabel = concept.pali
        ? `<span class="catalog-item__pali">${concept.pali}</span>`
        : '';
    const badge = viewed
        ? `<span class="badge catalog-item__badge" aria-label="Read">Read</span>`
        : `<span class="badge catalog-item__badge catalog-item__badge--unread" aria-label="New">New</span>`;

    return `
        <li class="catalog-item card">
            <div class="catalog-item__header">
                <div class="catalog-item__titles">
                    <h2 class="catalog-item__title">
                        <a href="#/concept/${concept.id}" class="catalog-item__link">${concept.title}</a>
                    </h2>
                    ${paliLabel}
                </div>
                ${badge}
            </div>
            <p class="catalog-item__brief">${concept.brief}</p>
        </li>`;
}

export function renderCatalogView(container: HTMLElement): void {
    const concepts = loadConcepts();

    const items = concepts.map(renderConceptItem).join('');

    container.innerHTML = `
        <div class="catalog-view page stack-lg" role="main">
            <h1 class="catalog-view__heading">All Concepts</h1>
            <ul class="catalog-list stack-sm" aria-label="Buddhist concepts">
                ${items}
            </ul>
        </div>`;
}
