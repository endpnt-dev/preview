# CLAUDE.md — Preview API Specific Rules

**This file supplements `C:\Repositories\endpnt\CLAUDE.md` (platform-wide rules).** Read both. Universal rules (definition of done, mandatory workflow, agent usage, spec archive procedure, status-report honesty) are in the platform file. Only Preview-specific guidance lives here.

---

## What this API does

Preview unfurls URLs — fetches a web page, extracts OpenGraph/Twitter card/schema.org metadata, and returns a structured preview payload. Routes under `/api/v1/`:

- `unfurl` — main endpoint, returns title/description/image/favicon + all raw metadata
- Other supporting endpoints (see `app/api/v1/`)

Input: a URL. Output: structured preview metadata in the standard response envelope.

---

## Security — This API is the Reference for SSRF Protection

Preview was built with SSRF awareness from day one. Other APIs that fetch user-supplied URLs (currently Convert, historically Screenshot) should copy Preview's pattern, not reinvent it.

### The reference pattern

- `lib/url-utils.ts` exports `isSSRFProtected(url)` — returns `false` for private IPs, loopback, link-local, multicast, IPv6 private ranges, and the `BLOCKED_DOMAINS` list.
- `lib/config.ts` exports `BLOCKED_IP_RANGES` (CIDR notation) and `BLOCKED_DOMAINS`.
- `lib/unfurl.ts` calls `isSSRFProtected` BEFORE the fetch, and again after each redirect hop.

If you touch SSRF code, understand this before changing: the check must run on the **post-redirect** hostname, not just the initial URL. A malicious server can return a 302 to a private IP. Preview handles this by setting `redirect: 'manual'` and re-validating — don't break that.

### Known gap (Preview S2)

Preview's own code has a residual issue flagged in `CODE-REVIEW-FINDINGS.md`: the response size check relies on the server's declared `content-length` header. A malicious server can omit or lie about it. Fix is to use streaming with a byte counter and abort on excess. Tracked as future work.

---

## Library Choices

| Library | Purpose | Key gotcha |
|---|---|---|
| `cheerio` | HTML parsing for metadata extraction | Native deps — must be externalized per Next 14 rules. API is jQuery-like but cheerio has server-side quirks around whitespace handling and encoding. |
| `undici` | HTTP fetching with redirect control | Used instead of native `fetch` for finer control over redirect handling (needed for SSRF re-validation on each hop). |

### cheerio API — verify before use

Cheerio's API has shifted between v1.0 stable lines. Before writing extraction code, read `node_modules/cheerio/lib/index.d.ts`. Common gotchas:

- `$('selector').attr('name')` returns `string | undefined`, not `string`. Check before using.
- `.text()` collapses all nested text into one string — lost structure. For multi-node cases iterate with `.each()`.
- Meta tag extraction pattern: `$('meta[property="og:title"]').attr('content')` — `property` for OG, `name` for Twitter/standard.

### undici usage

`undici` is preferred over native `fetch` here for redirect manual-mode support. Sample:

```typescript
import { request } from 'undici'
const { statusCode, headers, body } = await request(url, {
  method: 'GET',
  maxRedirections: 0,  // Handle redirects manually for SSRF re-check
})
```

Read `node_modules/undici/types/dispatcher.d.ts` before extending. Undici returns Node streams, not Web API ReadableStream — consume with `body.text()` or `body.arrayBuffer()`.

---

## Next.js Config — FIX REQUIRED

Current `next.config.js` uses `serverExternalPackages: ['cheerio']` at the top level with a comment "Updated from experimental to main config option." **This is Next 15 syntax. We're on Next 14.2.15.**

Correct Next 14 syntax:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['cheerio'],
  },
}

module.exports = nextConfig
```

Whoever "updated" this was wrong — reverse it. Any build failures around cheerio bundling likely trace here.

Do not fix this in a side task. Scope it as its own micro spec if you touch the config.

---

## Rate-Limit Namespace

Preview uses `rl:preview:{tier}` as the Upstash key prefix. This is correct and consistent with sibling APIs. Do NOT change.

Preview uses the `slidingWindow` algorithm (matching QR, Convert, Screenshot). Validate is the odd one out with `fixedWindow` — that's tracked as a separate future refactor.

---

## Preview-Specific Error Codes

Beyond platform errors:

- `INVALID_URL` (400) — malformed URL or non-http(s) scheme
- `BLOCKED_URL` (400) — hostname matches SSRF blocklist (private IP, localhost, etc.)
- `FETCH_FAILED` (500) — upstream returned non-2xx after redirects
- `TIMEOUT` (504) — upstream didn't respond within configured timeout
- `TOO_MANY_REDIRECTS` (400) — exceeded `max_redirects`
- `CONTENT_TOO_LARGE` (400) — response body exceeds `max_content_length`
- `PARSE_FAILED` (500) — cheerio couldn't parse the returned HTML

Defined in `lib/config.ts` under `ERROR_CODES`. When adding a new code, add it there — don't hardcode strings in route handlers.

---

## Configuration Defaults

Defined in `lib/config.ts` as `UNFURL_DEFAULTS`:

- `timeout: 10000` (10s) — configurable per-request via query param, bounded by `VALIDATION_LIMITS.timeout` (1s-15s)
- `follow_redirects: true` — manual redirect handling with SSRF re-check at each hop
- `include_html: false` — opt-in to return the raw HTML body (useful for debugging, expensive)
- `max_redirects: 5` — per HTTP spec, most legitimate chains are ≤3
- `max_content_length: 5MB` — see Preview S2 gap above; currently header-trust, should be stream-validated

Tuning these requires coordination — they affect rate-limit math and function cost.

---

## Loose files at repo root

The repo currently has `test-api.js` and `COMPONENTS.md` at root. These should either be:

- Moved to `tests/` or `docs/` respectively, OR
- Confirmed gitignored (check `.gitignore`)

Not blocking, but worth tidying when you're next in the repo for another reason.

---

## DO NOT TOUCH (Preview-specific)

- `lib/url-utils.ts` `isSSRFProtected` logic outside of an explicit SSRF-hardening spec — this function is copy-referenced by Convert's upcoming fix
- `lib/config.ts` `BLOCKED_IP_RANGES` and `BLOCKED_DOMAINS` — adjusting the allowlist requires security review
- The redirect-handling flow in `lib/unfurl.ts` — breaking the `redirect: 'manual'` + re-check pattern re-introduces SSRF exposure
