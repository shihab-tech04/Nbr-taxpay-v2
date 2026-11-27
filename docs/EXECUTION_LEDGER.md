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


