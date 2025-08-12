# pulsev2

Prototype showcasing surprise pack purchases powered by RevenueCat and Supabase.

## Development

- `app/surprise/index.tsx` offers a "Roll the dice" entry point and pack browser.
- RevenueCat is configured via `NEXT_PUBLIC_RC_API_KEY`.
- Purchases are stored in the `purchases` table using Supabase credentials.
- Edge function `reconcile_entitlements` syncs RevenueCat entitlements.

Run tests (none defined yet):

```
npm test
```
