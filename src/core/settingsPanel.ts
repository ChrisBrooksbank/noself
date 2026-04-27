import {
    getTheme,
    setTheme,
    getFontSize,
    setFontSize,
    getExpertiseLevel,
    setExpertiseLevel,
    getShowVideoLinks,
    setShowVideoLinks,
    type Theme,
    type FontSize,
    type ExpertiseLevel,
} from './preferences.js';
import {
    formatReminderTime,
    getReminderPreferences,
    parseReminderTime,
    setReminderPreferences,
    type ReminderType,
} from './reminders/preferences.js';
import {
    getNotificationPermission,
    requestNotificationPermission,
    subscribeToPushReminders,
    unsubscribeFromPushReminders,
} from './reminders/notifications.js';

let panelEl: HTMLElement | null = null;
let isOpen = false;

function buildPanel(): string {
    const theme = getTheme();
    const fontSize = getFontSize();
    const expertiseLevel = getExpertiseLevel();
    const showVideoLinks = getShowVideoLinks();
    const reminders = getReminderPreferences();
    const notificationPermission = getNotificationPermission();

    const themeOptions: { value: Theme; label: string }[] = [
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
        { value: 'auto', label: 'System' },
    ];

    const fontOptions: { value: FontSize; label: string }[] = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
    ];

    const expertiseOptions: { value: ExpertiseLevel; label: string; desc: string }[] = [
        {
            value: 1,
            label: 'Exploring',
            desc: 'Simple introductions, beginner meditations',
        },
        { value: 2, label: 'Deepening', desc: 'Fuller teachings, sutras, and mantras' },
        {
            value: 3,
            label: 'Immersed',
            desc: 'Everything, including pujas and original texts',
        },
    ];

    const themeRadios = themeOptions
        .map(
            (opt) => `
        <label class="settings-panel__option">
            <input type="radio" name="theme" value="${opt.value}"${opt.value === theme ? ' checked' : ''}>
            <span class="settings-panel__option-label">${opt.label}</span>
        </label>`,
        )
        .join('');

    const fontRadios = fontOptions
        .map(
            (opt) => `
        <label class="settings-panel__option">
            <input type="radio" name="fontSize" value="${opt.value}"${opt.value === fontSize ? ' checked' : ''}>
            <span class="settings-panel__option-label">${opt.label}</span>
        </label>`,
        )
        .join('');

    const expertiseRadios = expertiseOptions
        .map(
            (opt) => `
        <label class="settings-panel__option">
            <input type="radio" name="expertiseLevel" value="${opt.value}"${opt.value === expertiseLevel ? ' checked' : ''}>
            <span class="settings-panel__option-label">${opt.label}</span>
            <span class="settings-panel__option-desc">${opt.desc}</span>
        </label>`,
        )
        .join('');

    const notificationText =
        notificationPermission === 'granted'
            ? 'Browser notifications allowed'
            : notificationPermission === 'denied'
              ? 'Browser notifications blocked in this browser'
              : notificationPermission === 'unsupported'
                ? 'Browser notifications unavailable'
                : 'Browser notifications optional';

    return `
        <div class="settings-panel" role="dialog" aria-label="Accessibility settings">
            <div class="settings-panel__inner">
                <div class="settings-panel__header">
                    <h2 class="settings-panel__title">Settings</h2>
                    <button class="settings-panel__close" aria-label="Close settings">&times;</button>
                </div>
                <div class="settings-panel__sections">
                    <fieldset class="settings-panel__fieldset">
                        <legend class="settings-panel__legend">Experience</legend>
                        <div class="settings-panel__options settings-panel__options--stacked">${expertiseRadios}</div>
                    </fieldset>
                    <fieldset class="settings-panel__fieldset">
                        <legend class="settings-panel__legend">Theme</legend>
                        <div class="settings-panel__options">${themeRadios}</div>
                    </fieldset>
                    <fieldset class="settings-panel__fieldset">
                        <legend class="settings-panel__legend">Text Size</legend>
                        <div class="settings-panel__options">${fontRadios}</div>
                    </fieldset>
                    <fieldset class="settings-panel__fieldset settings-panel__fieldset--inline">
                        <label class="settings-panel__toggle">
                            <input type="checkbox" name="showVideoLinks"${showVideoLinks ? ' checked' : ''}>
                            <span class="settings-panel__toggle-label">Show video links</span>
                        </label>
                    </fieldset>
                    <fieldset class="settings-panel__fieldset settings-panel__fieldset--reminders">
                        <legend class="settings-panel__legend">Reminders</legend>
                        <label class="settings-panel__toggle">
                            <input type="checkbox" name="remindersEnabled"${reminders.enabled ? ' checked' : ''}>
                            <span class="settings-panel__toggle-label">Daily reminder</span>
                        </label>
                        <label class="settings-panel__field">
                            <span class="settings-panel__field-label">Time</span>
                            <input class="settings-panel__time" type="time" name="reminderTime" value="${formatReminderTime(reminders)}">
                        </label>
                        <label class="settings-panel__field">
                            <span class="settings-panel__field-label">Focus</span>
                            <select class="settings-panel__select" name="reminderType">
                                <option value="daily-prompt"${reminders.reminderType === 'daily-prompt' ? ' selected' : ''}>Daily prompt</option>
                                <option value="daily-concept"${reminders.reminderType === 'daily-concept' ? ' selected' : ''}>Daily concept</option>
                                <option value="meditation"${reminders.reminderType === 'meditation' ? ' selected' : ''}>Meditation</option>
                            </select>
                        </label>
                        <p class="settings-panel__hint">${notificationText}</p>
                        <div class="settings-panel__actions">
                            <button class="btn btn--sm settings-panel__notify-btn" type="button">Allow browser notifications</button>
                            <button class="btn btn--sm settings-panel__push-btn" type="button">Sync push reminder</button>
                            <button class="btn btn--sm settings-panel__push-off-btn" type="button">Turn off push</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>`;
}

function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isOpen) {
        closePanel();
    }
}

function closePanel(): void {
    if (!panelEl) return;
    const panel = panelEl.querySelector<HTMLElement>('.settings-panel');
    if (panel) panel.classList.remove('settings-panel--open');
    isOpen = false;
    updateToggleButton();
    document.removeEventListener('keydown', handleKeydown);
}

function openPanel(): void {
    if (!panelEl) return;

    panelEl.innerHTML = buildPanel();
    bindPanelEvents();

    const panel = panelEl.querySelector<HTMLElement>('.settings-panel');
    if (panel) {
        // Force reflow so the transition plays
        void panel.offsetHeight;
        panel.classList.add('settings-panel--open');
    }
    isOpen = true;
    updateToggleButton();
    document.addEventListener('keydown', handleKeydown);
}

function bindPanelEvents(): void {
    if (!panelEl) return;

    const closeBtn = panelEl.querySelector<HTMLElement>('.settings-panel__close');
    closeBtn?.addEventListener('click', closePanel);

    panelEl.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
        input.addEventListener('change', () => {
            setTheme(input.value as Theme);
        });
    });

    panelEl
        .querySelectorAll<HTMLInputElement>('input[name="fontSize"]')
        .forEach((input) => {
            input.addEventListener('change', () => {
                setFontSize(input.value as FontSize);
            });
        });

    panelEl
        .querySelectorAll<HTMLInputElement>('input[name="expertiseLevel"]')
        .forEach((input) => {
            input.addEventListener('change', () => {
                setExpertiseLevel(Number(input.value) as ExpertiseLevel);
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            });
        });

    const videoCheckbox = panelEl.querySelector<HTMLInputElement>(
        'input[name="showVideoLinks"]',
    );
    videoCheckbox?.addEventListener('change', () => {
        setShowVideoLinks(videoCheckbox.checked);
    });

    const remindersEnabled = panelEl.querySelector<HTMLInputElement>(
        'input[name="remindersEnabled"]',
    );
    remindersEnabled?.addEventListener('change', () => {
        setReminderPreferences({ enabled: remindersEnabled.checked });
    });

    const reminderTime = panelEl.querySelector<HTMLInputElement>(
        'input[name="reminderTime"]',
    );
    reminderTime?.addEventListener('change', () => {
        setReminderPreferences(parseReminderTime(reminderTime.value));
    });

    const reminderType = panelEl.querySelector<HTMLSelectElement>(
        'select[name="reminderType"]',
    );
    reminderType?.addEventListener('change', () => {
        setReminderPreferences({ reminderType: reminderType.value as ReminderType });
    });

    panelEl
        .querySelector<HTMLButtonElement>('.settings-panel__notify-btn')
        ?.addEventListener('click', async () => {
            await requestNotificationPermission();
            openPanel();
        });

    panelEl
        .querySelector<HTMLButtonElement>('.settings-panel__push-btn')
        ?.addEventListener('click', async () => {
            await subscribeToPushReminders();
            openPanel();
        });

    panelEl
        .querySelector<HTMLButtonElement>('.settings-panel__push-off-btn')
        ?.addEventListener('click', async () => {
            await unsubscribeFromPushReminders();
            openPanel();
        });
}

function updateToggleButton(): void {
    const btn = document.querySelector<HTMLElement>('.site-nav__settings-btn');
    if (btn) btn.setAttribute('aria-expanded', String(isOpen));
}

export function toggleSettings(): void {
    if (isOpen) {
        closePanel();
    } else {
        openPanel();
    }
}

export function initSettingsPanel(host: HTMLElement): void {
    panelEl = host;
}
