const DISMISSED_KEY = 'noself:install-dismissed';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function initInstallPrompt(container: HTMLElement): () => void {
    if (localStorage.getItem(DISMISSED_KEY)) return () => {};

    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    function dismiss(): void {
        localStorage.setItem(DISMISSED_KEY, '1');
        container.innerHTML = '';
    }

    function showBanner(): void {
        container.innerHTML = `
            <div class="install-banner" role="complementary" aria-label="Install app">
                <p class="install-banner__text">Add noself to your home screen for offline access.</p>
                <div class="install-banner__actions">
                    <button class="btn btn-primary install-banner__install" type="button">Install</button>
                    <button class="btn install-banner__dismiss" type="button">Not now</button>
                </div>
            </div>`;

        container
            .querySelector('.install-banner__install')
            ?.addEventListener('click', async () => {
                if (deferredPrompt) {
                    await deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    deferredPrompt = null;
                    if (outcome === 'accepted') {
                        dismiss();
                    }
                }
            });

        container
            .querySelector('.install-banner__dismiss')
            ?.addEventListener('click', dismiss);
    }

    function onBeforeInstallPrompt(e: Event): void {
        e.preventDefault();
        deferredPrompt = e as BeforeInstallPromptEvent;
        showBanner();
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
}
