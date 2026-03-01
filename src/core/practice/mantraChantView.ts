import { getMantraById } from '../../content/mantras/index.js';
import { playBell, resumeAudioContext } from './bellSound.js';
import { logMantraSession } from '../practiceHistory.js';

const TOTAL_BEADS = 108;
const BELL_INTERVAL = 27; // ring bell every quarter mala

/**
 * Build the 108-dot circular mala SVG-free layout.
 * Each bead is a small span positioned via CSS transform.
 */
function buildMalaHTML(): string {
    const beads: string[] = [];
    for (let i = 0; i < TOTAL_BEADS; i++) {
        beads.push(
            `<span class="mala__bead" data-bead="${i}" aria-hidden="true"></span>`,
        );
    }
    return `<div class="mala" aria-hidden="true">${beads.join('')}</div>`;
}

/**
 * Update bead states to reflect count completed.
 */
function updateMala(container: HTMLElement, count: number): void {
    const beads = container.querySelectorAll<HTMLElement>('.mala__bead');
    beads.forEach((bead, i) => {
        if (i < count) {
            bead.classList.add('mala__bead--done');
        } else {
            bead.classList.remove('mala__bead--done');
        }
    });
}

/**
 * Render the mantra chanting view with mala bead counter.
 *
 * Features:
 * - Large counter display (e.g. "42 / 108")
 * - Mantra text for reference
 * - Large tap button to increment count
 * - Circular 108-dot mala visualization
 * - Haptic feedback via navigator.vibrate?.(10)
 * - Bell every 27 beads (quarter mala)
 * - Completion: bell + message + log session
 *
 * Returns a cleanup function (no-op here but consistent with other views).
 */
export function renderMantraChantView(container: HTMLElement, id: string): () => void {
    const mantra = getMantraById(id);

    if (!mantra) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <a href="#/practice/mantras" class="back-link">&larr; Mantras</a>
                <p>Mantra not found: <strong>${id}</strong></p>
            </div>`;
        return () => {};
    }

    const totalRepetitions = mantra.defaultRepetitions;

    container.innerHTML = `
        <div class="mantra-chant-view page stack-lg" role="main">
            <a href="#/practice/mantra/${mantra.id}" class="back-link">&larr; ${mantra.title}</a>
            <header class="mantra-chant__header stack-sm">
                <h1 class="mantra-chant__title">${mantra.title}</h1>
                <p class="mantra-chant__sanskrit">${mantra.sanskrit}</p>
            </header>
            <div class="mantra-chant__body stack-md">
                ${buildMalaHTML()}
                <div class="mantra-chant__counter" aria-live="polite" aria-atomic="true">
                    <span class="mantra-chant__count">0</span>
                    <span class="mantra-chant__separator"> / </span>
                    <span class="mantra-chant__total">${totalRepetitions}</span>
                </div>
                <button class="mantra-chant__tap-target js-tap" type="button" aria-label="Count one repetition">
                    Tap
                </button>
                <p class="mantra-chant__status" aria-live="polite" aria-atomic="true"></p>
            </div>
            <div class="mantra-chant__controls btn-group">
                <button class="btn js-reset" type="button">Reset</button>
            </div>
        </div>`;

    const countEl = container.querySelector<HTMLElement>('.mantra-chant__count')!;
    const statusEl = container.querySelector<HTMLElement>('.mantra-chant__status')!;
    const tapBtn = container.querySelector<HTMLButtonElement>('.js-tap')!;
    const resetBtn = container.querySelector<HTMLButtonElement>('.js-reset')!;

    let count = 0;
    let completed = false;

    function updateDisplay(): void {
        countEl.textContent = String(count);
        updateMala(container, count);
    }

    tapBtn.addEventListener('click', () => {
        if (completed) return;

        void resumeAudioContext();
        navigator.vibrate?.(10);

        count++;
        updateDisplay();

        // Bell every 27 beads (quarter mala)
        if (count % BELL_INTERVAL === 0 && count < totalRepetitions) {
            playBell();
            statusEl.textContent = `${count} — quarter mala complete`;
        } else if (count < totalRepetitions) {
            statusEl.textContent = '';
        }

        if (count >= totalRepetitions) {
            completed = true;
            playBell();
            tapBtn.disabled = true;
            statusEl.textContent = 'Mala complete. May all beings benefit.';
            logMantraSession(mantra.id, totalRepetitions);
        }
    });

    resetBtn.addEventListener('click', () => {
        count = 0;
        completed = false;
        tapBtn.disabled = false;
        statusEl.textContent = '';
        updateDisplay();
    });

    updateDisplay();

    return () => {};
}
