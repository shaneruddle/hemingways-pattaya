# Hemingways Pattaya

Website for Hemingways Pattaya — Pattaya's biggest expat sports bar & restaurant.

This repo was set up by copying the [Hemingways Jomtien](https://github.com/shaneruddle/hemingways-jomtien) codebase and rebranding it. See **Setup checklist** below for what still needs to be done before this is live.

## Setup checklist (do these before deploying)

- [x] **Firebase project** — `hemingways-pattaya-9a576` created, with Firestore (Standard edition, asia-southeast1), Storage (asia-southeast1), and Authentication (Email/Password) enabled, billing linked to the `hemingwayspattaya.com` org's billing account.
- [x] **`firebase-applet-config.json`** — wired up with the real SDK config from Firebase Console.
- [x] **Firestore/Storage security rules** — deployed live to the Firebase project (rebranded, admin check uses `info@hemingwayspattaya.com`).
- [x] **Deploy auth (Workload Identity Federation)** — pool, OIDC provider, and IAM binding created in `hemingways-pattaya-9a576`; `deploy.yml` updated to use them (see CI/CD Setup below). Still needs pushing to GitHub — pending a PAT with `workflow` scope.
- [ ] **`src/utils/companyDefaults.ts`** — fill in the real address and phone number (marked `TODO` in the file). Everything else here (name, email, social links) was auto-renamed from Jomtien's and should be double-checked.
- [ ] **Google Place ID** — once you have a Google Business Profile for this location, set `googlePlaceId` in `companyDefaults.ts` (or the Company Profile dashboard) so reviews/maps work.
- [ ] **Domain** — this repo assumes `hemingwayspattaya.com` throughout (emails, canonical URLs, social handles). Confirm you own/will register this domain, or tell me the real one and I'll do another pass.
- [ ] **Social links** — `facebook.com/hemingwayspattaya` and `instagram.com/hemingwayspattaya` are guesses based on naming convention; confirm or replace with the real pages.
- [ ] **Menu items** — `src/data/initialMenu.ts` currently still has Jomtien's placeholder menu (generic pub food). Swap in the real Hemingways Pattaya menu — either edit this file directly or add items via the in-app menu dashboard once deployed.
- [ ] **GitHub Actions secrets** — add these in this repo's Settings → Secrets and variables → Actions (see CI/CD Setup below).

## Deployment

This project deploys automatically to **Google Cloud Run** via GitHub Actions whenever you push to `main`.

**Live site:** not yet deployed — will appear at a `run.app` URL (or a custom domain once configured) after the first successful deploy.

## Making Changes

Edit any file directly in GitHub and commit to `main` — the site will automatically rebuild and redeploy in ~3-5 minutes. Watch progress in the **Actions** tab.

## Local Development

Prerequisites: Node.js 20+

1. Clone the repo
2. Copy `.env.example` to `.env.local` and set your keys
3. `npm install`
4. `npm run dev`

## CI/CD Setup (one-time)

Authentication to Google Cloud uses **Workload Identity Federation (WIF)** — no downloadable service account key involved (the org's `iam.managed.disableServiceAccountKeyCreation` policy blocks key creation anyway, and WIF is the more secure, keyless approach Google recommends instead). This is already wired up:

- Workload Identity Pool `github-actions-pool` and OIDC provider `github-actions-provider` exist in project `hemingways-pattaya-9a576`, scoped via an attribute condition to only accept tokens from `shaneruddle/hemingways-pattaya`.
- The `github-actions-deploy` service account grants `roles/iam.workloadIdentityUser` to the principal for `repo:shaneruddle/hemingways-pattaya:ref:refs/heads/main` (i.e. only workflow runs triggered by a push to `main` can impersonate it — if you add other deploy triggers, e.g. tags or other branches, you'll need to grant those subjects access too).
- `.github/workflows/deploy.yml` authenticates via `google-github-actions/auth@v2` using `workload_identity_provider` + `service_account`, with `permissions: id-token: write` set at the workflow level.

Add these secrets in **Settings → Secrets and variables → Actions** (no `GCP_SA_KEY` needed):

| Secret | Value |
|--------|-------|
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
