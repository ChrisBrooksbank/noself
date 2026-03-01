import { loadMantras } from '../../content/mantras/index.js';
import type { Mantra } from '../../content/mantras/index.js';

function renderMantraItem(mantra: Mantra): string {
    return `
        <li class="mantra-item card stack-sm">
            <h2 class="mantra-item__title">${mantra.title}</h2>
            <p class="mantra-item__sanskrit">${mantra.sanskrit}</p>
            <p class="mantra-item__tradition">${mantra.tradition}</p>
            <div class="mantra-item__actions btn-group" aria-label="Actions for ${mantra.title}">
                <a href="#/practice/mantra/${mantra.id}" class="mantra-item__detail-link btn btn--sm">Details</a>
                <a href="#/practice/mantra/${mantra.id}/chant" class="mantra-item__chant-link btn btn--sm">Chant</a>
            </div>
        </li>`;
}

export function renderMantraListView(container: HTMLElement): void {
    const mantras = loadMantras();

    const sorted = [...mantras].sort((a, b) => a.title.localeCompare(b.title));

    container.innerHTML = `
        <div class="mantra-list-view page stack-lg" role="main">
            <a href="#/practice" class="back-link">&larr; Practice</a>
            <h1 class="mantra-list__heading">Mantras</h1>
            <p class="mantra-list__intro">Explore sacred chants for study or meditative repetition.</p>
            <ul class="mantra-list stack-md" aria-label="Mantras">
                ${sorted.map(renderMantraItem).join('')}
            </ul>
        </div>`;
}
