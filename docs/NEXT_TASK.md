# Next task — Nbr-taxpay-v2

Cycle 05 (architecture enforcement, 2-type button refactor, Home 2 decoupled verification & scoped preview capability policy, HelpChatDialog focus/UX fixes, and unified MUI selection controls) is implemented and verified locally (`npm run arch:check`, `npm run typecheck`, `npm run lint`, `npm test` 26/26, Vite production Pages build, and Playwright dev + `PUBLIC_PREVIEW=true` browser checks).

Because the container workspace has no `.git` metadata or GitHub credentials, the remaining deployment steps must be run in a git-connected environment:
1. Create/verify the backup bundle for baseline `04b42261055c8ec7850d9d0de5f9709a2e876bc8`, commit Cycle 05 changes, and push to `main` (or trigger `.github/workflows/citizen-pages.yml`).
2. Confirm the GitHub Actions workflow (`arch:check`, `typecheck`, `lint`, `test`, `pages-smoke.cjs`, and Pages deploy) completes green and verify the live GitHub Pages URL.
3. Preserve all existing backend contracts without SQL changes and never represent mock adapters as live tax payments or verified official records.
