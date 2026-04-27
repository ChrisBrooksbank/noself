import { beforeEach, describe, expect, it } from 'vitest';
import type { ReminderPreferences } from './preferences.js';
import {
    getNextReminderDelayMs,
    isReminderDue,
    markReminderShown,
    resetReminderShownForTests,
} from './scheduler.js';

const preferences: ReminderPreferences = {
    enabled: true,
    reminderHour: 9,
    reminderMinute: 30,
    reminderType: 'daily-prompt',
    browserNotificationsEnabled: false,
    timezone: 'Europe/London',
};

beforeEach(() => {
    localStorage.clear();
    resetReminderShownForTests();
});

describe('getNextReminderDelayMs', () => {
    it('returns delay for later today', () => {
        expect(getNextReminderDelayMs(preferences, new Date('2024-01-01T09:00:00'))).toBe(
            30 * 60 * 1000,
        );
    });

    it('rolls over to tomorrow after reminder time', () => {
        expect(getNextReminderDelayMs(preferences, new Date('2024-01-01T10:30:00'))).toBe(
            23 * 60 * 60 * 1000,
        );
    });
});

describe('isReminderDue', () => {
    it('is false when reminders are disabled', () => {
        expect(
            isReminderDue(
                { ...preferences, enabled: false },
                new Date('2024-01-01T10:00:00'),
            ),
        ).toBe(false);
    });

    it('is false before reminder time', () => {
        expect(isReminderDue(preferences, new Date('2024-01-01T09:00:00'))).toBe(false);
    });

    it('is true after reminder time', () => {
        expect(isReminderDue(preferences, new Date('2024-01-01T09:31:00'))).toBe(true);
    });

    it('is false after the reminder was already shown today', () => {
        markReminderShown(new Date('2024-01-01T09:31:00'));
        expect(isReminderDue(preferences, new Date('2024-01-01T10:00:00'))).toBe(false);
    });
});
