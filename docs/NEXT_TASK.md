# Next task — Nbr-taxpay-v2

Accelerated Cycle 10–11 (`24-field Taxpayer Profile` exact source parity, embedded Summary with `taxesCircle`, `previousTin` in Certificate Details, first-3-digit TIN/phone & domain email masking, synchronous reveal/copy state reset, and strict fixture isolation; `useTableState` empty/invalid page reset + `AppDrawer`/`AppConfirmDialog` modal parity; Combined Payment Certificate modal + `%PDF-1.4` client download + `/certificates` Tax Credit separation; and TIN masked-contact lookup, OTP simulation/Resend, sanitized `?returnTo=`, walk-in entry, clean sign-out isolation, and sequential `FirstLoginNoticeDialog` queue) is implemented and verified locally.

Next steps:
1. Run git commit/push, `2a6c024` backup/mirror verification, and GitHub Actions deployment in a git-connected environment to confirm live Pages SHA and `.nojekyll` artifact propagation.
2. Continue mapping remaining Master v1.3 UI/UX backlog (`F-21`–`F-24`).
3. Preserve `GEMINI.md` absolute backend freeze (Office and SQL/API integration `F-18` remain untouched).
