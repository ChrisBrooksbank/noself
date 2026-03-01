/**
 * Meditation timer state machine.
 *
 * States: idle → running → paused → completed
 *
 * Advances through an ordered array of MeditationStep objects, calling
 * callbacks on each tick, step transition, state change, and session end.
 * A bell callback fires at the start of each new step (including the first).
 */

import type { MeditationStep } from '../../content/meditations/index.js';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerCallbacks {
    /** Called whenever the timer state changes. */
    onStateChange?: (state: TimerState) => void;
    /** Called at the start of each step (index + step data). Fires for step 0 on start(). */
    onStepChange?: (stepIndex: number, step: MeditationStep) => void;
    /** Called every second with elapsed seconds within the current step, remaining seconds in the
     * step, and total elapsed seconds for the session. */
    onTick?: (stepElapsed: number, stepRemaining: number, totalElapsed: number) => void;
    /** Called at each step transition — use this to ring a bell. */
    onBell?: () => void;
}

export interface MeditationTimer {
    /** Start a fresh session from step 0. No-op if already running or completed. */
    start(): void;
    /** Pause a running session. No-op unless running. */
    pause(): void;
    /** Resume a paused session. No-op unless paused. */
    resume(): void;
    /** Stop and reset to idle. No-op if already idle or completed. */
    stop(): void;
    /** Return current state. */
    getState(): TimerState;
    /** Return index of the current step (0-based). */
    getCurrentStepIndex(): number;
    /** Stop any active interval — safe to call at any time (e.g. on navigation). */
    cleanup(): void;
}

/**
 * Create a new meditation timer for the given step sequence.
 *
 * @param steps   Ordered step list (must be non-empty).
 * @param callbacks  Optional event handlers.
 */
export function createMeditationTimer(
    steps: MeditationStep[],
    callbacks: TimerCallbacks = {},
): MeditationTimer {
    if (steps.length === 0) {
        throw new Error('createMeditationTimer: steps array must not be empty');
    }

    let state: TimerState = 'idle';
    let currentStepIndex = 0;
    let stepElapsed = 0;
    let totalElapsed = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    function setState(next: TimerState): void {
        state = next;
        callbacks.onStateChange?.(next);
    }

    function clearTimer(): void {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function enterStep(index: number): void {
        currentStepIndex = index;
        stepElapsed = 0;
        callbacks.onBell?.();
        callbacks.onStepChange?.(index, steps[index]!);
    }

    function tick(): void {
        stepElapsed++;
        totalElapsed++;

        const currentStep = steps[currentStepIndex]!;
        const stepRemaining = Math.max(0, currentStep.durationSeconds - stepElapsed);
        callbacks.onTick?.(stepElapsed, stepRemaining, totalElapsed);

        if (stepElapsed >= currentStep.durationSeconds) {
            const nextIndex = currentStepIndex + 1;
            if (nextIndex >= steps.length) {
                clearTimer();
                setState('completed');
            } else {
                enterStep(nextIndex);
            }
        }
    }

    return {
        start() {
            if (state !== 'idle') return;
            currentStepIndex = 0;
            stepElapsed = 0;
            totalElapsed = 0;
            setState('running');
            enterStep(0);
            intervalId = setInterval(tick, 1000);
        },

        pause() {
            if (state !== 'running') return;
            clearTimer();
            setState('paused');
        },

        resume() {
            if (state !== 'paused') return;
            setState('running');
            intervalId = setInterval(tick, 1000);
        },

        stop() {
            if (state === 'idle' || state === 'completed') return;
            clearTimer();
            currentStepIndex = 0;
            stepElapsed = 0;
            totalElapsed = 0;
            setState('idle');
        },

        getState() {
            return state;
        },

        getCurrentStepIndex() {
            return currentStepIndex;
        },

        cleanup() {
            clearTimer();
        },
    };
}
