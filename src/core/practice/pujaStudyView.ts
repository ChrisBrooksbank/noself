import { getPujaById } from '../../content/pujas/index.js';
import { getConceptById } from '../../content/concepts/index.js';
import { getShowVideoLinks } from '../preferences.js';
import { renderSacredTermSpan, initSacredTermTooltips } from '../sacredTerms.js';
import type { Puja, PujaSection, PujaTerms } from '../../content/pujas/index.js';

function renderTerms(terms: PujaTerms | undefined): string {
    if (!terms?.pali && !terms?.sanskrit) return '';
    const parts: string[] = [];
    if (terms.pali) {
        const opts = terms.sanskrit ? { counterpart: terms.sanskrit } : {};
        parts.push(renderSacredTermSpan(terms.pali, opts));
    }
    if (terms.sanskrit) {
        const opts = terms.pali ? { counterpart: terms.pali } : {};
        parts.push(renderSacredTermSpan(terms.sanskrit, opts));
    }
    return `<p class="puja-study__terms">${parts.join(' · ')}</p>`;
}

function renderGloss(section: PujaSection): string {
    const hasPhonetic = !!section.phonetic;
    const hasGloss = section.gloss && section.gloss.length > 0;
    if (!hasPhonetic && !hasGloss) return '';

    const phoneticBlock = hasPhonetic
        ? `<p class="puja-section__phonetic">${section.phonetic}</p>`
        : '';

    const glossRows =
        hasGloss && section.gloss
            ? section.gloss
                  .map(
                      (g) => `
                <tr>
                    <td class="puja-section__gloss-word">${g.word}</td>
                    ${g.phonetic ? `<td class="puja-section__gloss-phonetic">${g.phonetic}</td>` : '<td></td>'}
                    <td class="puja-section__gloss-meaning">${g.meaning}</td>
                </tr>`,
                  )
                  .join('')
            : '';

    const glossTable = hasGloss
        ? `<table class="puja-section__gloss-table">
            <thead><tr>
                <th>Word</th>
                <th>Pronunciation</th>
                <th>Meaning</th>
            </tr></thead>
            <tbody>${glossRows}</tbody>
        </table>`
        : '';

    return `
        <details class="puja-section__gloss-details">
            <summary class="puja-section__gloss-summary">Word-by-word study</summary>
            ${phoneticBlock}
            ${glossTable}
        </details>`;
}

function renderPujaVideos(puja: Puja): string {
    if (!getShowVideoLinks() || !puja.videos || puja.videos.length === 0) return '';

    const items = puja.videos
        .map(
            (v) =>
                `<a href="${v.videoUrl}" target="_blank" rel="noopener noreferrer" class="meditation-item__video-link"><svg class="video-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 4.5v7l5-3.5z" fill="currentColor"/></svg>${v.title} · ${v.teacher} · ${v.duration}</a>`,
        )
        .join('');

    return `<div class="puja-study__videos stack-sm">
                <h2 class="puja-section__title">Experience a Puja</h2>
                <p class="puja-study__desc">If you have not attended a puja at a sangha, these recordings give a sense of the ceremony, the chanting, and the communal atmosphere.</p>
                <div class="meditation-item__videos">${items}</div>
            </div>`;
}

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
            ${renderGloss(section)}
            ${renderRelatedConcepts(section.relatedConcepts)}
        </section>`;
}

export function renderPujaStudyView(container: HTMLElement, id: string): () => void {
    const puja = getPujaById(id);

    if (!puja) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <p>Puja not found: <strong>${id}</strong></p>
                <a href="#/practice/pujas">Return to Pujas</a>
            </div>`;
        return () => {};
    }

    const sorted = [...puja.sections].sort((a, b) => a.order - b.order);
    const termsBlock = renderTerms(puja.terms);

    container.innerHTML = `
        <div class="puja-study-view page stack-lg" role="main">
            <a href="#/practice/pujas" class="back-link">&larr; Pujas</a>
            <header class="puja-study__header stack-sm">
                <span class="badge">${puja.tradition}</span>
                <h1 class="puja-study__title">${puja.title}</h1>
                ${termsBlock}
                <p class="puja-study__desc">${puja.description}</p>
                <a href="#/practice/puja/${puja.id}/perform" class="btn btn--sm puja-study__perform-link">Perform Ritual</a>
            </header>
            ${renderPujaVideos(puja)}
            <div class="puja-study__sections stack-lg">
                ${sorted.map(renderSection).join('')}
            </div>
        </div>`;

    return initSacredTermTooltips(container);
}
