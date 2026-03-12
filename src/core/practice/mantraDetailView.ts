import { getMantraById } from '../../content/mantras/index.js';
import { getConceptById } from '../../content/concepts/index.js';
import type { MantraSyllable } from '../../content/mantras/index.js';

function renderSyllable(syllable: MantraSyllable): string {
    const phoneticHtml = syllable.phonetic
        ? `<span class="mantra-detail__syllable-phonetic">${syllable.phonetic}</span>`
        : '';
    const literalHtml = syllable.literal
        ? `<span class="mantra-detail__syllable-literal">${syllable.literal}</span>`
        : '';
    return `
        <li class="mantra-detail__syllable card stack-sm">
            <span class="mantra-detail__syllable-text">${syllable.text}</span>
            ${phoneticHtml}
            ${literalHtml}
            <p class="mantra-detail__syllable-meaning">${syllable.meaning}</p>
        </li>`;
}

function renderRelatedConcepts(ids: string[]): string {
    if (ids.length === 0) return '';

    const links = ids
        .map((id) => {
            const concept = getConceptById(id);
            const label = concept ? concept.title : id;
            return `<a href="#/concept/${id}" class="mantra-detail__concept-link">${label}</a>`;
        })
        .join(', ');

    return `<p class="mantra-detail__related">Related concepts: ${links}</p>`;
}

export function renderMantraDetailView(container: HTMLElement, id: string): void {
    const mantra = getMantraById(id);

    if (!mantra) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <p>Mantra not found: <strong>${id}</strong></p>
                <a href="#/practice/mantras">Return to Mantras</a>
            </div>`;
        return;
    }

    const paliSection = mantra.pali
        ? `<p class="mantra-detail__pali">${mantra.pali}</p>`
        : '';

    const phoneticSection = mantra.phonetic
        ? `<p class="mantra-detail__phonetic">${mantra.phonetic}</p>`
        : '';

    container.innerHTML = `
        <div class="mantra-detail-view page stack-lg" role="main">
            <a href="#/practice/mantras" class="back-link">&larr; Mantras</a>
            <header class="mantra-detail__header stack-sm">
                <span class="badge">${mantra.tradition}</span>
                <h1 class="mantra-detail__title">${mantra.title}</h1>
                <p class="mantra-detail__description">${mantra.description}</p>
            </header>
            <div class="mantra-detail__mantra-text stack-sm">
                <p class="mantra-detail__sanskrit">${mantra.sanskrit}</p>
                ${paliSection}
                ${phoneticSection}
            </div>
            <section class="mantra-detail__syllables stack-sm">
                <h2 class="mantra-detail__section-heading">Syllable Breakdown</h2>
                <ul class="mantra-detail__syllable-list stack-sm" aria-label="Syllable breakdown">
                    ${mantra.syllables.map(renderSyllable).join('')}
                </ul>
            </section>
            <section class="mantra-detail__meaning stack-sm">
                <h2 class="mantra-detail__section-heading">Meaning</h2>
                <p class="mantra-detail__meaning-text">${mantra.meaning}</p>
            </section>
            <section class="mantra-detail__usage stack-sm">
                <h2 class="mantra-detail__section-heading">Usage</h2>
                <p class="mantra-detail__usage-text">${mantra.usage}</p>
            </section>
            ${renderRelatedConcepts(mantra.relatedConcepts)}
            <a href="#/practice/mantra/${mantra.id}/chant" class="btn mantra-detail__chant-link">Begin Chanting</a>
        </div>`;
}
