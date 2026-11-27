# Scope Decisions & Architecture Register

## Scope Boundaries (Master v1.3)
- **IN SCOPE (Citizen Frontend)**: React 19, Material UI v9, Tailwind CSS v4, Home 2 (`Bento 03` + `Slider 2`) public landing, TIN/OTP UI simulation (`F-011`–`F-018`), Taxpayer Dashboard & 24-field Profile alignment (`F-166` / `US-167` / `US-178`), All Tax Payments (`F-026`–`F-039`, `F-045`, `F-137`, `F-178` remarks), Travel Tax (`F-041`–`F-044`, `F-144`–`F-165`), Gift Tax 4-stage flow with typed `giftDate`, Sample Receipt / Payment Certificate UI (`F-047`–`F-054`, `F-172` non-official preview boundaries), Beneficiary Management (`F-055`–`F-063`, `F-134`, `F-136`), Payment History & `paymentDateFilter.ts` parity (`F-065`–`F-074`, `F-138`), Saved Drafts (`F-075`–`F-080`), Corrections (`F-090`–`F-093`), and Support / Helpline 16555 (`F-139`–`F-143`).
- **PENDING UI (F-17 — After Independent Cycle 07 Acceptance)**: Shared `AppTable` on MUI Table, unified `AppDialog` / `PaymentWizard` modal consolidation, 24-field Profile surface, and Payment Certificate view alignment.
- **OUT OF SCOPE / DEFERRED (F-18 & Office)**: Office Management (`F-010`, `F-064`, `F-089`, `F-104`–`F-112`, `F-170`, `F-177`), absolute backend freeze (SQL, schemas, migrations, RPCs, RLS, Edge Functions), and live settlement/official E-Challan issuance.

## Master v1.3 & Recent Approved UI/UX Traceability (Last 8–10 Days)
1. **Home 2 Canonical Shell (`F-001`–`F-009`, `F-121`–`F-122`, `F-171`, PR #1050 / #1087 / #1088)**: Reconstructed Bento 03 + Slider 2 (`8s` rotation, pause/keyboard/swipe, CMS palettes & 5 assets, no Home 1/Home 3 switcher, public record search fail-closed when CMS/verify unavailable).
2. **Design System & Architecture Gate (`F-123`, `F-14`–`F-16`, `F-17` pending)**: Semantic `'primary' | 'secondary'` `AppButton`, unified `AppCheckbox`/`AppRadioGroup`/`AppRadioCard`/`AppSwitch`, MUI v9 form primitives, `AppAutocomplete`, segmented `AppTinInput`/`AppTinLookupField`/`AppTinResultCard` (default masked, `A->B->A` reveal reset, `allowRevealTin` enforcement, paste caret), MUI X `AppDateField`/`AppDatePicker`/`AppDateRangeFilter` under single root `AppDateLocalizationProvider`, `200`-line implementation gate (`arch:check`), and `320px`/`390px` EN/BN mobile Navbar parity.
3. **Domain Rules & Honest Prototype Boundaries (`R01`–`R15`, `T01`–`T20`, `G01`–`G10`)**:
   - **History Date Filter**: Unfiltered when no bounds (`from === '' && to === ''`); browser-local `00:00:00.000`–`23:59:59.999` timestamp bounds and malformed-date rejection matching pinned `paymentDateFilter.ts` across timezones.
   - **Gift Tax**: Typed date-only `giftDate` (`YYYY-MM-DD`, `Asia/Dhaka` today max bound) stored directly on `PaymentTransaction.giftDate` and displayed in `ReceiptModal`, never encoded solely in `remarks`.
   - **Fixture Honesty**: Sample calculations and receipts are explicitly labeled as illustrative prototype previews with zero official NBR tax calculation, gateway verification, or official challan PASS claims.

## Key Architecture Decisions
1. **Material UI & Tailwind CSS**: Unified design system using MUI components wrapped with Sohojkor brand colors (emerald/teal green `#0F766E`, slate neutrals) and Tailwind v4 utilities.
2. **Localization**: Fully bilingual support (English and Bengali) via `i18next`.
3. **Persistence**: Client-side `localStorage` persistence with isolated experimental fixtures (`mockLedgerAdapter.ts`) and `PUBLIC_PREVIEW` read-only locking (`previewPolicy.ts`).
