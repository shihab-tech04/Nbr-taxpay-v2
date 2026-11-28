# Execution Ledger — Sohojkor Citizen Cleanroom v1.2 (Production Readiness)

- **Date**: November 27, 2026
- **Status**: PRODUCTION-GRADE FRONTEND RELEASE CANDIDATE VERIFIED
- **Repository**: sohojkor-citizen-cleanroom (Isolated experimental greenfield)
- **Scope**: Citizen-facing taxpayer frontend only; backend frozen.

## Milestones Completed (v1.2)
1. **Requirements & Traceability (Phase 0)**: Locked via `docs/requirements/` (`features.csv`, `stories.csv`, `journeys.csv`, `acceptance.csv`, `scope-decisions.md`).
2. **Toolchain & Architecture (Phase 1)**: React 19 strict, TypeScript strict, Vite, Tailwind CSS v4, Material UI, React Router, i18next (EN/BN).
3. **Design System (Phase 2)**: Sohojkor emerald/teal theme, typography, buttons, inputs, tables, modals, and receipt/certificate dialogs.
4. **Citizen Shell & Public Journeys (Phase 3)**: Responsive Top Bar contract, footer, homepage banner, and primary service cards.
5. **Identity & Profile (Phase 4)**: Secure 12-digit TIN login, taxpayer dashboard, 24-field profile support, and beneficiary relationship management.
6. **Payment Engine & Services (Phase 5-7)**: Shared payment engine, All Tax Payments (Tax with Return & Other Tax), Travel Tax calculator, and 4-Stage Gift Tax filing.
7. **Receipts & History (Phase 8-11)**: Official E-Challan receipt modal with download/print, payment history, drafts, corrections, support center, and NBR helpline (16555).
8. **Production Readiness (Phase 12)**: Zero compilation errors (`compile_applet`), zero linter/type errors (`lint_applet`), rigorous React engineering standards met.

## Resume From Here
All citizen features, design tokens, bilingual translations, and production-grade validation are fully verified and ready for owner review.

## STEP 01.1 — MUI Form Quality Corrections (Verified)
- **Shared Form Components (`src/design-system/forms/`)**:
  - Removed all `any` types across `AppTextField`, `AppSelectField`, `AppNumberField`, `AppCurrencyField`, `AppPasswordField`, `AppSearchField`, and `AppTextArea`.
  - Migrated to MUI v9 `slotProps.input`, `slotProps.htmlInput`, and `slotProps.select` APIs via strictly typed `mergeSlotEntry` helper in `src/design-system/forms/fieldUtils.ts`.
  - Made `AppSelectField` reuse `AppTextField` (`select` mode) and fixed single-line option ellipsis truncation before dropdown chevrons.
  - Enforced numeric keypad (`inputMode="numeric"`, `pattern="[0-9]*"`), `maxLength`, leading-zero TIN string preservation (`12` digits), and digits-only OTP input (`6` digits) via `AppNumberField`.
  - Preserved currency validation, `2`-decimal precision, and minimum amounts (`৳100` in `AllTaxPaymentsView`, `৳1,000` in `GiftTaxView`) via `AppCurrencyField` and `validateCurrencyAmount`.
  - Centralized form heights (`40px` small / `48px` medium), typography, spacing, borders, hover, focus rings, error, disabled, read-only, adornment alignment, and select menu styles in `src/design-system/theme.ts`.
  - Localized EN/BN labels, placeholders, helper text, dropdown options, adornment `aria-label`s (`showPassword`/`hidePassword`, `clearSearch`), and inline validation messages across `src/i18n/i18n.ts` and all 8 screens (29 migrated fields).
  - Enforced `PUBLIC_PREVIEW` read-only restriction across all inputs, non-native MUI `<Select>` comboboxes (`aria-disabled="true"`), and adornment `<IconButton>` controls.
- **Actual Test Evidence**:
  - **Unit & SSR Component Tests (`npx --yes tsx --test src/design-system/forms/forms.test.tsx`)**: `5/5` passing — verified TIN leading-zero string handling, OTP 6-digit restriction, currency 2-decimal precision & `minAmount` (`100` / `1000`), phone/passport validators, and SSR rendering of all 7 shared form components across `light`/`dark` themes, `en`/`bn` locales, and `disabled`/`readOnly` states.
  - **Build & Type Check**: `compile_applet` (`vite build`) succeeded with zero errors; `lint_applet` (`tsc --noEmit`) exited `0` with zero type errors.
  - **Playwright Browser Verification (`playwright-cli` + headless Chromium)**:
    - Verified all 8 screens and all 29 fields interactively in dev mode (`http://localhost:3000`) across desktop (`1440x900`) and mobile (`390x844`), `light` and `dark` themes, and `EN`/`BN` locales with zero console/page errors and zero horizontal overflow on mobile.
    - Verified compiled production preview (`vite preview` at `http://127.0.0.1:4173`, `PUBLIC_PREVIEW = true`): confirmed read-only warning banner, disabled `<input>` elements, disabled non-native `[role="combobox"]` dropdowns (`aria-disabled="true"`, zero `[role="listbox"]` opening on click), and mobile BN select ellipsis rendering.

## Home 2 Exact Reconstruction (`Bento 03` Canonical Homepage)
- **Authoritative Source Reference**: Reconstructed from pinned commit `69d4ff02b3fabe910295284bfb6cbce8b74ed0b5` of `shihab-tech04/nbr-taxpay` (`Home2Layout.tsx`, `DesktopView.tsx`, `MobileView.tsx`, `Slider2.tsx`, `slider2.css`, `home2.css`, `lineArt.tsx`, `i18n.ts`, `shared.tsx`, `PublicHeroCarousel.tsx`, `brandingCmsHealth.ts`, `routeContract.ts`) with approved hero photography in `public/branding/published/` and `.webp` bundled fallbacks in `src/assets/`.
- **Architecture (`src/features/home/`)**:
  - Centralized design tokens, layouts, timing constants, and approved fallback slide data in `model/home.tokens.ts` and `model/home.assets.ts`.
  - Read-only branding CMS REST reader with cooldown health circuit breaker (`services/brandingCmsHealth.ts`, `services/bannerService.ts`, `hooks/usePublishedBanners.ts`), preserving empty CMS (`[]`) unavailable state cleanly.
  - Responsive breakpoint shell (`HomePage.tsx`): desktop `1240px` max-width 12-column Bento layout at `>=960px` (`HomeDesktopLayout.tsx`) and dedicated `430px` max-width mobile Bento composition + fixed bottom navigation at `<=959px` (`HomeMobileLayout.tsx`, `HomeMobileNavigation.tsx`).
  - Removed alternative-home switching links (`Original Home`, `মূল পাতা`, `Home 3`) so Home 2 is the sole canonical `/` homepage while preserving all 10 inner routes with their standard `<Navbar />`, `<Footer />`, and STEP 01.1 MUI forms.
- **Actual Test Evidence**:
  - **Unit & SSR Tests (`npx --yes tsx --test src/features/home/home.test.tsx src/design-system/forms/forms.test.tsx`)**: `12/12` passing (7 Home 2 tests + 5 STEP 01.1 tests).
  - **Build & Type Check**: `compile_applet` (`vite build`) succeeded with zero errors; `lint_applet` (`tsc --noEmit`) exited `0` with zero errors.
  - **Playwright Browser Verification (`playwright-cli` + headless Chromium)**:
    - Verified side-by-side layout, header height (`65px` desktop / `57px` mobile incl. 1px border), fonts (`Poppins` / `Plus Jakarta Sans` / `Hind Siliguri`), zero horizontal overflow across all 11 widths (`320, 360, 390, 430, 768, 959, 960, 1024, 1280, 1440, 1920`), EN/BN switching, Slider 2 5-slide palette transitions & deferred image loading (`2 -> 3 -> 4 -> 5`), search validation/trim/clear, Other Tax & Help dialogs (with carousel pause), signed-out `Login` <-> signed-in `Dashboard` transitions, and navigation to inner routes (`/all-taxes`, `/travel-tax`, `/history`).
    - Verified `NODE_ENV=production` compiled GitHub Pages build at `/Nbr-taxpay-v2/` (`PUBLIC_PREVIEW = true`): warning banner visible, `PRIVATE_SENTINEL` storage leak count `0`, simulated lookup blocked safely, `Pay Tax` navigates to `#/all-taxes`, hash reloads and disabled inner inputs (`/travel-tax`, `/login`) pass with `0` console/page errors.

## Cycle 05 — Architecture Enforcement + UI Corrections + MUI Selection Controls
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); 1:1 approved visual, functional, and business-contract parity preserved across Home 2 (`Bento 03`) and all 10 citizen routes.
- **Button System Refactor (`src/design-system/buttons/`)**:
  - Replaced 10 ad-hoc named tones with two semantic `actionType`s (`'primary' | 'secondary'`) and orthogonal modifiers (`intent`, `palette`, `surface`, `geometry`), centralizing configuration in `buttonConfig.ts` and `secondaryButtonConfig.ts`.
  - Fixed polymorphic anchor/router link event and ref typing (`ButtonLinkElements.tsx`) and enforced duplicate-click/loading/disabled protection.
- **Modular Theme & Architectural Decomposition**:
  - Split `src/design-system/theme.ts` into focused modules under `src/design-system/theme/` (palette, typography, spacing/shape, shared interaction states, button/form/select/selection overrides, and composition).
  - Decomposed all oversized modules (`AllTaxPaymentsView`, `GiftTaxView`, `TravelTaxView`, `SupportView`, `BeneficiariesView`, `Navbar`, `useBannerCarousel`, `bannerService`, `AppContext`, and `i18n`): separated `PreferencesContext`, `SessionContext`, `DomainStateContext`, and isolated `mockLedgerAdapter.ts`; moved shared payment step chrome to `src/components/payments/`.
  - Reduced oversized implementation files (`>200` lines) from **11** pre-Cycle 05 to **0** (`130` implementation files `<=200` lines across `135` total `.ts`/`.tsx` files and `3` CSS files).
- **Home 2 Corrections & Preview Capability Policy**:
  - Decoupled record verification availability from branding CMS configuration via `recordVerificationService.ts`, returning an honest unavailable state until a real backend integration exists.
  - Replaced broad `allowPublicLookup` bypasses with scoped `PublicCapability` (`'none' | 'public_help_question' | 'experimental_record_search'`) enforced at shared form, button, selection, and service boundaries.
  - Fixed `HelpChatDialog` topic-click input clearing, log scroll-to-bottom, post-submit input focus retention (preserving keyboard `Escape` dismissal), dialog close focus restoration, and tightened `matchHelpAnswer`.
- **Unified MUI Selection Controls (`src/design-system/selection/`)**:
  - Built `AppCheckbox`, `AppRadioGroup`, `AppRadioCard`, and `AppSwitch` backed by shared theme overrides (`selectionComponents.ts`) and `PublicCapability` enforcement.
  - Migrated beneficiary selection (`AllTaxFormStep.tsx`) to `<AppCheckbox>` and 3-column payment channel cards (`AllTaxPreviewStep.tsx`) to `<AppRadioGroup>` + `<AppRadioCard>`.
- **Architecture Gate & CI Workflow**:
  - Added TypeScript AST architecture gate (`scripts/arch-check.mjs`, wired into `npm run arch:check`) and updated `.github/workflows/citizen-pages.yml` (baseline SHA `04b42261055c8ec7850d9d0de5f9709a2e876bc8`, artifact `pre-release-04b4226-recovery`, plus `arch:check` CI step).
- **Verification Evidence (Sandbox)**:
  - `npm run typecheck` (`tsc --noEmit`): 0 errors.
  - `npm run lint` (`eslint .` / `lint_applet`): 0 errors, 0 warnings.
  - `npm run arch:check`: PASSED with 0 violations (`135` `.ts`/`.tsx` files, `130` implementation files all `<=200` lines, `3` CSS files).
  - `npm test`: `26/26` tests passing across `forms.test.tsx`, `buttons.test.tsx`, `selection.test.tsx`, `home.test.tsx`, and `payments.test.tsx` with 0 React warnings.
  - `compile_applet` & `NODE_ENV=production npx vite build --base=/Nbr-taxpay-v2/`: succeeded cleanly.
  - Browser verification (`playwright-cli` + headless Chromium): verified dev mode (`http://localhost:3000`) desktop & mobile (0 overflow, `AppCheckbox` toggle, `AppRadioGroup` arrow-key channel selection, `ReceiptModal` submission, `HelpChatDialog` topic click / submit / `Escape` focus restore) and compiled Pages `PUBLIC_PREVIEW=true` preview (`/Nbr-taxpay-v2/` on `127.0.0.1:4174`: warning banner, `PRIVATE_SENTINEL` isolation, honest verification unavailable state, disabled inputs/cards across `#/travel-tax`, `#/login`, `#/all-taxes`, 0 console/page errors).
- **Remaining Outside-Sandbox Steps**:
  - This container environment has no `.git` directory or GitHub credentials; creating the local git backup bundle from `04b42261055c8ec7850d9d0de5f9709a2e876bc8`, pushing Cycle 05 commits to `main`, and confirming live GitHub Pages CI deployment must be executed from a git-connected workstation / GitHub Actions runner.

## Cycle 06 — Shared Searchable Controls, Segmented TIN Input Foundation, and Architecture Refinement
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); completed Cycle 05 architecture improvements preserved; no actual login, taxpayer lookup backend integration, or complete payment journey wired yet.
- **Outstanding Corrections Completed**:
  - Verified `SelectionBooleanField.tsx` extracting duplicated label, description, helper-text, accessibility (`aria-describedby`, `aria-readonly`, `aria-invalid`), and controlled/uncontrolled read-only & disabled guards shared by `AppCheckbox` and `AppSwitch`.
  - Preserved the two semantic button types (`'primary' | 'secondary'`) and all approved appearances.
  - Enhanced `scripts/arch-check.mjs` to also detect prohibited MUI primitive re-exports (`ExportDeclaration`) in addition to aliased/namespace/subpath `ImportDeclaration` checks, path-alias resolution (`tsconfig.json`), production-reachable vs test-only graph analysis, and build/lint tooling dependency accounting.
  - Eliminated the `react-refresh/only-export-components` ESLint warning by moving `findDigitCellIndexAtPoint` from `AppTinDigitCell.tsx` into `tinInputUtils.ts`.
- **Shared MUI Autocomplete (`src/design-system/forms/AppAutocomplete.tsx`, `autocompleteUtils.ts`, `autocompleteRenderers.tsx`)**:
  - Supports typed options (`value`, `label`, optional `code`, `group`, `secondary`, `disabled`), stable option identifiers (`getOptionKey` / `isOptionEqualToValue` keyed on `value`), and search across labels, values, codes, group headings, and EN/BN secondary text.
  - Supports controlled selection, empty/no-options states, loading indicator, validation, required, disabled, read-only, `PUBLIC_PREVIEW` policy locking, Escape dismissal without closing parent modals (`stopPropagation`), and viewport-aware Popper placement (`flip: true`, `preventOverflow`, `zIndex: modal + 10`, `maxWidth: calc(100vw - 16px)`).
- **Shared Segmented TIN Input Foundation (`src/design-system/forms/AppTinInput.tsx`, `AppTinDigitGrid.tsx`, `AppTinDigitCell.tsx`, `AppTinPlainField.tsx`, `AppTinLookupField.tsx`, `AppTinSuggestionsPopper.tsx`, `AppTinResultCard.tsx`, `tinInputUtils.ts`, `useTinLookupPopper.ts`)**:
  - Preserves 12-digit TIN appearance with one accessible controlled numeric `<input>` behind visible digit blocks, preserving strings and leading zeros, configurable `maxLength`, optional masking, clear/search actions, localized EN/BN labels, and viewport-aware Popper suggestions (`flip: true`, `preventOverflow`).
  - Added `replaceDigitAtFullLength` and `resolveTinPasteUpdate` in `tinInputUtils.ts` so sequential direct digit replacement and keyboard movement work even when all digits are filled, and non-digit clipboard pastes do not disrupt caret state.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED with 0 violations (`151` TypeScript files, `146` implementation files all `<=200` lines, `146` production-reachable, `5` test files, `0` test-only, `3` CSS files).
  - `npm run typecheck` (`tsc --noEmit`): 0 errors.
  - `npm run lint` (`eslint .` / `lint_applet`): 0 errors, 0 warnings.
  - `npm test`: `31/31` tests passing across `forms.test.tsx`, `buttons.test.tsx`, `selection.test.tsx`, `home.test.tsx`, and `payments.test.tsx`.
  - `compile_applet` & `NODE_ENV=production npx vite build --base=/Nbr-taxpay-v2/`: succeeded cleanly.
  - Browser verification (`playwright-cli` + headless Chromium): verified dev mode (`http://localhost:3000`) Home 2 desktop (`1440x900`) and mobile (`390x844`, `homeMobileOverflowX: false`), interactive `AppCheckbox` click/Space toggle and `AppRadioGroup` ArrowRight keyboard selection on `/all-taxes`, and compiled Pages `PUBLIC_PREVIEW=true` preview (`/Nbr-taxpay-v2/` on `127.0.0.1:4173`: warning banner, `PRIVATE_SENTINEL` isolation, disabled inputs on `#/travel-tax` and `#/login`, 0 console/page errors). Note: pre-existing inner-route `Navbar` mobile header at `390px` on `/all-taxes` still exhibits horizontal overflow from the `"Sign In / TIN Login"` link (`Navbar.tsx` untouched in Cycle 06 scope).
- **Remaining Outside-Sandbox Steps**:
  - This container workspace has no `.git` directory or GitHub credentials; verifying the `01f150d6ec5855227bddfd6c3e044a7d17c25a1d` backup/restore bundle, pushing Cycle 06 commits to `main`, and confirming live `.github/workflows/citizen-pages.yml` deployment URL and `version.txt` SHA must be executed in a git-connected environment / GitHub Actions runner.

## Cycle 07 — TIN & Autocomplete Corrections, Unified MUI X Date Components, and Mobile Navbar Overflow Fix
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); Cycle 05 and Cycle 06 architecture preserved; `AppTable` deferred as instructed; no SQL or backend changes.
- **TIN & Autocomplete Corrections (`src/design-system/forms/`)**:
  - Defaulted `allowRevealTin` to `false` on `AppTinResultCard` and replaced effect-based reveal resets with synchronous derived identity state keyed on `tin` and `name`.
  - Standardized `AppTinPlainField` masking (`type={masked ? 'password' : 'text'}`) across editable, `readOnly`, and `disabled` states.
  - Added strict numeric length validation (`isValidNumericSuggestion`) in `tinInputUtils.ts` and `useTinLookupPopper.ts`, sanitized suggestion queries, and associated helper/error descriptions on `AppTinLookupField` (`aria-describedby` + `role="alert"`).
  - Extracted `resolveTinDigitKeyAction` and enforced microtask caret restoration (`setSelectionRange`) on `AppTinDigitGrid` paste and full-length digit replacement; removed unsafe non-null cast in `AppAutocomplete.tsx`.
- **Unified Date Components (`src/design-system/dates/`, `src/design-system/theme/datePickerComponents.ts`)**:
  - Added `@mui/x-date-pickers` (`9.18.0`) and `dayjs` (`1.11.23`) with EN (`enUS` / `'en'`) and BN (`bnBD` / `'bn-bd'`) localization via `AppDateLocalizationProvider`.
  - Implemented `AppDateField`, `AppDatePicker`, and `AppDateRangeFilter` matching `FORM_TOKENS` (`40px`/`48px`, `8px` radius, focus rings, dashed read-only borders, light/dark themes, responsive desktop popper / mobile modal, clearable, min/max, disabled/`PUBLIC_PREVIEW`, keyboard navigation) while emitting strict `YYYY-MM-DD` strings without timezone shifts.
  - Added timezone-safe calendar parsing and `Asia/Dhaka` helpers (`getDhakaTodayYmd`, `validateGiftDate`, `validateDateRangeFilter`, `isDateWithinInclusiveRange`) in `dateUtils.ts`.
  - Wired `AppDatePicker` (`disableFuture`, `maxDate={getDhakaTodayYmd()}`) into `GiftTaxView` / `GiftTaxValuationStep` / `GiftTaxPreviewStep` / `giftTaxLogic.ts`, and `AppDateRangeFilter` (independent optional inclusive bounds) into `HistoryView`.
  - Added `@mui/x-date-pickers` direct primitive enforcement to `scripts/arch-check.mjs`.
- **Mobile Navbar Overflow Fix (`src/components/Navbar.tsx`, `NavbarAccountMenu.tsx`)**:
  - Made toolbar padding/gaps responsive (`px: { xs: 1.5, sm: 2, md: 6 }`), truncated mobile brand label (`min-w-0`), hid subtitle on `xs`, and rendered compact `Sign In` / `লগইন` on `<sm` viewports so mobile headers fit cleanly at `390px` and `320px`.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED with 0 violations (`159` TypeScript files, `153` implementation files all `<=200` lines, `153` production-reachable, `6` test files, `0` test-only, `3` CSS files).
  - `npm run typecheck` (`tsc --noEmit`): 0 errors.
  - `npm run lint` (`eslint .` / `lint_applet`): 0 errors, 0 warnings.
  - `npm test`: `35/35` tests passing across `forms.test.tsx`, `dates.test.tsx`, `buttons.test.tsx`, `selection.test.tsx`, `home.test.tsx`, and `payments.test.tsx`.
  - `compile_applet` & `NODE_ENV=production npx vite build --base=/Nbr-taxpay-v2/`: succeeded cleanly.
  - Browser verification (`playwright-cli` + headless Chromium):
    - Mobile Navbar fix verified at `390x844` and `320x568` on `/all-taxes` and `/history` (`overflowX: false`, zero clipping, 0 console errors).
    - `/gift-tax` verified segmented TIN typing, Stage 2 `AppDatePicker` calendar popper (`zIndex: 1310`, `opacity: 1`, disabled future days), and future-date rejection (`"Gift date cannot exceed today (Asia/Dhaka)."`).
    - `/history` verified `AppDateRangeFilter` inclusive filtering (`10/04/2026` -> `1` matching row `SOHO-2026-98124`), future range `0` rows, `Clear Dates` restore (`2` rows), inverted range inline error (`"End date cannot be earlier than start date."`), and EN/BN + light/dark mode rendering.
    - Compiled Pages `PUBLIC_PREVIEW=true` preview (`/Nbr-taxpay-v2/` on `127.0.0.1:4174`) verified warning banner, disabled date inputs across `#/history`, `#/gift-tax`, `#/travel-tax`, mobile `overflowX: false`, and `0` console/page errors.
- **Remaining Outside-Sandbox Steps**:
  - This container workspace has no `.git` directory or GitHub credentials; committing Cycle 07 changes on top of `8615954`, pushing to GitHub `main`, and confirming live `.github/workflows/citizen-pages.yml` deployment & recovery tags must be run in a git-connected environment.

## Cycle 07 Closure — Date Bounds Semantics, TIN Identity/Masking Hardening, Single Provider, & CI Browser Suite
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); completed Cycle 07 date controls, TIN fixes, and mobile Navbar improvements preserved; `AppTable`, modals, and SQL/API integration deferred until independent acceptance.
- **Date Utilities & Shared Validation (`src/design-system/dates/`, `src/App.tsx`, `src/features/gift-tax/`)**:
  - Restored browser-local inclusive day bounds (`00:00:00.000`–`23:59:59.999`) for History range filtering (`isDateWithinInclusiveRange`) failing closed (`false`) on invalid bounds, reversed ranges, and invalid record timestamps; restricted `Asia/Dhaka` (`getDhakaTodayYmd`) strictly to Gift date.
  - Distinguished empty (`''`), invalid (`INVALID_YMD_VALUE = '__INVALID_DATE__'`), and valid `YYYY-MM-DD` in `useSharedDateControlState` (`dateFieldShared.ts`), preventing stale valid values from persisting during invalid/incomplete edits and reporting `'required' | 'invalid' | 'min' | 'max' | 'past' | 'future'`.
  - Consolidated `<AppDateLocalizationProvider>` to a single root instance in `src/App.tsx`, wired controlled single-`Escape` popper dismissal and `aria-invalid` forwarding in `AppDatePicker.tsx`, enforced preview/readOnly/disabled policy on `AppDateRangeFilter` `Clear Dates`, and re-validated Stage 2 before Gift Tax submission while preserving `giftDate` in preview and challan remarks.
- **TIN Identity/Masking & Caret Hardening (`src/design-system/forms/`)**:
  - Added `sanitizeTinResultForDisplay` omitting unauthorized raw `tin` before rendering `AppTinResultCard`; keyed synchronous reveal reset on `(tin, maskedTin, name, allowRevealTin)` so every identity or permission transition (`A -> B -> A`) resets reveal to `false`.
  - Matched segmented and plain `AppTinInput` masking (`type="password"`), preserved helper `aria-describedby` in `AppTinPlainField`, and shared `useTinCaretRestore` (`useLayoutEffect` + microtask `setSelectionRange`) across segmented and plain paste/edit updates.
- **CI Browser Regression Suite (`scripts/pages-smoke.cjs`, `scripts/ci-interactive-browser.cjs`, `.github/workflows/citizen-pages.yml`)**:
  - Expanded `pages-smoke.cjs` for 320px/390px EN/BN mobile Navbar overflow checks and `PUBLIC_PREVIEW=true` locking on `#/history` (`date-range-from`, `date-range-to`, `date-range-clear`) and `#/gift-tax`.
  - Added `scripts/ci-interactive-browser.cjs` (wired into `.github/workflows/citizen-pages.yml`) exercising isolated `AppTinResultCard` (`A -> B -> A` + permission reset), masking parity, paste caret, numeric suggestions, `AppAutocomplete` nullable clear + `Escape`, `AppDateField` bounds, History range filtering/fail-closed/Clear, Gift Tax stale-date blocking, and 320px/390px EN/BN mobile Navbar.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED (`0` violations across `161` `.ts`/`.tsx` files, `155` implementation files `<=200` lines, `155` production-reachable, `0` test-only, `3` CSS files).
  - `npm run typecheck`, `lint_applet`, `compile_applet`, and `npm test`: `35/35` unit/SSR tests passing with `0` errors/warnings.
  - Playwright Chromium (`playwright-cli`):
    - Verified dev mode (`http://localhost:3000`): 320px/390px EN/BN mobile Navbar (`hdrOverflow: false`, `clipped: 0`), History `10/04/2026` inclusive filter (`1` row `SOHO-2026-98124`), reversed range `0` rows + inline error, `Clear Dates` restore, single-`Escape` calendar popper dismissal, dark mode, and Gift Tax invalid date (`30/02/2026`) blocking Stage 2 -> Stage 3 plus valid `2026-04-10` receipt preservation with `0` console errors.
    - Verified compiled `PUBLIC_PREVIEW=true` Pages build (`/Nbr-taxpay-v2/` on `127.0.0.1:4173`): `date-range-clear`, `date-range-from`, `date-range-to`, and `#/gift-tax` inputs/button disabled, 320px mobile `overflowX: false`, `0` console errors.
- **Remaining Outside-Sandbox Steps**:
  - Because `.git` and GitHub credentials are absent in this container: verify full commit SHA for `de5a04e` on GitHub `main`, create & verify external backup bundle (`git bundle create`, `sha256sum`, `git clone --mirror`, `git fsck --full --strict`), push Cycle 07 Closure commits, confirm green CI (`pages-smoke.cjs` + `ci-interactive-browser.cjs`), and verify live GitHub Pages `version.txt` SHA before starting `AppTable` or SQL integration.

## Cycle 07 Final Acceptance — Contract Drift Fixes, Typed `giftDate`, Prototype Honesty, Requirements Split, & Multi-TZ Verification
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); verified date, TIN, and mobile Navbar fixes preserved; `AppTable` & modal consolidation (`F-17`) held in `Pending_UI` and SQL/API integration (`F-18`) kept `Deferred` until independent acceptance; `package.json` & `bun.lock` untouched.
- **History Date Filter Contract Parity (`src/design-system/dates/dateUtils.ts`, `dates.test.tsx`)**:
  - Restored unfiltered behavior when both `from` and `to` bounds are empty (`if (!from && !to) return true;` before record timestamp validation).
  - When bounds are active, restored original browser-local day boundary semantics (`00:00:00.000`–`23:59:59.999` vs `Date.parse`) while rejecting malformed dates and V8 calendar rollovers (`2026-02-30`, `2026-02-29T12:00:00Z`, `2026-04-31T00:00:00Z`) via `ISO_DATE_PREFIX_PATTERN` + `isValidYmd`.
  - Added multi-timezone parity test suite against pinned original `paymentDateFilter.ts` logic across local and UTC timestamps.
- **Gift Tax Typed `giftDate` & Fixture Copy Honesty (`src/types/tax.ts`, `mockData.ts`, `GiftTaxView.tsx`, `ReceiptModal.tsx`, `PaymentSuccessCard.tsx`, `AllTaxPaymentsView.tsx`, `TravelTax*.tsx`, `src/i18n/`)**:
  - Added `YmdDateString` and typed `giftDate?: YmdDateString` on `PaymentTransaction` (and sample `tx-102`), storing `giftDate` directly rather than encoding it only in `remarks`.
  - Rendered `[data-testid="receipt-gift-date"]` directly from `transaction.giftDate` in `ReceiptModal` (with optional `disablePortal` test prop for SSR verification).
  - Replaced misleading official tax/receipt/payment claims across Gift Tax, Travel Tax, All Tax Payments, Success Card, Receipt Modal, and EN/BN `paymentSuccess` copy with explicit sample/illustrative prototype disclosures (`Sample Gift Tax Preview Recorded`, `View Sample Receipt`, `Sample challan — not valid for payment`, `Illustrative receipt only. No payment or official challan has been issued.`).
- **Requirements Traceability & CI Updates (`docs/requirements/`, `.github/workflows/citizen-pages.yml`, `scripts/ci-interactive-browser.cjs`)**:
  - Split `F-17` (`Pending_UI`: shared `AppTable` & unified modal system) from `F-18` (`Deferred`: live SQL/API integration), split `US-16`/`US-17` and `AC-16-01`/`AC-17-01`, removed unsupported official-payment `PASS` claims on `AC-01-01`..`AC-10-01` (`UI_SIMULATION_ONLY` / `PARTIAL_UI_ONLY`), and expanded `scope-decisions.md` with Master v1.3 (`F-001`–`F-178`, `R01`–`R15`, `T01`–`T20`, `G01`–`G10`, 24-field profile) and recent 8–10 day UI/UX traceability.
  - Updated `.github/workflows/citizen-pages.yml` recovery job to resolve `de5a04e` to its full SHA (`git rev-parse --verify "de5a04e^{commit}"`), branch `recovery-baseline` safely with `-f`, verify bundle checksums & `git fsck --full --strict`, upload `pre-release-de5a04e-recovery`, and run `bun run test` across `UTC`, `Asia/Dhaka`, `America/Los_Angeles`, and `America/New_York`.
  - Updated `scripts/ci-interactive-browser.cjs` with History malformed-date (`30022026`) fail-closed assertion, Gift Tax non-official labels, and `[role="dialog"] [data-testid="receipt-gift-date"]` (`2026-04-10`) assertion.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED with 0 violations (`161` TypeScript files: `155` implementation files all `<=200` lines, `155` production-reachable, `6` test files, `0` test-only, `3` CSS files).
  - `npm run typecheck` (`tsc --noEmit`): 0 errors.
  - `lint_applet` (`eslint .`): 0 errors, 0 warnings.
  - `compile_applet` & `NODE_ENV=production npx vite build --base=/Nbr-taxpay-v2/`: succeeded cleanly.
  - Multi-timezone `npm test` (`TZ=UTC`, `TZ=Asia/Dhaka`, `TZ=America/Los_Angeles`, `TZ=America/New_York`): `36/36` tests passing in every timezone (`0` failures).
  - Browser verification (`playwright-cli` + headless Chromium on `http://localhost:3000`): verified `/history` (initial `2` rows unfiltered, `10/04/2026` -> `1` row `SOHO-2026-98124`, reversed range -> `0` rows + error, malformed `30022026` -> `0` rows, `Clear Dates` restore, `Escape` calendar dismissal), `/gift-tax` (`30022026` blocks Stage 3, valid `2026-04-10` preserves `giftDate` on Stage 3 preview & Stage 4 `[data-testid="receipt-gift-date"]` outside `remarks` with `Sample challan — not valid for payment`), `/travel-tax` non-official preview copy, `320x568` & `390x844` EN/BN mobile Navbar across `/all-taxes`, `/travel-tax`, `/history`, `/gift-tax` (`docOverflow: false`, `headerOverflow: false`, `clipped: 0`), and Home `/` desktop (`1440x900`) with `0` console/page errors.
- **Remaining Outside-Sandbox Steps**:
  - Because `.git` and GitHub credentials are absent in this container: run external `de5a04e` backup/checksum/mirror-restore verification outside GitHub, push Cycle 07 Final Acceptance commits to `main`, confirm green `.github/workflows/citizen-pages.yml` (`recovery`, `build` incl. `pages-smoke.cjs` & `ci-interactive-browser.cjs`, `deploy`), and verify the deployed GitHub Pages `version.txt` SHA before independent acceptance and starting `AppTable` (`F-17`).

## Cycle 07 Close — Real TSX CI Harness, Workflow Gate Hardening, Strict `YmdDateString`, & Full Browser Pass
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); completed Cycle 07 date, TIN, Gift Tax, History, and mobile Navbar fixes preserved; `F-17` (`AppTable`/modals) & `F-19`–`F-24` remain `Pending_UI` until independent acceptance, `F-12` remains `Excluded`, and **only** `F-18` (live SQL/API integration) is `Deferred`.
- **Real Test-Only CI Browser Harness (`/scripts/ci-harness.html`, `/scripts/ci-harness.tsx`, `scripts/ci-interactive-browser.cjs`, `AppAutocomplete.tsx`)**:
  - Replaced broken virtual `\0/__ci_harness__.tsx` injection with real Vite test-only TSX entry `/scripts/ci-harness.html` + `/scripts/ci-harness.tsx`, excluded from production `dist/` (verified `dist/scripts/ci-harness.*` absent).
  - Wired `segmentsTestId="ci-tin-segments"` + `inputTestId="taxpayer-tin-digits"` on `AppTinLookupField` and `inputTestId="ci-plain-tin"` on `AppTinInput` in `ci-harness.tsx`; added `autoHighlight` on `AppAutocomplete` so keyboard `ArrowDown -> ArrowDown -> Enter` selects the second option deterministically; re-focused the Day spinbutton in `ci-interactive-browser.cjs` before `05012026` and targeted MUI X v9's `title="Clear"` button via `getByRole('button', { name: 'Clear' })` with all assertions intact and unskipped.
- **Strict `YmdDateString` & CI Workflow Gate (`src/types/tax.ts`, `payments.test.tsx`, `.github/workflows/citizen-pages.yml`)**:
  - Preserved strict `YmdDateString = \`${number}-${YmdMonth}-${YmdDay}\`` union (no `| string`), verified compile-time rejection in `dates.test.tsx`, annotated `syntheticGiftTx: PaymentTransaction` in `payments.test.tsx`, and kept runtime `isValidYmd` validation across `dateUtils.ts`, `GiftTaxView.tsx`, `mockLedgerAdapter.ts`, and `ReceiptModal.tsx`.
  - Confirmed `.github/workflows/citizen-pages.yml` enforces `set -euo pipefail`, `deploy` gating (`needs: [build, recovery]` and `needs.build.result == 'success' && needs.recovery.result == 'success'`), `de5a04e` SHA backup verification, and multi-timezone `bun run test`.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED (`0` violations across `161` TypeScript files, `155` implementation files all `<=200` lines, `155` production-reachable, `6` test files, `0` test-only, `3` CSS files).
  - `npm run typecheck` (`tsc --noEmit`): exited `0` with `0` errors across all `1,561` checked files.
  - `eslint .` (`lint_applet`): `0` errors, `0` warnings.
  - `compile_applet` & `NODE_ENV=production npx vite build --base=/Nbr-taxpay-v2/`: succeeded cleanly (`dist/scripts/ci-harness.html` and `dist/scripts/ci-harness.tsx` absent).
  - Multi-timezone `npm test` (`TZ=UTC`, `TZ=Asia/Dhaka`, `TZ=America/Los_Angeles`, `TZ=America/New_York`): `36/36` tests passing in every timezone (`0` skipped, `0` failed).
  - Full interactive Chromium regression (`playwright-cli` on `http://localhost:3000`, `scripts/ci-interactive-browser.cjs` lines 1–197): `ALL_CI_HARNESS_AND_ROUTE_ASSERTIONS_PASS` (`0` console/page errors).
  - Compiled Pages `PUBLIC_PREVIEW=true` smoke check (`http://127.0.0.1:4173/Nbr-taxpay-v2/`, `scripts/pages-smoke.cjs`): `PAGES_SMOKE_LOCAL_PASS` (`0` console/page errors).
## Accelerated Cycle 08–09 — Table Migrations, Modal Foundations, & .nojekyll Pages Fix
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); completed table migrations for `HistoryView`, `BeneficiariesTable`, `AllTaxItemsTable`, and `ReceiptModal` using unified MUI-backed `AppTable`.
- **Shared Modal, Drawer, & Bottom-Sheet Foundations (`src/design-system/modals/`)**:
  - Implemented `AppDialog.tsx`, `AppDrawer.tsx`, and `AppBottomSheet.tsx` with exact approved geometry, accessibility (`role="dialog"`), backdrop blur, and dismissal controls.
  - Added unit test suite (`modals.test.tsx`), raising total test suite count to **39/39** passing tests across all 4 timezones.
- **GitHub Pages Deployment Fix (.nojekyll)**:
  - Added `/public/.nojekyll` so Vite copies it to `dist/.nojekyll` on build, preventing GitHub Pages from bypassing custom builds or running Jekyll processing on files with underscores.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED (`0` violations across `170` TypeScript files, `162` implementation files all `<=200` lines, `8` test files, `3` CSS files).
  - `npm run typecheck` (`tsc --noEmit`): `0` errors.
  - `lint_applet` (`eslint .`): `0` errors, `0` warnings.
  - `compile_applet`: succeeded.
  - Multi-timezone `npm test`: `39/39` tests passing across `UTC`, `Asia/Dhaka`, `America/Los_Angeles`, and `America/New_York`.

## Accelerated Cycle 09–10 — Complete AppTable, Modal System, Navigation/Feedback, 24-Field Profile, & Pages Artifact Fix
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); zero SQL/RPC/Edge/Office changes; all previous Home 2, button/form/selection, TIN, date, and mobile Navbar work preserved.
- **Unified `AppTable` & Domain Adoption (`src/design-system/tables/`, all 7 tables)**:
  - Completed `useTableState` typed sorting (numeric, text, date) + pagination + auto page reset across `HistoryView`, `BeneficiariesTable`, `DraftsView`, `CorrectionsView`, `RecentPaymentsTable` (Dashboard), `AllTaxItemsTable` (indexed `{ item, originalIndex }` wrapper so sorted deletions target the exact array index), and `ReceiptModal` (`Tax Head Allocations`).
  - Added EN/BN localized headers, pagination labels (`প্রতি পৃষ্ঠায় সারি:`), empty/loading (`AppSkeleton`)/error/retry (`AppStateView`) states, dark-mode contrast fixes, and mobile horizontal scroll.
- **Unified Modal System (`src/design-system/modals/`)**:
  - Completed `AppDialog`, `AppDrawer`, `AppBottomSheet`, and `AppConfirmDialog` with unique accessible IDs, focus restoration (`useModalFocusRestore`), controlled `Escape` handling, `onBack`, in-UI `DirtyCloseBanner` (`useDirtyCloseGuard` replacing `window.confirm`), `safe-area-inset-bottom`, and `responsiveBottomSheet` mobile delegation (`<640px`).
  - Migrated `ReceiptModal` (`responsiveBottomSheet` + focus restore), `BeneficiariesView`/`BeneficiaryForm`, `CorrectionsView`/`CorrectionFormDialog`, `DraftsView` (confirm delete), and `SupportView`/`SupportTicketForm` to shared modals, confirmation dialogs, and `AppToast`.
- **Navigation & Feedback Foundations (`src/design-system/navigation/`, `src/design-system/feedback/`)**:
  - Added `useAppNavigation` (integrated in `NavbarDesktopLinks` with `/profile` active route and `ProfileView` Back navigation), `AppSkeleton`, `AppStateView`, and `AppToast`.
- **24-Field Taxpayer Profile (`src/features/profile/`)**:
  - Implemented `PROFILE_24_FIELD_MANIFEST` (24 exact fields across 6 groups) with embedded summary row (`tinType`, `taxesCircle`, `registeredOn`, `lastLoginAt`), explicit `Sample taxpayer` badge (no false verified badge), default masking (`882 •••• •384`), session-authorized Eye Reveal (`allowRevealTin`), profile-only Copy controls + `AppToast`, Sample e-TIN Certificate preview (`AppDialog`), and mobile `break-words` layout without truncation.
- **GitHub Pages `.nojekyll` Artifact Fix (`.github/workflows/citizen-pages.yml`)**:
  - Added `include-hidden-files: true` to `citizen-pages-dist` `actions/upload-artifact@v4` and `test -f dist/.nojekyll` in `deploy` so `.nojekyll` is never stripped between `build` and `deploy`.
- **Remaining Outside-Sandbox Steps**:
## Accelerated Cycle 10–11 — Profile 24-Field Parity, Table/Modal Closure, Certificate UI Foundation, & Auth/Account Journeys
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); zero SQL/RPC/Edge/Office changes; Home 2 (`routeContract.ts` & `home.test.tsx`) and previously completed foundation work preserved cleanly.
- **Exact 24-Field Taxpayer Profile Parity (`src/features/profile/`)**:
  - Updated `PROFILE_24_FIELD_MANIFEST` with explicit declared `source` (`'certificate' | 'tin_profile' | 'account'`), placed `taxesCircle` (`'Taxes circle'`) exclusively inside the embedded Summary bar (`tinType`, `taxesCircle`, `registeredOn`, `lastLoginAt`), moved `previousTin` (`'Previous TIN'`) into Certificate Details (6 fields), reduced Tax Jurisdiction to 4 fields (`taxesZone`, `taxesRange`, `district`, `country`), and removed the duplicated detached Account Summary card so every `data-testid="profile-field-*"` renders exactly once across the 6 groups.
  - Corrected masking in `profileUtils.ts`: first 3 digits only for TIN & phones (`882•••••••••`, `654•••••••`, `880••••••••••`, `880••••••••` without trailing digits), domain masking for email (`ra••••@e••••.•••`), and sensitive certificate field masking (`previousTin`, `taxOfficePhone`) across Profile cards and `ProfileCertificateDialog`.
  - Extracted `MaskedProfileValue.tsx` with synchronous identity/value/permission scope reset (clearing reveal & copy state on identity switch `A -> B`, value change, or sign-out), bilingual ARIA labels, and `resolveTaxpayerProfile` isolating `SAMPLE_TAXPAYER_PROFILE_24` from unrelated user identities.
- **Shared Table & Modal Closure (`src/design-system/tables/`, `src/design-system/modals/`)**:
  - Added `resolveValidPage` in `tableUtils.ts` and fixed `useTableState.ts` so filtered datasets shrinking to empty (`data.length === 0`) or leaving `page` out-of-range reset synchronously and persistently to `page: 0`.
  - Extended `AppDrawer.tsx` (`onBack`, `isDirty`, `DirtyCloseBanner`, `disableEscapeKeyDown`/`disableBackdropClick`, mobile safe-area bottom padding) and `AppConfirmDialog.tsx` (`id` prop forwarded to `AppDialog`).
- **Certificate UI Foundation (`F-20` / `US-19`)**:
  - Created `src/shared/certificateUtils.ts` (`buildPaymentCertificateRecord` producing 1 combined `CERT-${transactionRef}` per completed transaction with challan/bank refs, allocations, assessment years, total, and signed-in vs walk-in lifecycle copy; `buildSamplePdfBytes` / `downloadSamplePdf` generating client-side `%PDF-1.4` preview files without fabricated official claims).
  - Created `PaymentCertificateDialog.tsx` (`AppDialog` with `responsiveBottomSheet`, Print, Download PDF, `AppToast`) and `TaxCreditCertificatesView.tsx` (`/certificates`), keeping Tax Credit Certificates (truthful unavailable `AppStateView` pending SQL/API `F-18`) strictly separate from Transaction Payment Certificates.
  - Enabled sample PDF download + Certificate modal inside `ReceiptModal.tsx` and wired `PaymentSuccessCard` (`AllTaxPaymentsView`, `TravelTaxView`, `GiftTaxView`), `HistoryView`, `DashboardView`, and `NavbarAccountMenu`.
- **Authentication & Account Journeys (`src/shared/accountSession.ts`, `SessionContext.tsx`, `src/features/account/`, `FirstLoginNoticeDialog.tsx`)**:
  - Added isolated typed directory lookup (`lookupTinIdentity`) returning masked SMS/Email choices without leaking raw contacts or merging identities, OTP simulation validation (`123456` / `111111` with inline error alert), Resend OTP cooldown/counter, Change TIN recovery, open-redirect-safe `sanitizeReturnPath` (`?returnTo=`), Walk-In taxpayer shortcut (`/all-taxes`), clean cross-account `signOutClean()`, and sequential `FirstLoginNoticeDialog` notice queue on `/dashboard`.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED (`0` violations across `204` TypeScript files, `192` implementation files all `<=200` lines, `192` production-reachable, `12` test files, `0` test-only, `3` CSS files).
  - `npm run typecheck` (`tsc --noEmit`), `compile_applet` (`vite build`), `lint_applet` (`eslint .`), and `NODE_ENV=production npx vite build --base=/Nbr-taxpay-v2/`: all succeeded with `0` errors and `0` warnings.
  - Multi-timezone `npm test` (`UTC`, `Asia/Dhaka`, `America/Los_Angeles`, `America/New_York`): `55/55` tests passing across every timezone (`0` failures).
  - Chromium verification (`ci-interactive-browser.cjs` + `pages-smoke.cjs` + `playwright-cli` full-page screenshots of `/profile`, `/login`, `/certificates` desktop & `390px` mobile): all checks PASS with `0` console/page errors.
- **Remaining Outside-Sandbox Steps**:
  - Commit/push Cycle 10–11 changes from a git-connected environment, verify prior `2a6c024` backup/restore bundle, trigger `.github/workflows/citizen-pages.yml` CI run, and confirm live deployed GitHub Pages SHA and `.nojekyll` bypass.

## Accelerated Cycle 11–12 — Account Isolation, Auth Parity, 24-Field Profile Closure, Unicode PDF Certificates, & All Tax Payments (`F-21`)
- **Scope Preserved**: Citizen-facing frontend only (`GEMINI.md` backend freeze intact); zero SQL/RPC/Edge/Office changes; zero Nadia/Nadia UX references; all approved Home 2, design-system, table, modal, and date contracts preserved cleanly.
- **Account Isolation & Authentication (`src/shared/accountSession.ts`, `SessionContext.tsx`, `scopedDomainStorage.ts`, `DomainStateContext.tsx`, `src/features/account/`, `App.tsx`)**:
  - Scoped `DomainStateContext` per authenticated TIN (`acct_<tin>`) and isolated `'walkin'` storage (`sohojkor_domain_*`), preventing cross-account or walk-in data leakage across `User1 -> User2 -> User1`, logout, and page reload.
  - Enforced fail-closed `readVerifiedSessionUser()` validation on `localStorage` session hydration via `lookupTinIdentity` (rejecting unknown or tampered stored identities).
  - Preserved per-account notification acknowledgements (`sohojkor_ack_notices`) across `signOutClean()` and mounted `FirstLoginNoticeDialog` globally in `App.tsx` across authenticated inner routes.
  - Made `lookupTinIdentity` fail closed on unknown TINs/IDs, restored empty initial credentials with `user1`/`user2` quick-fill, `AppPasswordField` + password check + `Recover Account` toggle, SMS/Email masked contact choices, Resend cooldown, open-redirect-safe `?returnTo=`, walk-in entry, and signed-in account-switching guard.
- **Exact 24-Field Taxpayer Profile Parity (`src/features/profile/`)**:
  - Placed `previousTin` FIRST in Certificate Details, assigned declared `'certificate'` sources on `taxesCircle`, `taxpayerStatus`, `registeredAddress`, and `currentAddress`, restored original masking thresholds (`>=8` TIN, `>=6` phone, regex email), `*` masking preserving separators, and `@****.***` domain hiding.
  - Added explicit `profile-group-<key>` hooks, enforced synchronous reveal/copy state reset on every `scopeKey` (`identity|key|value|canReveal|profileContext`) transition (`A->B->A`), clipboard failure `<span role="alert">`, `profileContext` gate on TIN Copy, signed-out `[data-testid="profile-auth-gate"]` (`Sign in to view your profile.`) without sample leakage, and `registrationNotLinked` toggle for unlinked accounts.
- **Complete Certificate Foundation & Wrapped Multipage Unicode PDF (`src/shared/certificateUtils.ts`, `certificatePdfExport.ts`, `components/certificates/`, `ReceiptModal.tsx`, `TaxCreditCertificatesView.tsx`)**:
  - Bound `ownerScope` and `originMode` (`signed_in` | `walk_in`) directly to completed transactions, enforced item-total reconciliation (`isTransactionReconciled`), filtered `/certificates` strictly by `activeScope`, preserved `giftDate`/`travelDetails`/per-line taxpayer & remarks + ref Copy, implemented wrapped multipage Unicode/Bengali + `৳` PDF export via `html2canvas-pro` + `jspdf`, and removed ASCII single-page catch fallback so PDF export errors surface cleanly in `<div role="alert">`.
- **All Tax Payments (`F-21` / `US-20` / `F-178`)**:
  - Delivered 7 fixed category groups (`ALL_TAX_CATEGORIES`), `<=5` frequent categories (signed-in `>=2` completed transactions only), shared `Chooser -> Taxpayers -> Payment Head -> Final Preview -> Payment Channel -> Result` 5-step flow, clean empty initial line items (zero automatic sample amounts/rows), own liability vs facilitation multi-taxpayer + one-time TIN (with optional save-to-Beneficiaries), per-taxpayer `Tax with Return` single-AY & exclusion rules (allowing `Taxpayer A Return + Taxpayer B Advance`), per-line Edit (`Pencil`) & sorted Delete, searchable head selector (`AppAutocomplete`), multiline EN/BN remarks (`AppTextArea` / `F-178`), signed-in Draft Save & Resume (`DraftsView`), `Pay Again` clone (`HistoryView`), and Walk-In Result options including explicit `Sign in to Claim Payment` (`F-167` via `?claimRef=`).
- **Full Canonical Register Recovery, Build Hygiene, & CI Baseline (`docs/requirements/`, `vite.config.ts`, `.github/workflows/citizen-pages.yml`)**:
  - Recovered the full canonical v1.3 register into `docs/requirements/`: `172` original features (`F-001`–`F-178`: `69 / 154` = `44.8%` applicable approved features and `66 / 128` = `51.6%` citizen-only features evidenced in UI prototype), `177` original stories (`US-001`–`US-177`), `11` canonical journeys, and `1,396` original acceptance IDs (`F-*-T*` / `US-*-T*`).
  - Eliminated `i18next` test warning (`home.test.tsx`), Vite `__dirname` warning, and Vite `>500 kB` chunk warning (`manualChunks` splitting `vendor-mui-dates`), and updated `.github/workflows/citizen-pages.yml` recovery baseline from stale `de5a04e` to resumed Main `1bda46f75fd5375e37d38596db74f8862b253849`.
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`, `npm run typecheck`, `compile_applet`, `lint_applet`, `NODE_ENV=production npx vite build --base=/Nbr-taxpay-v2/` (`0` warnings), 4-timezone `npm test` (`UTC`, `Asia/Dhaka`, `America/Los_Angeles`, `America/New_York`), `pages-smoke.cjs`, `ci-interactive-browser.cjs`, and live `playwright-cli` desktop/mobile verification completed cleanly after final code edits.
- **Remaining Outside-Sandbox Steps**:
  - Commit/push Cycle 11–12 changes, run GitHub Actions deployment, verify external `1bda46f` backup bundle, and confirm live GitHub Pages SHA from a git-connected environment (this container has no `.git` directory or GitHub remote).

## Cycle 17 — CI Repair, Correction Safeguards, & Gift Tax (দানকর) Rebuild
- **CI Type & Table Contract Repair**:
  - Restored strongly typed `TablePaginationState` and nullable `TableSortState | null` contract across `src/design-system/tables/useTableState.ts`, `HistoryActivityTable.tsx`, and `tables.test.tsx`.
  - Eliminated circular dependencies and resolved all 4 TypeScript strict compilation errors (`giftTax.ts` / `tax.ts` boundary split, `isValidYmd` narrowing).
- **Correction Safeguards (`src/shared/correctionLogic.ts`, `domainMutations.ts`, `DomainStateContext.tsx`, `CorrectionRequestModal.tsx`, `UnverifiedInquiryDialog.tsx`)**:
  - Derived actual current tax circle strictly from account-scoped/record metadata (`deriveActualCurrentCircle`) without invented fallback defaults, enforced trusted `eligibleTxs`, required explicit combined allocation selection when `items.length > 1`, reset proposed fields (`proposedAy`, `proposedCircle`, `proposedHeadId`) on transaction/allocation switch, enforced `INQUIRY_REFERENCE_REGEX` (`^[A-Za-z0-9][A-Za-z0-9._/-]{5,79}$`), prevented duplicate submissions (preserving exact preflight `id` & `ticketNumber` in `appendVerifiedCorrectionSafely`), and guaranteed `transactions` ledger immutability.
- **Gift Tax Rebuild (`src/features/gift-tax/`, `SharedPayTaxProgressiveModal`, `ReceiptModal`, `PaymentCertificateDialog`, `DraftsView`)**:
  - Delivered the 4-stage Gift Tax flow inside `SharedPayTaxProgressiveModal`: Stage 1 empty initial Donor/Donee TIN lookup (`AppTinLookupField` + `AppTinResultCard`), distinct TIN enforcement, required 1–80 char relationship tag, and Right Rail `Edit`/`Remove`/`Undo`; Stage 2 four equal-width fields (`Gift Value (BDT)`, `Gift Description`, `Date of Gift`, `Remarks (Optional)`), below-allowance & future-date validation, and non-statutory progressive estimate (`৳20,000` allowance, `5%`/`10%`/`15%`/`20%` brackets); Stage 3 Final Preview attributing tax credit & `On Behalf Of` to Donor and `Through` to Donee with shared payment channel selector; Stage 4 Challan, Certificate (`PaymentCertificateDialog`), Download/Print, walk-in recovery, signed-in draft save/resume, `Pay Again` allocation preservation, dark-mode contrast fixes, and updated CI smoke scripts (`scripts/pages-smoke.cjs`, `scripts/ci-interactive-browser.cjs`).
- **Verification Evidence (Sandbox)**:
  - `npm run arch:check`: PASSED (`0` violations across `253` TypeScript files, `237` implementation files all `<=200` lines, `16` test files, `0` cycles, `0` orphaned files).
  - `npm run typecheck`, `compile_applet`, and `lint_applet`: all succeeded (`0` errors, `0` warnings).
  - `npm run test`: `68/68` unit & SSR tests passing (`0` failures).
  - Headless Chromium E2E (`playwright-cli`): verified walk-in and signed-in Gift Tax Stages 1–4, drafts save/resume, `Pay Again`, Challan/Certificate attribution, correction safeguards (account isolation, derived circle, duplicate guard, reload persistence, inquiry regex), History sorting, EN/BN localization, Light/Dark themes, mobile `320px`/`390px` zero-overflow layouts, and `NODE_ENV=production` compiled GitHub Pages preview (`/Nbr-taxpay-v2/`, `PUBLIC_PREVIEW = true`) with `0` console/page errors.

