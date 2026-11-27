# Next task — Nbr-taxpay-v2

Cycle 07 (TIN reveal permission default `false` + synchronous identity reset, plain/segmented masking parity, numeric-only suggestion & paste caret fixes, helper `aria-describedby` association, nullable `AppAutocomplete` fix, unified MUI X `AppDateField` / `AppDatePicker` / `AppDateRangeFilter` with EN/BN localization and `Asia/Dhaka` timezone-safe `YYYY-MM-DD` validation wired into Gift Tax and History, and mobile Navbar overflow fix at `320px`/`390px`) is implemented and verified locally (`npm run arch:check` 0 violations, `npm run typecheck` 0 errors, `npm run lint` 0 errors / 0 warnings, `npm test` 35/35, `compile_applet`, Vite production Pages build, and Playwright dev + `PUBLIC_PREVIEW=true` browser checks).

Because the container workspace has no `.git` metadata or GitHub credentials, the remaining release steps must be run in a git-connected environment:
1. Verify recovery baseline from `8615954`, commit Cycle 07 changes, and push to `main`.
2. Confirm `.github/workflows/citizen-pages.yml` (`arch:check`, `typecheck`, `lint`, `test`, `pages-smoke.cjs`, and Pages deploy) completes green and verify the live GitHub Pages URL and `version.txt` SHA.
3. Wait for feature-specific prompts before starting `AppTable`, unified modals, login/lookup service wiring, or SQL integration; preserve `GEMINI.md` backend freeze.
