import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    playBell,
    resumeAudioContext,
    getAudioContextState,
    _resetAudioContext,
} from './bellSound.js';

// Mock AudioContext
function makeMockOscillator() {
    return {
        type: 'sine' as OscillatorType,
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
    };
}

function makeMockGain() {
    const gainNode = {
        gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
    };
    return gainNode;
}

function makeMockAudioContext(state: AudioContextState = 'running') {
    return {
        state,
        currentTime: 0,
        destination: {},
        createOscillator: vi.fn(() => makeMockOscillator()),
        createGain: vi.fn(() => makeMockGain()),
        resume: vi.fn().mockResolvedValue(undefined),
    };
}

let mockCtx: ReturnType<typeof makeMockAudioContext>;

beforeEach(() => {
    _resetAudioContext();
    mockCtx = makeMockAudioContext();
    vi.stubGlobal(
        'AudioContext',
        vi.fn(() => mockCtx),
    );
});

describe('playBell', () => {
    it('creates an AudioContext on first call', () => {
        expect(getAudioContextState()).toBe('uninitialized');
        playBell();
        expect(AudioContext).toHaveBeenCalledTimes(1);
    });

    it('reuses the same AudioContext on subsequent calls', () => {
        playBell();
        playBell();
        expect(AudioContext).toHaveBeenCalledTimes(1);
    });

    it('creates two oscillators (fundamental + harmonic)', () => {
        playBell();
        expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
    });

    it('sets fundamental frequency to ~800 Hz', () => {
        playBell();
        const osc1 = mockCtx.createOscillator.mock.results[0]!.value as ReturnType<
            typeof makeMockOscillator
        >;
        expect(osc1.frequency.setValueAtTime).toHaveBeenCalledWith(800, 0);
    });

    it('sets harmonic frequency to ~1600 Hz', () => {
        playBell();
        const osc2 = mockCtx.createOscillator.mock.results[1]!.value as ReturnType<
            typeof makeMockOscillator
        >;
        expect(osc2.frequency.setValueAtTime).toHaveBeenCalledWith(1600, 0);
    });

    it('schedules oscillators to start and stop', () => {
        playBell();
        const osc1 = mockCtx.createOscillator.mock.results[0]!.value as ReturnType<
            typeof makeMockOscillator
        >;
        expect(osc1.start).toHaveBeenCalled();
        expect(osc1.stop).toHaveBeenCalled();
    });

    it('applies exponential gain ramp-down on main gain node', () => {
        playBell();
        const gain = mockCtx.createGain.mock.results[0]!.value as ReturnType<
            typeof makeMockGain
        >;
        expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
    });

    it('connects gain to destination', () => {
        playBell();
        const gain = mockCtx.createGain.mock.results[0]!.value as ReturnType<
            typeof makeMockGain
        >;
        expect(gain.connect).toHaveBeenCalledWith(mockCtx.destination);
    });
});

describe('resumeAudioContext', () => {
    it('does nothing if AudioContext has not been created', async () => {
        await resumeAudioContext();
        expect(mockCtx.resume).not.toHaveBeenCalled();
    });

    it('calls resume when AudioContext is suspended', async () => {
        mockCtx = makeMockAudioContext('suspended');
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => mockCtx),
        );
        playBell();
        await resumeAudioContext();
        expect(mockCtx.resume).toHaveBeenCalledTimes(1);
    });

    it('does not call resume when AudioContext is already running', async () => {
        playBell();
        await resumeAudioContext();
        expect(mockCtx.resume).not.toHaveBeenCalled();
    });
});

describe('getAudioContextState', () => {
    it('returns "uninitialized" before first playBell call', () => {
        expect(getAudioContextState()).toBe('uninitialized');
    });

    it('returns the AudioContext state after playBell call', () => {
        playBell();
        expect(getAudioContextState()).toBe('running');
    });
});
