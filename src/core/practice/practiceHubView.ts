import {
    getTotalSessionCount,
    getMeditationSessions,
    getPromptSessions,
    getPujaSessions,
    getMantraSessions,
} from '../practiceHistory.js';

function renderStatsSummary(
    totalSessions: number,
    meditationCount: number,
    promptCount: number,
    pujaCount: number,
    mantraCount: number,
): string {
    if (totalSessions === 0) {
        return `<p class="practice-hub__empty">No practice sessions yet. Start below.</p>`;
    }
    return `
        <p class="practice-hub__stats">
            ${totalSessions} session${totalSessions === 1 ? '' : 's'} total
            &mdash; ${meditationCount} meditation${meditationCount === 1 ? '' : 's'},
            ${promptCount} prompt${promptCount === 1 ? '' : 's'} sat with,
            ${pujaCount} puja${pujaCount === 1 ? '' : 's'},
            ${mantraCount} mantra${mantraCount === 1 ? '' : 's'}
        </p>`;
}

function renderCard(
    href: string,
    title: string,
    description: string,
    linkLabel: string,
): string {
    return `
        <div class="practice-hub__card card stack-sm">
            <h2 class="practice-hub__card-title">${title}</h2>
            <p class="practice-hub__card-desc">${description}</p>
            <a href="${href}" class="practice-hub__card-link btn">${linkLabel}</a>
        </div>`;
}

export function renderPracticeHubView(container: HTMLElement): void {
    const totalSessions = getTotalSessionCount();
    const meditationCount = getMeditationSessions().length;
    const promptCount = getPromptSessions().length;
    const pujaCount = getPujaSessions().length;
    const mantraCount = getMantraSessions().length;

    container.innerHTML = `
        <div class="practice-hub-view page stack-lg" role="main">
            <h1 class="practice-hub__heading">Practice</h1>
            ${renderStatsSummary(totalSessions, meditationCount, promptCount, pujaCount, mantraCount)}
            <div class="practice-hub__cards stack-md">
                ${renderCard(
                    '#/practice/meditate',
                    'Meditate',
                    'Guided timer sessions with step-by-step instructions and bell sounds.',
                    'Browse Meditations',
                )}
                ${renderCard(
                    '#/practice/prompts',
                    'Contemplate',
                    'Daily reflection prompts tied to core Buddhist concepts.',
                    'View Prompts',
                )}
                ${renderCard(
                    '#/practice/paths',
                    'Paths',
                    'Structured multi-session curricula combining study, prompts, and meditation.',
                    'Browse Paths',
                )}
                ${renderCard(
                    '#/practice/pujas',
                    'Puja',
                    'Devotional liturgies to study and perform, including the Triratna Sevenfold Puja.',
                    'Browse Pujas',
                )}
                ${renderCard(
                    '#/practice/mantras',
                    'Mantras',
                    'Sacred syllables for chanting practice with mala bead counter.',
                    'Browse Mantras',
                )}
            </div>
            <a href="#/practice/history" class="practice-hub__history-link">View practice history</a>
        </div>`;
}
