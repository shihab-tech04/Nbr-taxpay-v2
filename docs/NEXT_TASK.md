# Next task — Nbr-taxpay-v2

Accelerated Cycle 08–09 (`AppTable` migration for History, Beneficiaries, Payment Line Items, and Receipt Allocations tables; shared `AppDialog`, `AppDrawer`, and `AppBottomSheet` modal foundations with `modals.test.tsx`; and `/public/.nojekyll` GitHub Pages deployment fix) is successfully implemented and verified locally (`npm run arch:check` 0 violations across 170 TS files / 162 impl files `<=200` lines, `npm run typecheck` 0 errors, `eslint .` 0 errors/warnings, `compile_applet`, and `npm test` `39/39` passing across all 4 timezones).

Next steps:
1. Continue mapping remaining Master v1.3 UI/UX backlog (`F-19`–`F-24`).
2. Preserve `GEMINI.md` absolute backend freeze (Office and SQL/API integration remain untouched).
