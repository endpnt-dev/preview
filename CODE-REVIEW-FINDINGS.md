# Preview API — Code Review Findings (endpnt-dev/preview)
**Reviewed by:** Opus (Claude chat) — cross-repo code review
**Date:** April 17, 2026
**Scope reviewed:** `app/api/v1/*`, `lib/*`, `.gitignore`, `.env.example`

---

## Critical issues

### C1 — `.env.local` committed locally with real-looking keys
**File:** `.env.local` (not in git, per earlier verification — but DOES exist on disk)

Confirmed not committed to GitHub. Low severity in public repo context. But it's worth being aware that `.env.local` exists on your dev machine with `ek_live_demo123` (a key that doesn't actually resolve) and could be accidentally added if someone force-adds it.

Not a fix tonight. Informational only.

---

## Correctness issues

### M1 — Demo and docs testers hardcode non-existent API key
**Files:** `components/ApiTester.tsx:32`, `components/UnfurlDemo.tsx:40`, `test-api.js:13`, `.env.local:2`

Preview hardcodes `ek_live_74qlNSbK5jTwq28Y` in the frontend (Pattern A). Based on the CIC audit ("every request returns INVALID_API_KEY"), this key is NOT in the current `API_KEYS` env var on Preview's Vercel deployment.

Additionally, `.env.example` references a different key (`ek_live_74qlNSbK5jTwq28Y`) alongside `ek_your_key_here`, while `.env.local` uses yet another (`ek_live_demo123`). Three different "demo" values across the repo.

**Recommended fix (short-term):** Pick ONE demo key value. Update hardcoded references in components. Update Vercel env var so that key actually resolves. Verify the landing demo works.

**Recommended fix (long-term):** Pattern B migration. Server-side demo endpoint.

### M2 — No API key field in docs page tester
**CIC audit finding confirmed:** "The tester has no API Key field at all and the docs only show `ek_your_api_key_here` / `YOUR_API_KEY` placeholders, so there is no way to make it succeed."

Unlike Screenshot and QR, Preview's docs page doesn't expose an API Key input. Users with their own keys can't use the docs tester. Users without a key (i.e., first-time visitors) can't use it either because the hardcoded demo key is broken. Both paths fail.

**Recommended fix:** Either (a) add an API Key input to the tester like Screenshot/QR have, or (b) wire the docs tester to a server-side demo endpoint that doesn't require auth. Preferably (b) as part of Pattern B migration.

### M3 — Only cURL code example in docs (missing JS/Node/Python)
**CIC audit finding confirmed:** Preview ships only a cURL example. QR, Screenshot, Convert, and Validate all ship cURL + JS + Node + Python.

**Recommended fix:** Add JS (fetch), Node (axios), and Python (requests) examples to the Preview docs page. Matches sister-API convention. Probably copy-paste-adapt from QR or Screenshot.

### M4 — Footer "Contact" is plain text instead of mailto link
**File:** wherever the footer is rendered (likely `components/Footer.tsx` or similar — CIC audit finding)

`hello@endpnt.dev` is displayed as text, not a clickable `mailto:` link. Clicking does nothing.

**Recommended fix:** Wrap in `<a href="mailto:hello@endpnt.dev">`.

### M5 — Footer GitHub icon has empty accessible text
**CIC audit finding confirmed.** The GitHub icon in the footer has no visible label or aria-label. Accessibility and link-verification both suffer.

**Recommended fix:** Add `aria-label="GitHub"` or visible text. Also point the link to the `endpnt-dev/preview` repo specifically instead of the org root — matches how QR/Screenshot link to their own repos.

---

## Polish / consistency issues

### P1 — Missing hero CTAs (structural)
**CIC audit finding:** "The hero has no signup/start CTA at all; the only call-to-action above the fold is the 'Unfurl' demo button."

QR and Screenshot have prominent "Get started free" + "View docs" buttons in the hero. Preview skips these. Users who don't want to try the demo have no obvious next step.

**Recommended fix:** Add a button pair to the hero matching QR/Screenshot convention.

### P2 — `.env.example` references placeholder vs real-looking keys inconsistently
**File:** `.env.example`

```
API_KEYS={"ek_live_74qlNSbK5jTwq28Y":{"tier":"free","name":"Demo Key"},"ek_your_key_here":{"tier":"starter","name":"Your App"}}
```

Mixes a "real-looking" key with a "placeholder" key. Pick one convention — I'd suggest all placeholders (`ek_placeholder_demo`, `ek_placeholder_yours`).

### P3 — Rate-limit namespace (updated Phase 8)
Prefix renamed to `endpnt:ratelimit:preview:{tier}` / `endpnt:demo:preview:ratelimit` per platform standard. No further action needed.

### P4 — `JavaScript example code block has a horizontal scrollbar`
**CIC audit finding.** Minor — CSS overflow issue in the JS code block on docs page, likely the long URL line wraps badly.

**Recommended fix:** Add `white-space: pre-wrap` or word-break handling to the code block styles.

### P5 — `JSON Example Response block also overflows horizontally`
**CIC audit finding.** Same issue, same fix.

### P6 — "GitHub" label low contrast in example preview card on landing
**CIC audit finding.** Gray-on-dark contrast issue in the `GitHub` example card. Bump color one shade lighter.

---

## Security considerations

### S1 — SSRF protection EXISTS and is COMPREHENSIVE ✓
**File:** `lib/unfurl.ts` + `lib/url-utils.ts` + `lib/config.ts` (BLOCKED_IP_RANGES, BLOCKED_DOMAINS)

Preview correctly implements SSRF protection:
- Validates URLs before fetching (`isValidUrl`, `isSSRFProtected`)
- Blocks private IP ranges (127.x, 10.x, 172.16-31.x, 192.168.x, 169.254.x, multicast, reserved)
- Blocks IPv6 private ranges (fc00::/7, fe80::/10, ::1)
- Blocks "localhost" and "0.0.0.0" as hostnames
- **Re-validates after every redirect** — prevents redirect-to-private-IP attacks
- Enforces max_redirects and timeout

**This is excellent work.** Use Preview's `url-utils.ts` as the reference if we need to add SSRF protection to other APIs (Screenshot, Convert both fetch URLs).

### S2 — Content-length header check doesn't fully guarantee size
**File:** `lib/unfurl.ts` (uses fetch() without explicit `max-content-length`)

The unfurl fetches external HTML and could receive a huge response. A malicious server might lie about content-length or send a chunked response exceeding `UNFURL_DEFAULTS.max_content_length`. The current code reads `await response.text()` without enforcing the 5MB limit at the body level.

**Recommended fix:** Stream the response body and abort when exceeding `max_content_length`, OR check `response.headers.get('content-length')` before reading and reject oversized responses. Currently relies only on timeout as a bound.

### S3 — Custom User-Agent is informative but may be blocked by sites
**File:** `lib/unfurl.ts` (User-Agent: 'endpnt-preview/1.0 (+https://preview.endpnt.dev)')

Some sites (Cloudflare-protected, etc.) may reject this UA. Not a security issue — it's appropriate to identify your bot. Flagging because some customers may report "Preview doesn't work on Site X" due to UA blocking.

---

## Suggested fix specs (priority ordered)

1. **M1 — Fix demo key (short-term).** 15 minutes. Unblocks the entire landing page experience and docs tester. Highest user-visible impact.
2. **M3 — Add JS/Node/Python code examples to docs.** 30 minutes of content work.
3. **M2 — Add API Key input to docs tester.** Small component change.
4. **P1 — Add hero CTAs.** UX consistency with sister APIs.
5. **M4, M5 — Footer fixes.** Trivial.
6. **P4, P5, P6 — Cosmetic batch.** 15 minutes.
7. **S2 — Content-length enforcement.** Small security hardening.

---

## Review notes for CC review-qa-agent

When running CC's `review-qa-agent` on the Preview repo:

1. **Confirm SSRF protection is wired through every code path.** I verified `isSSRFProtected` is called at URL entry AND after redirects. Confirm there's no path that fetches a URL without going through the check.
2. **Check cold-start behavior.** CIC audit noted cold-start timeouts on this API. Review Vercel function config in `vercel.json`, `next.config.js`, check if there's a `maxDuration` set, confirm Node runtime is configured correctly.
3. **Verify the `test-api.js` file works** against the deployed URL. If it's been broken for a while, useful to know.
4. **Read `lib/url-utils.ts` carefully.** This is your SSRF protection crown jewel. A bug there is a platform-wide risk (we want to reuse this pattern in other APIs).
5. **Look for the horizontal scrollbar issue** — CSS inspection on docs page code blocks.
