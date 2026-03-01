import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initInstallPrompt } from './installPrompt.js';

const DISMISSED_KEY = 'noself:install-dismissed';

function makePromptEvent(): Event & {
    prompt: ReturnType<typeof vi.fn>;
    userChoice: Promise<{ outcome: string }>;
} {
    const userChoice = Promise.resolve({ outcome: 'accepted' as const });
    const event = Object.assign(new Event('beforeinstallprompt'), {
        prompt: vi.fn().mockResolvedValue(undefined),
        userChoice,
    });
    return event;
}

describe('initInstallPrompt', () => {
    let container: HTMLElement;
    let cleanup: () => void;

    beforeEach(() => {
        container = document.createElement('div');
        localStorage.removeItem(DISMISSED_KEY);
    });

    afterEach(() => {
        cleanup?.();
        localStorage.removeItem(DISMISSED_KEY);
        vi.restoreAllMocks();
    });

    it('renders nothing before beforeinstallprompt fires', () => {
        cleanup = initInstallPrompt(container);
        expect(container.innerHTML.trim()).toBe('');
    });

    it('shows banner when beforeinstallprompt fires', () => {
        cleanup = initInstallPrompt(container);
        window.dispatchEvent(makePromptEvent());
        expect(container.querySelector('.install-banner')).not.toBeNull();
    });

    it('banner contains Install and Not now buttons', () => {
        cleanup = initInstallPrompt(container);
        window.dispatchEvent(makePromptEvent());
        expect(container.querySelector('.install-banner__install')).not.toBeNull();
        expect(container.querySelector('.install-banner__dismiss')).not.toBeNull();
    });

    it('dismiss button clears banner and sets localStorage flag', () => {
        cleanup = initInstallPrompt(container);
        window.dispatchEvent(makePromptEvent());
        const dismissBtn = container.querySelector<HTMLButtonElement>(
            '.install-banner__dismiss',
        );
        expect(dismissBtn).not.toBeNull();
        dismissBtn!.click();
        expect(container.innerHTML.trim()).toBe('');
        expect(localStorage.getItem(DISMISSED_KEY)).toBe('1');
    });

    it('does not show banner if already dismissed', () => {
        localStorage.setItem(DISMISSED_KEY, '1');
        cleanup = initInstallPrompt(container);
        window.dispatchEvent(makePromptEvent());
        expect(container.querySelector('.install-banner')).toBeNull();
    });

    it('install button calls prompt() on the deferred event', async () => {
        cleanup = initInstallPrompt(container);
        const event = makePromptEvent();
        window.dispatchEvent(event);
        const installBtn = container.querySelector<HTMLButtonElement>(
            '.install-banner__install',
        );
        installBtn!.click();
        await vi.waitFor(() => expect(event.prompt).toHaveBeenCalledOnce());
    });

    it('install button dismisses banner after accepted outcome', async () => {
        cleanup = initInstallPrompt(container);
        window.dispatchEvent(makePromptEvent());
        const installBtn = container.querySelector<HTMLButtonElement>(
            '.install-banner__install',
        );
        installBtn!.click();
        await vi.waitFor(() => expect(container.innerHTML.trim()).toBe(''));
        expect(localStorage.getItem(DISMISSED_KEY)).toBe('1');
    });

    it('cleanup function removes event listener so banner no longer appears', () => {
        cleanup = initInstallPrompt(container);
        cleanup();
        window.dispatchEvent(makePromptEvent());
        expect(container.querySelector('.install-banner')).toBeNull();
    });
});
