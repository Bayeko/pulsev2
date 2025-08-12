# pulsev2
Pulse — Product & Engineering Specification (v1.0)

Last updated: 12 Aug 2025

1) One‑line concept

A discreet, consent‑first app for couples to signal desire (“pulses”), coordinate the best moments, and keep intimacy fun with lightweight planning, insights, and optional surprises.

Platforms: iOS & Android (Expo/React Native).Stack: Expo Router (SDK 52), TypeScript, Supabase (Auth, Postgres, Storage, Edge Functions), Expo Push, RevenueCat (or native StoreKit/Billing) for IAP, PostHog for analytics (self‑hostable).No LDR mode (out of scope per positioning).

2) Users & Roles

User: individual account.

Partnered Pair: 1:1 link between two users. (Free: 1 pairing max.)

Admin: for abuse reports/help (minimal tooling).

Consent & safety are core: every signal is opt‑in, discreet UI, and configurable privacy.

3) Core Value & Epics

E1 — Pairing & Onboarding

Goal: Seamless account creation and a stress‑free way to connect with your partner.

Email/Apple/Google sign‑in (Supabase Auth + OAuth).

Create or accept a Pairing Invite (6‑digit code or QR).

Quick preferences: preferred Pulse icons set, quiet hours, boundaries (green/yellow/red), notification style (ultra‑discreet).

Optional calendar connect (read‑only; Apple, Google, Outlook) to suggest time windows.
Done when: A new user can pair in <60s and land on Home with partner avatar showing.

E2 — Send & Respond to Pulses

Goal: One‑tap, private signaling that respects context and boundaries.

Compose: choose icon (e.g., flame, wink, cuddle), intensity (1–3), time window proposal (e.g., “tonight 20:00–22:00”), optional note, location hint (coarse, not GPS precise), expiry (e.g., 24h).

Delivery: push notification with obfuscated text (e.g., “You’ve got a Pulse 🔒”).

Responses: Accept, Nudge (propose new time), Not now (with auto‑soft reply like “rain check?”), Snooze (1–24h).

Read receipts (on/off).

Boundaries engine: blocks pulses beyond red boundaries; yellow prompts extra confirmation.Done when: Both partners can exchange pulses end‑to‑end with confirmations and see final status.

E3 — Calendar‑Aware Planning

Goal: Suggest “best moments” without heavy scheduling.

Import calendars read‑only; maintain local free/busy map.

Smart suggestions: ranked slots (e.g., energy patterns + free time + commute).

Create a Moment event: optional calendar write‑back (user‑opt‑in).

Snooze Toggle on dashboard: pause suggestions for a duration.
Done when: User sees 3–5 suggested windows daily and can one‑tap schedule.

E4 — Surprise Mode (Micro‑transactions supported)

Goal: Keep things playful with minimal effort.

“Roll the dice” generates a contextual mini‑plan (home/outside, budget, duration).

Packs (IAP): themed ideas (cozy night‑in, spicy, outdoors).

Private checklist UI (no explicit wording in notifications).
Done when: User can buy a pack and trigger a surprise plan that fits constraints.

E5 — Insights (Premium)

Goal: Lightweight, private analytics to understand patterns.

Heatmap by day/time of accepted pulses.

Streaks, average response times, preferred windows.

Privacy: all metrics are couple‑local; no social comparison.Done when: Insights page renders with last 30/90‑day metrics and export toggle.

E6 — Parent Mode (Discreet Mode)

Goal: Protect privacy in public/family contexts.

Biometric/Passcode gate to open app.

Replace explicit terms with euphemisms; neutral icons.

Hide previews and obfuscate notifications.
Done when: Enabling Parent Mode fully obfuscates app UI until unlocked.

E7 — Theming & Stickers (IAP)

Goal: Personalization and fun.

Theme picker (color sets) + icon packs.

Store screen to browse/buy/apply.
Done when: Purchases sync across devices and apply instantly.

E8 — Support, Safety & Abuse Handling

Block/unpair, report abuse, export/delete data (GDPR), TOS/Privacy screens.

Simple admin console (Supabase SQL + dashboard) for abuse triage.

4) Monetization

Pulse Premium: €4.99/month or €49.99 lifetime*; 7‑day free trial.

Unlimited history & insights, advanced suggestions, custom themes, priority support, “Surprise Mode” without ads/watermarks.

Micro‑transactions: idea packs (€0.99–€2.99), icon/sticker sets (€0.99), theme packs (€1.49).

Free tier: 1 pairing, basic pulses, calendar import, read receipts.

Use RevenueCat for cross‑platform entitlements and trials.*

*Exact pricing may be tuned per store and region.

5) App Navigation (Expo Router)

/(auth): sign‑in, sign‑up, reset

/(pair): invite, accept, QR

/ Home: Compose Pulse + Inbox

/calendar: suggestions, moments

/surprise: dice + packs

/insights (Premium)

/store: themes, stickers, packs

/settings: account, notifications, boundaries, parent mode, data export

Bottom tabs: Home · Calendar · Surprise · Insights · SettingsModal stacks: Compose Pulse, Purchase, Pairing, Moment editor

6) Data Model (Supabase/Postgres)

users(id, email, name, avatar_url, locale, time_zone, created_at)profiles(user_id FK, discreet_mode bool, quiet_hours jsonb, boundary_green text[], boundary_yellow text[], boundary_red text[], theme_id, premium_entitlement bool)pairs(id, user_a, user_b, status enum{pending,active,blocked}, created_at)pair_invites(code, inviter_id, expires_at, consumed_at)pulses(id, pair_id, sender_id, icon_id, intensity int, note text, proposed_window tstzrange, expires_at, status enum{sent,read,accepted,declined,snoozed,expired}, created_at)reactions(id, pulse_id, actor_id, type enum{accept,nudge,not_now,snooze}, payload jsonb, created_at)moments(id, pair_id, slot tstzrange, title, calendar_ref jsonb, created_at)cal_sync(id, user_id, provider enum{apple,google,outlook}, scope enum{read,write}, token_encrypted, last_sync_at)store_items(id, type enum{theme,sticker,pack}, sku, price_cents, meta jsonb)purchases(id, user_id, sku, platform enum{ios,android}, rc_entitlement jsonb, created_at)analytics_events(id, user_id, pair_id, type text, props jsonb, ts timestamptz)abuse_reports(id, reporter_id, target_user_id, pulse_id, reason text, created_at)

Row Level Security (RLS) rules enforce user‑owns‑their‑data and pair‑scoped reads/writes.

7) Edge Functions (Supabase)

generate_suggestions(pair_id) → list of ranked time windows.

enforce_boundaries(pair_id, payload) → boolean + reason.

reconcile_entitlements(user_id) with RevenueCat webhook.

push_notify(user_id, template, vars) via Expo Push.

data_export(user_id) → signed URL to ZIP.

8) Client Components (RN/Expo)

AuthCard (email/OAuth), PairingCard (code/QR), PulseComposer, PulseItem, ResponseSheet (BottomSheet), SuggestionList, MomentCard, HeatmapChart (Recharts), StoreGrid, PurchaseSheet, SettingsList, BoundaryEditor, ParentModeGate, SnoozeToggle.

Accessibility: VoiceOver/ TalkBack, large text, haptics, color‑contrast safe.

9) Notifications & Privacy

Push tokens stored encrypted; notification bodies obfuscated by default.

Quiet hours & device‑local Do‑Not‑Disturb integration.

Parent Mode forces generic titles and hides previews.

Data minimization: no precise location; only coarse context if user opts in.

10) Non‑Functional Requirements

Performance: cold start <2.5s on mid‑range Android; main interactions <100ms.

Offline: queue pulses and responses; optimistic UI.

Security: Supabase RLS, JWT, row‑level pair checks; at‑rest encryption for sensitive blobs.

Compliance: GDPR/DSR, age‑appropriate design, regional pricing.

Localization: EN/FR at launch; string table i18n.

11) Analytics (privacy‑first)

Core events: auth_complete, pair_active, pulse_sent, pulse_responded, moment_created, surprise_rolled, purchase_started, purchase_success, insights_viewed, parent_mode_toggled.Derived metrics: DAU/WAU, send‑to‑accept rate, median response time, streak length.

12) Testing & QA

Unit: Jest/RTL for components, Zod schemas for API payloads.

E2E: Detox flows (auth → pair → send pulse → accept → schedule).

Contract tests for Edge Functions (Deno, superoak).

Beta via EAS + TestFlight/Play Internal.

13) Release Plan

MVP (4–6 weeks): E1, E2 basic flows, read‑only calendar suggestions, Parent Mode v1, Free tier, basic store with one free theme.v1.1: Surprise Mode + 2 purchasable packs, Insights basic, Premium plan + trial.v1.2: Calendar write‑back, advanced suggestions, themes/stickers store, admin abuse tools.

14) Acceptance Criteria (per Epic)

E1 Pairing: Create invite → Partner enters code → pair.status==active; both see partner chip on Home.

E2 Pulses: Send → receiver gets obfuscated push → accepts → sender sees status==accepted within 2s; declines update accordingly.

E3 Calendar: Connect Google → suggestions show ≥3 free slots within next 72h; tapping creates Moment.

E4 Surprise: Buying “Cozy Night‑In” unlocks immediately; roll produces plan within 2s using set constraints.

E5 Insights: Heatmap renders last 30 days; toggling 90 days updates chart; Premium gate works.

E6 Parent Mode: App shows neutral UI; unlocking reveals full content; notifications stay obfuscated.

15) Open Questions / Later

In‑app chat (keep out for now to reduce moderation).

Optional widgets/complications (iOS/Android).

Couple‑level vault for shared notes/photos (privacy review required).

Wearables hook for energy scoring (later, partners/SDKs).

16) Task Breakdown (engineering‑ready)

Project setup: Expo SDK 52, TS, EAS configs, react-native-url-polyfill first import.

Auth & Pairing: Supabase schema + invites + QR; screens & hooks.

Pulse engine: DB tables, RLS, composer UI, response sheet, push wiring.

Calendar suggestions: provider auth, free/busy parser, suggestion card list.

Parent Mode: gate + obfuscation + notification policy.

Store & IAP: RevenueCat integration, paywall, entitlements, restore purchases.

Insights: event pipeline, heatmap, premium gating.

Settings: boundaries editor, quiet hours, export/delete.

QA pipeline: Detox, fixtures, seed scripts; crash/error reporting.

Release: branding, store listings, privacy, review notes.

17) Definition of Done (DoD)

All acceptance criteria met, P0 bugs resolved, accessibility pass complete, telemetry healthy, security review passed, and app approved on both stores with trial working cross‑platform.

