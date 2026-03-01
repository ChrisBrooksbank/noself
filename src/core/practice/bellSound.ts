/**
 * Bell sound generator using Web Audio API.
 * Creates a ~800 Hz sine wave + harmonic with exponential gain ramp-down.
 * AudioContext is created lazily on first use to comply with browser autoplay policy.
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
}

/**
 * Plays a bell tone (~800 Hz fundamental + 1600 Hz harmonic).
 * Duration of audible ring: ~3 seconds.
 */
export function playBell(): void {
    const ctx = getAudioContext();

    const now = ctx.currentTime;
    const duration = 3;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    gainNode.connect(ctx.destination);

    const fundamental = ctx.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(800, now);
    fundamental.connect(gainNode);
    fundamental.start(now);
    fundamental.stop(now + duration);

    const harmonic = ctx.createOscillator();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(1600, now);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.15, now);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(gainNode);
    harmonic.start(now);
    harmonic.stop(now + duration);
}

/**
 * Resumes the AudioContext if it was suspended (required after user interaction on some browsers).
 */
export async function resumeAudioContext(): Promise<void> {
    if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
    }
}

/**
 * Returns the current AudioContext state, or 'closed' if not yet created.
 */
export function getAudioContextState(): AudioContextState | 'uninitialized' {
    return audioContext ? audioContext.state : 'uninitialized';
}

/** Exposed for testing only — resets the module-level AudioContext. */
export function _resetAudioContext(): void {
    audioContext = null;
}
