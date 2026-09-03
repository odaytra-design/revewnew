# ReviewBooster — Step 2

This package adds the real business onboarding flow and basic database API.

## GitHub
Replace the existing `index.js` and `wrangler.jsonc` in the repository root with the files in this package. Keep `schema.sql` as-is.

## Cloudflare
The Worker name is `reviewnew` to match the current deployed Worker. Keep the existing D1 binding variable `DB` connected to `reviewbooster`.

## Test
1. Open `/health` and confirm `database: connected`.
2. Open `/onboarding` and create a test business.
3. Open `/dashboard` and confirm the business appears.

No real SMS/email is sent yet. This step only stores the business and prepares the next automation step.
