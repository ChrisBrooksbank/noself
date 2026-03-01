import { getDailyConcept } from './dailyConcept.js';
import { getViewedIds } from './readingHistory.js';
import { getConceptById, CONCEPT_IDS } from '../content/concepts/index.js';

const TOTAL_CONCEPTS = CONCEPT_IDS.length;
const MAX_HISTORY = 5;

function renderDailyCard(id: string, title: string, brief: string): string {
    return `
        <section class="home-daily card stack-sm" aria-label="Concept of the day">
            <h2 class="home-section__heading">Today's Concept</h2>
            <h3 class="home-daily__title">${title}</h3>
            <p class="home-daily__brief">${brief}</p>
            <a href="#/concept/${id}" class="home-daily__link btn">Explore</a>
        </section>`;
}

function renderProgress(viewedCount: number): string {
    return `
        <p class="home-progress" aria-label="Reading progress">
            ${viewedCount} of ${TOTAL_CONCEPTS} concepts explored
        </p>`;
}

function renderGuidance(): string {
    return `
        <section class="home-guidance card stack-sm" aria-label="A note on practice">
            <h2 class="home-guidance__heading">Beyond Reading</h2>
            <p class="home-guidance__text">
                In the Buddhist tradition, reading about the Dhamma is called
                <em>sutamaya panna</em> — wisdom gained from hearing or study.
                It is a valuable first step, but only the beginning.
            </p>
            <p class="home-guidance__text">
                Deeper understanding comes through <em>cintamaya panna</em>,
                personal reflection, and ultimately through
                <em>bhavanamaya panna</em> — the direct insight that arises
                from meditative practice.
            </p>
            <p class="home-guidance__text">
                If these teachings resonate with you, consider finding a local
                sangha and a qualified teacher. A living community of practice
                can offer what no app or book can.
            </p>
        </section>`;
}

function renderHistory(viewedIds: string[]): string {
    const recent = viewedIds.slice(-MAX_HISTORY).reverse();
    if (recent.length === 0) return '';

    const items = recent
        .map((id) => {
            const concept = getConceptById(id);
            const label = concept ? concept.title : id;
            return `<li><a href="#/concept/${id}" class="home-history__link">${label}</a></li>`;
        })
        .join('');

    return `
        <section class="home-history stack-sm" aria-label="Recently viewed">
            <h2 class="home-section__heading">Recently Viewed</h2>
            <ul class="home-history__list stack-sm">${items}</ul>
        </section>`;
}

export function renderHomeView(container: HTMLElement): void {
    const concept = getDailyConcept();
    const viewedIds = getViewedIds();

    container.innerHTML = `
        <div class="home-view page stack-lg" role="main">
            ${renderDailyCard(concept.id, concept.title, concept.brief)}
            ${renderProgress(viewedIds.length)}
            ${renderHistory(viewedIds)}
            ${renderGuidance()}
        </div>`;
}
