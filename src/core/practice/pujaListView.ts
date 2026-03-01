import { loadPujas } from '../../content/pujas/index.js';
import type { Puja } from '../../content/pujas/index.js';

function renderPujaItem(puja: Puja): string {
    return `
        <li class="puja-item card stack-sm">
            <h2 class="puja-item__title">${puja.title}</h2>
            <p class="puja-item__tradition">${puja.tradition}</p>
            <p class="puja-item__desc">${puja.description}</p>
            <div class="puja-item__actions btn-group" aria-label="Actions for ${puja.title}">
                <a href="#/practice/puja/${puja.id}" class="puja-item__study-link btn btn--sm">Study</a>
                <a href="#/practice/puja/${puja.id}/perform" class="puja-item__perform-link btn btn--sm">Perform</a>
            </div>
        </li>`;
}

export function renderPujaListView(container: HTMLElement): void {
    const pujas = loadPujas();

    const sorted = [...pujas].sort((a, b) => a.title.localeCompare(b.title));

    container.innerHTML = `
        <div class="puja-list-view page stack-lg" role="main">
            <a href="#/practice" class="back-link">&larr; Practice</a>
            <h1 class="puja-list__heading">Pujas</h1>
            <p class="puja-list__intro">Explore devotional liturgies for study or ritual practice.</p>
            <ul class="puja-list stack-md" aria-label="Pujas">
                ${sorted.map(renderPujaItem).join('')}
            </ul>
        </div>`;
}
