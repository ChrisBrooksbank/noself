export type ReminderType = 'daily-prompt' | 'daily-concept' | 'meditation';

export interface ReminderPreferences {
    enabled: boolean;
    reminderHour: number;
    reminderMinute: number;
    reminderType: ReminderType;
    browserNotificationsEnabled: boolean;
    timezone: string;
}

const STORAGE_KEY = 'noself:reminderPreferences';

const DEFAULT_PREFERENCES: ReminderPreferences = {
    enabled: false,
    reminderHour: 9,
    reminderMinute: 0,
    reminderType: 'daily-prompt',
    browserNotificationsEnabled: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

function isReminderType(value: unknown): value is ReminderType {
    return (
        value === 'daily-prompt' || value === 'daily-concept' || value === 'meditation'
    );
}

function clampHour(value: unknown): number {
    const hour = Number(value);
    return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : 9;
}

function clampMinute(value: unknown): number {
    const minute = Number(value);
    return Number.isInteger(minute) && minute >= 0 && minute <= 59 ? minute : 0;
}

export function getReminderPreferences(): ReminderPreferences {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_PREFERENCES;

        const parsed = JSON.parse(raw) as Partial<ReminderPreferences>;
        return {
            enabled: parsed.enabled === true,
            reminderHour: clampHour(parsed.reminderHour),
            reminderMinute: clampMinute(parsed.reminderMinute),
            reminderType: isReminderType(parsed.reminderType)
                ? parsed.reminderType
                : 'daily-prompt',
            browserNotificationsEnabled: parsed.browserNotificationsEnabled === true,
            timezone:
                typeof parsed.timezone === 'string' && parsed.timezone
                    ? parsed.timezone
                    : DEFAULT_PREFERENCES.timezone,
        };
    } catch {
        return DEFAULT_PREFERENCES;
    }
}

export function setReminderPreferences(
    preferences: Partial<ReminderPreferences>,
): ReminderPreferences {
    const current = getReminderPreferences();
    const next: ReminderPreferences = {
        ...current,
        ...preferences,
        reminderHour:
            preferences.reminderHour === undefined
                ? current.reminderHour
                : clampHour(preferences.reminderHour),
        reminderMinute:
            preferences.reminderMinute === undefined
                ? current.reminderMinute
                : clampMinute(preferences.reminderMinute),
        reminderType:
            preferences.reminderType && isReminderType(preferences.reminderType)
                ? preferences.reminderType
                : current.reminderType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || current.timezone,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('noself:reminder-preferences-changed'));
    return next;
}

export function formatReminderTime(preferences: ReminderPreferences): string {
    const hour = String(preferences.reminderHour).padStart(2, '0');
    const minute = String(preferences.reminderMinute).padStart(2, '0');
    return `${hour}:${minute}`;
}

export function parseReminderTime(
    value: string,
): Pick<ReminderPreferences, 'reminderHour' | 'reminderMinute'> {
    const [hour = '9', minute = '0'] = value.split(':');
    return {
        reminderHour: clampHour(hour),
        reminderMinute: clampMinute(minute),
    };
}
