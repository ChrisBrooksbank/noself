import { loadConcepts } from '../content/concepts/index.js';
import { isViewed } from './readingHistory.js';
import { debounce } from '../utils/helpers.js';
import { getExpertiseLevel } from './preferences.js';
import type { Concept, ConceptCategory } from '../content/concepts/index.js';

const CATEGORIES: Array<{ value: ConceptCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'foundational', label: 'Foundational' },
    { value: 'three-marks', label: 'Three Marks' },
    { value: 'mind-and-practice', label: 'Mind & Practice' },
    { value: 'buddhist-psychology', label: 'Psychology' },
    { value: 'brahmaviharas', label: 'Brahmaviharas' },
    { value: 'mahayana', label: 'Mahayana' },
    { value: 'liberation', label: 'Liberation' },
];

function renderConceptItem(concept: Concept): string {
    const level = getExpertiseLevel();
    const viewed = isViewed(concept.id);
    const paliLabel = concept.pali
        ? `<span class="catalog-item__pali">${concept.pali}</span>`
        : '';
    const badge = viewed
        ? `<span class="badge catalog-item__badge" aria-label="Read">Read</span>`
        : `<span class="badge catalog-item__badge catalog-item__badge--unread" aria-label="New">New</span>`;
    const briefText =
        level === 1 ? (concept.simpleBrief ?? concept.brief) : concept.brief;

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
            <p class="catalog-item__brief">${briefText}</p>
        </li>`;
}

export function matchesCategory(
    concept: Concept,
    category: ConceptCategory | 'all',
): boolean {
    return category === 'all' || concept.category === category;
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
    let activeCategory: ConceptCategory | 'all' = 'all';

    const categoryButtons = CATEGORIES.map(
        (cat) =>
            `<button class="btn catalog-filter__btn${cat.value === 'all' ? ' catalog-filter__btn--active' : ''}" data-category="${cat.value}" aria-pressed="${cat.value === 'all'}">${cat.label}</button>`,
    ).join('');

    container.innerHTML = `
        <div class="catalog-view page stack-lg" role="main">
            <h1 class="catalog-view__heading">All Concepts</h1>
            <div class="catalog-search">
                <label for="catalog-search-input" class="sr-only">Search concepts</label>
                <input
                    id="catalog-search-input"
                    class="catalog-search__input"
                    type="search"
                    placeholder="Search concepts…"
                    aria-label="Search concepts"
                />
            </div>
            <div class="catalog-filter btn-group" role="group" aria-label="Filter by category">
                ${categoryButtons}
            </div>
            <ul class="catalog-list stack-sm" aria-label="Buddhist concepts" aria-live="polite">
            </ul>
        </div>`;

    const list = container.querySelector<HTMLElement>('.catalog-list')!;
    const input = container.querySelector<HTMLInputElement>('#catalog-search-input')!;
    const filterGroup = container.querySelector<HTMLElement>('.catalog-filter')!;

    function renderList(query: string): void {
        const filtered = concepts.filter(
            (c) =>
                (query ? matchesSearch(c, query) : true) &&
                matchesCategory(c, activeCategory),
        );
        list.innerHTML = filtered.map(renderConceptItem).join('');
    }

    renderList('');

    const debouncedRender = debounce((query: string) => renderList(query), 200);

    input.addEventListener('input', () => {
        debouncedRender(input.value.trim());
    });

    filterGroup.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
            '.catalog-filter__btn',
        );
        if (!btn) return;
        activeCategory = btn.dataset.category as ConceptCategory | 'all';
        filterGroup
            .querySelectorAll<HTMLButtonElement>('.catalog-filter__btn')
            .forEach((b) => {
                b.classList.toggle('catalog-filter__btn--active', b === btn);
                b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
            });
        renderList(input.value.trim());
    });
}
