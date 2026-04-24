# BUGS.md — URL Preview API Bug Tracker

**Scope:** Bugs specific to the URL Preview API (`preview.endpnt.dev`). Cross-cutting bugs live at `../BUGS.md`.

**ID prefix:** `PR-NNN` (sequential, do not reuse).

**Last updated:** 2026-04-24.

---

## Open bugs

### PR-001 — Content-length header trust in response size check

- **Severity:** Medium
- **File:** `lib/unfurl.ts`
- **Discovered:** Pre-2026-04-24 (flagged as "Preview S2" in `CODE-REVIEW-FINDINGS.md`)
- **Symptom:** Response size enforcement relies on the upstream server's declared `content-length` header. A malicious or misconfigured upstream can omit the header entirely, or lie about it.
- **Root cause:** Header-trust pattern from early draft. Streaming byte-counting was deferred in favor of shipping the first working version.
- **Impact:** Attacker can stream a 900MB response into the unfurl function and force OOM (similar to C-002 in Convert). Less severe than SSRF (Preview already protects against private-IP targets) but still a DoS vector against Preview itself.
- **Fix approach:** Replace header-trust with streaming read + byte counter. Abort as soon as bytes exceed `UNFURL_DEFAULTS.max_content_length` (currently 5MB). Return `CONTENT_TOO_LARGE` (already in `ERROR_CODES`).
- **Status:** Open. Deferred. Will be scheduled as a micro-spec once launch-critical items (Convert SSRF/size) are resolved — same fix pattern applies to both.

### PR-002 — Demo cold-start timeouts on heavy-JS sites

- **Severity:** Medium (demo-only, user-visible)
- **File:** Demo proxy route on `preview.endpnt.dev/` landing page
- **Discovered:** Pre-2026-04-24 (captured in userMemories as "URL Preview: cold-start timeouts on heavy sites in demo")
- **Symptom:** When a user enters a URL with heavy JavaScript (SPA shell, lots of async loading) in the demo, the demo often returns a timeout error. The production API with a valid key behaves the same but customers generally use lighter URLs.
- **Root cause:** Combination of (a) Vercel cold-start adds 2-5s before the unfurl even begins, (b) heavy-JS sites don't reach `networkidle` quickly, (c) default timeout is 10s. On a cold start, that leaves 5s of actual fetching — not enough.
- **Impact:** Demo appears broken to prospects who happen to try it with a SPA URL. First impression of the platform is "slow / unreliable."
- **Fix approach:** Multiple options, not mutually exclusive:
  1. Raise the demo's timeout to 20-30s (edit the demo route, not production `/api/v1/unfurl`).
  2. Add a warm-up ping every few minutes to keep the function warm.
  3. Display a more honest error message that suggests the user try a different URL.
  4. Add an "example URLs" quick-pick in the demo UI that seeds non-SPA targets.
- **Status:** Open. Advisory only for the landing page. Deferred to frontend polish pass.

---

## Resolved bugs

*(None resolved yet.)*
