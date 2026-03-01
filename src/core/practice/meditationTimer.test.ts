import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach,
    type MockInstance,
} from 'vitest';
import { createMeditationTimer } from './meditationTimer.js';
import type { MeditationTimer, TimerCallbacks } from './meditationTimer.js';
import type { MeditationStep } from '../../content/meditations/index.js';

const STEPS: MeditationStep[] = [
    { instruction: 'Settle in', durationSeconds: 10 },
    { instruction: 'Breathe', durationSeconds: 20 },
    { instruction: 'Close', durationSeconds: 5 },
];

const SINGLE_STEP: MeditationStep[] = [{ instruction: 'Just sit', durationSeconds: 3 }];

interface MockCallbacks {
    onStateChange: MockInstance;
    onStepChange: MockInstance;
    onTick: MockInstance;
    onBell: MockInstance;
}

function makeCallbacks(): MockCallbacks & TimerCallbacks {
    return {
        onStateChange: vi.fn(),
        onStepChange: vi.fn(),
        onTick: vi.fn(),
        onBell: vi.fn(),
    };
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe('createMeditationTimer — initial state', () => {
    it('starts in idle state', () => {
        const timer = createMeditationTimer(STEPS);
        expect(timer.getState()).toBe('idle');
    });

    it('throws if steps array is empty', () => {
        expect(() => createMeditationTimer([])).toThrow();
    });

    it('reports step index 0 before start', () => {
        const timer: MeditationTimer = createMeditationTimer(STEPS);
        expect(timer.getCurrentStepIndex()).toBe(0);
    });
});

describe('start()', () => {
    it('transitions to running', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        expect(timer.getState()).toBe('running');
        expect(cb.onStateChange).toHaveBeenCalledWith('running');
    });

    it('calls onStepChange for step 0 immediately', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        expect(cb.onStepChange).toHaveBeenCalledWith(0, STEPS[0]);
    });

    it('rings bell immediately on start', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        expect(cb.onBell).toHaveBeenCalledTimes(1);
    });

    it('is a no-op when already running', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.start();
        expect(cb.onStateChange).toHaveBeenCalledTimes(1);
    });
});

describe('pause() / resume()', () => {
    it('pause() transitions running → paused', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.pause();
        expect(timer.getState()).toBe('paused');
        expect(cb.onStateChange).toHaveBeenCalledWith('paused');
    });

    it('pause() is a no-op when idle', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.pause();
        expect(cb.onStateChange).not.toHaveBeenCalled();
    });

    it('resume() transitions paused → running', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.pause();
        timer.resume();
        expect(timer.getState()).toBe('running');
        expect(cb.onStateChange).toHaveBeenCalledWith('running');
    });

    it('resume() is a no-op when idle', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.resume();
        expect(cb.onStateChange).not.toHaveBeenCalled();
    });

    it('ticks stop while paused', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.pause();
        vi.advanceTimersByTime(5000);
        expect(cb.onTick).not.toHaveBeenCalled();
    });

    it('ticks resume after resume()', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.pause();
        timer.resume();
        vi.advanceTimersByTime(3000);
        expect(cb.onTick).toHaveBeenCalledTimes(3);
    });
});

describe('stop()', () => {
    it('transitions running → idle', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.stop();
        expect(timer.getState()).toBe('idle');
        expect(cb.onStateChange).toHaveBeenCalledWith('idle');
    });

    it('transitions paused → idle', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.pause();
        timer.stop();
        expect(timer.getState()).toBe('idle');
    });

    it('is a no-op when already idle', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.stop();
        expect(cb.onStateChange).not.toHaveBeenCalled();
    });

    it('resets step index to 0', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(11000); // complete step 0 (10s)
        expect(timer.getCurrentStepIndex()).toBe(1);
        timer.stop();
        expect(timer.getCurrentStepIndex()).toBe(0);
    });

    it('stops ticks after stop()', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.stop();
        vi.advanceTimersByTime(5000);
        expect(cb.onTick).not.toHaveBeenCalled();
    });
});

describe('tick progression', () => {
    it('calls onTick each second', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(3000);
        expect(cb.onTick).toHaveBeenCalledTimes(3);
    });

    it('provides correct stepElapsed and stepRemaining values', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(1000);
        // step 0 has durationSeconds: 10
        expect(cb.onTick).toHaveBeenLastCalledWith(1, 9, 1);
    });

    it('provides totalElapsed across steps', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(11000); // step 0 completes at 10s; at 11s we're on step 1
        const lastCall = cb.onTick.mock.calls.at(-1)!;
        expect(lastCall[2]).toBe(11); // totalElapsed
    });
});

describe('step advancement', () => {
    it('advances to step 1 after step 0 completes', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(10000); // exhaust step 0 (10s)
        expect(timer.getCurrentStepIndex()).toBe(1);
    });

    it('calls onStepChange on advancement', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(10000);
        // called for step 0 on start + step 1 on advance
        expect(cb.onStepChange).toHaveBeenCalledTimes(2);
        expect(cb.onStepChange).toHaveBeenNthCalledWith(2, 1, STEPS[1]);
    });

    it('rings bell on each step transition', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(10000); // step 0 → step 1
        expect(cb.onBell).toHaveBeenCalledTimes(2); // once on start, once on transition
    });

    it('resets stepElapsed to 0 at new step', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        vi.advanceTimersByTime(11000); // step 0 done, 1s into step 1
        const lastCall = cb.onTick.mock.calls.at(-1)!;
        expect(lastCall[0]).toBe(1); // stepElapsed restarted
        expect(lastCall[1]).toBe(19); // stepRemaining = 20 - 1
    });
});

describe('completion', () => {
    it('transitions to completed after last step finishes', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(SINGLE_STEP, cb);
        timer.start();
        vi.advanceTimersByTime(3000);
        expect(timer.getState()).toBe('completed');
        expect(cb.onStateChange).toHaveBeenCalledWith('completed');
    });

    it('stops ticking after completion', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(SINGLE_STEP, cb);
        timer.start();
        vi.advanceTimersByTime(3000);
        const tickCountAtCompletion = cb.onTick.mock.calls.length;
        vi.advanceTimersByTime(3000);
        expect(cb.onTick).toHaveBeenCalledTimes(tickCountAtCompletion);
    });

    it('completes after all steps across multi-step session', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        const totalSeconds = STEPS.reduce((sum, s) => sum + s.durationSeconds, 0);
        vi.advanceTimersByTime(totalSeconds * 1000);
        expect(timer.getState()).toBe('completed');
    });

    it('stop() is a no-op when completed', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(SINGLE_STEP, cb);
        timer.start();
        vi.advanceTimersByTime(3000);
        // clear prior calls
        vi.clearAllMocks();
        timer.stop();
        expect(cb.onStateChange).not.toHaveBeenCalled();
    });
});

describe('cleanup()', () => {
    it('stops ticking without changing state', () => {
        const cb = makeCallbacks();
        const timer = createMeditationTimer(STEPS, cb);
        timer.start();
        timer.cleanup();
        vi.advanceTimersByTime(5000);
        expect(cb.onTick).not.toHaveBeenCalled();
        // state is still 'running' — cleanup is a raw interval clear
        expect(timer.getState()).toBe('running');
    });

    it('is safe to call multiple times', () => {
        const timer = createMeditationTimer(STEPS);
        timer.cleanup();
        timer.cleanup();
        expect(timer.getState()).toBe('idle');
    });
});
