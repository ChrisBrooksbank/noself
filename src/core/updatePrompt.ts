import { registerSW } from 'virtual:pwa-register';

export function initUpdatePrompt(container: HTMLElement): void {
    registerSW({
        immediate: true,
        onRegisteredSW(_swUrl, registration) {
            registration?.update().catch(() => {});
        },
        onNeedRefresh() {
            window.location.reload();
        },
        onOfflineReady() {
            container.innerHTML = '';
        },
    });
}
