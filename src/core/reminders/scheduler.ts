import type { ReminderPreferences } from './preferences.js';

const LAST_SHOWN_KEY = 'noself:reminderLastShownDate';

function localDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getNextReminderDelayMs(
    preferences: ReminderPreferences,
    now: Date = new Date(),
): number {
    const next = new Date(now);
    next.setHours(preferences.reminderHour, preferences.reminderMinute, 0, 0);

    if (next.getTime() <= now.getTime()) {
        next.setDate(next.getDate() + 1);
    }

    return next.getTime() - now.getTime();
}

export function isReminderDue(
    preferences: ReminderPreferences,
    now: Date = new Date(),
): boolean {
    if (!preferences.enabled) return false;
    const lastShownDate = localStorage.getItem(LAST_SHOWN_KEY);
    const today = localDateKey(now);
    if (lastShownDate === today) return false;

    const reminderTime = new Date(now);
    reminderTime.setHours(preferences.reminderHour, preferences.reminderMinute, 0, 0);
    return now.getTime() >= reminderTime.getTime();
}

export function markReminderShown(now: Date = new Date()): void {
    localStorage.setItem(LAST_SHOWN_KEY, localDateKey(now));
}

export function resetReminderShownForTests(): void {
    localStorage.removeItem(LAST_SHOWN_KEY);
}
