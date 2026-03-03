import { loadMeditations } from '../../content/meditations/loader.js';
import { getExpertiseLevel, getShowVideoLinks } from '../preferences.js';
import type { Meditation } from '../../content/meditations/index.js';

function renderDurationOptions(meditation: Meditation): string {
    const level = getExpertiseLevel();
    const durations =
        level === 1 ? meditation.durations.filter((d) => d <= 10) : meditation.durations;
    return durations
        .map(
            (min) =>
                `<a href="#/practice/meditate/${meditation.id}?duration=${min}" class="meditation-item__duration-link btn btn--sm">${min} min</a>`,
        )
        .join('');
}

function renderMeditationVideos(meditation: Meditation): string {
    if (!getShowVideoLinks() || !meditation.videos || meditation.videos.length === 0)
        return '';

    const items = meditation.videos
        .map(
            (v) =>
                `<a href="${v.videoUrl}" target="_blank" rel="noopener noreferrer" class="meditation-item__video-link"><svg class="video-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 4.5v7l5-3.5z" fill="currentColor"/></svg>${v.title} · ${v.teacher} · ${v.duration}</a>`,
        )
        .join('');

    return `<div class="meditation-item__videos">${items}</div>`;
}

function renderMeditationItem(meditation: Meditation): string {
    return `
        <li class="meditation-item card stack-sm">
            <h2 class="meditation-item__title">${meditation.title}</h2>
            <p class="meditation-item__desc">${meditation.description}</p>
            ${renderMeditationVideos(meditation)}
            <div class="meditation-item__durations btn-group" aria-label="Duration options for ${meditation.title}">
                ${renderDurationOptions(meditation)}
            </div>
        </li>`;
}

export function renderMeditationListView(container: HTMLElement): void {
    const level = getExpertiseLevel();
    const meditations = loadMeditations().filter((m) => (m.level ?? 1) <= level);

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
