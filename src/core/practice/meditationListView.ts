import { loadMeditations } from '../../content/meditations/loader.js';
import type { Meditation } from '../../content/meditations/index.js';

function renderDurationOptions(meditation: Meditation): string {
    return meditation.durations
        .map(
            (min) =>
                `<a href="#/practice/meditate/${meditation.id}?duration=${min}" class="meditation-item__duration-link btn btn--sm">${min} min</a>`,
        )
        .join('');
}

function renderMeditationItem(meditation: Meditation): string {
    return `
        <li class="meditation-item card stack-sm">
            <h2 class="meditation-item__title">${meditation.title}</h2>
            <p class="meditation-item__desc">${meditation.description}</p>
            <div class="meditation-item__durations btn-group" aria-label="Duration options for ${meditation.title}">
                ${renderDurationOptions(meditation)}
            </div>
        </li>`;
}

export function renderMeditationListView(container: HTMLElement): void {
    const meditations = loadMeditations();

    const sorted = [...meditations].sort((a, b) => a.title.localeCompare(b.title));

    container.innerHTML = `
        <div class="meditation-list-view page stack-lg" role="main">
            <a href="#/practice" class="back-link">&larr; Practice</a>
            <h1 class="meditation-list__heading">Guided Meditations</h1>
            <p class="meditation-list__intro">Choose a meditation and select a duration to begin.</p>
            <ul class="meditation-list stack-md" aria-label="Guided meditations">
                ${sorted.map(renderMeditationItem).join('')}
            </ul>
        </div>`;
}
