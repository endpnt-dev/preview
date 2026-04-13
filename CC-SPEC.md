# endpnt URL Preview API — CC Spec (Part 3 of 6)
**Version:** 1.0
**Date:** April 13, 2026
**Author:** Opus (planning only — CC executes all code changes)
**Agent:** Start with architect → then frontend-agent + backend-agent for implementation
**Project:** endpnt.dev — Developer API platform
**Repo:** endpnt-dev/preview

---

## CRITICAL: Environment Setup (READ FIRST)

Before doing ANYTHING, run these commands to ensure you're in the right place:

```bash
cd /mnt/c/Repositories/endpnt/preview
pwd
# Must show: /mnt/c/Repositories/endpnt/preview

git branch
# Must show: * dev
# If not on dev, run: git checkout dev

git status
# Should be clean. If not, stash or commit existing changes.
```

**Git workflow for this project:**
- Work on `dev` branch
- Push to `dev` when done — Vercel auto-deploys a preview URL
- DO push to dev
- JK will review the preview, then open a PR to main on GitHub for production deploy

---

## Overview

Build the URL Preview API — the third of 5 utility APIs for endpnt.dev. This API accepts a URL, fetches the HTML, and extracts metadata: Open Graph tags, Twitter Card tags, meta descriptions, titles, favicons, theme colors, and canonical URLs. Returns everything needed to render a rich link preview like Slack, Discord, or iMessage do.

This is the fastest API in the suite — pure HTML parsing with cheerio, no browser needed. Response times should be under 500ms for most URLs.

Use the same architecture patterns from the Screenshot API. Copy shared scaffolding (auth, rate limiting, response format, config) and adapt.

Deployed at preview.endpnt.dev.

---

## Requirements

1. API accepts a URL and returns extracted metadata as structured JSON
2. Extracts: title, description, OG image, OG type, favicon, site name, locale, Twitter card data, canonical URL, theme color
3. Follows redirects (up to 5 hops)
4. Configurable timeout
5. Optional: return raw HTML of the page
6. API key auth via `x-api-key` header (same system as other APIs)
7. Rate limiting via Upstash Redis
8. Consistent `{ success, data, meta }` response envelope
9. GET and POST methods supported
10. Landing page at `/`, docs at `/docs`, pricing at `/pricing`
11. Health check at `/api/v1/health`

---

## Suggestions & Context

### Tech Stack
- **Framework:** Next.js 14+ App Router, TypeScript
- **HTML Parsing:** `cheerio` — jQuery-like API for parsing HTML, extremely fast, no browser needed
- **HTTP Client:** Native `fetch` (built into Node 18+) or `undici` for faster requests
- **Rate Limiting:** `@upstash/ratelimit` + `@upstash/redis`
- **Styling:** Tailwind CSS, dark theme

### Folder Structure

```
preview/
  app/
    api/
      v1/
        unfurl/
          route.ts            ← Core metadata extraction logic
        health/
          route.ts
    page.tsx                  ← Landing page
    docs/
      page.tsx                ← Interactive API docs
    pricing/
      page.tsx
    layout.tsx
    globals.css
  lib/
    auth.ts                   ← Copy from screenshot
    rate-limit.ts             ← Copy from screenshot
    response.ts               ← Copy from screenshot
    unfurl.ts                 ← URL fetching + metadata extraction logic
    config.ts
  middleware.ts
  package.json
  tsconfig.json
  next.config.js
  tailwind.config.ts
  postcss.config.js
  .env.example
  vercel.json
  README.md
```

### API Endpoint: POST /api/v1/unfurl

**Request parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| url | string | Yes | — | URL to extract metadata from |
| include_html | boolean | No | false | Include raw HTML in response |
| timeout | number | No | 5000 | Max ms to wait for page response. Max: 15000 |
| follow_redirects | boolean | No | true | Follow HTTP redirects. Max 5 hops |

**Success response:**
```json
{
  "success": true,
  "data": {
    "url": "https://github.com",
    "final_url": "https://github.com/",
    "title": "GitHub: Let's build from here",
    "description": "GitHub is where over 100 million developers shape the future of software...",
    "image": "https://github.githubassets.com/images/modules/site/social-cards/campaign-social.png",
    "image_width": 1200,
    "image_height": 630,
    "favicon": "https://github.githubassets.com/favicons/favicon.svg",
    "site_name": "GitHub",
    "type": "website",
    "locale": "en_US",
    "twitter_card": "summary_large_image",
    "twitter_site": "@github",
    "canonical_url": "https://github.com/",
    "theme_color": "#1e2327",
    "author": null,
    "published_date": null,
    "keywords": []
  },
  "meta": {
    "request_id": "req_u1v2w3",
    "processing_ms": 320,
    "remaining_credits": 97
  }
}
```

**Metadata extraction priority (for title as example):**
1. `og:title` — highest priority
2. `twitter:title`
3. `<title>` tag
4. First `<h1>` tag — fallback

Same cascading priority for description and image.

**Error codes:**
- `AUTH_REQUIRED` (401)
- `INVALID_API_KEY` (401)
- `RATE_LIMIT_EXCEEDED` (429)
- `INVALID_URL` (400)
- `FETCH_FAILED` (502) — couldn't reach the URL
- `TIMEOUT` (504) — URL didn't respond in time
- `TOO_MANY_REDIRECTS` (400) — exceeded 5 redirect hops

### Landing Page
- Hero: "Extract rich link previews from any URL"
- Live demo: Paste a URL, click "Unfurl", see the extracted metadata rendered as a link preview card
- Show example preview cards for popular sites (GitHub, YouTube, Twitter)
- Code examples in curl, JavaScript, Python

### Docs Page
- Interactive tester: URL input + options → shows raw JSON response AND a rendered preview card
- Parameter reference table
- Metadata field reference (what each field means, where it comes from)
- Code examples

### Design Direction
- Same dark theme, same accent color, same layout patterns as other APIs
- Preview card component on the landing page that looks like a Slack/Discord link preview

---

## DO NOT TOUCH

- Do not modify any files outside `/mnt/c/Repositories/endpnt/preview/`
- Do not touch any other endpnt repos

---

## Edge Cases

1. URL with no OG tags — fall back to meta description, title tag, first h1
2. URL with no favicon — check /favicon.ico as fallback
3. URL that returns non-HTML (PDF, image) — return what you can (content-type, URL, size)
4. URL with relative image paths (e.g., og:image="/img/social.png") — resolve to absolute URL
5. URL that requires JavaScript to render (SPA) — you'll get the server-rendered HTML only. Document this limitation.
6. URL with multiple OG images — return the first one in `image`, include all in `images` array
7. Redirect chain (A → B → C) — return final URL in `final_url`, original in `url`
8. URL returning 403/401 — return FETCH_FAILED with the HTTP status
9. Very large HTML page (>5MB) — cap download at 5MB, parse what you have
10. URL with international characters / IDN domains — handle properly
11. Malformed HTML — cheerio handles this gracefully, but test edge cases

---

## Environment Variables

```
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
API_KEYS={"ek_live_demo123":{"tier":"free","name":"Demo Key"}}
NEXT_PUBLIC_SITE_URL=https://preview.endpnt.dev
```

---

## Git Commit & Push

```bash
git add -A && git commit -m "feat: initial URL Preview API — endpoints, landing page, docs, pricing" && git push origin dev
```

**DO push to dev.**

---

## Smoke Tests

| # | Scenario | Steps | Expected Result | Pass/Fail |
|---|----------|-------|-----------------|-----------|
| 1 | Health check | GET /api/v1/health | Returns { status: "ok" } | |
| 2 | Basic unfurl | POST /api/v1/unfurl with url: "https://github.com" | Returns title, description, image, favicon | |
| 3 | OG tags extracted | POST with url to a site with OG tags | og:title, og:image, og:description present | |
| 4 | Twitter card data | POST with url: "https://x.com" | twitter_card, twitter_site fields populated | |
| 5 | Favicon extraction | POST with any URL | favicon field has a valid URL | |
| 6 | Redirect following | POST with a URL that redirects | final_url differs from url, data from final page | |
| 7 | Include HTML | POST with include_html: true | Response includes raw HTML in data.html | |
| 8 | Missing API key | POST without x-api-key | Returns 401 | |
| 9 | Invalid URL | POST with url: "not-a-url" | Returns 400 INVALID_URL | |
| 10 | Timeout | POST with url to a very slow site, timeout: 1000 | Returns 504 TIMEOUT | |
| 11 | GET method | GET /api/v1/unfurl?url=https://github.com | Same result as POST | |
| 12 | Landing page | Visit / | Renders with hero, demo, preview cards | |
| 13 | Docs page | Visit /docs | Renders with interactive tester | |
| 14 | Live demo | Paste URL on landing page, click Unfurl | Preview card renders with extracted data | |
| 15 | Relative image paths | POST with URL that has og:image="/img/x.png" | Image URL resolved to absolute | |
