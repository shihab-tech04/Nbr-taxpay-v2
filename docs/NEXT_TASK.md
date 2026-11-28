# Next task — Nbr-taxpay-v2

Accelerated Cycle 09–10 (`AppTable` + `useTableState` full adoption across all 7 domain/modal tables; unified `AppDialog`, `AppDrawer`, `AppBottomSheet`, `AppConfirmDialog` with in-UI dirty-close guard, focus restoration, Escape, and responsive mobile sheets; `useAppNavigation` + `AppSkeleton`/`AppStateView`/`AppToast`; 24-field Taxpayer Profile with embedded account info, default masking, authorized eye reveal, profile-only Copy + toast, and Sample e-TIN Certificate preview; and `.github/workflows/citizen-pages.yml` `include-hidden-files: true` Pages `.nojekyll` fix) is implemented and verified locally.

Next steps:
1. Run git commit/push, `de5a04e` backup/mirror verification, and GitHub Actions deployment in a git-connected environment to confirm live Pages SHA and `.nojekyll` artifact propagation.
2. Continue mapping remaining Master v1.3 UI/UX backlog (`F-20`–`F-24`).
3. Preserve `GEMINI.md` absolute backend freeze (Office and SQL/API integration `F-18` remain untouched).
