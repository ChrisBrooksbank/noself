import { getPujaById } from '../../content/pujas/index.js';
import { playBell, resumeAudioContext } from './bellSound.js';
import { logPujaSession } from '../practiceHistory.js';

type PerformState = 'idle' | 'running' | 'paused' | 'completed';

function formatSeconds(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Render the puja ritual performance view.
 *
 * Displays step-by-step ritual flow with optional countdown timer.
 * Timed steps (durationSeconds !== null) auto-advance; open-ended steps
 * show a "Next Step" / "Complete" button instead.
 *
 * Returns a cleanup function that stops any running interval — must be
 * called before navigating away.
 */
export function renderPujaPerformView(
    container: HTMLElement,
    pujaId: string,
): () => void {
    const puja = getPujaById(pujaId);

    if (!puja) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <a href="#/practice/pujas" class="back-link">&larr; Pujas</a>
                <p>Puja not found: <strong>${pujaId}</strong></p>
            </div>`;
        return () => {};
    }

    const steps = [...puja.ritualSteps].sort((a, b) => a.order - b.order);

    if (steps.length === 0) {
        container.innerHTML = `
            <div class="page stack" role="main">
                <a href="#/practice/pujas" class="back-link">&larr; Pujas</a>
                <p>No ritual steps available.</p>
            </div>`;
        return () => {};
    }

    let state: PerformState = 'idle';
    let currentStepIndex = 0;
    let stepElapsed = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    container.innerHTML = `
        <div class="puja-perform-view page stack-lg" role="main">
            <a href="#/practice/pujas" class="back-link">&larr; Pujas</a>
            <header class="puja-perform__header stack-sm">
                <h1 class="puja-perform__title">${puja.title}</h1>
                <span class="badge">${puja.tradition}</span>
            </header>
            <div class="puja-perform__body stack-md">
                <p class="puja-perform__step-count" aria-live="polite"></p>
                <h2 class="puja-perform__step-title"></h2>
                <div class="puja-perform__instruction" aria-live="polite" aria-atomic="true">
                    <p class="puja-perform__instruction-text">${steps[0]!.instruction}</p>
                </div>
                <div class="puja-perform__timer" aria-live="polite">
                    <span class="puja-perform__time-display"></span>
                </div>
                <p class="puja-perform__status" aria-live="polite" aria-atomic="true"></p>
            </div>
            <div class="puja-perform__controls btn-group"></div>
        </div>`;

    const stepCountEl = container.querySelector<HTMLElement>(
        '.puja-perform__step-count',
    )!;
    const stepTitleEl = container.querySelector<HTMLElement>(
        '.puja-perform__step-title',
    )!;
    const instructionEl = container.querySelector<HTMLElement>(
        '.puja-perform__instruction-text',
    )!;
    const timeDisplayEl = container.querySelector<HTMLElement>(
        '.puja-perform__time-display',
    )!;
    const statusEl = container.querySelector<HTMLElement>('.puja-perform__status')!;
    const controlsEl = container.querySelector<HTMLElement>('.puja-perform__controls')!;

    function clearTimer(): void {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function enterStep(index: number): void {
        currentStepIndex = index;
        stepElapsed = 0;
        const step = steps[index]!;
        stepCountEl.textContent = `Step ${index + 1} of ${steps.length}`;
        stepTitleEl.textContent = step.title;
        instructionEl.textContent = step.instruction;
        if (step.durationSeconds !== null) {
            timeDisplayEl.textContent = formatSeconds(step.durationSeconds);
        } else {
            timeDisplayEl.textContent = '';
        }
        playBell();
    }

    function advanceStep(): void {
        clearTimer();
        const nextIndex = currentStepIndex + 1;
        if (nextIndex >= steps.length) {
            state = 'completed';
            statusEl.textContent = 'Puja complete. May all beings benefit.';
            timeDisplayEl.textContent = '';
            updateControls();
        } else {
            enterStep(nextIndex);
            startStepTimer();
            updateControls();
        }
    }

    function startStepTimer(): void {
        clearTimer();
        const currentStep = steps[currentStepIndex]!;
        if (currentStep.durationSeconds === null) {
            // open-ended step — no auto-advance
            return;
        }
        intervalId = setInterval(() => {
            stepElapsed++;
            const step = steps[currentStepIndex]!;
            if (step.durationSeconds !== null) {
                const remaining = Math.max(0, step.durationSeconds - stepElapsed);
                timeDisplayEl.textContent = formatSeconds(remaining);
                if (stepElapsed >= step.durationSeconds) {
                    advanceStep();
                }
            }
        }, 1000);
    }

    function updateControls(): void {
        const currentStep = steps[currentStepIndex]!;
        const isLastStep = currentStepIndex === steps.length - 1;
        const isUntimed = currentStep.durationSeconds === null;

        if (state === 'idle') {
            controlsEl.innerHTML = `<button class="btn btn-primary js-start" type="button">Begin</button>`;
        } else if (state === 'running') {
            if (isUntimed) {
                const label = isLastStep ? 'Complete' : 'Next Step';
                controlsEl.innerHTML = `
                    <button class="btn btn-primary js-next" type="button">${label}</button>
                    <button class="btn js-stop" type="button">Stop</button>`;
            } else {
                controlsEl.innerHTML = `
                    <button class="btn js-pause" type="button">Pause</button>
                    <button class="btn js-stop" type="button">Stop</button>`;
            }
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
                state = 'running';
                enterStep(0);
                startStepTimer();
                updateControls();
            });
        container
            .querySelector<HTMLButtonElement>('.js-pause')
            ?.addEventListener('click', () => {
                if (state !== 'running') return;
                clearTimer();
                state = 'paused';
                statusEl.textContent = 'Paused';
                updateControls();
            });
        container
            .querySelector<HTMLButtonElement>('.js-resume')
            ?.addEventListener('click', () => {
                if (state !== 'paused') return;
                void resumeAudioContext();
                state = 'running';
                statusEl.textContent = '';
                startStepTimer();
                updateControls();
            });
        container
            .querySelector<HTMLButtonElement>('.js-stop')
            ?.addEventListener('click', () => {
                if (state === 'idle' || state === 'completed') return;
                clearTimer();
                state = 'idle';
                currentStepIndex = 0;
                stepElapsed = 0;
                stepCountEl.textContent = '';
                stepTitleEl.textContent = '';
                instructionEl.textContent = steps[0]!.instruction;
                timeDisplayEl.textContent = '';
                statusEl.textContent = '';
                updateControls();
            });
        container
            .querySelector<HTMLButtonElement>('.js-next')
            ?.addEventListener('click', () => {
                if (currentStepIndex === steps.length - 1) {
                    state = 'completed';
                    statusEl.textContent = 'Puja complete. May all beings benefit.';
                    timeDisplayEl.textContent = '';
                    updateControls();
                } else {
                    enterStep(currentStepIndex + 1);
                    startStepTimer();
                    updateControls();
                }
            });
        container
            .querySelector<HTMLButtonElement>('.js-done')
            ?.addEventListener('click', () => {
                logPujaSession(pujaId);
                window.location.hash = '#/practice/pujas';
            });
    }

    updateControls();

    return () => clearTimer();
}
