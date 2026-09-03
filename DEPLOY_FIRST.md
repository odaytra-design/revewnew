# ReviewBooster — clean first deployment

This repository is intentionally deployable WITHOUT a D1 ID. That avoids the previous failure caused by a missing/invalid `src/index.js` or an unknown database ID.

## GitHub
Upload these files directly to the repository root:
- index.js
- wrangler.jsonc
- package.json
- schema.sql
- DEPLOY_FIRST.md

Do not put them inside another folder.

## Cloudflare Workers Builds
Workers & Pages → Create application → Import a repository → choose this GitHub repo.

Build command: leave empty.
Deploy command: `npx wrangler deploy`.
Root directory: `/`.

The Worker name is `reviewbooster-api`, matching `wrangler.jsonc`.

## Verify
Open `/health` on the workers.dev URL.
It should show:
`database: "not_connected"`

That is expected at this stage.

## Then D1
Create a D1 database named `reviewbooster`, then add a D1 binding to this Worker with:
- Variable name: `DB`
- Database: `reviewbooster`

Apply `schema.sql` to the D1 database. After the binding exists, `/health` should show `database: "connected"`.

## Then integrations
Only after the Worker + D1 are healthy:
1. Shopify orders/create webhook
2. Email/SMS provider
3. Authentication + billing
4. Production analytics
