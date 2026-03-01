import { loadSutras } from '../content/sutras/index.js';
import type { Sutra } from '../content/sutras/index.js';

function renderSutraItem(sutra: Sutra): string {
    const sanskritLabel = sutra.sanskrit
        ? `<span class="sutra-item__sanskrit">${sutra.sanskrit}</span>`
        : '';

    return `
        <li class="sutra-item card card--interactive stack-sm">
            <div>
                <h2 class="sutra-item__title">
                    <a href="#/sutra/${sutra.id}" class="sutra-item__link">${sutra.title}</a>
                </h2>
                ${sanskritLabel}
            </div>
            <p class="sutra-item__desc">${sutra.description}</p>
            <div class="sutra-item__meta">
                <span class="badge">${sutra.tradition}</span>
                <span>${sutra.sections.length} sections</span>
            </div>
        </li>`;
}

export function renderSutrasListView(container: HTMLElement): void {
    const sutras = loadSutras();

    const items = sutras.map(renderSutraItem).join('');

    container.innerHTML = `
        <div class="page stack-lg" role="main">
            <header class="stack-sm">
                <h1>Sutras</h1>
                <p class="sutra-item__desc">Study the foundational texts of Buddhist wisdom.</p>
            </header>
            <ul class="sutras-list stack">${items}</ul>
        </div>`;
}
