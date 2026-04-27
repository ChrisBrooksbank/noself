import { hasPracticedToday } from '../practiceHistory.js';
import { getReminderPreferences } from './preferences.js';
import { getNextReminderDelayMs, isReminderDue, markReminderShown } from './scheduler.js';
import { showPracticeNotification } from './notifications.js';

let timeoutId: number | null = null;

function reminderText(): string {
    const preferences = getReminderPreferences();
    if (preferences.reminderType === 'daily-concept') {
        return "Today's concept is ready.";
    }
    if (preferences.reminderType === 'meditation') {
        return 'A quiet minute is available now.';
    }
    return "Today's contemplation is ready.";
}

function reminderHref(): string {
    const preferences = getReminderPreferences();
    if (preferences.reminderType === 'daily-concept') return '#/';
    if (preferences.reminderType === 'meditation') return '#/practice/meditate';
    return '#/practice/prompts';
}

function removeExistingBanner(): void {
    document.querySelector('.practice-reminder-banner')?.remove();
}

function showBanner(): void {
    removeExistingBanner();
    const banner = document.createElement('div');
    banner.className = 'practice-reminder-banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = `
        <span class="practice-reminder-banner__text">${reminderText()}</span>
        <a class="practice-reminder-banner__link" href="${reminderHref()}">Open</a>
        <button class="practice-reminder-banner__dismiss" type="button" aria-label="Dismiss reminder">&times;</button>`;

    banner
        .querySelector('.practice-reminder-banner__dismiss')
        ?.addEventListener('click', () => banner.remove());

    document.body.append(banner);
}

function handleDueReminder(): void {
    const preferences = getReminderPreferences();
    if (!isReminderDue(preferences) || hasPracticedToday()) return;

    const didNotify = showPracticeNotification(preferences.reminderType);
    if (!didNotify) showBanner();
    markReminderShown();
}

function scheduleNext(): void {
    const preferences = getReminderPreferences();
    if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
    }

    removeExistingBanner();
    if (!preferences.enabled) return;

    handleDueReminder();
    timeoutId = window.setTimeout(() => {
        handleDueReminder();
        scheduleNext();
    }, getNextReminderDelayMs(preferences));
}

export function initEngagementReminders(): () => void {
    scheduleNext();
    window.addEventListener('noself:reminder-preferences-changed', scheduleNext);

    return () => {
        if (timeoutId !== null) window.clearTimeout(timeoutId);
        window.removeEventListener('noself:reminder-preferences-changed', scheduleNext);
        removeExistingBanner();
    };
}
