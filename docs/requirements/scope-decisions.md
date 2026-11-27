# Scope Decisions & Architecture Register

## Scope Boundaries (Master v1.1)
- **IN SCOPE**: Citizen-facing frontend application (React, Material UI, Tailwind CSS), responsive shell, public homepage, authentication simulation with 12-digit TIN, Taxpayer Dashboard, All Tax Payments (Tax with Return & Other Tax), Travel Tax calculator, 4-Stage Gift Tax filing, E-Challan receipt viewer with download/print, Beneficiary management with family/client relationship tagging, Payment History, Saved Drafts, Challan Corrections, and Support / NBR Helpline.
- **OUT OF SCOPE / FROZEN**: Office Management, Admin Dashboards, CMS admin interfaces, officer workflows, and any backend database schema changes, migrations, RPCs, RLS policies, or backend code modifications. Absolute backend freeze enforced.

## Key Architecture Decisions
1. **Material UI & Tailwind CSS**: Unified design system using MUI components wrapped with Sohojkor brand colors (emerald/teal green `#0F766E`, slate neutrals) and Tailwind v4 utilities.
2. **Localization**: Fully bilingual support (English and Bengali) via `i18next`.
3. **Persistence**: Client-side localStorage persistence with robust initial fixtures for offline/online experimental standalone operation.
