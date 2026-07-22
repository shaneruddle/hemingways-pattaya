# Hemingways Pattaya

Website for Hemingways Pattaya — Pattaya's biggest expat sports bar & restaurant.

This repo was set up by copying the [Hemingways Jomtien](https://github.com/shaneruddle/hemingways-jomtien) codebase and rebranding it. See **Setup checklist** below for what still needs to be done before this is live.

## Setup checklist (do these before deploying)

- [x] **Firebase project** — `hemingways-pattaya-9a576` created, with Firestore (Standard edition, asia-southeast1), Storage (asia-southeast1), and Authentication (Email/Password) enabled, billing linked to the `hemingwayspattaya.com` org's billing account.
- [x] **`firebase-applet-config.json`** — wired up with the real SDK config from Firebase Console.
- [x] **Firestore/Storage security rules** — deployed live to the Firebase project (rebranded, admin check uses `info@hemingwayspattaya.com`).
- [x] **Deploy auth (service account key)** — WIF was attempted first but `iam.serviceAccounts.getAccessToken` kept failing with a 403 despite correct IAM bindings, attribute mapping, and an org policy override (`iam.allowedPolicyMemberDomains`) — never conclusively diagnosed. Switched to a plain downloadable JSON key for `github-actions-deploy@hemingways-pattaya-9a576.iam.gserviceaccount.com`, which required overriding the `iam.managed.disableServiceAccountKeyCreation` org policy (not enforced) for this project. Key is stored as the `GCP_SA_KEY` GitHub secret (see CI/CD Setup below).
- [x] **`src/utils/companyDefaults.ts`** address/phone — filled in from the real, live Google Business Profile for "Hemingways (Pattaya) Sportsbar Restaurant" (4.4★, 612 reviews): `503 Pattaya Sai Song Rd, Nong Prue, Bang Lamung District, Chon Buri 20150` / `+66 97 215 9509`.
- [ ] **Google Place ID** — still blank in `companyDefaults.ts`. Grab the `ChIJ...`-format ID from [Google's Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) (search "Hemingways Pattaya") or set it via the Company Profile dashboard once live.
- [x] **Domain** — confirmed: `hemingwayspattaya.com` is a real domain you own (managed in GoDaddy), currently serving a **live Bubble-built site** with real reviews/traffic. Plan: deploy this app to **`new.hemingwayspattaya.com`** as a subdomain, leaving the existing live site untouched at the root domain. Once the app is deployed to Cloud Run, this needs: (1) add a custom domain mapping for `new.hemingwayspattaya.com` to the `hemingways-pattaya` Cloud Run service in the GCP console, (2) add the DNS record Cloud Run gives you to the `hemingwayspattaya.com` zone in GoDaddy. Not done yet — blocked on the first deploy happening (see workflow-scope PAT note above).
- [x] **Social links** — `facebook.com/hemingwayspattaya` confirmed (linked from the live site's footer). `instagram.com/hemingwayspattaya` is still an unconfirmed guess — the live site's footer only links WhatsApp/Facebook/Google/YouTube, no Instagram icon.
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
