import { getSutraById } from '../content/sutras/index.js';
import { getConceptById } from '../content/concepts/index.js';
import { getExpertiseLevel } from './preferences.js';
import type { Sutra, SutraSection } from '../content/sutras/index.js';

function renderToc(sections: SutraSection[]): string {
    const items = sections
        .map(
            (s) =>
                `<li><a href="javascript:void(0)" data-scroll-to="section-${s.id}">${s.title}</a></li>`,
        )
        .join('');

    return `
        <nav class="sutra-toc" aria-label="Table of contents">
            <h2 class="sutra-toc__title">Contents</h2>
            <ol class="sutra-toc__list">${items}</ol>
        </nav>`;
}

function renderRelatedConcepts(ids: string[]): string {
    if (ids.length === 0) return '';

    const links = ids
        .map((id) => {
            const concept = getConceptById(id);
            const label = concept ? concept.title : id;
            return `<a href="#/concept/${id}" class="badge">${label}</a>`;
        })
        .join('');

    return `
        <div class="sutra-section__related">
            <span class="sutra-section__related-label">Related:</span>
            ${links}
        </div>`;
}

function renderSection(section: SutraSection): string {
    const level = getExpertiseLevel();
    const originalBlock =
        level >= 3
            ? `<div class="sutra-section__original">
                <span class="sutra-section__original-label">${section.originalLanguage}</span>
                ${section.original}
            </div>`
            : '';

    return `
        <article id="section-${section.id}" class="sutra-section card stack">
            <h3 class="sutra-section__title">${section.title}</h3>
            ${originalBlock}
            <p class="sutra-section__translation">${section.translation}</p>
            <details class="sutra-section__commentary-details">
                <summary class="sutra-section__commentary-summary">Commentary</summary>
                <p class="sutra-section__commentary">${section.commentary}</p>
            </details>
            ${renderRelatedConcepts(section.relatedConcepts)}
        </article>`;
}

function renderSutra(sutra: Sutra): string {
    const sanskritLabel = sutra.sanskrit
        ? `<p class="sutra-study__sanskrit">${sutra.sanskrit}</p>`
        : '';

    const sorted = [...sutra.sections].sort((a, b) => a.order - b.order);

    const sections = sorted
        .map(
            (section, i) =>
                renderSection(section) +
                (i < sorted.length - 1
                    ? '<div class="ornament" aria-hidden="true">&#x2638;</div>'
                    : ''),
        )
        .join('');

    return `
        <div class="sutra-study page stack-lg" role="main">
            <a href="#/sutras" class="back-link" aria-label="Back to sutras">&larr; All Sutras</a>
            <header class="stack-sm">
                <h1 class="sutra-study__title">${sutra.title}</h1>
                ${sanskritLabel}
                <span class="badge">${sutra.tradition}</span>
                <p class="sutra-study__desc">${sutra.description}</p>
            </header>
            ${renderToc(sorted)}
            <div class="stack-xl">
                ${sections}
            </div>
        </div>`;
}

export function renderSutraStudyView(container: HTMLElement, id: string): void {
    const sutra = getSutraById(id);

    if (!sutra) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <p>Sutra not found.</p>
                <a href="#/sutras">Back to sutras</a>
            </div>`;
        return;
    }

    container.innerHTML = renderSutra(sutra);

    container.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[data-scroll-to]');
        if (target) {
            e.preventDefault();
            const el = document.getElementById(target.dataset.scrollTo!);
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
