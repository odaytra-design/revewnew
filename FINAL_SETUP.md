# ReviewBooster — Final D1 Build

This package is configured for the existing Cloudflare Worker `reviewnew` and existing D1 database `reviewbooster`.

## D1 binding
- Binding: `DB`
- Database: `reviewbooster`
- Database ID: `00ce153e-725a-443c-9baa-deab230b20b2`

## Deploy
1. Replace the files in the GitHub repository root with the files in this ZIP.
2. Commit the changes to the `main` branch.
3. Wait for Cloudflare Workers Builds to show **Success**.
4. Open `/health` on the Worker URL. It should show `database: connected`.
5. Open `/onboarding` and create a test business.

The D1 tables already exist, so do not recreate the database or rerun the schema just for this deployment.
