import { loadConcepts } from '../content/concepts/index.js';
import { isViewed } from './readingHistory.js';
import { debounce } from '../utils/helpers.js';
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

export function matchesSearch(concept: Concept, query: string): boolean {
    const q = query.toLowerCase();
    return (
        concept.title.toLowerCase().includes(q) ||
        (concept.pali?.toLowerCase().includes(q) ?? false) ||
        (concept.sanskrit?.toLowerCase().includes(q) ?? false) ||
        concept.brief.toLowerCase().includes(q)
    );
}

export function renderCatalogView(container: HTMLElement): void {
    const concepts = loadConcepts();

    container.innerHTML = `
        <div class="catalog-view page stack-lg" role="main">
            <h1 class="catalog-view__heading">All Concepts</h1>
            <div class="catalog-search">
                <label for="catalog-search-input" class="visually-hidden">Search concepts</label>
                <input
                    id="catalog-search-input"
                    class="catalog-search__input"
                    type="search"
                    placeholder="Search concepts…"
                    aria-label="Search concepts"
                />
            </div>
            <ul class="catalog-list stack-sm" aria-label="Buddhist concepts" aria-live="polite">
            </ul>
        </div>`;

    const list = container.querySelector<HTMLElement>('.catalog-list')!;
    const input = container.querySelector<HTMLInputElement>('#catalog-search-input')!;

    function renderList(query: string): void {
        const filtered = query
            ? concepts.filter((c) => matchesSearch(c, query))
            : concepts;
        list.innerHTML = filtered.map(renderConceptItem).join('');
    }

    renderList('');

    const debouncedRender = debounce((query: string) => renderList(query), 200);

    input.addEventListener('input', () => {
        debouncedRender(input.value.trim());
    });
}
