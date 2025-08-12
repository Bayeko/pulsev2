# Moments Calendar Sync

This document outlines how the app could write Moments back to a user's external calendar.

## Authentication

### Google Calendar
- **OAuth 2.0** with offline access.
- Request `https://www.googleapis.com/auth/calendar.events` so the app can create and update events.

### Apple Calendar
- Use **EventKit** on iOS to request calendar write permission (`EKEntityTypeEvent`).
- Optionally pair with iCloud or Sign in with Apple to persist events across devices.

### Outlook / Microsoft 365
- **OAuth 2.0** via Microsoft identity platform.
- Request `Calendars.ReadWrite` scope to create and modify events through Microsoft Graph.

## Data Flow
1. User grants the app access to their calendar provider.
2. Access/refresh tokens are stored securely (e.g., Supabase row tied to the user).
3. When a Moment is created or updated:
   - Moment data is saved to Supabase.
   - Using the stored token, the app or a serverless function calls the provider's API (`events.insert`, `EKEventStore.save`, or `POST /me/events`).
   - The resulting event ID is stored with the Moment for future updates or deletion.
4. On Moment edits or deletions, the stored event ID is used to update or remove the calendar entry.

This design keeps user calendars aligned with Moments while respecting provider-specific auth models and data flows.
