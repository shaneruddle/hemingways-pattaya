# Hemingways Pattaya

Website for Hemingways Pattaya — Pattaya's biggest expat sports bar & restaurant.

This repo was set up by copying the [Hemingways Jomtien](https://github.com/shaneruddle/hemingways-jomtien) codebase and rebranding it. See **Setup checklist** below for what still needs to be done before this is live.

## Setup checklist (do these before deploying)

- [x] **Firebase project** — `hemingways-pattaya-9a576` created, with Firestore (Standard edition, asia-southeast1), Storage (asia-southeast1), and Authentication (Email/Password) enabled, billing linked to the `hemingwayspattaya.com` org's billing account.
- [x] **`firebase-applet-config.json`** — wired up with the real SDK config from Firebase Console.
- [x] **Firestore/Storage security rules** — deployed live to the Firebase project (rebranded, admin check uses `info@hemingwayspattaya.com`).
- [x] **Deploy auth (service account key)** — WIF was attempted first but `iam.serviceAccounts.getAccessToken` kept failing with a 403 despite correct IAM bindings, attribute mapping, and an org policy override (`iam.allowedPolicyMemberDomains`) — never conclusively diagnosed. Switched to a plain downloadable JSON key for `github-actions-deploy@hemingways-pattaya-9a576.iam.gserviceaccount.com`, which required overriding the `iam.managed.disableServiceAccountKeyCreation` org policy (not enforced) for this project. Key is stored as the `GCP_SA_KEY` GitHub secret (see CI/CD Setup below).
- [x] **Pipeline verified working end-to-end** — after also enabling the Artifact Registry API, creating the `hemingways-pattaya` Artifact Registry repo (Docker, Standard, `asia-southeast1`), and enabling the Cloud Run Admin API, the deploy succeeded on 2026-07-22. First deploy came up **private by default** (Cloud Run's standard behavior — `deploy-cloudrun@v2` doesn't request public access unless told to) and returned 403 Forbidden; fixed by setting **Security → Authentication → Allow public access** on the `hemingways-pattaya` Cloud Run service in the console. This is a one-time setting — it persists across future deploys to the same service, so it shouldn't need doing again.
- [x] **`src/utils/companyDefaults.ts`** address/phone — filled in from the real, live Google Business Profile for "Hemingways (Pattaya) Sportsbar Restaurant" (4.4★, 612 reviews): `503 Pattaya Sai Song Rd, Nong Prue, Bang Lamung District, Chon Buri 20150` / `+66 97 215 9509`.
- [x] **Firebase Auth authorized domains** — added `hemingways-pattaya-5ndqwfcsda-as.a.run.app` (the Cloud Run URL) to Authentication → Settings → Authorized domains, so sign-in at `/admin/login` works from the live deployed URL (it's only authorized for `localhost` and the `*.firebaseapp.com`/`*.web.app` domains by default). Add any future custom domain here too once mapped.
- [x] **Firebase Auth sign-in providers** — enabled the **Google** sign-in provider (Authentication → Sign-in method), which was off by default and blocked Google sign-in at `/admin/login` ("Google login is not enabled in Firebase"). Set project public-facing name to "Hemingways Pattaya" and support email to `info@hemingwayspattaya.com`. Email/Password was already enabled.
- [ ] **Google Place ID** — still blank in `companyDefaults.ts`. Grab the `ChIJ...`-format ID from [Google's Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) (search "Hemingways Pattaya") or set it via the Company Profile dashboard once live.
- [x] **Domain** — confirmed: `hemingwayspattaya.com` is a real domain you own (managed in GoDaddy), currently serving a **live Bubble-built site** with real reviews/traffic. Plan: deploy this app to **`new.hemingwayspattaya.com`** as a subdomain, leaving the existing live site untouched at the root domain. Once the app is deployed to Cloud Run, this needs: (1) add a custom domain mapping for `new.hemingwayspattaya.com` to the `hemingways-pattaya` Cloud Run service in the GCP console, (2) add the DNS record Cloud Run gives you to the `hemingwayspattaya.com` zone in GoDaddy. Not done yet — blocked on the first deploy happening (see workflow-scope PAT note above).
- [x] **Social links** — `facebook.com/hemingwayspattaya` confirmed (linked from the live site's footer). `instagram.com/hemingwayspattaya` is still an unconfirmed guess — the live site's footer only links WhatsApp/Facebook/Google/YouTube, no Instagram icon.
- [x] **Menu items (text)** — `src/data/initialMenu.ts` now has the full real Hemingways Pattaya menu (324 items across 21 categories) scraped from the live Bubble site on 2026-07-22: all 14 food categories (Breakfast, Snacks & Soups, Pasta, Sandwich & Burgers, Main Meals, Pizza, Pies, Salad & Jackets, Premium & Steaks, Thai Food, Kids Meals, Desserts, Sides, Sunday Roasts), the 12-bottle Wine list, Twining's Tea, House Wine (glass/corkage), and the full separate Drinks Menu (Beers & Ciders, Spirits, Coffee & Tea, Soft Drinks & Shakes, Cocktails & Alcopops). This file is seed data — the live app actually reads from the Firestore `menu` collection, so it still needs to be imported via **Dashboard → Bulk Import** (needs a staff/admin login, which only Shane can do).
- [x] **Menu items (images)** — real per-item photos scraped from the live Bubble site's public CDN and added to `src/data/initialMenu.ts` (`image` field, 187 of 324 items). The remaining 137 have no image because the live site itself doesn't have one for them: the entire separate Drinks Menu (Beers & Ciders, House Wine, Spirits, Coffee & Tea, Soft Drinks & Shakes, Cocktails & Alcopops — 134 items) is a plain price list with no per-item photography at all on the live site, and 3 of the 4 Sunday Roasts items (Roast Pork Loin, Roast Beef, Roast Lamb) hit a reproducible loading bug on the live site itself where their image never loads past a placeholder, even in a fresh browser tab — only Roast Chicken Breast's photo ever renders. The original 324 blank-image Firestore `menu` documents were deleted and need re-importing from `hemingways_pattaya_menu_import.csv` via **Dashboard → Bulk Import**, mapping the `originalId` column to "Unique ID (for updates)" so a future re-import upserts instead of duplicating.
- [ ] **Logo images** — `public/logo.png`, `public/assets/logo/hemingways-logo-black.png`, and `public/assets/logo/hemingways-logo-white.png` are still the original Jomtien logo graphics (the images themselves read "HEMINGWAYS JOMTIEN"). Confirmed live on the deployed site's header. Attempted to source the real Pattaya logo from the live site, but the only version served there is a small compressed web copy (335×122) versus the ~3068×1202 originals in this repo — using it would look visibly blurry. Needs a real hi-res logo file from Shane.
- [ ] **GitHub Actions secrets** — add these in this repo's Settings → Secrets and variables → Actions (see CI/CD Setup below).

## Deployment

This project deploys automatically to **Google Cloud Run** via GitHub Actions whenever you push to `main`.

**Live site:** https://hemingways-pattaya-5ndqwfcsda-as.a.run.app (first successful deploy 2026-07-22; will move to `new.hemingwayspattaya.com` once the custom domain is mapped — see checklist above).

## Making Changes

Edit any file directly in GitHub and commit to `main` — the site will automatically rebuild and redeploy in ~3-5 minutes. Watch progress in the **Actions** tab.

## Local Development

Prerequisites: Node.js 20+

1. Clone the repo
2. Copy `.env.example` to `.env.local` and set your keys
3. `npm install`
4. `npm run dev`

## CI/CD Setup (one-time)

Authentication to Google Cloud uses a **service account JSON key** for `github-actions-deploy@hemingways-pattaya-9a576.iam.gserviceaccount.com`.

Workload Identity Federation (keyless auth) was tried first and is generally the more secure option, but `gcloud`/`docker` kept getting a 403 on `iam.serviceAccounts.getAccessToken` when impersonating the service account, even with a correct `workloadIdentityUser` binding, a correct attribute mapping/CEL condition, and after overriding the `iam.allowedPolicyMemberDomains` org policy to allow the pool. Root cause was never conclusively identified, so we fell back to a plain key. This required overriding the `iam.managed.disableServiceAccountKeyCreation` org policy (set to **not enforced**) for the `hemingways-pattaya-9a576` project — both overrides are project-scoped and don't affect anything else in the org.

- `.github/workflows/deploy.yml` authenticates via `google-github-actions/auth@v2` using `credentials_json: ${{ secrets.GCP_SA_KEY }}`.
- Docker auth for Artifact Registry uses the standard `gcloud auth configure-docker` command (no more manual token piping).

Add these secrets in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `GCP_SA_KEY` | Full contents of the downloaded JSON key for `github-actions-deploy@hemingways-pattaya-9a576.iam.gserviceaccount.com` |
| `GEMINI_API_KEY` | Your Gemini API key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (used by the Blog/Finance AI features) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP credentials for outgoing email (reservations, contact form) |

## Project Structure

```
src/           React/TypeScript frontend (Vite)
public/        Static assets (menu images, logo)
server.ts      Express server (API proxy + serves built frontend)
Dockerfile     Container build for Cloud Run
.github/       GitHub Actions CI/CD workflow
```
