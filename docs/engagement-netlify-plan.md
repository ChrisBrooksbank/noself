# Netlify Engagement Plan

## Goal

Keep users gently engaged with daily Buddhist practice while staying Netlify-native.
Avoid a traditional always-on backend. Use local-first behavior by default, then add
Netlify Functions, Scheduled Functions, and Blobs only where true background
notifications require server-side support.

## Product Principles

- Opt-in, never manipulative.
- Reminders should feel like invitations, not alarms.
- Practice continuity matters more than streak pressure.
- Work offline wherever possible.
- Store the least user data needed for each feature.
- Build useful engagement even before push notifications exist.

## Current App Fit

The app already has the main ingredients:

- PWA installability and service worker configuration in `vite.config.ts`.
- Daily concept rotation in `src/core/dailyConcept.ts`.
- Daily prompts in `src/core/practice/dailyPrompt.ts`.
- Local practice history in `src/core/practiceHistory.ts`.
- Netlify deployment configuration in `netlify.toml`.

## Phase 1: Local-First Engagement

No Netlify Functions required.

### Features

- Daily practice state:
    - Detect whether the user has completed any practice today.
    - Count prompt, meditation, puja, mantra, and path-session activity.
    - Expose `hasPracticedToday`, `getLastPracticeDate`, `getCurrentStreak`, and
      `getLongestStreak` helpers.

- Home and practice nudges:
    - Show today's prompt or concept when there is no activity yet today.
    - Show a subtle completion state after practice.
    - Show streak and total-session summaries on the practice hub.

- Return-user cue:
    - If the user returns after several inactive days, show a gentle "begin again"
      message instead of a failure state.

- Install nudge:
    - Keep existing install prompt behavior, but connect it to the practice value:
      installed app, daily reflection, offline access.

### Implementation Notes

- Extend `src/core/practiceHistory.ts` with date aggregation helpers.
- Add tests in `src/core/practiceHistory.test.ts`.
- Update `src/core/homeView.ts` and `src/core/practice/practiceHubView.ts`.
- Store all state in existing `noself:practiceHistory` localStorage data.

### Acceptance Criteria

- User can see whether they practiced today.
- User can see current streak and total sessions.
- Missing a day does not create harsh or shaming UI.
- Works fully offline.

## Phase 2: Reminder Preferences Without Push

Still no Netlify Functions required.

### Features

- Reminder settings panel:
    - Enable/disable reminders.
    - Preferred local time.
    - Preferred reminder style: daily concept, daily prompt, meditation.

- In-app reminders:
    - When the app is open, schedule an in-memory timer for the next reminder time.
    - If the app opens after the reminder time and no practice is logged, show a
      quiet in-app banner.

- Browser notification permission primer:
    - Explain that notifications are optional.
    - Do not request browser permission on page load.
    - Request only after a user action.

### Implementation Notes

- Add `src/core/reminders/preferences.ts`.
- Add `src/core/reminders/inAppReminder.ts`.
- Add tests for time calculations.
- Add settings UI to `src/core/settingsPanel.ts`.

### Acceptance Criteria

- User can configure reminder preferences.
- In-app reminders work without network.
- No browser permission prompt appears until the user explicitly asks.

## Phase 3: Local Notifications While App Is Open

Still no server storage.

### Features

- Use the Web Notifications API when permission is granted.
- Fire notifications only while the PWA page is open or recently active.
- Notification click opens:
    - `#/practice/prompts` for daily prompts.
    - `#/concept/:id` for daily concepts.

### Limits

This phase does not deliver reliable notifications when the app is closed. It is
useful as a low-risk bridge and for validating notification copy and settings.

### Implementation Notes

- Add `src/core/reminders/notifications.ts`.
- Add service-worker notification click handling if needed.
- Keep notification copy short and content-specific.

### Acceptance Criteria

- Permission request is user-initiated.
- Notifications can be disabled in settings.
- Clicking a notification routes to the intended app view.

## Phase 4: Netlify Web Push MVP

Use Netlify Functions and Netlify Blobs. No separate backend service.

### Architecture

```text
PWA client
  -> asks for notification permission
  -> creates PushSubscription
  -> POST /.netlify/functions/save-push-subscription

Netlify Blob store
  -> stores subscription, timezone, preferred hour, reminder type, createdAt

Netlify Scheduled Function
  -> runs every hour
  -> finds subscriptions whose local reminder hour is due
  -> sends Web Push payloads
  -> removes expired subscriptions
```

### Netlify Pieces

- `netlify/functions/save-push-subscription.ts`
- `netlify/functions/delete-push-subscription.ts`
- `netlify/functions/send-daily-reminders.ts`
- `netlify/lib/pushSubscriptions.ts`
- Netlify Blobs store, for example `push-subscriptions`
- `netlify.toml` schedule entry for hourly reminder checks

### Required Dependencies

- `web-push` for sending push messages.
- `@netlify/blobs` for subscription storage.

### Required Environment Variables

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

`VAPID_SUBJECT` should be a `mailto:` or site URL controlled by the project owner.

### Stored Subscription Shape

```ts
interface StoredPushSubscription {
    id: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    timezone: string;
    reminderHour: number;
    reminderType: 'daily-prompt' | 'daily-concept' | 'meditation';
    lastSentDate?: string;
    createdAt: string;
    updatedAt: string;
}
```

### Scheduling Strategy

Run the scheduled function hourly in UTC.

For each subscription:

- Convert current time to the subscription timezone.
- If local hour equals `reminderHour`, continue.
- If `lastSentDate` is already today's local date, skip.
- Send notification.
- Save `lastSentDate`.
- If push provider returns gone/expired, delete the subscription.

This avoids needing one cron per timezone.

### Acceptance Criteria

- User can opt into real push reminders.
- User can opt out and delete their subscription.
- Notifications are sent at approximately the user's preferred local hour.
- Expired subscriptions are cleaned up.
- The app still works if Netlify Functions fail.

## Phase 5: Engagement Depth

Once reminders are technically reliable, improve the engagement model.

### Features

- Weekly reflection:
    - "You practiced 4 days this week."
    - "Most visited theme: compassion."

- Milestones:
    - First prompt completed.
    - Seven practice days.
    - Thirty total sessions.
    - Completed first practice path.

- Intelligent reminders:
    - If the user usually practices in the evening, suggest that time.
    - If the user ignores reminders for several days, reduce reminder frequency.
    - If the user practices before reminder time, do not notify that day.

- Content-aware reminders:
    - Mention today's concept title or daily prompt theme.
    - Rotate copy to avoid repetition.

### Implementation Notes

- Keep analytics local unless explicit sync is introduced.
- Prefer derived local stats over server-side profiles.
- Store only reminder delivery metadata server-side.

## Phase 6: Optional Accountless Sync

Only add this if there is a clear need.

### Option A: Anonymous Device ID

- Generate a local random device ID.
- Store only push subscriptions and delivery metadata.
- No cross-device practice sync.

### Option B: Magic-Link Accounts

- Use Netlify Identity or another auth provider.
- Sync practice history across devices.
- Higher complexity and stronger privacy requirements.

Recommendation: stay with Option A unless users ask for cross-device sync.

## Privacy And Trust

### Do

- Make reminders opt-in.
- Provide a visible off switch.
- Let users choose the reminder time.
- Keep notification copy calm.
- Delete expired subscriptions.
- Avoid storing practice history server-side unless sync is explicitly added.

### Avoid

- Asking for notification permission on first load.
- Guilt-based streak loss messaging.
- Notification spam.
- Server-side user profiles before they are needed.
- Third-party push platforms unless Netlify-native push becomes insufficient.

## Suggested Notification Copy

- "Today's contemplation is ready."
- "A quiet minute is available now."
- "Sit with today's prompt when you are ready."
- "Return to the breath for one moment."
- "Today's concept: {title}."
- "Begin again, gently."

## Build Order

1. Add practice date aggregation and streak helpers.
2. Add home/practice hub engagement UI.
3. Add reminder preferences.
4. Add in-app reminders.
5. Add local browser notifications while the app is open.
6. Add Netlify Functions and Blobs for push subscriptions.
7. Add scheduled hourly push sender.
8. Add opt-out and subscription cleanup.
9. Add milestones and weekly summaries.
10. Tune reminder copy and frequency.

## Testing Plan

- Unit test date and streak helpers.
- Unit test reminder due-time calculations across timezones.
- Unit test subscription serialization.
- Integration test function handlers with mocked Blobs and `web-push`.
- Manually test PWA install, notification permission, opt-in, opt-out, and
  notification click routing.
- Verify `npm run check`, `npm run test:run`, and `npm run build`.

## Risk Register

- Browser push support differs across platforms.
- iOS PWA notifications require installation and user permission.
- Scheduled Functions run in UTC, so timezone logic must be tested carefully.
- Netlify function and Blob usage may create cost if notification volume grows.
- Push subscriptions expire or become invalid and need cleanup.

## Recommendation

Build Phases 1 through 3 first. They give meaningful engagement, preserve the
local-first character of the app, and create the settings surface users need.
Then add Phase 4 when real background reminders are worth the extra operational
surface. This keeps the app Netlify-native without committing to a full backend.
