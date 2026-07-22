# Hemingways Pattaya

Website for Hemingways Pattaya — Pattaya's biggest expat sports bar & restaurant.

This repo was set up by copying the [Hemingways Jomtien](https://github.com/shaneruddle/hemingways-jomtien) codebase and rebranding it. See **Setup checklist** below for what still needs to be done before this is live.

## Setup checklist (do these before deploying)

- [ ] **Firebase project** — create a new Firebase/GCP project (e.g. `hemingways-pattaya-website`), enable Firestore, Storage, and Authentication (Email/Password) in it.
- [ ] **`firebase-applet-config.json`** — replace the `TODO_REPLACE_WITH_REAL_*` placeholder values with the real SDK config from Firebase Console → Project Settings → General → Your apps → SDK setup and configuration.
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

Add these secrets in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `GCP_SA_KEY` | JSON key for a GCP service account (Cloud Run Developer + Storage Object Admin + Service Account User roles) |
| `GEMINI_API_KEY` | Your Gemini API key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (used by the Blog/Finance AI features) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP credentials for outgoing email (reservations, contact form) |

To create the GCP service account: Console → IAM & Admin → Service Accounts → Create → add roles above → Keys → Add Key → JSON → paste in GitHub secret.

## Project Structure

```
src/           React/TypeScript frontend (Vite)
public/        Static assets (menu images, logo)
server.ts      Express server (API proxy + serves built frontend)
Dockerfile     Container build for Cloud Run
.github/       GitHub Actions CI/CD workflow
```
