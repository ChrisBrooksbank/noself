import { registerSW } from 'virtual:pwa-register';

export function initUpdatePrompt(container: HTMLElement): void {
    const updateSW = registerSW({
        onNeedRefresh() {
            container.innerHTML = `
                <div class="update-banner" role="alert">
                    <p class="update-banner__text">A new version is available.</p>
                    <div class="update-banner__actions">
                        <button class="btn btn-primary update-banner__reload" type="button">Update</button>
                        <button class="btn update-banner__dismiss" type="button">Later</button>
                    </div>
                </div>`;

            container
                .querySelector('.update-banner__reload')
                ?.addEventListener('click', () => updateSW(true));

            container
                .querySelector('.update-banner__dismiss')
                ?.addEventListener('click', () => {
                    container.innerHTML = '';
                });
        },
    });
}
