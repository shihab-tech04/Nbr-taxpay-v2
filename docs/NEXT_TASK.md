# Next task — Nbr-taxpay-v2

Cycle 06 (outstanding `SelectionBooleanField` / `AppCheckbox` / `AppSwitch` refinements, `arch-check.mjs` re-export/alias hardening, shared MUI `AppAutocomplete` with `code` search, segmented `AppTinInput` / `AppTinLookupField` foundation with full-length direct digit replacement and viewport-aware Popper placement, and zero-warning ESLint cleanup) is implemented and verified locally (`npm run arch:check` 0 violations, `npm run typecheck` 0 errors, `npm run lint` 0 errors / 0 warnings, `npm test` 31/31, `compile_applet`, Vite production Pages build, and Playwright dev + `PUBLIC_PREVIEW=true` browser checks).

Because the container workspace has no `.git` metadata or GitHub credentials, the remaining release steps must be run in a git-connected environment:
1. Run `.github/workflows/citizen-pages.yml` (or local backup/restore verification from baseline `01f150d6ec5855227bddfd6c3e044a7d17c25a1d` matching `pre-release-01f150d-recovery`), commit Cycle 06 changes, and push to `main`.
2. Confirm the GitHub Actions workflow (`arch:check`, `typecheck`, `lint`, `test`, `pages-smoke.cjs`, and Pages deploy) completes green and verify the live GitHub Pages URL and `version.txt` SHA.
3. Wait for feature-specific prompts before wiring the new login, taxpayer lookup integration, date pickers, tables, unified modals, or complete payment journeys; preserve all existing backend contracts without SQL changes.

