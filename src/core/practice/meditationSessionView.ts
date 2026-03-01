import { loadMeditations } from '../../content/meditations/loader.js';
import type { MeditationDuration } from '../../content/meditations/index.js';
import { createMeditationTimer } from './meditationTimer.js';
import type { TimerState } from './meditationTimer.js';
import { playBell, resumeAudioContext } from './bellSound.js';
import { logMeditationSession } from '../practiceHistory.js';

function formatSeconds(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Render the active meditation session view.
 *
 * The `id` parameter may include a query string (e.g. "breath-awareness?duration=10")
 * as passed by the router from `#/practice/meditate/breath-awareness?duration=10`.
 *
 * Returns a cleanup function that stops any running timer interval — must be called
 * before navigating away.
 */
export function renderMeditationSessionView(
    container: HTMLElement,
    id: string,
): () => void {
    const [meditationId = '', queryString = ''] = id.split('?') as [string, string];
    const params = new URLSearchParams(queryString);
    const requestedDuration = parseInt(
        params.get('duration') ?? '0',
        10,
    ) as MeditationDuration;

    const meditations = loadMeditations();
    const meditation = meditations.find((m) => m.id === meditationId);

    if (!meditation) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <a href="#/practice/meditate" class="back-link">&larr; Meditations</a>
                <p>Meditation not found: <strong>${meditationId}</strong></p>
            </div>`;
        return () => {};
    }

    const availableDuration: MeditationDuration = meditation.durations.includes(
        requestedDuration,
    )
        ? requestedDuration
        : meditation.durations[0]!;

    const steps = meditation.steps[availableDuration] ?? [];

    if (steps.length === 0) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <a href="#/practice/meditate" class="back-link">&larr; Meditations</a>
                <p>No steps available for ${availableDuration} minutes.</p>
            </div>`;
        return () => {};
    }

    const totalDurationSeconds = steps.reduce((sum, s) => sum + s.durationSeconds, 0);

    container.innerHTML = `
        <div class="meditation-session-view page stack-lg" role="main">
            <a href="#/practice/meditate" class="back-link js-back">&larr; Meditations</a>
            <header class="meditation-session__header stack-sm">
                <h1 class="meditation-session__title">${meditation.title}</h1>
                <p class="meditation-session__duration">${availableDuration} minutes</p>
            </header>
            <div class="meditation-session__body stack-md">
                <div class="meditation-session__instruction" aria-live="polite" aria-atomic="true">
                    <p class="meditation-session__instruction-text">${steps[0]!.instruction}</p>
                </div>
                <div class="meditation-session__timer" aria-live="polite">
                    <span class="meditation-session__time-display">00:00</span>
                    <span class="meditation-session__time-total">/ ${formatSeconds(totalDurationSeconds)}</span>
                </div>
                <p class="meditation-session__step-remaining"></p>
                <p class="meditation-session__status" aria-live="polite" aria-atomic="true"></p>
            </div>
            <div class="meditation-session__controls btn-group"></div>
        </div>`;

    const instructionEl = container.querySelector<HTMLElement>(
        '.meditation-session__instruction-text',
    )!;
    const timeDisplayEl = container.querySelector<HTMLElement>(
        '.meditation-session__time-display',
    )!;
    const stepRemainingEl = container.querySelector<HTMLElement>(
        '.meditation-session__step-remaining',
    )!;
    const statusEl = container.querySelector<HTMLElement>('.meditation-session__status')!;
    const controlsEl = container.querySelector<HTMLElement>(
        '.meditation-session__controls',
    )!;

    function updateControls(state: TimerState): void {
        if (state === 'idle') {
            controlsEl.innerHTML = `<button class="btn btn-primary js-start" type="button">Begin</button>`;
        } else if (state === 'running') {
            controlsEl.innerHTML = `
                <button class="btn js-pause" type="button">Pause</button>
                <button class="btn js-stop" type="button">Stop</button>`;
        } else if (state === 'paused') {
            controlsEl.innerHTML = `
                <button class="btn btn-primary js-resume" type="button">Resume</button>
                <button class="btn js-stop" type="button">Stop</button>`;
        } else {
            // completed
            controlsEl.innerHTML = `<button class="btn btn-primary js-done" type="button">Done</button>`;
        }

        container
            .querySelector<HTMLButtonElement>('.js-start')
            ?.addEventListener('click', () => {
                void resumeAudioContext();
                timer.start();
            });
        container
            .querySelector<HTMLButtonElement>('.js-pause')
            ?.addEventListener('click', () => {
                timer.pause();
            });
        container
            .querySelector<HTMLButtonElement>('.js-resume')
            ?.addEventListener('click', () => {
                void resumeAudioContext();
                timer.resume();
            });
        container
            .querySelector<HTMLButtonElement>('.js-stop')
            ?.addEventListener('click', () => {
                timer.stop();
            });
        container
            .querySelector<HTMLButtonElement>('.js-done')
            ?.addEventListener('click', () => {
                logMeditationSession(meditationId, availableDuration);
                window.location.hash = '#/practice/meditate';
            });
    }

    const timer = createMeditationTimer(steps, {
        onStateChange(state) {
            updateControls(state);
            if (state === 'paused') {
                statusEl.textContent = 'Paused';
            } else if (state === 'running') {
                statusEl.textContent = '';
            } else if (state === 'idle') {
                statusEl.textContent = '';
                timeDisplayEl.textContent = '00:00';
                stepRemainingEl.textContent = '';
                instructionEl.textContent = steps[0]!.instruction;
            } else if (state === 'completed') {
                statusEl.textContent = 'Session complete. Well done.';
                stepRemainingEl.textContent = '';
            }
        },
        onStepChange(_stepIndex, step) {
            instructionEl.textContent = step.instruction;
            stepRemainingEl.textContent = '';
        },
        onTick(_stepElapsed, stepRemaining, totalElapsed) {
            timeDisplayEl.textContent = formatSeconds(totalElapsed);
            stepRemainingEl.textContent =
                stepRemaining > 0 ? `Step ends in ${formatSeconds(stepRemaining)}` : '';
        },
        onBell() {
            playBell();
        },
    });

    updateControls('idle');

    return () => timer.cleanup();
}
