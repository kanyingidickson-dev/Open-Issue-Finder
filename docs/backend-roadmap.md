# Backend Roadmap & Architecture (Proposal)

This project currently runs fully client-side on GitHub Pages. The following roadmap outlines **backend-required** enhancements (semantic search, OAuth, notifications) without introducing mock implementations.

## Goals

- Keep the default deployment GitHub Pages–compatible.
- Add an optional backend that can be hosted independently.
- Avoid storing GitHub tokens in the browser.

## High-level architecture

### Components

- **Frontend (GitHub Pages)**
  - React + Vite SPA
  - Calls GitHub API directly for anonymous use
  - Calls backend when authenticated / enhanced features are enabled

- **Backend API (optional)**
  - Responsible for OAuth, token storage, rate limiting, caching, background jobs
  - Exposes a stable API consumed by the frontend

- **Data stores**
  - **Postgres**: users, installs, saved searches (optional), notification preferences
  - **Redis** (optional): caching GitHub responses, job queues, rate limiting
  - **Vector store** (optional): embeddings for semantic search (pgvector, Pinecone, etc.)

## OAuth (GitHub)

### Why it needs a backend

GitHub OAuth requires a **client secret**, which cannot be safely embedded in a static frontend.

### Flow

- Frontend redirects to backend `/auth/github/start`
- Backend redirects to GitHub OAuth consent
- GitHub redirects back to backend `/auth/github/callback`
- Backend exchanges code for access token and stores it server-side
- Backend sets a secure session cookie (or returns a short-lived JWT)

### Notes

- Use least-privilege scopes (read-only where possible).
- Consider GitHub App for finer-grained permissions and better UX.

## Semantic search

### Why it needs a backend

- Embedding generation is expensive.
- You typically want indexing/caching and background jobs.

### Approach

- Store issue text (title/body/labels) and repo metadata.
- Generate embeddings with an embeddings model (OpenAI, local model, etc.).
- Query vector index + apply filters (language/labels/state) on top.

### Pipeline

- Job: ingest issues for selected repos / trending repos
- Job: refresh embeddings periodically
- API: `/search/semantic?q=...&filters=...`

## Notifications

### Why it needs a backend

Notifications require:
- polling/webhooks
- background processing
- a delivery channel (email/web push/Slack/Discord)

### Approach

- Allow users to save searches server-side.
- Run scheduled jobs that execute saved searches.
- Diff new results vs last-seen and notify.

### Channels

- Email (SendGrid/Mailgun)
- Discord webhook
- Slack webhook
- Web Push (requires service worker + push server)

## Deployment options

- **Backend**: Fly.io, Render, Railway, or a small VPS
- **DB**: managed Postgres
- **Secrets**: GitHub OAuth client secret, session signing key

## Security

- Never expose GitHub tokens to the browser.
- Use server-side token storage + session cookies.
- Add rate limiting per IP/user.

## Suggested milestone order

1. OAuth backend + token-safe GitHub proxy endpoints
2. Server-side caching for GitHub API (reduce rate limits)
3. Saved searches persistence server-side (optional)
4. Notifications MVP (email/webhook)
5. Semantic search indexing + query API
