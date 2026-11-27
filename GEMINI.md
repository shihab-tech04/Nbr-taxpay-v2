# SOHOJKOR CITIZEN CLEANROOM — GEMINI PROTOCOL v1.2

This file serves as the durable operational guide for AI implementation agents working on the Sohojkor Citizen Cleanroom application under Master v1.2 production-grade standards.

## Core Rules
1. **Absolute Backend Freeze**: Do not modify databases, schemas, migrations, RPCs, or backend code. Citizen frontend only.
2. **Production-Grade Quality**: Enforce React rules (pure rendering, minimal state, strict typing), zero warnings, zero linter errors, and robust component architecture.
3. **Traceability**: Maintain `docs/requirements/` (`features.csv`, `stories.csv`, `journeys.csv`, `acceptance.csv`, `scope-decisions.md`) and `docs/EXECUTION_LEDGER.md`.
4. **Quality & Verification**: Ensure zero compilation errors (`compile_applet`) and zero linter/type errors (`lint_applet`).
