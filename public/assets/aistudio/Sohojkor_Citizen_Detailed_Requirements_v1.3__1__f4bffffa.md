# SOHOJKOR — detailed citizen requirements register v1.3
27 November 2026 | Source: recovered v9.5.3 master snapshot, dated 22 November 2026, with later ledger notes; not a certification of latest Library version or live behavior.

## Read this first
This is a source-derived register, not a new product approval or a backend execution mandate. Original requirement and test text is retained as historical specification; original statuses are not newly verified. Apply the controlling Gemini master and the latest approved overlays below. Office-only rows are preserved for traceability, not implementation. Shared rows require only citizen-visible compatibility with existing immutable services. Proposed rows remain deferred. Preliminary scope classifications are not a final citizen-only denominator; reconcile every row with latest approved evidence. Original tests requiring Office/SQL writes, CMS publishing, deployment of the old app or superseded controls are reference-only on this project; test only applicable citizen boundary safely.

Coverage extracted: 172 feature records (168 approved, 4 proposed), 177 story records (171 approved, 6 proposed), 672 approved feature case IDs + 684 approved story case IDs = 1356 original approved acceptance IDs. Original journey text is preserved wherever present in source.

## Controlling current decisions
HOME 2 AND CURRENT CITIZEN OVERRIDES — CONTROLLING, 27 NOV 2026
1. Home 2 is the only canonical public landing page of the new repository; default route '/' (respect hosting base path). Preserve authorized legacy Home 2 deep-link compatibility, but never create Home 1 or a second homepage. The old Home 1 six-card layout is superseded as a visual requirement; preserve every approved functional destination in Home 2's approved structure, not a duplicate card section. Existing production routes remain untouched.
2. Reference: user-approved Bento 03 (PR #1050, 24 Nov); subsequent Home 2 Slider2 CMS reuse PR #1087, polish PR #1088 and all later approved changes. Reference route https://shihab-tech04.github.io/nbr-taxpay/?action=home-2 is for authorized read-only comparison; it is not the new deployment. Historical source locators: src/components/screens/Home2Layout.tsx; src/components/screens/home2/views/DesktopView.tsx; MobileView.tsx; Slider2.tsx; PublicHeroCarousel.tsx; PublicHomeHeader.tsx; CitizenFooter.tsx. Resolve current files/SHA before extracting exact dimensions and assets. Do not copy obsolete implementation. Preserve latest approved hero, not the original orange editorial tile if superseded by Slider2. The Bento 03 history records cobalt Pay Tax, lime Travel Tax, three-column record retrieval, lilac certificate, peach correction, ink history, gold Pay Again, white drafts and mint account; compare against final approved screenshot before freezing exact positions, copy, sizes and colors. No guessed hex values.
3. Slider2 consumes published CMS data only: five approved assets subject to published visibility/order, CMS palettes and artwork incl mobile, fixed content and two callbacks, eight-second rotation from recorded implementation, pause/keyboard/swipe, smooth dissolve, image fallback and bounded refresh. Desktop cover/right-center and mobile contain are later refinement evidence; resolve any newer approved change before pixel acceptance. One bilingual heading per viewport. Preserve white search card, approved quiet dashboard CTA and exact header/footer variant. No CMS admin, publishing, database, storage or auth changes.
4. Every Home 2 entry needs an explicit component/route/action/role/state matrix: Pay Tax → approved All Tax Payments; Travel Tax → separate Travel Tax; record retrieval → challan/token/transaction reference (authorized result or no-match/error); certificates → appropriate permitted receipt/Payment Certificate/Tax Credit Certificate route; correction → authentication and eligible record, return after login; history → authorized payment history; Pay Again → history with approved action; saved drafts → approved dashboard/drafts destination; My tax account/dashboard → verified account destination; beneficiary shortcut → approved authenticated destination. Validate exact latest labels, routes, tiles, order and signed-in/out behavior from current reference; do not add new visible tiles just because a feature exists. No duplicate top-level Travel Tax; preserve approved Pay Tax dropdown and mobile nav. All Tax Payments chooser routes consistently from signed-in and public entries. No Home 1 switcher.
5. Income/Other/Advance/Source: one shared flow TIN → payment head → final preview, Return same taxpayer one AY/no other head; approved other taxpayer Advance alongside Return permitted. Own liability one taxpayer; facilitating another supports multiple. Seven fixed category groups; frequent categories only signed-in with at least two completed payments, up to five, based on distinct owner-authorized completed categories; no pending/failed, count once per completed combined payment; approved 3 columns Category/Heads/Action. Optional multiline EN/BN challan remarks (F-178) must survive Back/Edit, draft and Pay Again through existing API; do not invent backend support.
6. Travel Tax: latest approved individual medical review, no automatic exemption, zero payable only when existing authoritative contract permits; preserve passport suggestions without layout displacement, passenger confirmation and progressive form. Do not reintroduce the removed remove/undo affordance; map remaining approved edit/remove behavior to existing confirmed controls. Use shared Final Preview, Payment Channel and Result. Historical cases referring to prior controls or layout must be reconciled, not silently dropped. Gift Tax (দানকর) later approved journey: Donor (payer/credit receiver, On Behalf Of), Donee (Through), donor/donee TIN lookup and confirm, required relationship including Others free text, add Donee, masked summary; gift amount, description, gift date, exemption/rates as authorized, zone/circle, optional remarks; preview names/TIN, amounts/date/description/remarks/total/challan and edit/confirm; shared result/receipt/history. Gift Tax is fail-closed when current existing API/SQL cannot support an authorized persisted result. Never invent rates, payment mapping or SQL functions. No Save Draft for guest.
7. Latest correction and payment lifecycle decisions: no maker-checker or invented role/approval stage. Existing taxpayer request and direct authorized Office decision return via unchanged contract. Existing Office-initiated applied correction appears only through authorized readback; original record remains immutable, status/notifications linked to correct source. Recipient notice: allocated-only amounts and identity, one popup at a time, acknowledgement persists, later panel/report as approved; exact acknowledgement vs dismissal semantics from latest v12/current source. Distinguish accepted submission, pending, successful completion, failed and unknown/stale status. Never call payment complete until existing server readback confirms; only completed amounts in totals. Report tracking through existing API with reference, no invented case IDs. Payment & Activity entirely server-backed, payer/recipient distinct; no fixture data in release. If API does not support a requirement, keep safe boundary and UNVERIFIED. No backend changes to close it.
8. Exact profile: 24 keys below, source/origin as recorded; source key manifest is not verification of actual personal data, Bengali labels or pixel layout. Latest authorized profile UI embeds account metadata inside identity surface; no detached Account card. Preserve approved EN/BN labels, order/group, masked default/eye/copy for TIN/phone/email, actual certificate and shared receipt/certificate print/download; Copy only in approved profile. Check current approved masking (historical ledger describes first three numeric digits and email local first two with domain treatment; original F-166 mentions last 2–3 digit treatment; resolve exact current display against approved source and screenshot; never expose unauthorized raw values). Do not add or remove registration fields. Map existing 24 keys without backend writes/changes. Exact design tokens, dimensions, screenshot references and field required/read-only rules that are not present in source remain UNVERIFIED pending authorized reference inspection.
9. General UI: Poppins + Noto Sans Bengali; approved 16px base, 14px min where approved; 4px spacing scale, shared table/form/modal, primary/secondary visual button variants, currency ৳, responsive desktop/tablet/mobile, accessible keyboard/focus, EN/BN and approved theme states. Existing approved modal and profile contracts outrank generic MUI defaults. Existing signed-in max content width 1300px at ≥1400px where applicable; never apply unverified Home 2 measurements to all pages. Do not create a new design or resurrect obsolete controls.
10. This override is a frontend-only implementation scope. ALL SQL, schema, migrations, grants, RLS, RPCs, auth configuration, Edge functions, storage and Office code are immutable. Existing API writes are tested only through permitted operations in an already authorized nonproduction environment. If unavailable, mock/contract evidence is separate from hosted acceptance; no production payment or data writes. No cutover without separate explicit approval.

## Exact profile key manifest
Source: v9.5.3 table 7. These are code-defined keys, not a verified certificate or final field design.
```text
Group | Key | Current English label | Declared origin
Identity | taxpayerName | Name | certificate
Identity | tin | TIN | certificate
Summary | tinType | TIN type | tin_profile
Summary | registeredOn | Registered since | tin_profile
Summary | previousTin | Previous TIN | certificate
Summary | lastLoginAt | Last account login | account
Personal information | taxpayerStatus | Taxpayer status | certificate
Personal information | tinSubtype | TIN classification | tin_profile
Personal information | userType | User type | tin_profile
Personal information | localTaxpayer | Local taxpayer | tin_profile
Contact and addresses | mobileNumber | Mobile number | tin_profile
Contact and addresses | emailAddress | Email address | tin_profile
Contact and addresses | registeredAddress | Registered / permanent address | certificate
Contact and addresses | currentAddress | Current address | certificate
Jurisdiction | taxesCircle | Taxes circle | certificate
Jurisdiction | taxesZone | Taxes zone | certificate
Jurisdiction | taxesRange | Taxes range | tin_profile
Jurisdiction | district | District | tin_profile
Jurisdiction | country | Country | tin_profile
Certificate details | certificateIssuedOn | Certificate issue date | certificate
Certificate details | certificateLastUpdatedOn | Certificate last updated | certificate
Certificate details | issuingOfficer | Issuing tax officer | certificate
Certificate details | taxOfficeAddress | Tax office address | certificate
Certificate details | taxOfficePhone | Tax office phone | certificate
```

## Feature index (original ID, preliminary scope, original requirement)
- F-001 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Sohojkor homepage: guest payment entry, payment-record search and the six existing benefit cards. Keep “How your payment works” and “Common questions” hidden.
- F-002 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Public service catalogue, guidance and discovery
- F-003 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Office-owned logo upload, preview and crop
- F-004 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Five-banner carousel: fixed left heading, description and both buttons while images and image-based colours change
- F-005 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Keep image-derived banner colours: light background, dark text and outline-button colour on every slide
- F-006 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Office preview shows the complete fixed-left banner layout, changing image, colours and both actions
- F-007 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Keep all five banner images, smooth dissolve, existing timing, order, visibility and navigation
- F-008 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Banner buttons open only the existing Pay Tax journey or the separate Pay Travel Tax journey
- F-009 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Published Office banner/image/colour data appears exactly in the taxpayer application
- F-010 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Publish history, conflict detection and rollback
- F-011 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Allow a TIN holder to pay without signing in; the recipient can receive eligible payments even before first login.
- F-012 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Use the existing Sohojkor sign-in screen. Keep official eReturn credential integration deferred; do not add a production login method.
- F-013 | CITIZEN — implement frontend | APPROVED REQUIREMENT  On the first demonstration login, show the demo-only OTP step (111111), complete demo sign-in automatically after the correct entry, show success, then show saved unseen payment notices one by one. This demo code must not authenticate production accounts.
- F-015 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show the signed-in taxpayer’s correct TIN details and account records.
- F-016 | CITIZEN — implement frontend | APPROVED REQUIREMENT  After verified sign-in, show the eligible earlier guest payments linked to the taxpayer account using the existing ownership method; entering a TIN alone is not proof.
- F-017 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Existing sign-out works; the next account sees only its own records.
- F-018 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Language and account preference saved information
- F-019 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Saved beneficiary search and suggestion
- F-020 | CITIZEN — implement frontend | APPROVED REQUIREMENT  TIN input format and user lookup
- F-021 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Confirmation of selected taxpayer name/TIN
- F-022 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Self versus other payer identification
- F-023 | CITIZEN — implement frontend | APPROVED REQUIREMENT  One-time payee without saving contact
- F-024 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Later save a payee from payment history
- F-025 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Typing someone’s TIN does not make their private payment history available to the payer.
- F-026 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Offer the existing Tax with Return payment form for one taxpayer and one assessment year.
- F-027 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Single taxpayer/beneficiary rule
- F-028 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Single assessment-year rule
- F-029 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Return-vs-other-head exclusivity
- F-030 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Self and third-party payer contexts
- F-031 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Validation and receipt consistency
- F-032 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Eligible head catalog and mapping
- F-033 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Multiple payees in a single payment
- F-034 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Multiple heads for one payee
- F-035 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Multiple years for any payee/head
- F-036 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Edit payment lines in a combined payment
- F-037 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Sum-of-payment lines and duplicate-line validation
- F-038 | CITIZEN — implement frontend | APPROVED REQUIREMENT  One combined receipt with individual line details
- F-039 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Existing beneficiary + one-time payee in one batch
- F-041 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Travel Tax taxpayer/passenger selection
- F-042 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Passport, route and passenger detail validation
- F-043 | CITIZEN — implement frontend | APPROVED REQUIREMENT  After a completed Travel Tax payment, show the saved receipt and generated Travel Tax Payment Certificate. Allow View, Print and Download PDF; keep recorded passenger lines and totals together under the original payment.
- F-044 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Responsive Travel Tax progressive form
- F-045 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Advance/source/other allowed payment journeys
- F-047 | CITIZEN — implement frontend | APPROVED REQUIREMENT  After each completed payment, show confirmation, its stable payment reference, receipt and Payment Certificate. Display normal payment wording in the interface; keep technical status values internal.
- F-048 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Store one original payment ID, one receipt and one Payment Certificate for each completed parent transaction. Retries, refreshes and repeated actions never create duplicates.
- F-049 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show one combined receipt and matching Payment Certificate with the parent total and each beneficiary, tax head, assessment year and amount.
- F-050 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Generate a Payment Certificate automatically for every successfully completed payment. Provide View, Print and Download PDF beside the receipt. Tax Credit Certificates are a separate existing feature.
- F-051 | CITIZEN — implement frontend | APPROVED REQUIREMENT  The existing homepage reference search and permitted payment history must retrieve the original receipt and Payment Certificate without generating another transaction or document.
- F-052 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show the Payment Certificate as a professional Sohojkor payment record. Do not display test-mode labels or internal success codes on the website, printable certificate or downloaded PDF. Do not claim unsupported NBR issuance or bank settlement.
- F-054 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show clear, ordinary payment status labels to users, backed by the actual saved result. Internal test or transaction codes are not user-facing, and the website must not claim an unverified external Treasury/bank settlement.
- F-055 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Create, rename, select and remove owned beneficiary lists; lists and members persist after sign-out and across browsers
- F-056 | CITIZEN — implement frontend | APPROVED REQUIREMENT  All Beneficiaries shows every owned entry, with one shared search/filter toolbar and no missing lists
- F-057 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Create, review, edit and delete one beneficiary from the existing form/Edit modal without deleting historical payments
- F-058 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Require a tag when adding or editing; choose correct existing relation/tag without duplicates
- F-059 | CITIZEN — implement frontend | APPROVED REQUIREMENT  For Others, allow free-text relation or tag details up to 80 characters
- F-060 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Use existing Clients, Friends & Family categories and supported family/friend relation options
- F-061 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Unified name/TIN/tag/list search and filters; desktop table and responsive mobile cards; Edit is secondary to Make Payment
- F-062 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Hide Excel import options for now. Keep the existing import feature untouched for possible later use.
- F-063 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Saved beneficiaries persist under the right logged-in taxpayer only; do not share one account’s lists with another
- F-064 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Office can view authorized payment-linked taxpayer and allocation data, not the taxpayer’s private address book
- F-065 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Payer Payment History supports reference, date, head, year, tag and beneficiary filters and opens the original receipt and Payment Certificate for permitted viewing, printing or downloading.
- F-066 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Recipient payment history shows only that taxpayer’s confirmed allocations; permitted certificate access cannot reveal protected information about other recipients.
- F-067 | CITIZEN — implement frontend | APPROVED REQUIREMENT  An owned beneficiary profile shows name, final tag, TIN, payment totals and links to the payer’s actual receipt and Payment Certificate.
- F-068 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Beneficiary-specific timeline shows only this payer’s payments for that TIN, with date, head, assessment year, amount, combined payment reference, receipt and Payment Certificate.
- F-069 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Filter the selected beneficiary’s history by tag, tax head, assessment year and date; never mix other accounts
- F-070 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Open original payment detail and combined receipt; show only this beneficiary’s allocation without losing full-batch context
- F-071 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Individual-row Pay Again action
- F-072 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Clone + add/remove/edit Pay Again payment lines
- F-073 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Current assessment year auto-fill; other assessment year explicitly re-entered
- F-074 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Export only this payer’s permitted payment history and matching filtered records.
- F-075 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Save draft, resume, and discard
- F-076 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Safe modal close/cancel with draft choice
- F-077 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Save signed-in taxpayers’ unfinished payment forms so they can be resumed.
- F-078 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Keep eligible guest payment draft details for the current guest session.
- F-079 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  When a saved draft has changed, restore or update it without losing the newer information.
- F-080 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  No draft mistaken for a completed payment
- F-081 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show the payer in-app success notice for each completed recorded payment.
- F-082 | CITIZEN — implement frontend | APPROVED REQUIREMENT  For a verified recipient TIN, show only their allocated received-payment notice, including amount, head, year and reference.
- F-083 | CITIZEN — implement frontend | APPROVED REQUIREMENT  At first successful demonstration login, retrieve saved unseen recipient-payment notices and display popup notifications one by one after the welcome message; retain every item in Notifications.
- F-084 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Keep one popup visible at a time; acknowledge/next advances to the following unseen notice and persists read state. Reopening the account does not replay acknowledged notices.
- F-085 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Provide the existing in-app notification list, filters and dated payment/correction entries, including acknowledged and unread notices.
- F-086 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Self/other/received unified chronological process
- F-087 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Correction, report and external event entries
- F-088 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Show only the correct account’s activity, without repeated entries.
- F-089 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Show new Office payment alerts and recover missed alerts when Office reconnects.
- F-090 | CITIZEN — implement frontend | APPROVED REQUIREMENT  User correction request form and evidence
- F-091 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Office correction queue / decision API
- F-092 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Show the Office correction decision and latest saved status to the taxpayer.
- F-093 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Corrections by specific authorized taxpayer TIN
- F-094 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Report unsolicited payment
- F-095 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Office case review, outcomes and notifications
- F-096 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Display confirmed external updates only when reliable linked information exists.
- F-097 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Keep previous taxpayer events in history when a correction or change is recorded.
- F-098 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Recorded payment totals and breakdowns
- F-099 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Dashboard shows Completed Payments, Saved Drafts and Correction Requests instead of old status indicators
- F-100 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Year and service filter
- F-101 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Spending by beneficiary tag/relationship
- F-102 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Recent payments and direct activity links
- F-103 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Empty-state accuracy: no invented balances
- F-104 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Office payment overview and transaction table
- F-105 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Transaction and payment line detail drawer
- F-106 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Admin taxpayer 360 timeline shows recorded payments, corrections, reports, TIN application/issuance and jurisdiction/name changes only when verified historical source events exist; present dated fishbone view.
- F-107 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Office may view the payment-linked list of payers/beneficiaries, relationships and allocation breakdowns for a taxpayer TIN, not the payer’s private saved-beneficiary address book.
- F-108 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Office/Admin sees the same original recorded payment reference and related receipt and Payment Certificate, with authorized allocation details and transaction notifications.
- F-109 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Reporting by year, head, payer, beneficiary
- F-110 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Show existing correction and unwanted-payment requests in Office.
- F-111 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Show payment summaries and reports from stored Office records, not manually entered totals.
- F-112 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Reuse the existing Office sign-in and permissions for Admin views. Do not add new roles or approval steps.
- F-113 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Keep complete payment details in the Sohojkor database, including each payer, recipient, head, year and amount.
- F-114 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Send recorded payments to Office without duplicates, including after retries.
- F-115 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Pass the same payment details from Sohojkor to Office and record when Office receives them.
- F-116 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  When delivery is repeated or delayed, Office must still save each payment once and in the correct order.
- F-117 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Keep original payment, allocation, receipt and Payment Certificate references consistent between Sohojkor SQL and Office SQL; preserve original history on retries and replays.
- F-118 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Payers and recipients see their own correct payment details and allocation amounts.
- F-119 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Keep in-app payment notices linked to the original transaction, including their read state.
- F-120 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Keep Sohojkor’s database separate from the Office database; match the relevant records between them.
- F-121 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Published Office banners, logos and colors appear the same on the public website.
- F-122 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Preserve responsive desktop/mobile and EN/BN screen, including mobile bottom navigation, floating Pay action and top-right Help icon
- F-123 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Keep existing keyboard, focus and modal behavior usable on desktop and mobile.
- F-124 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Each taxpayer and Office user sees only the records they should already be able to access.
- F-125 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Payment history, beneficiary lists and search remain responsive as the number of records grows.
- F-126 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  The website, stored Sohojkor records and Office view show matching payment details.
- F-129 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  The live website displays the correct saved transaction and receipt details.
- F-130 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Preserve existing payment journeys and the separate Sohojkor and Office databases while improving the system.
- F-131 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show the external-data dashboard row only after successful non-empty retrieval; otherwise remove the row and shift content up
- F-132 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Dedicated Tax Credit Certificates menu for eligible existing tax-credit documents. Keep these source-specific records separate from the automatically generated Sohojkor Payment Certificate for each completed payment.
- F-133 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show Travel Tax under Pay Tax dropdown; never duplicate it as a top-level menu
- F-134 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Beneficiary list/profile display: first line taxpayer name · final tag; second line TIN digits only, no repeated label
- F-135 | SHARED CONTRACT — citizen consumer only; backend frozen | APPROVED REQUIREMENT  Office preview and live banner match: fixed left content, slide artwork/colours, no extra Taxpayer zoom or crop
- F-136 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Saved-first TIN discovery; explicit fallback lookup, 30 sample suggestion profiles and confirmation
- F-137 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Exhaustive valid/invalid combination matrix for Return versus all mapped non-Return heads
- F-138 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Individual payment-row Pay Again action with full original batch reconstruction
- F-139 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Bilingual static step-by-step user guides for each payment service
- F-140 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Bilingual FAQ and plain-language payment terminology glossary
- F-141 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Static contact/help information and checked official resource links
- F-142 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Privacy, terms, current demonstration system boundaries and legal information pages
- F-143 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Keep existing public guides up to date and show their last-updated date.
- F-144 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Travel Tax access for visitors and signed-in taxpayers
- F-145 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Choose land or water travel
- F-146 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Choose departure port without guessing tax zone
- F-147 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Enter destination and planned travel date
- F-148 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Enter a Bangladeshi passenger passport
- F-149 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Enter a foreign passenger passport and nationality country
- F-150 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Calculate a passenger’s age on the travel date
- F-151 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show sample Travel Tax amounts for each passenger
- F-152 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Add several passengers to one Travel Tax payment
- F-153 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Edit or remove a passenger before confirming
- F-154 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Prevent duplicate passports and incomplete passengers
- F-155 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Explicitly confirm each traveller
- F-156 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Handle medical exemption/referral without falsely granting relief
- F-157 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Collect required contact mobile without forcing email
- F-158 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Choose available payment channel and method
- F-159 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Show a full Travel Tax review before payment
- F-160 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Save Travel Tax payment once and show one complete receipt
- F-161 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Save and resume a signed-in traveller’s unfinished Travel Tax form.
- F-162 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Guest and signed-in Travel Tax payment history retains the original receipt and generated Payment Certificate under the same transaction reference.
- F-163 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Travel Tax Pay Again creates a new payment and new Payment Certificate after successful completion. Preserve the previous transaction and its certificate.
- F-164 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Travel Tax beneficiary/recipient visibility and Office reporting
- F-165 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Travel Tax mobile, Bangla and English usability
- F-166 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Single taxpayer profile with the 24 agreed registration fields and top summary. Keep the current TIN, phone and email masking with eye/copy actions; use the existing certificate view.
- F-167 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Optional walk-in payer TIN: search and confirm a match, then link the recorded payment to the payer’s verified account history
- F-168 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Signed-in taxpayer can view available certificates, ledger, payment history and receipts, including automatically generated Payment Certificates, and view, print or download each permitted document.
- F-169 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Require existing taxpayer sign-in before starting a correction, including payments originally made as walk-in
- F-170 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Complete verified taxpayer event history in Admin with a dated fishbone timeline (TIN application/issue, jurisdiction, name changes, corrections and payments)
- F-171 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Keep “Find a payment record” below the homepage banner. Search by challan, token or transaction reference and display the permitted result or a clear no-match message.
- F-172 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Every successfully completed payment automatically generates exactly one Sohojkor Payment Certificate, separate from its receipt. For Tax with Return, Other Tax, combined payments, self/others, Pay Again and Travel Tax, generate it from the original saved transaction with a stable certificate reference, payment date, payer/recipient and itemized heads, years or passenger lines, amounts and total. Show View, Print and Download PDF on success and permitted history/reference pages. For a combined payment, issue one combined certificate. Do not expose test labels, internal technical statuses or fake government validation/settlement claims.
- F-173 | DEFERRED PROPOSAL | UNAPPROVED CANDIDATE  Existing public guide-based Help chat: open panel, ask a supported payment/receipt question, receive an answer from maintained guide content and close or recover safely. No external AI service is introduced.
- F-174 | DEFERRED PROPOSAL | UNAPPROVED CANDIDATE  Existing public payment-head catalogue: browse and filter reference heads, distinguish mapped from unapproved records and link to only eligible payment choices.
- F-175 | DEFERRED PROPOSAL | UNAPPROVED CANDIDATE  Existing signed-in account profile settings: edit supported display name and preferences, save per account and restore on refresh without altering taxpayer TIN-registration data.
- F-176 | DEFERRED PROPOSAL | UNAPPROVED CANDIDATE  Existing account notification preference control: enable/disable in-app account alerts without deleting historic notices or introducing email/SMS.
- F-177 | OFFICE-ONLY — no implementation; preserve existing boundary | APPROVED REQUIREMENT  Detailed Taxpayer Ledger in Office Management: maintain a consolidated, transaction-level view of tax payments and verified tax deductions regardless of payment method/source. Include BRTA, e-TDS, iBAS++, NSD, Sub-Registrar Office, Bank and SA Coder source categories, and persist the corresponding Dhara, Source and Payment Amount with source reference/provenance, taxpayer identity and necessary reconciliation fields. Preserve separate Taxpayer and Office SQL/auth architectures; do not fabricate unavailable external integrations.
- F-178 | CITIZEN — implement frontend | APPROVED REQUIREMENT  Add a dedicated optional multiline Remarks / Comments field to the existing challan payment journey. Accept free-text information in English and Bengali beyond the current 20-character limit; persist it in the original challan/payment record, retain it in review/drafts/Pay Again and read it in permitted taxpayer and Office details without truncation or changes to structured payment rules.

## Full feature records — all source wording and cases
### F-001
**Scope:** CITIZEN — implement frontend

F-001  |  P1  |  APPROVED
APPROVED REQUIREMENT  Sohojkor homepage: guest payment entry, payment-record search and the six existing benefit cards. Keep “How your payment works” and “Common questions” hidden.
System: Taxpayer website  •  Story links: US-172, US-056, US-067  •  Current state: UNVERIFIED
F-001-T01 SUCCESS  ACT: Open the existing public homepage at approved desktop/mobile EN/BN; use guest Pay Tax and record lookup, inspect all six approved benefit slots, confirm two excluded sections absent.  EXPECT: All original six approved benefit links/destinations function, guest payment is accessible, lookup works with permitted record, hidden sections stay hidden and no visual redesign.
F-001-T02 NEGATIVE/PERMISSION  ACT: Invalid/restricted reference never leaks private status/history; forbidden beneficiary/profile benefits remain absent.  EXPECT: Invalid/restricted reference never leaks private status/history; forbidden beneficiary/profile benefits remain absent.
F-001-T03 RECOVERY  ACT: Reload/search failure preserves exact approved layout and allows retry.  EXPECT: Reload/search failure preserves exact approved layout and allows retry.
F-001-T04 PERSISTENCE/PARITY  ACT: Original lookup source ID and result provenance; screen comparison at approved variants and all six slot destinations.  EXPECT: Original lookup source ID and result provenance; screen comparison at approved variants and all six slot destinations.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-002
**Scope:** CITIZEN — implement frontend

F-002  |  P3  |  APPROVED
APPROVED REQUIREMENT  Public service catalogue, guidance and discovery
System: Taxpayer website  •  Story links: US-056, US-136, US-175, US-057  •  Current state: UNVERIFIED
Trace exception  {'US-057': 'Related public entry only; not functional coverage of public issue submission.'}
F-002-T01 SUCCESS  ACT: As guest open public catalogue and guidance, browse payment services and approved help links without sign-in.  EXPECT: Public discovery available; general public support reporting US-057 is separately UNVERIFIED until existing intake contract verified.
F-002-T02 NEGATIVE/PERMISSION  ACT: Do not substitute F-094 unwanted-payment case for general help report or add new service.  EXPECT: Do not substitute F-094 unwanted-payment case for general help report or add new service.
F-002-T03 RECOVERY  ACT: Retry failed guidance route; maintain guest navigation.  EXPECT: Retry failed guidance route; maintain guest navigation.
F-002-T04 PERSISTENCE/PARITY  ACT: Published existing service content/paths match public UI; no account write.  EXPECT: Published existing service content/paths match public UI; no account write.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-003
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-003  |  P2  |  APPROVED
APPROVED REQUIREMENT  Office-owned logo upload, preview and crop
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-026, US-027, US-028  •  Current state: UNVERIFIED
F-003-T01 SUCCESS  ACT: Office content Admin selects approved Sohojkor logo asset using existing CMS upload/edit path, previews and publishes only approved version.  EXPECT: Office-owned logo upload, preview and crop
F-003-T02 NEGATIVE/PERMISSION  ACT: Reject unauthorized logo publication and unacceptable asset; never redesign owner-supplied logo.  EXPECT: Reject unauthorized logo publication and unacceptable asset; never redesign owner-supplied logo
F-003-T03 RECOVERY  ACT: Return to saved draft after upload failure, preserving last published logo.  EXPECT: Return to saved draft after upload failure, preserving last published logo
F-003-T04 PERSISTENCE/PARITY  ACT: Office logo asset/version and public asset URL/content match; no payment data changed.  EXPECT: Office logo asset/version and public asset URL/content match; no payment data changed
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-004
**Scope:** CITIZEN — implement frontend

F-004  |  P2  |  APPROVED
APPROVED REQUIREMENT  Five-banner carousel: fixed left heading, description and both buttons while images and image-based colours change
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-030, US-033, US-037, US-040  •  Current state: UNVERIFIED
F-004-T01 SUCCESS  ACT: Observe full banner cycle: images dissolve; left heading/description/two buttons remain stationary.  EXPECT: Five-banner carousel: fixed left heading, description and both buttons while images and image-based colours change
F-004-T02 NEGATIVE/PERMISSION  ACT: Disable/reduce motion and ensure no horizontal slide or moving left copy.  EXPECT: Disable/reduce motion and ensure no horizontal slide or moving left copy
F-004-T03 RECOVERY  ACT: Reload during transition and verify image visibility and button access remain safe.  EXPECT: Reload during transition and verify image visibility and button access remain safe
F-004-T04 PERSISTENCE/PARITY  ACT: Existing slide timing/transition settings and fixed-left content retained.  EXPECT: Existing slide timing/transition settings and fixed-left content retained
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-005
**Scope:** CITIZEN — implement frontend

F-005  |  P2  |  APPROVED
APPROVED REQUIREMENT  Keep image-derived banner colours: light background, dark text and outline-button colour on every slide
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-032, US-033  •  Current state: UNVERIFIED
F-005-T01 SUCCESS  ACT: Cycle all five images and confirm slide-specific derived backgrounds, dark text and secondary outline button colors.  EXPECT: Keep image-derived banner colours: light background, dark text and outline-button colour on every slide
F-005-T02 NEGATIVE/PERMISSION  ACT: Check color mismatch/poor contrast on one image; do not silently use unrelated global palette.  EXPECT: Check color mismatch/poor contrast on one image; do not silently use unrelated global palette
F-005-T03 RECOVERY  ACT: Reload a slide after analysis interruption and restore same image-specific colors.  EXPECT: Reload a slide after analysis interruption and restore same image-specific colors
F-005-T04 PERSISTENCE/PARITY  ACT: Office published per-slide image+palette and taxpayer public computed colors agree.  EXPECT: Office published per-slide image+palette and taxpayer public computed colors agree
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-006
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-006  |  P2  |  APPROVED
APPROVED REQUIREMENT  Office preview shows the complete fixed-left banner layout, changing image, colours and both actions
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-034, US-038  •  Current state: UNVERIFIED
F-006-T01 SUCCESS  ACT: Preview complete Office banner with current image, fixed left copy, two buttons and responsive crop; compare to published render.  EXPECT: Office preview shows the complete fixed-left banner layout, changing image, colours and both actions
F-006-T02 NEGATIVE/PERMISSION  ACT: Reject taxpayer-side extra zoom/crop and preview that hides any action.  EXPECT: Reject taxpayer-side extra zoom/crop and preview that hides any action
F-006-T03 RECOVERY  ACT: After edit cancellation/public reload, preserve previously published full layout.  EXPECT: After edit cancellation/public reload, preserve previously published full layout
F-006-T04 PERSISTENCE/PARITY  ACT: Pixel/context comparison at agreed breakpoints and Office asset versions match without cropping.  EXPECT: Pixel/context comparison at agreed breakpoints and Office asset versions match without cropping
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-007
**Scope:** CITIZEN — implement frontend

F-007  |  P2  |  APPROVED
APPROVED REQUIREMENT  Keep all five banner images, smooth dissolve, existing timing, order, visibility and navigation
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-031, US-035, US-040  •  Current state: UNVERIFIED
F-007-T01 SUCCESS  ACT: Observe all five banner images through repeated smooth dissolve, then verify saved Office order, visibility, timing and navigation without moving fixed-left content.  EXPECT: Keep all five banner images, smooth dissolve, existing timing, order, visibility and navigation
F-007-T02 NEGATIVE/PERMISSION  ACT: Disable/reduce motion and ensure no horizontal slide or moving left copy.  EXPECT: Disable/reduce motion and ensure no horizontal slide or moving left copy
F-007-T03 RECOVERY  ACT: Reload during transition and verify image visibility and button access remain safe.  EXPECT: Reload during transition and verify image visibility and button access remain safe
F-007-T04 PERSISTENCE/PARITY  ACT: Existing slide timing/transition settings and fixed-left content retained.  EXPECT: Existing slide timing/transition settings and fixed-left content retained
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-008
**Scope:** CITIZEN — implement frontend

F-008  |  P2  |  APPROVED
APPROVED REQUIREMENT  Banner buttons open only the existing Pay Tax journey or the separate Pay Travel Tax journey
System: Taxpayer website  •  Story links: US-039  •  Current state: UNVERIFIED
F-008-T01 SUCCESS  ACT: From each of the two banner buttons open existing Pay Tax and separate Travel Tax for guest and signed-in contexts, then Back.  EXPECT: Banner buttons open only the existing Pay Tax journey or the separate Pay Travel Tax journey
F-008-T02 NEGATIVE/PERMISSION  ACT: No third wizard or wrong destination; neither button may open the other's form.  EXPECT: No third wizard or wrong destination; neither button may open the other's form
F-008-T03 RECOVERY  ACT: Back from either journey returns to landing without resetting unrelated state.  EXPECT: Back from either journey returns to landing without resetting unrelated state
F-008-T04 PERSISTENCE/PARITY  ACT: Two correct established route identifiers and existing published action links remain intact.  EXPECT: Two correct established route identifiers and existing published action links remain intact
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-009
**Scope:** CITIZEN — implement frontend

F-009  |  P2  |  APPROVED
APPROVED REQUIREMENT  Published Office banner/image/colour data appears exactly in the taxpayer application
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-029, US-036  •  Current state: UNVERIFIED
F-009-T01 SUCCESS  ACT: Publish an approved Office banner edit and compare Taxpayer homepage image, colors, left copy, two links, order and mobile treatment.  EXPECT: Published Office banner/image/colour data appears exactly in the taxpayer application
F-009-T02 NEGATIVE/PERMISSION  ACT: Reject stale cached public version or taxpayer-side recomputation that changes artwork/colors.  EXPECT: Reject stale cached public version or taxpayer-side recomputation that changes artwork/colors
F-009-T03 RECOVERY  ACT: Reload after cached asset invalidation and verify same published revision.  EXPECT: Reload after cached asset invalidation and verify same published revision
F-009-T04 PERSISTENCE/PARITY  ACT: Office publish ID and public banner version, paths and visual state match.  EXPECT: Office publish ID and public banner version, paths and visual state match
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-010
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-010  |  P2  |  APPROVED
APPROVED REQUIREMENT  Publish history, conflict detection and rollback
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-041, US-066  •  Current state: UNVERIFIED
F-010-T01 SUCCESS  ACT: Open version history, edit candidate publication, trigger stale-version conflict and recover via authorized retry.  EXPECT: Publish history, conflict detection and rollback
F-010-T02 NEGATIVE/PERMISSION  ACT: Reject conflicting stale write without overriding newly published content.  EXPECT: Reject conflicting stale write without overriding newly published content
F-010-T03 RECOVERY  ACT: Recover previously approved version from Office publish history.  EXPECT: Recover previously approved version from Office publish history
F-010-T04 PERSISTENCE/PARITY  ACT: Office actor/time/version audit and public published revision consistent.  EXPECT: Office actor/time/version audit and public published revision consistent
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-011
**Scope:** CITIZEN — implement frontend

F-011  |  P1  |  APPROVED
APPROVED REQUIREMENT  Allow a TIN holder to pay without signing in; the recipient can receive eligible payments even before first login.
System: Taxpayer website  •  Story links: US-001, US-003, US-075  •  Current state: UNVERIFIED
F-011-T01 SUCCESS  ACT: As guest begin a permitted TIN payment; separately verify received allocation for TIN holder before first sign-in, then sign in as verified recipient.  EXPECT: No forced sign-in for guest; prior received allocation appears after verified first login; ownership proven by existing identity method.
F-011-T02 NEGATIVE/PERMISSION  ACT: Typed TIN alone never grants record ownership, unrelated account sees nothing.  EXPECT: Typed TIN alone never grants record ownership, unrelated account sees nothing.
F-011-T03 RECOVERY  ACT: Reconnect/reload after first sign-in and load same received payment and notification once.  EXPECT: Reconnect/reload after first sign-in and load same received payment and notification once.
F-011-T04 PERSISTENCE/PARITY  ACT: Original parent/allocation recipient IDs and verified account relation match expected; source/Office applicable.  EXPECT: Original parent/allocation recipient IDs and verified account relation match expected; source/Office applicable.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-012
**Scope:** CITIZEN — implement frontend

F-012  |  P1  |  APPROVED
APPROVED REQUIREMENT  Use the existing Sohojkor sign-in screen. Keep official eReturn credential integration deferred; do not add a production login method.
System: Taxpayer website  •  Story links: US-004, US-074  •  Current state: UNVERIFIED
F-012-T01 SUCCESS  ACT: Open existing sign-in screen as visitor; exercise existing permitted sign-in path and confirm no new eReturn production credential option.  EXPECT: Only previously approved sign-in entry and login behavior appear; no new role selector/auth scheme or production eReturn credential integration.
F-012-T02 NEGATIVE/PERMISSION  ACT: Unauthorized or invalid sign-in denied; demonstration OTP cannot authenticate production.  EXPECT: Unauthorized or invalid sign-in denied; demonstration OTP cannot authenticate production.
F-012-T03 RECOVERY  ACT: Retry an interrupted existing sign-in without unexpected account switch.  EXPECT: Retry an interrupted existing sign-in without unexpected account switch.
F-012-T04 PERSISTENCE/PARITY  ACT: Authorized session identity, existing route, and account-only records match permitted role; no new auth/SQL schema.  EXPECT: Authorized session identity, existing route, and account-only records match permitted role; no new auth/SQL schema.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-013
**Scope:** CITIZEN — implement frontend

F-013  |  P1  |  APPROVED
APPROVED REQUIREMENT  On the first demonstration login, show the demo-only OTP step (111111), complete demo sign-in automatically after the correct entry, show success, then show saved unseen payment notices one by one. This demo code must not authenticate production accounts.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-004, US-085  •  Current state: UNVERIFIED
F-013-T01 SUCCESS  ACT: On isolated demonstration first login enter demo-only OTP; show welcome first and all queued unseen notifications sequentially, retaining acknowledgement and denying this OTP to production.  EXPECT: On the first demonstration login, show the demo-only OTP step (111111), complete demo sign-in automatically after the correct entry, show success, then show saved unseen payment notices one by one. This demo code must not authenticate production accounts.
F-013-T02 NEGATIVE/PERMISSION  ACT: Reject incorrect OTP; never let demonstration OTP authenticate a production account or reveal another account's notices.  EXPECT: Reject incorrect OTP; never let demonstration OTP authenticate a production account or reveal another account's notices
F-013-T03 RECOVERY  ACT: Interrupt between acknowledgement and next queued popup; reopen demonstration account and resume only unread items.  EXPECT: Interrupt between acknowledgement and next queued popup; reopen demonstration account and resume only unread items
F-013-T04 PERSISTENCE/PARITY  ACT: Verified demo account binding and per-event notice IDs/read timestamps persist without duplicate popup.  EXPECT: Verified demo account binding and per-event notice IDs/read timestamps persist without duplicate popup
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-015
**Scope:** CITIZEN — implement frontend

F-015  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show the signed-in taxpayer’s correct TIN details and account records.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-167, US-076  •  Current state: UNVERIFIED
F-015-T01 SUCCESS  ACT: Sign into User1 existing profile, inspect one page and top summary plus all code-defined certificate fields and actions.  EXPECT: Show the signed-in taxpayer’s correct TIN details and account records.
F-015-T02 NEGATIVE/PERMISSION  ACT: No duplicate Overview/TIN tabs, detached Account card or invented source values.  EXPECT: No duplicate Overview/TIN tabs, detached Account card or invented source values
F-015-T03 RECOVERY  ACT: Reload profile from authorized SQL after error, retaining masked eye/copy controls.  EXPECT: Reload profile from authorized SQL after error, retaining masked eye/copy controls
F-015-T04 PERSISTENCE/PARITY  ACT: 24 declared code rows and original certificate source values must be compared externally; exact Office projection unverified until readback.  EXPECT: 24 declared code rows and original certificate source values must be compared externally; exact Office projection unverified until readback
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-016
**Scope:** CITIZEN — implement frontend

F-016  |  P1  |  APPROVED
APPROVED REQUIREMENT  After verified sign-in, show the eligible earlier guest payments linked to the taxpayer account using the existing ownership method; entering a TIN alone is not proof.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-074, US-075, US-159  •  Current state: UNVERIFIED
F-016-T01 SUCCESS  ACT: Sign in as verified payer after previously completed eligible guest payment and find exact source payment in own history.  EXPECT: After verified sign-in, show the eligible earlier guest payments linked to the taxpayer account using the existing ownership method; entering a TIN alone is not proof.
F-016-T02 NEGATIVE/PERMISSION  ACT: Typed TIN alone or unrelated sign-in must not claim guest financial history.  EXPECT: Typed TIN alone or unrelated sign-in must not claim guest financial history
F-016-T03 RECOVERY  ACT: Sign out/in again and recover history using established account binding.  EXPECT: Sign out/in again and recover history using established account binding
F-016-T04 PERSISTENCE/PARITY  ACT: Verified payer binding joins only allowed guest parent IDs and receipt links.  EXPECT: Verified payer binding joins only allowed guest parent IDs and receipt links
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-017
**Scope:** CITIZEN — implement frontend

F-017  |  P1  |  APPROVED
APPROVED REQUIREMENT  Existing sign-out works; the next account sees only its own records.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-122, US-076  •  Current state: UNVERIFIED
F-017-T01 SUCCESS  ACT: Sign into taxpayer A, open private account; sign out and sign into B, inspect no A data remains.  EXPECT: Existing sign-out works; the next account sees only its own records.
F-017-T02 NEGATIVE/PERMISSION  ACT: Reject reuse of stale A token or cached private data after logout.  EXPECT: Reject reuse of stale A token or cached private data after logout
F-017-T03 RECOVERY  ACT: Refresh protected page after sign-out, route to existing safe sign-in state.  EXPECT: Refresh protected page after sign-out, route to existing safe sign-in state
F-017-T04 PERSISTENCE/PARITY  ACT: Session invalidated and account-isolation query denies A data to B.  EXPECT: Session invalidated and account-isolation query denies A data to B
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-018
**Scope:** CITIZEN — implement frontend

F-018  |  P2  |  APPROVED
APPROVED REQUIREMENT  Language and account preference saved information
System: Taxpayer website · Sohojkor SQL  •  Story links: US-043, US-176  •  Current state: UNVERIFIED
F-018-T01 SUCCESS  ACT: Save signed-in language selection, sign out and back into same account, then inspect selected language.  EXPECT: Language and account preference saved information
F-018-T02 NEGATIVE/PERMISSION  ACT: Second account must not inherit first account's private preference.  EXPECT: Second account must not inherit first account's private preference
F-018-T03 RECOVERY  ACT: Refresh and sign in again; restore same selected language.  EXPECT: Refresh and sign in again; restore same selected language
F-018-T04 PERSISTENCE/PARITY  ACT: Saved account preference owner ID and resulting EN/BN navigation match.  EXPECT: Saved account preference owner ID and resulting EN/BN navigation match
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-019
**Scope:** CITIZEN — implement frontend

F-019  |  P1  |  APPROVED
APPROVED REQUIREMENT  Saved beneficiary search and suggestion
System: Taxpayer website · Sohojkor SQL  •  Story links: US-015, US-132  •  Current state: UNVERIFIED
F-019-T01 SUCCESS  ACT: In payment TIN selector type saved beneficiary; see saved match first; for absent match use explicit TIN fallback and confirm.  EXPECT: Saved beneficiary search and suggestion
F-019-T02 NEGATIVE/PERMISSION  ACT: Do not confuse 30 example suggestions with verified TIN match or private list membership.  EXPECT: Do not confuse 30 example suggestions with verified TIN match or private list membership
F-019-T03 RECOVERY  ACT: Recover failed fallback request and confirm correct taxpayer without auto-saving.  EXPECT: Recover failed fallback request and confirm correct taxpayer without auto-saving
F-019-T04 PERSISTENCE/PARITY  ACT: Selected TIN/person is explicit and owned saved/fallback status retained correctly.  EXPECT: Selected TIN/person is explicit and owned saved/fallback status retained correctly
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-020
**Scope:** CITIZEN — implement frontend

F-020  |  P1  |  APPROVED
APPROVED REQUIREMENT  TIN input format and user lookup
System: Taxpayer website · Sohojkor SQL  •  Story links: US-015, US-132  •  Current state: UNVERIFIED
F-020-T01 SUCCESS  ACT: Enter valid existing 12-digit TIN in saved lookup then explicit external fallback and confirm matching name/TIN.  EXPECT: TIN format validation, lookup response, selected name and TIN match; saved-first behavior preserved.
F-020-T02 NEGATIVE/PERMISSION  ACT: Too-short/long/non-digit/mismatched/unmatched TIN rejected without treating sample suggestions as identity proof.  EXPECT: Too-short/long/non-digit/mismatched/unmatched TIN rejected without treating sample suggestions as identity proof.
F-020-T03 RECOVERY  ACT: Timeout and retry retain exact input; no phantom profile or auto-saved contact.  EXPECT: Timeout and retry retain exact input; no phantom profile or auto-saved contact.
F-020-T04 PERSISTENCE/PARITY  ACT: Selected target TIN equals verified lookup record; no private history or owner session created by lookup.  EXPECT: Selected target TIN equals verified lookup record; no private history or owner session created by lookup.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-021
**Scope:** CITIZEN — implement frontend

F-021  |  P1  |  APPROVED
APPROVED REQUIREMENT  Confirmation of selected taxpayer name/TIN
System: Taxpayer website  •  Story links: US-015, US-001  •  Current state: UNVERIFIED
F-021-T01 SUCCESS  ACT: Type known saved TIN in payment lookup and observe saved match first; type absent valid TIN, use explicit fallback, confirm name/TIN and continue.  EXPECT: Confirmation of selected taxpayer name/TIN
F-021-T02 NEGATIVE/PERMISSION  ACT: Reject malformed or unmatched TIN without implying a sample suggestion is verified identity.  EXPECT: Reject malformed or unmatched TIN without implying a sample suggestion is verified identity
F-021-T03 RECOVERY  ACT: Recover failed fallback lookup and confirm correct same TIN before continuing.  EXPECT: Recover failed fallback lookup and confirm correct same TIN before continuing
F-021-T04 PERSISTENCE/PARITY  ACT: Lookup and selected TIN correspond; no account authorization or private history granted by entry alone.  EXPECT: Lookup and selected TIN correspond; no account authorization or private history granted by entry alone
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-022
**Scope:** CITIZEN — implement frontend

F-022  |  P1  |  APPROVED
APPROVED REQUIREMENT  Self versus other payer identification
System: Taxpayer website · Sohojkor SQL  •  Story links: US-016, US-003  •  Current state: UNVERIFIED
F-022-T01 SUCCESS  ACT: Run one self-payment path and another third-party payer/recipient path, keeping payer identity separate from beneficiary TIN.  EXPECT: Both self and others contexts use correct existing journeys and saved transaction payer/recipient distinctions.
F-022-T02 NEGATIVE/PERMISSION  ACT: Never substitute recipient TIN for payer identity or auto-assign account ownership from typed TIN.  EXPECT: Never substitute recipient TIN for payer identity or auto-assign account ownership from typed TIN.
F-022-T03 RECOVERY  ACT: Back and resume payer-selection without losing confirmed recipient or switching context.  EXPECT: Back and resume payer-selection without losing confirmed recipient or switching context.
F-022-T04 PERSISTENCE/PARITY  ACT: Original payer ID/TIN and each recipient/amount remain correctly separated in source and Office.  EXPECT: Original payer ID/TIN and each recipient/amount remain correctly separated in source and Office.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-023
**Scope:** CITIZEN — implement frontend

F-023  |  P1  |  APPROVED
APPROVED REQUIREMENT  One-time payee without saving contact
System: Taxpayer website · Sohojkor SQL  •  Story links: US-016  •  Current state: UNVERIFIED
F-023-T01 SUCCESS  ACT: Pay another taxpayer once through fresh TIN lookup without saving, then separately exercise the saved-beneficiary selection flow and verify both reach same payment review.  EXPECT: One-time payee without saving contact
F-023-T02 NEGATIVE/PERMISSION  ACT: Do not require saving a new contact to complete a permitted one-time payment; reject invalid lookup.  EXPECT: Do not require saving a new contact to complete a permitted one-time payment; reject invalid lookup
F-023-T03 RECOVERY  ACT: Back from payment form to recipient choice and re-enter one-time TIN without losing completed original payment.  EXPECT: Back from payment form to recipient choice and re-enter one-time TIN without losing completed original payment
F-023-T04 PERSISTENCE/PARITY  ACT: Financial transaction has correct recipient regardless of private address-book membership; no unintended contact creation.  EXPECT: Financial transaction has correct recipient regardless of private address-book membership; no unintended contact creation
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-024
**Scope:** CITIZEN — implement frontend

F-024  |  P1  |  APPROVED
APPROVED REQUIREMENT  Later save a payee from payment history
System: Taxpayer website · Sohojkor SQL  •  Story links: US-017  •  Current state: UNVERIFIED
F-024-T01 SUCCESS  ACT: From an existing authorized one-time payment row choose Save Beneficiary, assign list and mandatory final tag, save and open new profile.  EXPECT: Later save a payee from payment history
F-024-T02 NEGATIVE/PERMISSION  ACT: Reject save without tag or attempted save to someone else's list.  EXPECT: Reject save without tag or attempted save to someone else's list
F-024-T03 RECOVERY  ACT: After save, refresh or change browser; saved beneficiary remains while historical payment unchanged.  EXPECT: After save, refresh or change browser; saved beneficiary remains while historical payment unchanged
F-024-T04 PERSISTENCE/PARITY  ACT: New owner-specific contact references original recipient TIN; original paid ID/allocations unchanged.  EXPECT: New owner-specific contact references original recipient TIN; original paid ID/allocations unchanged
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-025
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-025  |  P1  |  APPROVED
APPROVED REQUIREMENT  Typing someone’s TIN does not make their private payment history available to the payer.
System: Sohojkor SQL  •  Story links: US-076, US-101  •  Current state: UNVERIFIED
F-025-T01 SUCCESS  ACT: Switch accounts A and B after loading private payer history and verify only active owner's records display.  EXPECT: Typing someone’s TIN does not make their private payment history available to the payer.
F-025-T02 NEGATIVE/PERMISSION  ACT: Entering another TIN or reusing cached A rows must not reveal A after B login.  EXPECT: Entering another TIN or reusing cached A rows must not reveal A after B login
F-025-T03 RECOVERY  ACT: Sign out, clear active session, sign into B and refresh protected views.  EXPECT: Sign out, clear active session, sign into B and refresh protected views
F-025-T04 PERSISTENCE/PARITY  ACT: Account owner/session claims isolate payments, beneficiaries, drafts and corrections.  EXPECT: Account owner/session claims isolate payments, beneficiaries, drafts and corrections
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-026
**Scope:** CITIZEN — implement frontend

F-026  |  P1  |  APPROVED
APPROVED REQUIREMENT  Offer the existing Tax with Return payment form for one taxpayer and one assessment year.
System: Taxpayer website  •  Story links: US-001, US-005  •  Current state: UNVERIFIED
F-026-T01 SUCCESS  ACT: Open Return payment as guest and signed-in payer, select exactly one beneficiary and one AY, review and submit valid exclusive transaction.  EXPECT: Offer the existing Tax with Return payment form for one taxpayer and one assessment year.
F-026-T02 NEGATIVE/PERMISSION  ACT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation.  EXPECT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation
F-026-T03 RECOVERY  ACT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction.  EXPECT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction
F-026-T04 PERSISTENCE/PARITY  ACT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office.  EXPECT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-027
**Scope:** CITIZEN — implement frontend

F-027  |  P1  |  APPROVED
APPROVED REQUIREMENT  Single taxpayer/beneficiary rule
System: Taxpayer website · Sohojkor SQL  •  Story links: US-005  •  Current state: UNVERIFIED
F-027-T01 SUCCESS  ACT: Open Return payment as guest and signed-in payer, select exactly one beneficiary and one AY, review and submit valid exclusive transaction.  EXPECT: Single taxpayer/beneficiary rule
F-027-T02 NEGATIVE/PERMISSION  ACT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation.  EXPECT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation
F-027-T03 RECOVERY  ACT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction.  EXPECT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction
F-027-T04 PERSISTENCE/PARITY  ACT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office.  EXPECT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-028
**Scope:** CITIZEN — implement frontend

F-028  |  P1  |  APPROVED
APPROVED REQUIREMENT  Single assessment-year rule
System: Taxpayer website · Sohojkor SQL  •  Story links: US-005  •  Current state: UNVERIFIED
F-028-T01 SUCCESS  ACT: Open Return payment as guest and signed-in payer, select exactly one beneficiary and one AY, review and submit valid exclusive transaction.  EXPECT: Single assessment-year rule
F-028-T02 NEGATIVE/PERMISSION  ACT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation.  EXPECT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation
F-028-T03 RECOVERY  ACT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction.  EXPECT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction
F-028-T04 PERSISTENCE/PARITY  ACT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office.  EXPECT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-029
**Scope:** CITIZEN — implement frontend

F-029  |  P1  |  APPROVED
APPROVED REQUIREMENT  Return-vs-other-head exclusivity
System: Taxpayer website · Sohojkor SQL  •  Story links: US-005, US-107  •  Current state: UNVERIFIED
F-029-T01 SUCCESS  ACT: Open Return payment as guest and signed-in payer, select exactly one beneficiary and one AY, review and submit valid exclusive transaction.  EXPECT: Return-vs-other-head exclusivity
F-029-T02 NEGATIVE/PERMISSION  ACT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation.  EXPECT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation
F-029-T03 RECOVERY  ACT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction.  EXPECT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction
F-029-T04 PERSISTENCE/PARITY  ACT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office.  EXPECT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-030
**Scope:** CITIZEN — implement frontend

F-030  |  P1  |  APPROVED
APPROVED REQUIREMENT  Self and third-party payer contexts
System: Taxpayer website · Sohojkor SQL  •  Story links: US-001, US-005  •  Current state: UNVERIFIED
F-030-T01 SUCCESS  ACT: Run exclusive one-AY Tax with Return for self as guest and for a separately confirmed other taxpayer; keep payer distinct and reject extra heads or beneficiaries.  EXPECT: Self and third-party payer contexts
F-030-T02 NEGATIVE/PERMISSION  ACT: Try adding a second beneficiary, a second AY or another head to Tax with Return; reject before financial submission.  EXPECT: Try adding a second beneficiary, a second AY or another head to Tax with Return; reject before financial submission
F-030-T03 RECOVERY  ACT: Interrupt after guest confirmation; reopen by saved reference and later verified sign-in without duplicating the payment.  EXPECT: Interrupt after guest confirmation; reopen by saved reference and later verified sign-in without duplicating the payment
F-030-T04 PERSISTENCE/PARITY  ACT: Original parent ID, receipt/certificate IDs and verified account linkage match Taxpayer SQL and permitted Office mirror.  EXPECT: Original parent ID, receipt/certificate IDs and verified account linkage match Taxpayer SQL and permitted Office mirror
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-031
**Scope:** CITIZEN — implement frontend

F-031  |  P1  |  APPROVED
APPROVED REQUIREMENT  Validation and receipt consistency
System: Taxpayer website · Sohojkor SQL  •  Story links: US-001, US-005  •  Current state: UNVERIFIED
F-031-T01 SUCCESS  ACT: Complete authorized Tax with Return after invalid-form checks, then compare receipt TIN, AY, amount, stable transaction reference and actual stored parent with source and Office.  EXPECT: Validation and receipt consistency
F-031-T02 NEGATIVE/PERMISSION  ACT: Try adding a second beneficiary, a second AY or another head to Tax with Return; reject before financial submission.  EXPECT: Try adding a second beneficiary, a second AY or another head to Tax with Return; reject before financial submission
F-031-T03 RECOVERY  ACT: Interrupt after guest confirmation; reopen by saved reference and later verified sign-in without duplicating the payment.  EXPECT: Interrupt after guest confirmation; reopen by saved reference and later verified sign-in without duplicating the payment
F-031-T04 PERSISTENCE/PARITY  ACT: Original parent ID, receipt/certificate IDs and verified account linkage match Taxpayer SQL and permitted Office mirror.  EXPECT: Original parent ID, receipt/certificate IDs and verified account linkage match Taxpayer SQL and permitted Office mirror
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-032
**Scope:** CITIZEN — implement frontend

F-032  |  P1  |  APPROVED
APPROVED REQUIREMENT  Eligible head catalog and mapping
System: Taxpayer website · Sohojkor SQL  •  Story links: US-002, US-006, US-175  •  Current state: UNVERIFIED
F-032-T01 SUCCESS  ACT: Open the existing mapped payment-head catalogue and select supported Other, Advance and Source tax heads; submit only permitted heads through the existing composer.  EXPECT: Each eligible mapped head appears correctly and reaches the existing source SQL/Office head mapping; no unsupported head silently accepted.
F-032-T02 NEGATIVE/PERMISSION  ACT: Unknown or Return-exclusive head cannot be admitted to mixed non-Return batch; no legacy enum-only limitation.  EXPECT: Unknown or Return-exclusive head cannot be admitted to mixed non-Return batch; no legacy enum-only limitation.
F-032-T03 RECOVERY  ACT: Retry catalogue load, preserving mapped selection and not adding missing heads.  EXPECT: Retry catalogue load, preserving mapped selection and not adding missing heads.
F-032-T04 PERSISTENCE/PARITY  ACT: Head code/name from actual mapping retained per recipient/year in saved source and Office allocation.  EXPECT: Head code/name from actual mapping retained per recipient/year in saved source and Office allocation.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-033
**Scope:** CITIZEN — implement frontend

F-033  |  P1  |  APPROVED
APPROVED REQUIREMENT  Multiple payees in a single payment
System: Taxpayer website · Sohojkor SQL  •  Story links: US-006, US-107  •  Current state: UNVERIFIED
F-033-T01 SUCCESS  ACT: Exercise full allowed self/others × multiple non-Return heads × multiple AYs and exclusive Return invalid combinations.  EXPECT: Multiple payees in a single payment
F-033-T02 NEGATIVE/PERMISSION  ACT: Do not block allowed non-Return combos or permit Return with another beneficiary/head/year.  EXPECT: Do not block allowed non-Return combos or permit Return with another beneficiary/head/year
F-033-T03 RECOVERY  ACT: Back/edit/retry a complex batch; only one parent and no duplicate allocation.  EXPECT: Back/edit/retry a complex batch; only one parent and no duplicate allocation
F-033-T04 PERSISTENCE/PARITY  ACT: Frontend validation, source SQL, Office SQL, receipt and certificate show same allowed matrix.  EXPECT: Frontend validation, source SQL, Office SQL, receipt and certificate show same allowed matrix
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-034
**Scope:** CITIZEN — implement frontend

F-034  |  P1  |  APPROVED
APPROVED REQUIREMENT  Multiple heads for one payee
System: Taxpayer website · Sohojkor SQL  •  Story links: US-002, US-006  •  Current state: UNVERIFIED
F-034-T01 SUCCESS  ACT: Complete guest Other Tax with at least two eligible heads and different AYs, review line totals, submit once and retrieve one combined receipt/certificate and full history.  EXPECT: Multiple heads for one payee
F-034-T02 NEGATIVE/PERMISSION  ACT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines.  EXPECT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines
F-034-T03 RECOVERY  ACT: Retry the same submitted request after network loss; maintain one parent and all valid lines.  EXPECT: Retry the same submitted request after network loss; maintain one parent and all valid lines
F-034-T04 PERSISTENCE/PARITY  ACT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match.  EXPECT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-035
**Scope:** CITIZEN — implement frontend

F-035  |  P1  |  APPROVED
APPROVED REQUIREMENT  Multiple years for any payee/head
System: Taxpayer website · Sohojkor SQL  •  Story links: US-002, US-006  •  Current state: UNVERIFIED
F-035-T01 SUCCESS  ACT: Use existing Other Tax composer with multiple beneficiaries, multiple eligible heads per beneficiary and several AYs, verify grand sum and submit one combined parent.  EXPECT: Multiple years for any payee/head
F-035-T02 NEGATIVE/PERMISSION  ACT: Reject invalid or repeated recipient/head/AY rows; do not forbid otherwise eligible combinations.  EXPECT: Reject invalid or repeated recipient/head/AY rows; do not forbid otherwise eligible combinations
F-035-T03 RECOVERY  ACT: Edit an allocation after Back, then retry network-interrupted submit with same idempotency key.  EXPECT: Edit an allocation after Back, then retry network-interrupted submit with same idempotency key
F-035-T04 PERSISTENCE/PARITY  ACT: Line sum equals saved parent total; each head/year/beneficiary and one receipt/certificate match source and Office.  EXPECT: Line sum equals saved parent total; each head/year/beneficiary and one receipt/certificate match source and Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-036
**Scope:** CITIZEN — implement frontend

F-036  |  P1  |  APPROVED
APPROVED REQUIREMENT  Edit payment lines in a combined payment
System: Taxpayer website · Sohojkor SQL  •  Story links: US-126, US-135  •  Current state: UNVERIFIED
F-036-T01 SUCCESS  ACT: Within an existing combined payment draft add/remove/edit recipient/head/year/amount lines and return from review to edit.  EXPECT: After each edit, correct line totals and parent total displayed; existing other lines and valid selections preserved.
F-036-T02 NEGATIVE/PERMISSION  ACT: Invalid line or duplicate recipient/head/AY prevented without removing other eligible lines.  EXPECT: Invalid line or duplicate recipient/head/AY prevented without removing other eligible lines.
F-036-T03 RECOVERY  ACT: Back/edit/review/retry persists user edits; no duplicate parent on submit.  EXPECT: Back/edit/review/retry persists user edits; no duplicate parent on submit.
F-036-T04 PERSISTENCE/PARITY  ACT: Source parent has only final lines and exact sum, mirrored to Office with one receipt/certificate.  EXPECT: Source parent has only final lines and exact sum, mirrored to Office with one receipt/certificate.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-037
**Scope:** CITIZEN — implement frontend

F-037  |  P1  |  APPROVED
APPROVED REQUIREMENT  Sum-of-payment lines and duplicate-line validation
System: Taxpayer website · Sohojkor SQL  •  Story links: US-002, US-135  •  Current state: UNVERIFIED
F-037-T01 SUCCESS  ACT: Complete guest Other Tax with at least two eligible heads and different AYs, review line totals, submit once and retrieve one combined receipt/certificate and full history.  EXPECT: Sum-of-payment lines and duplicate-line validation
F-037-T02 NEGATIVE/PERMISSION  ACT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines.  EXPECT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines
F-037-T03 RECOVERY  ACT: Retry the same submitted request after network loss; maintain one parent and all valid lines.  EXPECT: Retry the same submitted request after network loss; maintain one parent and all valid lines
F-037-T04 PERSISTENCE/PARITY  ACT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match.  EXPECT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-038
**Scope:** CITIZEN — implement frontend

F-038  |  P1  |  APPROVED
APPROVED REQUIREMENT  One combined receipt with individual line details
System: Taxpayer website · Sohojkor SQL  •  Story links: US-002, US-006  •  Current state: UNVERIFIED
F-038-T01 SUCCESS  ACT: Complete guest Other Tax with at least two eligible heads and different AYs, review line totals, submit once and retrieve one combined receipt/certificate and full history.  EXPECT: One combined receipt with individual line details
F-038-T02 NEGATIVE/PERMISSION  ACT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines.  EXPECT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines
F-038-T03 RECOVERY  ACT: Retry the same submitted request after network loss; maintain one parent and all valid lines.  EXPECT: Retry the same submitted request after network loss; maintain one parent and all valid lines
F-038-T04 PERSISTENCE/PARITY  ACT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match.  EXPECT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-039
**Scope:** CITIZEN — implement frontend

F-039  |  P1  |  APPROVED
APPROVED REQUIREMENT  Existing beneficiary + one-time payee in one batch
System: Taxpayer website · Sohojkor SQL  •  Story links: US-014  •  Current state: UNVERIFIED
F-039-T01 SUCCESS  ACT: Begin Other Tax, select saved beneficiary, add confirmed new TIN through lookup, allocate different heads/AYs to each and complete one batch.  EXPECT: Existing beneficiary + one-time payee in one batch
F-039-T02 NEGATIVE/PERMISSION  ACT: Reject duplicated recipient/line and mismatched new TIN; do not auto-save one-time contact.  EXPECT: Reject duplicated recipient/line and mismatched new TIN; do not auto-save one-time contact
F-039-T03 RECOVERY  ACT: Cancel/new TIN lookup and retry without losing existing saved-recipient lines.  EXPECT: Cancel/new TIN lookup and retry without losing existing saved-recipient lines
F-039-T04 PERSISTENCE/PARITY  ACT: Saved list remains unchanged unless explicitly saved; both recipient allocations exist under one parent in source/Office.  EXPECT: Saved list remains unchanged unless explicitly saved; both recipient allocations exist under one parent in source/Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-041
**Scope:** CITIZEN — implement frontend

F-041  |  P1  |  APPROVED
APPROVED REQUIREMENT  Travel Tax taxpayer/passenger selection
System: Taxpayer website  •  Story links: US-117, US-118  •  Current state: UNVERIFIED
F-041-T01 SUCCESS  ACT: Add two or more passengers, review each and confirm grouped Travel Tax payment.  EXPECT: Travel Tax taxpayer/passenger selection
F-041-T02 NEGATIVE/PERMISSION  ACT: Reject duplicate passport or invalid one-person total across passengers.  EXPECT: Reject duplicate passport or invalid one-person total across passengers
F-041-T03 RECOVERY  ACT: Edit passenger list then return to review without losing confirmations.  EXPECT: Edit passenger list then return to review without losing confirmations
F-041-T04 PERSISTENCE/PARITY  ACT: One payment parent, every confirmed passenger allocation and exact summed total.  EXPECT: One payment parent, every confirmed passenger allocation and exact summed total
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-042
**Scope:** CITIZEN — implement frontend

F-042  |  P1  |  APPROVED
APPROVED REQUIREMENT  Passport, route and passenger detail validation
System: Taxpayer website  •  Story links: US-117, US-151  •  Current state: UNVERIFIED
F-042-T01 SUCCESS  ACT: Enter travel route, date and each passenger's required passport/identity details in existing form.  EXPECT: Passport, route and passenger detail validation
F-042-T02 NEGATIVE/PERMISSION  ACT: Reject invalid passport, nationality, route or incomplete passenger without dropping valid companions.  EXPECT: Reject invalid passport, nationality, route or incomplete passenger without dropping valid companions
F-042-T03 RECOVERY  ACT: Back to passenger step and correct invalid field while retaining others.  EXPECT: Back to passenger step and correct invalid field while retaining others
F-042-T04 PERSISTENCE/PARITY  ACT: Persist/review exactly typed valid passenger fields in existing Travel Tax draft/submission.  EXPECT: Persist/review exactly typed valid passenger fields in existing Travel Tax draft/submission
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-043
**Scope:** CITIZEN — implement frontend

F-043  |  P1  |  APPROVED
APPROVED REQUIREMENT  After a completed Travel Tax payment, show the saved receipt and generated Travel Tax Payment Certificate. Allow View, Print and Download PDF; keep recorded passenger lines and totals together under the original payment.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-157, US-158, US-163  •  Current state: UNVERIFIED
F-043-T01 SUCCESS  ACT: After an isolated completed Travel Tax record, open original receipt and generated certificate, verify itemized passengers/totals and View, Print and true PDF Download.  EXPECT: After a completed Travel Tax payment, show the saved receipt and generated Travel Tax Payment Certificate. Allow View, Print and Download PDF; keep recorded passenger lines and totals together under the original payment.
F-043-T02 NEGATIVE/PERMISSION  ACT: Do not create second payment or issue certificate before completed saved result.  EXPECT: Do not create second payment or issue certificate before completed saved result
F-043-T03 RECOVERY  ACT: Refresh success screen and retrieve original documents by same reference.  EXPECT: Refresh success screen and retrieve original documents by same reference
F-043-T04 PERSISTENCE/PARITY  ACT: One parent/receipt/certificate with all passenger allocations in source and Office.  EXPECT: One parent/receipt/certificate with all passenger allocations in source and Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-044
**Scope:** CITIZEN — implement frontend

F-044  |  P1  |  APPROVED
APPROVED REQUIREMENT  Responsive Travel Tax progressive form
System: Taxpayer website  •  Story links: US-116, US-165  •  Current state: UNVERIFIED
F-044-T01 SUCCESS  ACT: Complete approved four-stage Travel Tax form on mobile narrow viewport and desktop, including forward/back, scroll, keyboard and BN labels.  EXPECT: No clipped or missing field/button/nav, mobile keyboard and sticky actions work; no duplicate Travel Tax wizard.
F-044-T02 NEGATIVE/PERMISSION  ACT: Cannot skip mandatory stage or lose valid entered fields on breakpoint change.  EXPECT: Cannot skip mandatory stage or lose valid entered fields on breakpoint change.
F-044-T03 RECOVERY  ACT: Switch viewport/rotate while mid-step and resume with entered values and selected language.  EXPECT: Switch viewport/rotate while mid-step and resume with entered values and selected language.
F-044-T04 PERSISTENCE/PARITY  ACT: Same validated passenger and route payload independent of viewport; approved mobile/desktop screenshots compared.  EXPECT: Same validated passenger and route payload independent of viewport; approved mobile/desktop screenshots compared.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-045
**Scope:** CITIZEN — implement frontend

F-045  |  P1  |  APPROVED
APPROVED REQUIREMENT  Advance/source/other allowed payment journeys
System: Taxpayer website · Sohojkor SQL  •  Story links: US-002, US-006, US-179  •  Current state: UNVERIFIED
F-045-T01 SUCCESS  ACT: Use existing Other Tax composer with multiple beneficiaries, multiple eligible heads per beneficiary and several AYs, verify grand sum and submit one combined parent.  EXPECT: Advance/source/other allowed payment journeys
F-045-T02 NEGATIVE/PERMISSION  ACT: Reject invalid or repeated recipient/head/AY rows; do not forbid otherwise eligible combinations.  EXPECT: Reject invalid or repeated recipient/head/AY rows; do not forbid otherwise eligible combinations
F-045-T03 RECOVERY  ACT: Edit an allocation after Back, then retry network-interrupted submit with same idempotency key.  EXPECT: Edit an allocation after Back, then retry network-interrupted submit with same idempotency key
F-045-T04 PERSISTENCE/PARITY  ACT: Line sum equals saved parent total; each head/year/beneficiary and one receipt/certificate match source and Office.  EXPECT: Line sum equals saved parent total; each head/year/beneficiary and one receipt/certificate match source and Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-047
**Scope:** CITIZEN — implement frontend

F-047  |  P1  |  APPROVED
APPROVED REQUIREMENT  After each completed payment, show confirmation, its stable payment reference, receipt and Payment Certificate. Display normal payment wording in the interface; keep technical status values internal.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-009, US-049  •  Current state: UNVERIFIED
F-047-T01 SUCCESS  ACT: Complete authorized ordinary payment and inspect confirmation, original receipt, certificate View, Print and true PDF Download.  EXPECT: After each completed payment, show confirmation, its stable payment reference, receipt and Payment Certificate. Display normal payment wording in the interface; keep technical status values internal.
F-047-T02 NEGATIVE/PERMISSION  ACT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created.  EXPECT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created
F-047-T03 RECOVERY  ACT: Reload confirmation or search original reference after interruption and retrieve same documents.  EXPECT: Reload confirmation or search original reference after interruption and retrieve same documents
F-047-T04 PERSISTENCE/PARITY  ACT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office.  EXPECT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-048
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-048  |  P1  |  APPROVED
APPROVED REQUIREMENT  Store one original payment ID, one receipt and one Payment Certificate for each completed parent transaction. Retries, refreshes and repeated actions never create duplicates.
System: Sohojkor SQL · Office SQL  •  Story links: US-009, US-078, US-173  •  Current state: UNVERIFIED
F-048-T01 SUCCESS  ACT: Complete authorized ordinary payment and inspect confirmation, original receipt, certificate View, Print and true PDF Download.  EXPECT: Store one original payment ID, one receipt and one Payment Certificate for each completed parent transaction. Retries, refreshes and repeated actions never create duplicates.
F-048-T02 NEGATIVE/PERMISSION  ACT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created.  EXPECT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created
F-048-T03 RECOVERY  ACT: Reload confirmation or search original reference after interruption and retrieve same documents.  EXPECT: Reload confirmation or search original reference after interruption and retrieve same documents
F-048-T04 PERSISTENCE/PARITY  ACT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office.  EXPECT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-049
**Scope:** CITIZEN — implement frontend

F-049  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show one combined receipt and matching Payment Certificate with the parent total and each beneficiary, tax head, assessment year and amount.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-002, US-049, US-173  •  Current state: UNVERIFIED
F-049-T01 SUCCESS  ACT: Complete guest Other Tax with at least two eligible heads and different AYs, review line totals, submit once and retrieve one combined receipt/certificate and full history.  EXPECT: Show one combined receipt and matching Payment Certificate with the parent total and each beneficiary, tax head, assessment year and amount.
F-049-T02 NEGATIVE/PERMISSION  ACT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines.  EXPECT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines
F-049-T03 RECOVERY  ACT: Retry the same submitted request after network loss; maintain one parent and all valid lines.  EXPECT: Retry the same submitted request after network loss; maintain one parent and all valid lines
F-049-T04 PERSISTENCE/PARITY  ACT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match.  EXPECT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-050
**Scope:** CITIZEN — implement frontend

F-050  |  P1  |  APPROVED
APPROVED REQUIREMENT  Generate a Payment Certificate automatically for every successfully completed payment. Provide View, Print and Download PDF beside the receipt. Tax Credit Certificates are a separate existing feature.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-051, US-173  •  Current state: UNVERIFIED
F-050-T01 SUCCESS  ACT: After completed Return/Other/combined/Travel/Pay Again transactions inspect exactly one automatic payment certificate; View, Print and actual PDF Download.  EXPECT: Generate a Payment Certificate automatically for every successfully completed payment. Provide View, Print and Download PDF beside the receipt. Tax Credit Certificates are a separate existing feature.
F-050-T02 NEGATIVE/PERMISSION  ACT: Duplicate replay cannot create extra certificate; no internal test code or fake official stamp shown.  EXPECT: Duplicate replay cannot create extra certificate; no internal test code or fake official stamp shown
F-050-T03 RECOVERY  ACT: Reload confirmation and retrieve existing document through permitted history/reference search.  EXPECT: Reload confirmation and retrieve existing document through permitted history/reference search
F-050-T04 PERSISTENCE/PARITY  ACT: Certificate original ID, payer/recipient/line items/total and valid PDF bytes match saved parent; Office reference aligned.  EXPECT: Certificate original ID, payer/recipient/line items/total and valid PDF bytes match saved parent; Office reference aligned
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-051
**Scope:** CITIZEN — implement frontend

F-051  |  P1  |  APPROVED
APPROVED REQUIREMENT  The existing homepage reference search and permitted payment history must retrieve the original receipt and Payment Certificate without generating another transaction or document.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-050, US-172  •  Current state: UNVERIFIED
F-051-T01 SUCCESS  ACT: On homepage Find a payment record search by challan, token and transaction reference; open permitted result/receipt/certificate.  EXPECT: The existing homepage reference search and permitted payment history must retrieve the original receipt and Payment Certificate without generating another transaction or document.
F-051-T02 NEGATIVE/PERMISSION  ACT: Unmatched or restricted reference must show safe no-match or authorization state, not private history.  EXPECT: Unmatched or restricted reference must show safe no-match or authorization state, not private history
F-051-T03 RECOVERY  ACT: Retry lookup after timeout preserving entered reference and original layout.  EXPECT: Retry lookup after timeout preserving entered reference and original layout
F-051-T04 PERSISTENCE/PARITY  ACT: Lookup uses stored original ID/status and existing public entitlement, never generates payment/doc.  EXPECT: Lookup uses stored original ID/status and existing public entitlement, never generates payment/doc
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-052
**Scope:** CITIZEN — implement frontend

F-052  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show the Payment Certificate as a professional Sohojkor payment record. Do not display test-mode labels or internal success codes on the website, printable certificate or downloaded PDF. Do not claim unsupported NBR issuance or bank settlement.
System: Taxpayer website · Sohojkor SQL · Office/Admin  •  Story links: US-051, US-173  •  Current state: UNVERIFIED
F-052-T01 SUCCESS  ACT: After completed Return/Other/combined/Travel/Pay Again transactions inspect exactly one automatic payment certificate; View, Print and actual PDF Download.  EXPECT: Show the Payment Certificate as a professional Sohojkor payment record. Do not display test-mode labels or internal success codes on the website, printable certificate or downloaded PDF. Do not claim unsupported NBR issuance or bank settlement.
F-052-T02 NEGATIVE/PERMISSION  ACT: Duplicate replay cannot create extra certificate; no internal test code or fake official stamp shown.  EXPECT: Duplicate replay cannot create extra certificate; no internal test code or fake official stamp shown
F-052-T03 RECOVERY  ACT: Reload confirmation and retrieve existing document through permitted history/reference search.  EXPECT: Reload confirmation and retrieve existing document through permitted history/reference search
F-052-T04 PERSISTENCE/PARITY  ACT: Certificate original ID, payer/recipient/line items/total and valid PDF bytes match saved parent; Office reference aligned.  EXPECT: Certificate original ID, payer/recipient/line items/total and valid PDF bytes match saved parent; Office reference aligned
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-054
**Scope:** CITIZEN — implement frontend

F-054  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show clear, ordinary payment status labels to users, backed by the actual saved result. Internal test or transaction codes are not user-facing, and the website must not claim an unverified external Treasury/bank settlement.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-009, US-051  •  Current state: UNVERIFIED
F-054-T01 SUCCESS  ACT: From a saved completed payment show normal saved payment status label (not test codes or external settlement claim) and compare it to source and Office status.  EXPECT: Show clear, ordinary payment status labels to users, backed by the actual saved result. Internal test or transaction codes are not user-facing, and the website must not claim an unverified external Treasury/bank settlement.
F-054-T02 NEGATIVE/PERMISSION  ACT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created.  EXPECT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created
F-054-T03 RECOVERY  ACT: Reload confirmation or search original reference after interruption and retrieve same documents.  EXPECT: Reload confirmation or search original reference after interruption and retrieve same documents
F-054-T04 PERSISTENCE/PARITY  ACT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office.  EXPECT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-055
**Scope:** CITIZEN — implement frontend

F-055  |  P1  |  APPROVED
APPROVED REQUIREMENT  Create, rename, select and remove owned beneficiary lists; lists and members persist after sign-out and across browsers
System: Taxpayer website · Sohojkor SQL  •  Story links: US-010, US-013, US-125  •  Current state: UNVERIFIED
F-055-T01 SUCCESS  ACT: Create owned list, rename it, select it for adding/choosing a beneficiary, remove one selected list using existing confirmation, then sign out and back in on another browser.  EXPECT: Create, rename, select and remove all work with owner-only persisted members; history remains untouched and unaffected lists persist.
F-055-T02 NEGATIVE/PERMISSION  ACT: Another user cannot rename/remove/view lists; removing one list cannot delete historical payments or other owner lists.  EXPECT: Another user cannot rename/remove/view lists; removing one list cannot delete historical payments or other owner lists.
F-055-T03 RECOVERY  ACT: Cancel rename/delete, retry failed save and reopen across browsers with correctly scoped state.  EXPECT: Cancel rename/delete, retry failed save and reopen across browsers with correctly scoped state.
F-055-T04 PERSISTENCE/PARITY  ACT: Owner/list/member IDs and operations match SQL before/after; unaffected lists/payments unchanged.  EXPECT: Owner/list/member IDs and operations match SQL before/after; unaffected lists/payments unchanged.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-056
**Scope:** CITIZEN — implement frontend

F-056  |  P1  |  APPROVED
APPROVED REQUIREMENT  All Beneficiaries shows every owned entry, with one shared search/filter toolbar and no missing lists
System: Taxpayer website  •  Story links: US-125  •  Current state: UNVERIFIED
F-056-T01 SUCCESS  ACT: Open All Beneficiaries and inspect all owner-owned entries from all lists with one search/filter toolbar.  EXPECT: All Beneficiaries shows every owned entry, with one shared search/filter toolbar and no missing lists
F-056-T02 NEGATIVE/PERMISSION  ACT: Do not lose people in hidden list or mix another account's saved people.  EXPECT: Do not lose people in hidden list or mix another account's saved people
F-056-T03 RECOVERY  ACT: Refresh after list move/edit and restore complete owned aggregate.  EXPECT: Refresh after list move/edit and restore complete owned aggregate
F-056-T04 PERSISTENCE/PARITY  ACT: Owned beneficiary IDs across all lists equal displayed total and filter results.  EXPECT: Owned beneficiary IDs across all lists equal displayed total and filter results
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-057
**Scope:** CITIZEN — implement frontend

F-057  |  P1  |  APPROVED
APPROVED REQUIREMENT  Create, review, edit and delete one beneficiary from the existing form/Edit modal without deleting historical payments
System: Taxpayer website · Sohojkor SQL  •  Story links: US-010, US-053  •  Current state: UNVERIFIED
F-057-T01 SUCCESS  ACT: Open owned beneficiary Edit modal, change relation/tag/list, save; delete from modal and confirm payment history stays.  EXPECT: Create, review, edit and delete one beneficiary from the existing form/Edit modal without deleting historical payments
F-057-T02 NEGATIVE/PERMISSION  ACT: Reject unauthorized edit, duplicate tag, missing final tag and unexpected historical payment deletion.  EXPECT: Reject unauthorized edit, duplicate tag, missing final tag and unexpected historical payment deletion
F-057-T03 RECOVERY  ACT: Cancel Edit/Delete modal, reopen and confirm original saved values.  EXPECT: Cancel Edit/Delete modal, reopen and confirm original saved values
F-057-T04 PERSISTENCE/PARITY  ACT: Owner's latest contact revision persisted; original historical paid allocations unchanged.  EXPECT: Owner's latest contact revision persisted; original historical paid allocations unchanged
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-058
**Scope:** CITIZEN — implement frontend

F-058  |  P1  |  APPROVED
APPROVED REQUIREMENT  Require a tag when adding or editing; choose correct existing relation/tag without duplicates
System: Taxpayer website · Sohojkor SQL  •  Story links: US-010, US-053  •  Current state: UNVERIFIED
F-058-T01 SUCCESS  ACT: Create named owned beneficiary list, use Add Beneficiary, confirm TIN, choose mandatory category/tag, save and find record after new browser sign-in.  EXPECT: Require a tag when adding or editing; choose correct existing relation/tag without duplicates
F-058-T02 NEGATIVE/PERMISSION  ACT: Omit mandatory tag or enter Others free text over 80 chars; show error and no new contact.  EXPECT: Omit mandatory tag or enter Others free text over 80 chars; show error and no new contact
F-058-T03 RECOVERY  ACT: Interrupt before save, resume valid fields; after save reload another session without changing owner.  EXPECT: Interrupt before save, resume valid fields; after save reload another session without changing owner
F-058-T04 PERSISTENCE/PARITY  ACT: Owner ID, list membership, mandatory final tag and saved TIN persist; other account cannot read/edit.  EXPECT: Owner ID, list membership, mandatory final tag and saved TIN persist; other account cannot read/edit
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-059
**Scope:** CITIZEN — implement frontend

F-059  |  P1  |  APPROVED
APPROVED REQUIREMENT  For Others, allow free-text relation or tag details up to 80 characters
System: Taxpayer website · Sohojkor SQL  •  Story links: US-010, US-053  •  Current state: UNVERIFIED
F-059-T01 SUCCESS  ACT: Create and edit Others relationship text with 1 and exactly 80 supported characters; save and reopen.  EXPECT: Allowed nonblank text up to 80 characters persisted exactly, with no duplicate final tag rendering.
F-059-T02 NEGATIVE/PERMISSION  ACT: Empty mandatory tag or 81-character value rejected consistently in frontend and SQL without changing saved contact.  EXPECT: Empty mandatory tag or 81-character value rejected consistently in frontend and SQL without changing saved contact.
F-059-T03 RECOVERY  ACT: Correct invalid text and save without losing selected beneficiary/list.  EXPECT: Correct invalid text and save without losing selected beneficiary/list.
F-059-T04 PERSISTENCE/PARITY  ACT: Stored tag, length, displayed final label and owner match UI and SQL.  EXPECT: Stored tag, length, displayed final label and owner match UI and SQL.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-060
**Scope:** CITIZEN — implement frontend

F-060  |  P1  |  APPROVED
APPROVED REQUIREMENT  Use existing Clients, Friends & Family categories and supported family/friend relation options
System: Taxpayer website · Sohojkor SQL  •  Story links: US-010  •  Current state: UNVERIFIED
F-060-T01 SUCCESS  ACT: Use existing Clients, Friends & Family and Others categories; choose each supported family/friend relation and save beneficiary.  EXPECT: All approved relation choices map to one final tag without duplicated labels.
F-060-T02 NEGATIVE/PERMISSION  ACT: Unsupported relation or duplicate final tag not saved.  EXPECT: Unsupported relation or duplicate final tag not saved.
F-060-T03 RECOVERY  ACT: Edit relation, cancel/retry and preserve prior saved category.  EXPECT: Edit relation, cancel/retry and preserve prior saved category.
F-060-T04 PERSISTENCE/PARITY  ACT: Owner, category, relation and final displayed tag persist exactly.  EXPECT: Owner, category, relation and final displayed tag persist exactly.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-061
**Scope:** CITIZEN — implement frontend

F-061  |  P1  |  APPROVED
APPROVED REQUIREMENT  Unified name/TIN/tag/list search and filters; desktop table and responsive mobile cards; Edit is secondary to Make Payment
System: Taxpayer website  •  Story links: US-053, US-125  •  Current state: UNVERIFIED
F-061-T01 SUCCESS  ACT: Open beneficiary table on desktop and mobile; search name/TIN/tag/list, filter and use Edit secondary to Make Payment.  EXPECT: One approved toolbar, correct filters/cards/table and primary/secondary action hierarchy.
F-061-T02 NEGATIVE/PERMISSION  ACT: No missing owned person, unexpected modal pattern or column/scroll regression.  EXPECT: No missing owned person, unexpected modal pattern or column/scroll regression.
F-061-T03 RECOVERY  ACT: Return from profile/modal and retain current filter state.  EXPECT: Return from profile/modal and retain current filter state.
F-061-T04 PERSISTENCE/PARITY  ACT: Displayed filtered owned member IDs equal permitted saved SQL rows.  EXPECT: Displayed filtered owned member IDs equal permitted saved SQL rows.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-062
**Scope:** CITIZEN — implement frontend

F-062  |  P1  |  APPROVED
APPROVED REQUIREMENT  Hide Excel import options for now. Keep the existing import feature untouched for possible later use.
System: Taxpayer website  •  Story links: US-052  •  Current state: UNVERIFIED
F-062-T01 SUCCESS  ACT: On approved mobile and desktop beneficiary views confirm Add Beneficiary remains available, Excel import entry is hidden.  EXPECT: No Excel import affordance visible while existing dormant import code/templates/files/data remain untouched.
F-062-T02 NEGATIVE/PERMISSION  ACT: Neither hidden import action nor removal of parser/template or existing Add/Edit is introduced.  EXPECT: Neither hidden import action nor removal of parser/template or existing Add/Edit is introduced.
F-062-T03 RECOVERY  ACT: Reload/EN–BN switch leaves manual Add visible and import option hidden.  EXPECT: Reload/EN–BN switch leaves manual Add visible and import option hidden.
F-062-T04 PERSISTENCE/PARITY  ACT: Source diff proves only approved visibility adjustment; no database deletion or import data corruption.  EXPECT: Source diff proves only approved visibility adjustment; no database deletion or import data corruption.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-063
**Scope:** CITIZEN — implement frontend

F-063  |  P1  |  APPROVED
APPROVED REQUIREMENT  Saved beneficiaries persist under the right logged-in taxpayer only; do not share one account’s lists with another
System: Taxpayer website · Sohojkor SQL  •  Story links: US-010, US-101, US-122  •  Current state: UNVERIFIED
F-063-T01 SUCCESS  ACT: Sign in as account A, save beneficiary under list/tag, sign out and sign into account B on another browser, then back to A.  EXPECT: Only A sees A-owned beneficiaries across browsers; B never receives A-owned list entries.
F-063-T02 NEGATIVE/PERMISSION  ACT: Block B search/read/edit/delete of A beneficiary even with known TIN or stale cache.  EXPECT: Block B search/read/edit/delete of A beneficiary even with known TIN or stale cache.
F-063-T03 RECOVERY  ACT: Reload/logout/login across browsers; owner isolation holds and A list persists.  EXPECT: Reload/logout/login across browsers; owner isolation holds and A list persists.
F-063-T04 PERSISTENCE/PARITY  ACT: Compare saved beneficiary owner UUID, list ID, TIN and SQL row visibility for both accounts.  EXPECT: Compare saved beneficiary owner UUID, list ID, TIN and SQL row visibility for both accounts.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-064
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-064  |  P1  |  APPROVED
APPROVED REQUIREMENT  Office can view authorized payment-linked taxpayer and allocation data, not the taxpayer’s private address book
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-098, US-103  •  Current state: UNVERIFIED
F-064-T01 SUCCESS  ACT: Open authorized Office payment-linked payer/recipient relationship information for one verified taxpayer.  EXPECT: Office can view authorized payment-linked taxpayer and allocation data, not the taxpayer’s private address book
F-064-T02 NEGATIVE/PERMISSION  ACT: Do not reveal private saved-beneficiary address-book tags/lists not supported by payment-linked records.  EXPECT: Do not reveal private saved-beneficiary address-book tags/lists not supported by payment-linked records
F-064-T03 RECOVERY  ACT: Close/reopen taxpayer details and retain authorized allocation links.  EXPECT: Close/reopen taxpayer details and retain authorized allocation links
F-064-T04 PERSISTENCE/PARITY  ACT: Only payment-derived relationship IDs and amounts from SQL, not private list IDs.  EXPECT: Only payment-derived relationship IDs and amounts from SQL, not private list IDs
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-065
**Scope:** CITIZEN — implement frontend

F-065  |  P1  |  APPROVED
APPROVED REQUIREMENT  Payer Payment History supports reference, date, head, year, tag and beneficiary filters and opens the original receipt and Payment Certificate for permitted viewing, printing or downloading.
System: Taxpayer website · Sohojkor SQL · Office SQL  •  Story links: US-047, US-048, US-055  •  Current state: UNVERIFIED
F-065-T01 SUCCESS  ACT: In payer Payment History filter date/head/AY/tag/beneficiary and open original receipt/Payment Certificate via permitted row.  EXPECT: Only payer-owned records and exact original documents, no double counts.
F-065-T02 NEGATIVE/PERMISSION  ACT: Restricted reference or another payer cannot expose data.  EXPECT: Restricted reference or another payer cannot expose data.
F-065-T03 RECOVERY  ACT: Reload filtered history and reopen same detail.  EXPECT: Reload filtered history and reopen same detail.
F-065-T04 PERSISTENCE/PARITY  ACT: Filtered source parent/allocations, original receipt/doc IDs and Office mapping align.  EXPECT: Filtered source parent/allocations, original receipt/doc IDs and Office mapping align.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-066
**Scope:** CITIZEN — implement frontend

F-066  |  P1  |  APPROVED
APPROVED REQUIREMENT  Recipient payment history shows only that taxpayer’s confirmed allocations; permitted certificate access cannot reveal protected information about other recipients.
System: Taxpayer website · Sohojkor SQL · Office SQL  •  Story links: US-012, US-083  •  Current state: UNVERIFIED
F-066-T01 SUCCESS  ACT: Sign into recipient account and open Received Payments, filter by date/head and inspect each permitted incoming allocation and receipt share.  EXPECT: Recipient payment history shows only that taxpayer’s confirmed allocations; permitted certificate access cannot reveal protected information about other recipients.
F-066-T02 NEGATIVE/PERMISSION  ACT: Attempt to expose other recipients' allocations or private payer lists from shared parent; deny.  EXPECT: Attempt to expose other recipients' allocations or private payer lists from shared parent; deny
F-066-T03 RECOVERY  ACT: Sign out and back in or reload after notice delay; same received entries remain, no duplicate.  EXPECT: Sign out and back in or reload after notice delay; same received entries remain, no duplicate
F-066-T04 PERSISTENCE/PARITY  ACT: Recipient account/TIN binding, allocation IDs and per-recipient totals, not full unrelated parent amounts.  EXPECT: Recipient account/TIN binding, allocation IDs and per-recipient totals, not full unrelated parent amounts
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-067
**Scope:** CITIZEN — implement frontend

F-067  |  P1  |  APPROVED
APPROVED REQUIREMENT  An owned beneficiary profile shows name, final tag, TIN, payment totals and links to the payer’s actual receipt and Payment Certificate.
System: Taxpayer website  •  Story links: US-011  •  Current state: UNVERIFIED
F-067-T01 SUCCESS  ACT: Open saved beneficiary profile from history and inspect dated payments made by this payer for exact recipient, filtered lines and linked original receipts.  EXPECT: An owned beneficiary profile shows name, final tag, TIN, payment totals and links to the payer’s actual receipt and Payment Certificate.
F-067-T02 NEGATIVE/PERMISSION  ACT: Sign in as another payer for same TIN; never expose first payer's private beneficiary history.  EXPECT: Sign in as another payer for same TIN; never expose first payer's private beneficiary history
F-067-T03 RECOVERY  ACT: Refresh beneficiary timeline after changing filters, reopen selected payment and return to same context.  EXPECT: Refresh beneficiary timeline after changing filters, reopen selected payment and return to same context
F-067-T04 PERSISTENCE/PARITY  ACT: Payer-owner plus recipient TIN allocation query matches dates/amounts/heads/AY and only eligible historical receipts.  EXPECT: Payer-owner plus recipient TIN allocation query matches dates/amounts/heads/AY and only eligible historical receipts
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-068
**Scope:** CITIZEN — implement frontend

F-068  |  P1  |  APPROVED
APPROVED REQUIREMENT  Beneficiary-specific timeline shows only this payer’s payments for that TIN, with date, head, assessment year, amount, combined payment reference, receipt and Payment Certificate.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-011  •  Current state: UNVERIFIED
F-068-T01 SUCCESS  ACT: Open owned beneficiary profile and sort its dated history of this payer’s payments for exact recipient TIN.  EXPECT: Timeline shows each actual head/AY/amount, original reference, receipt and certificate.
F-068-T02 NEGATIVE/PERMISSION  ACT: No other payer history or unrelated recipient allocations.  EXPECT: No other payer history or unrelated recipient allocations.
F-068-T03 RECOVERY  ACT: Refresh after changing filters and restore selected payment.  EXPECT: Refresh after changing filters and restore selected payment.
F-068-T04 PERSISTENCE/PARITY  ACT: Payer-owner + exact recipient TIN allocation query matches visible event IDs and amounts.  EXPECT: Payer-owner + exact recipient TIN allocation query matches visible event IDs and amounts.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-069
**Scope:** CITIZEN — implement frontend

F-069  |  P1  |  APPROVED
APPROVED REQUIREMENT  Filter the selected beneficiary’s history by tag, tax head, assessment year and date; never mix other accounts
System: Taxpayer website  •  Story links: US-011, US-047  •  Current state: UNVERIFIED
F-069-T01 SUCCESS  ACT: Search owned history by reference, date, head, AY, tag and beneficiary; open chosen payment and beneficiary profile.  EXPECT: Filter the selected beneficiary’s history by tag, tax head, assessment year and date; never mix other accounts
F-069-T02 NEGATIVE/PERMISSION  ACT: Search other account's reference/TIN; must not reveal private rows or contact list.  EXPECT: Search other account's reference/TIN; must not reveal private rows or contact list
F-069-T03 RECOVERY  ACT: Refresh filtered history and return from detail without losing filters.  EXPECT: Refresh filtered history and return from detail without losing filters
F-069-T04 PERSISTENCE/PARITY  ACT: Authorized filtered row IDs align with payer-owned payment allocations.  EXPECT: Authorized filtered row IDs align with payer-owned payment allocations
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-070
**Scope:** CITIZEN — implement frontend

F-070  |  P1  |  APPROVED
APPROVED REQUIREMENT  Open original payment detail and combined receipt; show only this beneficiary’s allocation without losing full-batch context
System: Taxpayer website  •  Story links: US-011, US-055  •  Current state: UNVERIFIED
F-070-T01 SUCCESS  ACT: From beneficiary-specific timeline open one line belonging to a combined parent and view original payment detail/receipt.  EXPECT: Beneficiary allocation shown correctly while permitted full-batch context, one combined receipt and stable original ID retained.
F-070-T02 NEGATIVE/PERMISSION  ACT: Do not show unrelated payer private list or count full batch total as beneficiary share.  EXPECT: Do not show unrelated payer private list or count full batch total as beneficiary share.
F-070-T03 RECOVERY  ACT: Back to beneficiary timeline, restore filter and return to original detail.  EXPECT: Back to beneficiary timeline, restore filter and return to original detail.
F-070-T04 PERSISTENCE/PARITY  ACT: Recipient allocation share and original parent+receipt IDs agree; role-specific disclosure enforced.  EXPECT: Recipient allocation share and original parent+receipt IDs agree; role-specific disclosure enforced.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-071
**Scope:** CITIZEN — implement frontend

F-071  |  P1  |  APPROVED
APPROVED REQUIREMENT  Individual-row Pay Again action
System: Taxpayer website  •  Story links: US-007, US-133  •  Current state: UNVERIFIED
F-071-T01 SUCCESS  ACT: From a specific successfully completed payment table row click Pay Again and open its editable original batch reconstruction.  EXPECT: Pay Again is an action attached to the exact completed transaction, not only table filter; original intact.
F-071-T02 NEGATIVE/PERMISSION  ACT: Failed/pending/other-user payment cannot be cloned as authorized completed original.  EXPECT: Failed/pending/other-user payment cannot be cloned as authorized completed original.
F-071-T03 RECOVERY  ACT: Return to history/reopen Pay Again and retain the correct original row context.  EXPECT: Return to history/reopen Pay Again and retain the correct original row context.
F-071-T04 PERSISTENCE/PARITY  ACT: Original ID points to new draft transaction provenance; no source original mutation.  EXPECT: Original ID points to new draft transaction provenance; no source original mutation.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-072
**Scope:** CITIZEN — implement frontend

F-072  |  P1  |  APPROVED
APPROVED REQUIREMENT  Clone + add/remove/edit Pay Again payment lines
System: Taxpayer website  •  Story links: US-007  •  Current state: UNVERIFIED
F-072-T01 SUCCESS  ACT: From one completed payment row select Pay Again, clone entire prior batch into existing editable form, change/add/remove rows, supply required noncurrent AY and create a new transaction.  EXPECT: Clone + add/remove/edit Pay Again payment lines
F-072-T02 NEGATIVE/PERMISSION  ACT: Require explicit noncurrent AY and reject stale owner/original reference; never overwrite past paid record.  EXPECT: Require explicit noncurrent AY and reject stale owner/original reference; never overwrite past paid record
F-072-T03 RECOVERY  ACT: Close and reopen editable repeat before submitting; preserve changed values and immutable original.  EXPECT: Close and reopen editable repeat before submitting; preserve changed values and immutable original
F-072-T04 PERSISTENCE/PARITY  ACT: New parent, new documents, cloned line provenance and Office readback; original parent and receipt unchanged.  EXPECT: New parent, new documents, cloned line provenance and Office readback; original parent and receipt unchanged
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-073
**Scope:** CITIZEN — implement frontend

F-073  |  P1  |  APPROVED
APPROVED REQUIREMENT  Current assessment year auto-fill; other assessment year explicitly re-entered
System: Taxpayer website  •  Story links: US-007, US-133  •  Current state: UNVERIFIED
F-073-T01 SUCCESS  ACT: Pay Again a complete batch covering current AY and one prior/upcoming AY; inspect prefill and required reentry per line.  EXPECT: Only current approved AY defaults; every noncurrent AY must be explicitly chosen before submission.
F-073-T02 NEGATIVE/PERMISSION  ACT: Stale prior/upcoming AY cannot silently autofill or submit; valid current AY stays editable.  EXPECT: Stale prior/upcoming AY cannot silently autofill or submit; valid current AY stays editable.
F-073-T03 RECOVERY  ACT: Return to edit to supply each missing AY without resetting other cloned lines.  EXPECT: Return to edit to supply each missing AY without resetting other cloned lines.
F-073-T04 PERSISTENCE/PARITY  ACT: New transaction includes individually confirmed AY values, old saved transaction unchanged.  EXPECT: New transaction includes individually confirmed AY values, old saved transaction unchanged.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-074
**Scope:** CITIZEN — implement frontend

F-074  |  P1  |  APPROVED
APPROVED REQUIREMENT  Export only this payer’s permitted payment history and matching filtered records.
System: Taxpayer website  •  Story links: US-048  •  Current state: UNVERIFIED
F-074-T01 SUCCESS  ACT: Filter owned payment history and export; compare exported row count, amounts and columns to current result.  EXPECT: Export only this payer’s permitted payment history and matching filtered records.
F-074-T02 NEGATIVE/PERMISSION  ACT: Attempt export of unfiltered or other-account rows; refuse data leakage.  EXPECT: Attempt export of unfiltered or other-account rows; refuse data leakage
F-074-T03 RECOVERY  ACT: Repeat export after interrupted download and obtain same filtered snapshot.  EXPECT: Repeat export after interrupted download and obtain same filtered snapshot
F-074-T04 PERSISTENCE/PARITY  ACT: CSV rows exactly match authorized filtered table and original payment IDs.  EXPECT: CSV rows exactly match authorized filtered table and original payment IDs
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-075
**Scope:** CITIZEN — implement frontend

F-075  |  P1  |  APPROVED
APPROVED REQUIREMENT  Save draft, resume, and discard
System: Taxpayer website · Sohojkor SQL  •  Story links: US-044, US-045  •  Current state: UNVERIFIED
F-075-T01 SUCCESS  ACT: Save a partially completed eligible payment draft, resume it, then separately discard with confirmation.  EXPECT: Save/resume restores all lines, owner and values; discard affects selected draft only; never marked paid.
F-075-T02 NEGATIVE/PERMISSION  ACT: Cancel discard and test wrong-account access; existing other drafts untouched.  EXPECT: Cancel discard and test wrong-account access; existing other drafts untouched.
F-075-T03 RECOVERY  ACT: Refresh/logout-relogin or same guest session as applicable and resume current revision.  EXPECT: Refresh/logout-relogin or same guest session as applicable and resume current revision.
F-075-T04 PERSISTENCE/PARITY  ACT: Draft revision, owner/session and saved fields match SQL without creating parent paid record.  EXPECT: Draft revision, owner/session and saved fields match SQL without creating parent paid record.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-076
**Scope:** CITIZEN — implement frontend

F-076  |  P1  |  APPROVED
APPROVED REQUIREMENT  Safe modal close/cancel with draft choice
System: Taxpayer website  •  Story links: US-046  •  Current state: UNVERIFIED
F-076-T01 SUCCESS  ACT: With unsaved changes in draft-eligible form use close icon, overlay and browser Back; choose Save/Discard/Cancel.  EXPECT: Safe modal close/cancel with draft choice
F-076-T02 NEGATIVE/PERMISSION  ACT: Closing modal without choice must not silently discard entered valid fields.  EXPECT: Closing modal without choice must not silently discard entered valid fields
F-076-T03 RECOVERY  ACT: Choose Cancel and return to form with all fields, or Save and resume from draft.  EXPECT: Choose Cancel and return to form with all fields, or Save and resume from draft
F-076-T04 PERSISTENCE/PARITY  ACT: Saved draft or intact form state remains and modal focus/back behavior matches approved UI.  EXPECT: Saved draft or intact form state remains and modal focus/back behavior matches approved UI
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-077
**Scope:** CITIZEN — implement frontend

F-077  |  P1  |  APPROVED
APPROVED REQUIREMENT  Save signed-in taxpayers’ unfinished payment forms so they can be resumed.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-044, US-045  •  Current state: UNVERIFIED
F-077-T01 SUCCESS  ACT: Fill partial existing payment form, Save Draft, inspect draft list and resume exact values without submission.  EXPECT: Save signed-in taxpayers’ unfinished payment forms so they can be resumed.
F-077-T02 NEGATIVE/PERMISSION  ACT: Attempt to count unfinished draft as paid transaction or expose another account's draft; deny.  EXPECT: Attempt to count unfinished draft as paid transaction or expose another account's draft; deny
F-077-T03 RECOVERY  ACT: Close and reopen current session or sign in again as applicable, then resume saved draft.  EXPECT: Close and reopen current session or sign in again as applicable, then resume saved draft
F-077-T04 PERSISTENCE/PARITY  ACT: Draft ID/owner/session, fields/lines and timestamps persist; no payment parent created.  EXPECT: Draft ID/owner/session, fields/lines and timestamps persist; no payment parent created
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-078
**Scope:** CITIZEN — implement frontend

F-078  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep eligible guest payment draft details for the current guest session.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-044, US-045  •  Current state: UNVERIFIED
F-078-T01 SUCCESS  ACT: As unsigned visitor enter eligible payment form fields, save guest draft and resume in the SAME permitted guest session.  EXPECT: Guest session draft restores current session values without creating account-owned draft or payment.
F-078-T02 NEGATIVE/PERMISSION  ACT: Unrelated or expired guest session cannot retrieve protected draft and no paid record created.  EXPECT: Unrelated or expired guest session cannot retrieve protected draft and no paid record created.
F-078-T03 RECOVERY  ACT: Reload/reopen within supported same session and recover state without owner mix.  EXPECT: Reload/reopen within supported same session and recover state without owner mix.
F-078-T04 PERSISTENCE/PARITY  ACT: Guest session identifier/draft fields and expiry rule match existing implementation; no Office payment.  EXPECT: Guest session identifier/draft fields and expiry rule match existing implementation; no Office payment.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-079
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-079  |  P1  |  APPROVED
APPROVED REQUIREMENT  When a saved draft has changed, restore or update it without losing the newer information.
System: Sohojkor SQL  •  Story links: US-045, US-046  •  Current state: UNVERIFIED
F-079-T01 SUCCESS  ACT: Save an owned draft, change its fields in one session, reopen stale version in another permitted session and attempt conflicting update.  EXPECT: Newer approved draft revision is retained or an explicit version-conflict flow resolves it without silent rollback.
F-079-T02 NEGATIVE/PERMISSION  ACT: An older copy must not overwrite newer amount/beneficiary/year lines without user-confirmed resolution.  EXPECT: An older copy must not overwrite newer amount/beneficiary/year lines without user-confirmed resolution.
F-079-T03 RECOVERY  ACT: Recover from interrupted update by loading latest revision and preserving still-editable valid changes.  EXPECT: Recover from interrupted update by loading latest revision and preserving still-editable valid changes.
F-079-T04 PERSISTENCE/PARITY  ACT: Draft ID, revision, timestamps and saved fields compared before/after against original SQL.  EXPECT: Draft ID, revision, timestamps and saved fields compared before/after against original SQL.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-080
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-080  |  P1  |  APPROVED
APPROVED REQUIREMENT  No draft mistaken for a completed payment
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-044, US-115  •  Current state: UNVERIFIED
F-080-T01 SUCCESS  ACT: Fill partial existing payment form, Save Draft, inspect draft list and resume exact values without submission.  EXPECT: No draft mistaken for a completed payment
F-080-T02 NEGATIVE/PERMISSION  ACT: Attempt to count unfinished draft as paid transaction or expose another account's draft; deny.  EXPECT: Attempt to count unfinished draft as paid transaction or expose another account's draft; deny
F-080-T03 RECOVERY  ACT: Close and reopen current session or sign in again as applicable, then resume saved draft.  EXPECT: Close and reopen current session or sign in again as applicable, then resume saved draft
F-080-T04 PERSISTENCE/PARITY  ACT: Draft ID/owner/session, fields/lines and timestamps persist; no payment parent created.  EXPECT: Draft ID/owner/session, fields/lines and timestamps persist; no payment parent created
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-081
**Scope:** CITIZEN — implement frontend

F-081  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show the payer in-app success notice for each completed recorded payment.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-003, US-059  •  Current state: UNVERIFIED
F-081-T01 SUCCESS  ACT: From an isolated successfully completed payer transaction, verify exactly one payer-facing in-app success notice referencing original transaction.  EXPECT: Show the payer in-app success notice for each completed recorded payment.
F-081-T02 NEGATIVE/PERMISSION  ACT: Do not duplicate same notice or reveal another account's activity.  EXPECT: Do not duplicate same notice or reveal another account's activity
F-081-T03 RECOVERY  ACT: Reconnect and reopen list; retain acknowledgement and chronological event.  EXPECT: Reconnect and reopen list; retain acknowledgement and chronological event
F-081-T04 PERSISTENCE/PARITY  ACT: Correct owner event IDs, read timestamps and deep-link targets persist.  EXPECT: Correct owner event IDs, read timestamps and deep-link targets persist
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-082
**Scope:** CITIZEN — implement frontend

F-082  |  P1  |  APPROVED
APPROVED REQUIREMENT  For a verified recipient TIN, show only their allocated received-payment notice, including amount, head, year and reference.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-003, US-012, US-083  •  Current state: UNVERIFIED
F-082-T01 SUCCESS  ACT: Complete isolated third-party payment for recipient B, sign B into permitted account and open original received-payment in-app notice.  EXPECT: B sees only its allocated amount/head/AY/original reference in one correct notice and notification list entry.
F-082-T02 NEGATIVE/PERMISSION  ACT: Unrelated recipient C must not see B notice or all parent allocation details.  EXPECT: Unrelated recipient C must not see B notice or all parent allocation details.
F-082-T03 RECOVERY  ACT: Delay/replay notification delivery and show B notice once, preserving acknowledgement state.  EXPECT: Delay/replay notification delivery and show B notice once, preserving acknowledgement state.
F-082-T04 PERSISTENCE/PARITY  ACT: Notification recipient owner, allocation and original transaction ID match source and Office-linked event.  EXPECT: Notification recipient owner, allocation and original transaction ID match source and Office-linked event.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-083
**Scope:** CITIZEN — implement frontend

F-083  |  P1  |  APPROVED
APPROVED REQUIREMENT  At first successful demonstration login, retrieve saved unseen recipient-payment notices and display popup notifications one by one after the welcome message; retain every item in Notifications.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-004, US-085  •  Current state: UNVERIFIED
F-083-T01 SUCCESS  ACT: For non-production first login only, submit the documented demonstration OTP, show welcome before queued unseen notices, acknowledge each in sequence and inspect Notifications list.  EXPECT: At first successful demonstration login, retrieve saved unseen recipient-payment notices and display popup notifications one by one after the welcome message; retain every item in Notifications.
F-083-T02 NEGATIVE/PERMISSION  ACT: Reject incorrect OTP; never let demonstration OTP authenticate a production account or reveal another account's notices.  EXPECT: Reject incorrect OTP; never let demonstration OTP authenticate a production account or reveal another account's notices
F-083-T03 RECOVERY  ACT: Interrupt between acknowledgement and next queued popup; reopen demonstration account and resume only unread items.  EXPECT: Interrupt between acknowledgement and next queued popup; reopen demonstration account and resume only unread items
F-083-T04 PERSISTENCE/PARITY  ACT: Verified demo account binding and per-event notice IDs/read timestamps persist without duplicate popup.  EXPECT: Verified demo account binding and per-event notice IDs/read timestamps persist without duplicate popup
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-084
**Scope:** CITIZEN — implement frontend

F-084  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep one popup visible at a time; acknowledge/next advances to the following unseen notice and persists read state. Reopening the account does not replay acknowledged notices.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-084, US-085  •  Current state: UNVERIFIED
F-084-T01 SUCCESS  ACT: Open received-payment popup, acknowledge once, refresh/relogin and inspect item in Notifications history.  EXPECT: Keep one popup visible at a time; acknowledge/next advances to the following unseen notice and persists read state. Reopening the account does not replay acknowledged notices.
F-084-T02 NEGATIVE/PERMISSION  ACT: Previously acknowledged popup must not replay or disappear from historical list.  EXPECT: Previously acknowledged popup must not replay or disappear from historical list
F-084-T03 RECOVERY  ACT: Simulate interrupted acknowledgement and reconcile single saved read state.  EXPECT: Simulate interrupted acknowledgement and reconcile single saved read state
F-084-T04 PERSISTENCE/PARITY  ACT: One original notice ID, read timestamp, and source event preserved.  EXPECT: One original notice ID, read timestamp, and source event preserved
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-085
**Scope:** CITIZEN — implement frontend

F-085  |  P1  |  APPROVED
APPROVED REQUIREMENT  Provide the existing in-app notification list, filters and dated payment/correction entries, including acknowledged and unread notices.
System: Taxpayer website  •  Story links: US-059, US-084, US-086  •  Current state: UNVERIFIED
F-085-T01 SUCCESS  ACT: Open taxpayer Notifications list, filter acknowledged and unread payment/correction entries, verify dates, source event IDs and permitted ownership.  EXPECT: Provide the existing in-app notification list, filters and dated payment/correction entries, including acknowledged and unread notices.
F-085-T02 NEGATIVE/PERMISSION  ACT: After permission revoked/unrelated account, deep link must show inaccessible state and not leak detail.  EXPECT: After permission revoked/unrelated account, deep link must show inaccessible state and not leak detail
F-085-T03 RECOVERY  ACT: Return from deep-linked view, keep read state and list position.  EXPECT: Return from deep-linked view, keep read state and list position
F-085-T04 PERSISTENCE/PARITY  ACT: Notification target type+original ID and current authorization match stored event.  EXPECT: Notification target type+original ID and current authorization match stored event
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-086
**Scope:** CITIZEN — implement frontend

F-086  |  P1  |  APPROVED
APPROVED REQUIREMENT  Self/other/received unified chronological process
System: Taxpayer website · Sohojkor SQL  •  Story links: US-020, US-087  •  Current state: UNVERIFIED
F-086-T01 SUCCESS  ACT: Open Payments & Activity, filter chronological self/other/received payments, corrections, reports and verified events, then open an item.  EXPECT: Self/other/received unified chronological process
F-086-T02 NEGATIVE/PERMISSION  ACT: Try an event belonging to a different account; exclude it and avoid duplicate event entries.  EXPECT: Try an event belonging to a different account; exclude it and avoid duplicate event entries
F-086-T03 RECOVERY  ACT: Reload timeline after delayed sync, keeping stable event order and filters.  EXPECT: Reload timeline after delayed sync, keeping stable event order and filters
F-086-T04 PERSISTENCE/PARITY  ACT: Chronological event IDs, actor, timestamps, payment/case links and role scopes match stored authorized events.  EXPECT: Chronological event IDs, actor, timestamps, payment/case links and role scopes match stored authorized events
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-087
**Scope:** CITIZEN — implement frontend

F-087  |  P1  |  APPROVED
APPROVED REQUIREMENT  Correction, report and external event entries
System: Taxpayer website · Sohojkor SQL  •  Story links: US-020, US-087, US-093  •  Current state: UNVERIFIED
F-087-T01 SUCCESS  ACT: Open Payments & Activity and inspect authenticated correction, unwanted report and sourced external change events in dated order.  EXPECT: Each existing verified case/external event appears exactly once with date, status, original link and correct actor.
F-087-T02 NEGATIVE/PERMISSION  ACT: Do not synthesize missing external TIN/circle events or leak another account activity.  EXPECT: Do not synthesize missing external TIN/circle events or leak another account activity.
F-087-T03 RECOVERY  ACT: Refresh after late synchronized correction/report decision and recover unchanged history and new event once.  EXPECT: Refresh after late synchronized correction/report decision and recover unchanged history and new event once.
F-087-T04 PERSISTENCE/PARITY  ACT: Event IDs, case refs, source timestamp and owner/Office decision readback agree.  EXPECT: Event IDs, case refs, source timestamp and owner/Office decision readback agree.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-088
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-088  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show only the correct account’s activity, without repeated entries.
System: Sohojkor SQL  •  Story links: US-059, US-101  •  Current state: UNVERIFIED
F-088-T01 SUCCESS  ACT: Sign in, open Notifications & Activity and inspect sourced payments/corrections/read state, filter and open event.  EXPECT: Show only the correct account’s activity, without repeated entries.
F-088-T02 NEGATIVE/PERMISSION  ACT: Do not duplicate same notice or reveal another account's activity.  EXPECT: Do not duplicate same notice or reveal another account's activity
F-088-T03 RECOVERY  ACT: Reconnect and reopen list; retain acknowledgement and chronological event.  EXPECT: Reconnect and reopen list; retain acknowledgement and chronological event
F-088-T04 PERSISTENCE/PARITY  ACT: Correct owner event IDs, read timestamps and deep-link targets persist.  EXPECT: Correct owner event IDs, read timestamps and deep-link targets persist
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-089
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-089  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show new Office payment alerts and recover missed alerts when Office reconnects.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-021, US-096  •  Current state: UNVERIFIED
F-089-T01 SUCCESS  ACT: With existing authorized Office session and an isolated source event, verify new payment alert and missed-event recovery.  EXPECT: Office register/notification bell shows original event once, with correct reference and data.
F-089-T02 NEGATIVE/PERMISSION  ACT: Retry/replay must not duplicate payment/alert or expose unauthorized event.  EXPECT: Retry/replay must not duplicate payment/alert or expose unauthorized event.
F-089-T03 RECOVERY  ACT: Disconnect/reconnect bridge in isolated test and process queued events exactly once.  EXPECT: Disconnect/reconnect bridge in isolated test and process queued events exactly once.
F-089-T04 PERSISTENCE/PARITY  ACT: Source event/outbox → Office inbox/payment ID → alert ID linked to same parent.  EXPECT: Source event/outbox → Office inbox/payment ID → alert ID linked to same parent.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-090
**Scope:** CITIZEN — implement frontend

F-090  |  P1  |  APPROVED
APPROVED REQUIREMENT  User correction request form and evidence
System: Taxpayer website · Sohojkor SQL  •  Story links: US-008, US-170  •  Current state: UNVERIFIED
F-090-T01 SUCCESS  ACT: From a walk-in payment reference attempt correction signed out, then sign in through existing login and submit eligible linked request.  EXPECT: User correction request form and evidence
F-090-T02 NEGATIVE/PERMISSION  ACT: Unsigned request cannot write correction, typed TIN not sufficient to claim payment.  EXPECT: Unsigned request cannot write correction, typed TIN not sufficient to claim payment
F-090-T03 RECOVERY  ACT: Return from sign-in to original payment/correction context and recover saved case.  EXPECT: Return from sign-in to original payment/correction context and recover saved case
F-090-T04 PERSISTENCE/PARITY  ACT: Original walk-in payment ID, verified claimant identity and Office case state linked without financial mutation.  EXPECT: Original walk-in payment ID, verified claimant identity and Office case state linked without financial mutation
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-091
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-091  |  P1  |  APPROVED
APPROVED REQUIREMENT  Office correction queue / decision API
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-089, US-091  •  Current state: UNVERIFIED
F-091-T01 SUCCESS  ACT: Authorized Office reviewer invokes existing correction queue/API on permitted case and records valid transition.  EXPECT: Office correction queue / decision API
F-091-T02 NEGATIVE/PERMISSION  ACT: Reject unauthorized role, invalid transition, duplicate decision or nonexistent case.  EXPECT: Reject unauthorized role, invalid transition, duplicate decision or nonexistent case
F-091-T03 RECOVERY  ACT: Retry same accepted action after timeout and return same case revision.  EXPECT: Retry same accepted action after timeout and return same case revision
F-091-T04 PERSISTENCE/PARITY  ACT: Named existing RPC/API contract, case owner/state, audit actor and Office-to-source status verified.  EXPECT: Named existing RPC/API contract, case owner/state, audit actor and Office-to-source status verified
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-092
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-092  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show the Office correction decision and latest saved status to the taxpayer.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-088, US-090  •  Current state: UNVERIFIED
F-092-T01 SUCCESS  ACT: For a known correction case, compare Office saved decision reason/date and taxpayer's account-visible status.  EXPECT: Show the Office correction decision and latest saved status to the taxpayer.
F-092-T02 NEGATIVE/PERMISSION  ACT: No conflicting stale status or invented approval shown.  EXPECT: No conflicting stale status or invented approval shown
F-092-T03 RECOVERY  ACT: Refresh after delayed sync; keep last confirmed Office revision.  EXPECT: Refresh after delayed sync; keep last confirmed Office revision
F-092-T04 PERSISTENCE/PARITY  ACT: Office/source case ID, state, decision date and reason agree.  EXPECT: Office/source case ID, state, decision date and reason agree
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-093
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-093  |  P1  |  APPROVED
APPROVED REQUIREMENT  Corrections by specific authorized taxpayer TIN
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-008, US-023, US-092  •  Current state: UNVERIFIED
F-093-T01 SUCCESS  ACT: In permitted Office flow open correction by specifically verified taxpayer TIN and its eligible original payment, save case decision and check taxpayer readback.  EXPECT: Correction actor, taxpayer TIN, original payment and decision remain bound to exactly same authorized identity.
F-093-T02 NEGATIVE/PERMISSION  ACT: Typing unrelated TIN or a different account must not grant correction permissions or bind wrong case.  EXPECT: Typing unrelated TIN or a different account must not grant correction permissions or bind wrong case.
F-093-T03 RECOVERY  ACT: Refresh after decision timeout and retrieve same correction ID/status without duplicate.  EXPECT: Refresh after decision timeout and retrieve same correction ID/status without duplicate.
F-093-T04 PERSISTENCE/PARITY  ACT: Case ID, verified taxpayer binding, source original parent and Office decision/actor IDs match.  EXPECT: Case ID, verified taxpayer binding, source original parent and Office decision/actor IDs match.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-094
**Scope:** CITIZEN — implement frontend

F-094  |  P1  |  APPROVED
APPROVED REQUIREMENT  Report unsolicited payment
System: Taxpayer website · Sohojkor SQL  •  Story links: US-018  •  Current state: UNVERIFIED
F-094-T01 SUCCESS  ACT: As verified recipient select an unwanted received-payment allocation and submit the existing report flow.  EXPECT: One case linked to recipient allocation reaches authorized Office review; original financial record remains.
F-094-T02 NEGATIVE/PERMISSION  ACT: Not general public support reporting US-057; unrelated payer cannot report stranger allocation.  EXPECT: Not general public support reporting US-057; unrelated payer cannot report stranger allocation.
F-094-T03 RECOVERY  ACT: Retry report after timeout retrieves same case and current Office status.  EXPECT: Retry report after timeout retrieves same case and current Office status.
F-094-T04 PERSISTENCE/PARITY  ACT: Recipient ownership, original allocation ID, case ID and Office decision/readback reconcile.  EXPECT: Recipient ownership, original allocation ID, case ID and Office decision/readback reconcile.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-095
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-095  |  P1  |  APPROVED
APPROVED REQUIREMENT  Office case review, outcomes and notifications
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-018, US-091  •  Current state: UNVERIFIED
F-095-T01 SUCCESS  ACT: Sign into verified recipient account, choose unsolicited received-payment line, report with reason and follow Office case review response.  EXPECT: Office case review, outcomes and notifications
F-095-T02 NEGATIVE/PERMISSION  ACT: Deny reporting a stranger's received allocation; no fictional reversal or direct payment mutation.  EXPECT: Deny reporting a stranger's received allocation; no fictional reversal or direct payment mutation
F-095-T03 RECOVERY  ACT: After report submission reload saved case and follow Office review status.  EXPECT: After report submission reload saved case and follow Office review status
F-095-T04 PERSISTENCE/PARITY  ACT: Unsolicited case ID linked to exact recipient allocation, original payment immutable and Office state synchronized.  EXPECT: Unsolicited case ID linked to exact recipient allocation, original payment immutable and Office state synchronized
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-096
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-096  |  P1  |  APPROVED
APPROVED REQUIREMENT  Display confirmed external updates only when reliable linked information exists.
System: Sohojkor SQL  •  Story links: US-023, US-093  •  Current state: UNVERIFIED
F-096-T01 SUCCESS  ACT: When a truly source-confirmed external change exists, show its dated notice in taxpayer account.  EXPECT: Display confirmed external updates only when reliable linked information exists.
F-096-T02 NEGATIVE/PERMISSION  ACT: No connected/verified event means no fabricated TIN/circle/name change popup.  EXPECT: No connected/verified event means no fabricated TIN/circle/name change popup
F-096-T03 RECOVERY  ACT: Reopen account after event delivery delay and show only verified pending alert.  EXPECT: Reopen account after event delivery delay and show only verified pending alert
F-096-T04 PERSISTENCE/PARITY  ACT: Event source reference, effective date, taxpayer identity and alert ID verified.  EXPECT: Event source reference, effective date, taxpayer identity and alert ID verified
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-097
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-097  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep previous taxpayer events in history when a correction or change is recorded.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-020, US-023  •  Current state: UNVERIFIED
F-097-T01 SUCCESS  ACT: After an authorized correction/history change inspect existing taxpayer timeline; verify original event and new case/status both remain with actor and timestamps.  EXPECT: Keep previous taxpayer events in history when a correction or change is recorded.
F-097-T02 NEGATIVE/PERMISSION  ACT: Attempt unauthorized officer transition or fabricated external name/circle change; deny.  EXPECT: Attempt unauthorized officer transition or fabricated external name/circle change; deny
F-097-T03 RECOVERY  ACT: Retry after Office decision network failure; restore same case revision and notification once.  EXPECT: Retry after Office decision network failure; restore same case revision and notification once
F-097-T04 PERSISTENCE/PARITY  ACT: Original payment unchanged; authorized case state/revision, decision timestamps and source-linked external events match both systems.  EXPECT: Original payment unchanged; authorized case state/revision, decision timestamps and source-linked external events match both systems
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-098
**Scope:** CITIZEN — implement frontend

F-098  |  P1  |  APPROVED
APPROVED REQUIREMENT  Recorded payment totals and breakdowns
System: Taxpayer website · Sohojkor SQL  •  Story links: US-019, US-094  •  Current state: UNVERIFIED
F-098-T01 SUCCESS  ACT: From taxpayer dashboard compare self-paid, paid-for-others and received totals with original parent and own allocations.  EXPECT: Recorded payment totals and breakdowns
F-098-T02 NEGATIVE/PERMISSION  ACT: Combined parent total must not be counted once per recipient or both paid and received in one category.  EXPECT: Combined parent total must not be counted once per recipient or both paid and received in one category
F-098-T03 RECOVERY  ACT: Switch date/head filters and recalc without double count.  EXPECT: Switch date/head filters and recalc without double count
F-098-T04 PERSISTENCE/PARITY  ACT: Account-owned payer totals and recipient-only allocation sums from actual SQL.  EXPECT: Account-owned payer totals and recipient-only allocation sums from actual SQL
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-099
**Scope:** CITIZEN — implement frontend

F-099  |  P1  |  APPROVED
APPROVED REQUIREMENT  Dashboard shows Completed Payments, Saved Drafts and Correction Requests instead of old status indicators
System: Taxpayer website  •  Story links: US-019, US-128  •  Current state: UNVERIFIED
F-099-T01 SUCCESS  ACT: Open signed-in dashboard and inspect exactly Completed Payments, Saved Drafts and Correction Requests with correct drill-down.  EXPECT: Approved three cards, sourced amounts and existing drafts visible; no unauthorized replacement.
F-099-T02 NEGATIVE/PERMISSION  ACT: No fabricated status counts or missing owned saved drafts.  EXPECT: No fabricated status counts or missing owned saved drafts.
F-099-T03 RECOVERY  ACT: Reload partial source error and maintain already valid cards.  EXPECT: Reload partial source error and maintain already valid cards.
F-099-T04 PERSISTENCE/PARITY  ACT: Cards reflect permitted payment/draft/correction SQL IDs and amounts.  EXPECT: Cards reflect permitted payment/draft/correction SQL IDs and amounts.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-100
**Scope:** CITIZEN — implement frontend

F-100  |  P1  |  APPROVED
APPROVED REQUIREMENT  Year and service filter
System: Taxpayer website  •  Story links: US-019, US-054  •  Current state: UNVERIFIED
F-100-T01 SUCCESS  ACT: On signed-in dashboard switch assessment year and service filters; compare each filtered count and amount with owned source allocations and unchanged dashboard components.  EXPECT: Year and service filter
F-100-T02 NEGATIVE/PERMISSION  ACT: With unavailable external integration, hide its entire conditional row; do not invent zero payment/liable balance.  EXPECT: With unavailable external integration, hide its entire conditional row; do not invent zero payment/liable balance
F-100-T03 RECOVERY  ACT: Reload after partial/failed external fetch and recover correct layout and existing account cards.  EXPECT: Reload after partial/failed external fetch and recover correct layout and existing account cards
F-100-T04 PERSISTENCE/PARITY  ACT: Card values and drill-downs agree with account-owned payment/draft/correction queries; source-backed only.  EXPECT: Card values and drill-downs agree with account-owned payment/draft/correction queries; source-backed only
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-101
**Scope:** CITIZEN — implement frontend

F-101  |  P1  |  APPROVED
APPROVED REQUIREMENT  Spending by beneficiary tag/relationship
System: Taxpayer website · Sohojkor SQL  •  Story links: US-054  •  Current state: UNVERIFIED
F-101-T01 SUCCESS  ACT: Filter dashboard spending for client/family/friends/other tags by date/AY and inspect matching payer-owned payments.  EXPECT: Amounts sum only actual payer-owned allocation lines under correct tags, without parent duplication.
F-101-T02 NEGATIVE/PERMISSION  ACT: No other account payments or double counted full combined parent in tag group.  EXPECT: No other account payments or double counted full combined parent in tag group.
F-101-T03 RECOVERY  ACT: Change date/year/tag and refresh; stable correct group sums.  EXPECT: Change date/year/tag and refresh; stable correct group sums.
F-101-T04 PERSISTENCE/PARITY  ACT: Each counted allocation ID appears once under owner, tag and period; compare SQL totals.  EXPECT: Each counted allocation ID appears once under owner, tag and period; compare SQL totals.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-102
**Scope:** CITIZEN — implement frontend

F-102  |  P1  |  APPROVED
APPROVED REQUIREMENT  Recent payments and direct activity links
System: Taxpayer website · Sohojkor SQL  •  Story links: US-019, US-087  •  Current state: UNVERIFIED
F-102-T01 SUCCESS  ACT: Open account Activity and sort dated payments, corrections, reports and account events, then inspect linked originals.  EXPECT: Recent payments and direct activity links
F-102-T02 NEGATIVE/PERMISSION  ACT: Do not invent TIN history or reorder items using local rendered time instead of stored event timestamp.  EXPECT: Do not invent TIN history or reorder items using local rendered time instead of stored event timestamp
F-102-T03 RECOVERY  ACT: Reconnect after late event and maintain deterministic chronology.  EXPECT: Reconnect after late event and maintain deterministic chronology
F-102-T04 PERSISTENCE/PARITY  ACT: Actor/source/timestamp/event ID and original reference consistent across views.  EXPECT: Actor/source/timestamp/event ID and original reference consistent across views
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-103
**Scope:** CITIZEN — implement frontend

F-103  |  P1  |  APPROVED
APPROVED REQUIREMENT  Empty-state accuracy: no invented balances
System: Taxpayer website  •  Story links: US-095  •  Current state: UNVERIFIED
F-103-T01 SUCCESS  ACT: Open empty newly created permitted account; inspect dashboard and payment history explanatory no-data states.  EXPECT: Empty-state accuracy: no invented balances
F-103-T02 NEGATIVE/PERMISSION  ACT: No invented liabilities, fictional payment totals or fabricated government data.  EXPECT: No invented liabilities, fictional payment totals or fabricated government data
F-103-T03 RECOVERY  ACT: Reload after failed integration and retain truthful empty/loading/error distinction.  EXPECT: Reload after failed integration and retain truthful empty/loading/error distinction
F-103-T04 PERSISTENCE/PARITY  ACT: Zero owned saved records remain zero; UI never generates phantom data.  EXPECT: Zero owned saved records remain zero; UI never generates phantom data
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-104
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-104  |  P1  |  APPROVED
APPROVED REQUIREMENT  Office payment overview and transaction table
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-025, US-060, US-064  •  Current state: UNVERIFIED
F-104-T01 SUCCESS  ACT: In Office/Admin payment overview open transaction table, search and filter records, open the original transaction and verify its preserved columns/actions.  EXPECT: Office payment overview and transaction table
F-104-T02 NEGATIVE/PERMISSION  ACT: Do not show unauthorized Office data or incorrect filtered count.  EXPECT: Do not show unauthorized Office data or incorrect filtered count
F-104-T03 RECOVERY  ACT: Refresh Office table with same selected filter and open exact row.  EXPECT: Refresh Office table with same selected filter and open exact row
F-104-T04 PERSISTENCE/PARITY  ACT: Filtered Office SQL rows match table IDs and detail drawer.  EXPECT: Filtered Office SQL rows match table IDs and detail drawer
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-105
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-105  |  P1  |  APPROVED
APPROVED REQUIREMENT  Transaction and payment line detail drawer
System: Office SQL · Office/Admin  •  Story links: US-061  •  Current state: UNVERIFIED
F-105-T01 SUCCESS  ACT: Office Admin opens one original transaction and detail drawer with payer, recipients, all head/AY lines, total and receipt/certificate.  EXPECT: Transaction and payment line detail drawer
F-105-T02 NEGATIVE/PERMISSION  ACT: Do not omit a child allocation or treat per-head line as separate parent/receipt.  EXPECT: Do not omit a child allocation or treat per-head line as separate parent/receipt
F-105-T03 RECOVERY  ACT: Close and reopen drawer after refresh; return same original reference.  EXPECT: Close and reopen drawer after refresh; return same original reference
F-105-T04 PERSISTENCE/PARITY  ACT: Office original parent and all lines/receipt/certificate IDs match source and authorized views.  EXPECT: Office original parent and all lines/receipt/certificate IDs match source and authorized views
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-106
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-106  |  P1  |  APPROVED
APPROVED REQUIREMENT  Admin taxpayer 360 timeline shows recorded payments, corrections, reports, TIN application/issuance and jurisdiction/name changes only when verified historical source events exist; present dated fishbone view.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-022, US-063, US-171  •  Current state: UNVERIFIED
F-106-T01 SUCCESS  ACT: In existing Office taxpayer 360 open fishbone dated timeline and show verified TIN/application/issue/circle/name/payment/correction events only where actual source provenance exists.  EXPECT: Dated sequence and event details are accurate, sources linked, no fabricated application/jurisdiction events.
F-106-T02 NEGATIVE/PERMISSION  ACT: Unknown historical event must be absent or clearly unavailable; private saved contacts never exposed.  EXPECT: Unknown historical event must be absent or clearly unavailable; private saved contacts never exposed.
F-106-T03 RECOVERY  ACT: Reload timeline after late verified source event and retain date order without duplicate.  EXPECT: Reload timeline after late verified source event and retain date order without duplicate.
F-106-T04 PERSISTENCE/PARITY  ACT: Historical source event IDs, actor/time, Office projection and linked original financial event match.  EXPECT: Historical source event IDs, actor/time, Office projection and linked original financial event match.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-107
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-107  |  P1  |  APPROVED
APPROVED REQUIREMENT  Office may view the payment-linked list of payers/beneficiaries, relationships and allocation breakdowns for a taxpayer TIN, not the payer’s private saved-beneficiary address book.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-022, US-098, US-099  •  Current state: UNVERIFIED
F-107-T01 SUCCESS  ACT: Office Admin searches verified TIN, opens taxpayer 360 fishbone and payment-linked payer/recipient records, inspects allocations and linked corrections.  EXPECT: Office may view the payment-linked list of payers/beneficiaries, relationships and allocation breakdowns for a taxpayer TIN, not the payer’s private saved-beneficiary address book.
F-107-T02 NEGATIVE/PERMISSION  ACT: Attempt to view payer's private saved-beneficiary address book or unverified historical events; exclude.  EXPECT: Attempt to view payer's private saved-beneficiary address book or unverified historical events; exclude
F-107-T03 RECOVERY  ACT: Refresh taxpayer 360 after a newly synchronized event and retain correct TIN context.  EXPECT: Refresh taxpayer 360 after a newly synchronized event and retain correct TIN context
F-107-T04 PERSISTENCE/PARITY  ACT: Event source/provenance, actor, original parent and line relationships in Office SQL correspond to Taxpayer records.  EXPECT: Event source/provenance, actor, original parent and line relationships in Office SQL correspond to Taxpayer records
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-108
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-108  |  P1  |  APPROVED
APPROVED REQUIREMENT  Office/Admin sees the same original recorded payment reference and related receipt and Payment Certificate, with authorized allocation details and transaction notifications.
System: Office SQL · Office/Admin  •  Story links: US-021, US-061, US-065  •  Current state: UNVERIFIED
F-108-T01 SUCCESS  ACT: Office Admin opens one original transaction and detail drawer with payer, recipients, all head/AY lines, total and receipt/certificate.  EXPECT: Office/Admin sees the same original recorded payment reference and related receipt and Payment Certificate, with authorized allocation details and transaction notifications.
F-108-T02 NEGATIVE/PERMISSION  ACT: Do not omit a child allocation or treat per-head line as separate parent/receipt.  EXPECT: Do not omit a child allocation or treat per-head line as separate parent/receipt
F-108-T03 RECOVERY  ACT: Close and reopen drawer after refresh; return same original reference.  EXPECT: Close and reopen drawer after refresh; return same original reference
F-108-T04 PERSISTENCE/PARITY  ACT: Office original parent and all lines/receipt/certificate IDs match source and authorized views.  EXPECT: Office original parent and all lines/receipt/certificate IDs match source and authorized views
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-109
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-109  |  P1  |  APPROVED
APPROVED REQUIREMENT  Reporting by year, head, payer, beneficiary
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-024, US-062, US-064, US-097  •  Current state: UNVERIFIED
F-109-T01 SUCCESS  ACT: In Office Payment Reports filter by date, AY, head, payer and recipient; inspect parent/line totals and export filtered result.  EXPECT: Reporting by year, head, payer, beneficiary
F-109-T02 NEGATIVE/PERMISSION  ACT: Apply invalid/mismatched filter or multiple allocations that could double-count parent; totals must remain correct.  EXPECT: Apply invalid/mismatched filter or multiple allocations that could double-count parent; totals must remain correct
F-109-T03 RECOVERY  ACT: Reload Office report after export interruption and reproduce same filters and report count.  EXPECT: Reload Office report after export interruption and reproduce same filters and report count
F-109-T04 PERSISTENCE/PARITY  ACT: Office stored payment IDs and line allocations produce exported totals identical to filtered source/Office rows.  EXPECT: Office stored payment IDs and line allocations produce exported totals identical to filtered source/Office rows
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-110
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-110  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show existing correction and unwanted-payment requests in Office.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-023, US-070, US-091, US-100  •  Current state: UNVERIFIED
F-110-T01 SUCCESS  ACT: Open existing Office corrections and unwanted-payment request queue; inspect submitted cases, filters and linked taxpayer/payment details.  EXPECT: Both supported request types appear with their original case IDs, status, owners and actual saved source data.
F-110-T02 NEGATIVE/PERMISSION  ACT: Do not substitute payment sync exception reports or expose private unlinked request data.  EXPECT: Do not substitute payment sync exception reports or expose private unlinked request data.
F-110-T03 RECOVERY  ACT: Retry failed Office request fetch and restore correct queue without duplicates.  EXPECT: Retry failed Office request fetch and restore correct queue without duplicates.
F-110-T04 PERSISTENCE/PARITY  ACT: Taxpayer source case ID/type/status and Office mirrored review record are 1:1.  EXPECT: Taxpayer source case ID/type/status and Office mirrored review record are 1:1.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-111
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-111  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show payment summaries and reports from stored Office records, not manually entered totals.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-024, US-025, US-097  •  Current state: UNVERIFIED
F-111-T01 SUCCESS  ACT: In Office Payment Reports filter by date, AY, head, payer and recipient; inspect parent/line totals and export filtered result.  EXPECT: Show payment summaries and reports from stored Office records, not manually entered totals.
F-111-T02 NEGATIVE/PERMISSION  ACT: Apply invalid/mismatched filter or multiple allocations that could double-count parent; totals must remain correct.  EXPECT: Apply invalid/mismatched filter or multiple allocations that could double-count parent; totals must remain correct
F-111-T03 RECOVERY  ACT: Reload Office report after export interruption and reproduce same filters and report count.  EXPECT: Reload Office report after export interruption and reproduce same filters and report count
F-111-T04 PERSISTENCE/PARITY  ACT: Office stored payment IDs and line allocations produce exported totals identical to filtered source/Office rows.  EXPECT: Office stored payment IDs and line allocations produce exported totals identical to filtered source/Office rows
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-112
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-112  |  P1  |  APPROVED
APPROVED REQUIREMENT  Reuse the existing Office sign-in and permissions for Admin views. Do not add new roles or approval steps.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-069, US-103, US-124  •  Current state: UNVERIFIED
F-112-T01 SUCCESS  ACT: Sign into Office roles with different authorized scopes, open payment/admin views and check only permitted records.  EXPECT: Reuse the existing Office sign-in and permissions for Admin views. Do not add new roles or approval steps.
F-112-T02 NEGATIVE/PERMISSION  ACT: Deny unauthorized query/action and do not create new role or bypass existing Office auth.  EXPECT: Deny unauthorized query/action and do not create new role or bypass existing Office auth
F-112-T03 RECOVERY  ACT: Log out/switch role/refresh; no previous role's records remain.  EXPECT: Log out/switch role/refresh; no previous role's records remain
F-112-T04 PERSISTENCE/PARITY  ACT: Office RLS/authorization and UI readback correspond to existing permissions.  EXPECT: Office RLS/authorization and UI readback correspond to existing permissions
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-113
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-113  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep complete payment details in the Sohojkor database, including each payer, recipient, head, year and amount.
System: Sohojkor SQL  •  Story links: US-072, US-073, US-077  •  Current state: UNVERIFIED
F-113-T01 SUCCESS  ACT: Inspect one existing permitted complete source payment parent and each payer/recipient/head/AY/amount allocation; compare saved detail view.  EXPECT: Every approved field and full total persist under original ID without static mock or missing line.
F-113-T02 NEGATIVE/PERMISSION  ACT: Cannot insert malformed/duplicate allocations or mutate parent without allowed workflow.  EXPECT: Cannot insert malformed/duplicate allocations or mutate parent without allowed workflow.
F-113-T03 RECOVERY  ACT: Retry idempotently under isolated disposable test and retain same original IDs.  EXPECT: Retry idempotently under isolated disposable test and retain same original IDs.
F-113-T04 PERSISTENCE/PARITY  ACT: Exact source parent and allocation IDs, amounts, status, timestamps and document references read back.  EXPECT: Exact source parent and allocation IDs, amounts, status, timestamps and document references read back.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-114
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-114  |  P1  |  APPROVED
APPROVED REQUIREMENT  Send recorded payments to Office without duplicates, including after retries.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-077, US-078, US-080  •  Current state: UNVERIFIED
F-114-T01 SUCCESS  ACT: Deliver exact same original payment event twice, inspect Office table/count and receipt count.  EXPECT: Send recorded payments to Office without duplicates, including after retries.
F-114-T02 NEGATIVE/PERMISSION  ACT: No duplicate parent, child or certificate from repeat event/idempotent retry.  EXPECT: No duplicate parent, child or certificate from repeat event/idempotent retry
F-114-T03 RECOVERY  ACT: Replay after ack timeout and recover original delivery acknowledgment.  EXPECT: Replay after ack timeout and recover original delivery acknowledgment
F-114-T04 PERSISTENCE/PARITY  ACT: Original idempotency/event key uniquely identifies one saved Office parent.  EXPECT: Original idempotency/event key uniquely identifies one saved Office parent
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-115
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-115  |  P1  |  APPROVED
APPROVED REQUIREMENT  Pass the same payment details from Sohojkor to Office and record when Office receives them.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-068, US-071, US-077, US-082  •  Current state: UNVERIFIED
F-115-T01 SUCCESS  ACT: Compare same completed payment reference in Taxpayer SQL, Office SQL and both visible transaction details.  EXPECT: Pass the same payment details from Sohojkor to Office and record when Office receives them.
F-115-T02 NEGATIVE/PERMISSION  ACT: Reject Office duplicate or altered reference during retry.  EXPECT: Reject Office duplicate or altered reference during retry
F-115-T03 RECOVERY  ACT: Replay original event after temporary outage without generating new ID.  EXPECT: Replay original event after temporary outage without generating new ID
F-115-T04 PERSISTENCE/PARITY  ACT: One original parent ID/reference and recorded total identical across both SQL stores.  EXPECT: One original parent ID/reference and recorded total identical across both SQL stores
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-116
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-116  |  P1  |  APPROVED
APPROVED REQUIREMENT  When delivery is repeated or delayed, Office must still save each payment once and in the correct order.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-078, US-079, US-080  •  Current state: UNVERIFIED
F-116-T01 SUCCESS  ACT: Deliver exact same original payment event twice, inspect Office table/count and receipt count.  EXPECT: When delivery is repeated or delayed, Office must still save each payment once and in the correct order.
F-116-T02 NEGATIVE/PERMISSION  ACT: No duplicate parent, child or certificate from repeat event/idempotent retry.  EXPECT: No duplicate parent, child or certificate from repeat event/idempotent retry
F-116-T03 RECOVERY  ACT: Replay after ack timeout and recover original delivery acknowledgment.  EXPECT: Replay after ack timeout and recover original delivery acknowledgment
F-116-T04 PERSISTENCE/PARITY  ACT: Original idempotency/event key uniquely identifies one saved Office parent.  EXPECT: Original idempotency/event key uniquely identifies one saved Office parent
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-117
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-117  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep original payment, allocation, receipt and Payment Certificate references consistent between Sohojkor SQL and Office SQL; preserve original history on retries and replays.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-071, US-072, US-081, US-112  •  Current state: UNVERIFIED
F-117-T01 SUCCESS  ACT: Reconcile original source and Office parent/allocation/receipt/certificate IDs for eligible recorded transaction and replay case.  EXPECT: All original parent, allocation, receipt, certificate references stable; mirror IDs correctly linked and no divergent amounts.
F-117-T02 NEGATIVE/PERMISSION  ACT: Duplicate/replayed event cannot create competing Office parent/documents.  EXPECT: Duplicate/replayed event cannot create competing Office parent/documents.
F-117-T03 RECOVERY  ACT: Restore bridge connectivity and replay once while preserving original IDs.  EXPECT: Restore bridge connectivity and replay once while preserving original IDs.
F-117-T04 PERSISTENCE/PARITY  ACT: Source→Office mapping and data fingerprint for each eligible line/total/doc exact.  EXPECT: Source→Office mapping and data fingerprint for each eligible line/total/doc exact.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-118
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-118  |  P1  |  APPROVED
APPROVED REQUIREMENT  Payers and recipients see their own correct payment details and allocation amounts.
System: Sohojkor SQL  •  Story links: US-073, US-075, US-083  •  Current state: UNVERIFIED
F-118-T01 SUCCESS  ACT: Sign in as verified payer and recipient separately; verify exact payer-owned total and only recipient allocation amounts with privacy guards and original references.  EXPECT: Payers and recipients see their own correct payment details and allocation amounts.
F-118-T02 NEGATIVE/PERMISSION  ACT: Do not substitute payer TIN for recipient or disclose another account's private profile.  EXPECT: Do not substitute payer TIN for recipient or disclose another account's private profile
F-118-T03 RECOVERY  ACT: Reload row details and verify attribution unchanged.  EXPECT: Reload row details and verify attribution unchanged
F-118-T04 PERSISTENCE/PARITY  ACT: Explicit payer/recipient IDs and allocated amount preserved across two DBs.  EXPECT: Explicit payer/recipient IDs and allocated amount preserved across two DBs
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-119
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-119  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep in-app payment notices linked to the original transaction, including their read state.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-059, US-084, US-085  •  Current state: UNVERIFIED
F-119-T01 SUCCESS  ACT: Sign in, open Notifications & Activity and inspect sourced payments/corrections/read state, filter and open event.  EXPECT: Keep in-app payment notices linked to the original transaction, including their read state.
F-119-T02 NEGATIVE/PERMISSION  ACT: Do not duplicate same notice or reveal another account's activity.  EXPECT: Do not duplicate same notice or reveal another account's activity
F-119-T03 RECOVERY  ACT: Reconnect and reopen list; retain acknowledgement and chronological event.  EXPECT: Reconnect and reopen list; retain acknowledgement and chronological event
F-119-T04 PERSISTENCE/PARITY  ACT: Correct owner event IDs, read timestamps and deep-link targets persist.  EXPECT: Correct owner event IDs, read timestamps and deep-link targets persist
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-120
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-120  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep Sohojkor’s database separate from the Office database; match the relevant records between them.
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-103, US-110, US-112  •  Current state: UNVERIFIED
F-120-T01 SUCCESS  ACT: Check production Taxpayer SQL project reference and compare source payment record to Office mirror.  EXPECT: Keep Sohojkor’s database separate from the Office database; match the relevant records between them.
F-120-T02 NEGATIVE/PERMISSION  ACT: Do not write to historical clone or replace original Taxpayer DB endpoint.  EXPECT: Do not write to historical clone or replace original Taxpayer DB endpoint
F-120-T03 RECOVERY  ACT: After connection loss restore original source link and observe correct records.  EXPECT: After connection loss restore original source link and observe correct records
F-120-T04 PERSISTENCE/PARITY  ACT: Exact original project reference, schema/table contract and mirrored IDs.  EXPECT: Exact original project reference, schema/table contract and mirrored IDs
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-121
**Scope:** CITIZEN — implement frontend

F-121  |  P2  |  APPROVED
APPROVED REQUIREMENT  Published Office banners, logos and colors appear the same on the public website.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-029, US-036, US-111  •  Current state: UNVERIFIED
F-121-T01 SUCCESS  ACT: With existing published Office content versions compare both logo AND all five banner artworks/colors in public Sohojkor site at approved breakpoints and languages.  EXPECT: Logo, banner assets, per-image palette, fixed left text/2 CTAs and publish order match Office exactly.
F-121-T02 NEGATIVE/PERMISSION  ACT: No published/preview drift, unauthorized asset mutation or Taxpayer-side zoom/crop.  EXPECT: No published/preview drift, unauthorized asset mutation or Taxpayer-side zoom/crop.
F-121-T03 RECOVERY  ACT: Cache reload produces current published revision and retains previous unaffected assets.  EXPECT: Cache reload produces current published revision and retains previous unaffected assets.
F-121-T04 PERSISTENCE/PARITY  ACT: Office logo/banner publish versions + asset SHA and colors match public route and screenshot.  EXPECT: Office logo/banner publish versions + asset SHA and colors match public route and screenshot.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-122
**Scope:** CITIZEN — implement frontend

F-122  |  P2  |  APPROVED
APPROVED REQUIREMENT  Preserve responsive desktop/mobile and EN/BN screen, including mobile bottom navigation, floating Pay action and top-right Help icon
System: Taxpayer website · Office SQL · Office/Admin  •  Story links: US-042, US-058, US-108  •  Current state: UNVERIFIED
F-122-T01 SUCCESS  ACT: Run existing core payment/search/receipt journeys on phone and desktop in EN/BN, preserving bottom nav/Pay/Help.  EXPECT: Preserve responsive desktop/mobile and EN/BN screen, including mobile bottom navigation, floating Pay action and top-right Help icon
F-122-T02 NEGATIVE/PERMISSION  ACT: Ensure no missing mobile footer, removed control, clipped input or unexpected desktop redesign.  EXPECT: Ensure no missing mobile footer, removed control, clipped input or unexpected desktop redesign
F-122-T03 RECOVERY  ACT: Rotate/resize during form and recover input/focus and safe areas.  EXPECT: Rotate/resize during form and recover input/focus and safe areas
F-122-T04 PERSISTENCE/PARITY  ACT: Same business result IDs across viewports, UI screenshot parity against approved baseline.  EXPECT: Same business result IDs across viewports, UI screenshot parity against approved baseline
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-123
**Scope:** CITIZEN — implement frontend

F-123  |  P2  |  APPROVED
APPROVED REQUIREMENT  Keep existing keyboard, focus and modal behavior usable on desktop and mobile.
System: Taxpayer website · Office SQL · Office/Admin  •  Story links: US-058, US-113  •  Current state: UNVERIFIED
F-123-T01 SUCCESS  ACT: Navigate representative forms/modal/errors entirely by keyboard and assistive roles in EN and BN.  EXPECT: Keep existing keyboard, focus and modal behavior usable on desktop and mobile.
F-123-T02 NEGATIVE/PERMISSION  ACT: Focus must not trap outside approved modal, hide error or skip required control.  EXPECT: Focus must not trap outside approved modal, hide error or skip required control
F-123-T03 RECOVERY  ACT: Open/close modal with Escape/back and verify return focus and retained form data.  EXPECT: Open/close modal with Escape/back and verify return focus and retained form data
F-123-T04 PERSISTENCE/PARITY  ACT: Accessibility checks and unchanged business data on keyboard-only journeys.  EXPECT: Accessibility checks and unchanged business data on keyboard-only journeys
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-124
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-124  |  P1  |  APPROVED
APPROVED REQUIREMENT  Each taxpayer and Office user sees only the records they should already be able to access.
System: Sohojkor SQL  •  Story links: US-069, US-101, US-102, US-103  •  Current state: UNVERIFIED
F-124-T01 SUCCESS  ACT: Using existing authorized A/B taxpayer and Office roles in isolated tests, attempt appropriate own reads and forbidden cross-owner reads/writes.  EXPECT: Existing UI/API/SQL RLS reflect approved permission matrix; owners access permitted records only.
F-124-T02 NEGATIVE/PERMISSION  ACT: No new roles or auth architecture; unauthorized cross-account reads and writes denied.  EXPECT: No new roles or auth architecture; unauthorized cross-account reads and writes denied.
F-124-T03 RECOVERY  ACT: Logout/login or refresh invalidates old owner cache and restores permitted new session only.  EXPECT: Logout/login or refresh invalidates old owner cache and restores permitted new session only.
F-124-T04 PERSISTENCE/PARITY  ACT: Account/Office role IDs, SQL/RLS evidence, returned row IDs and denial outcomes recorded.  EXPECT: Account/Office role IDs, SQL/RLS evidence, returned row IDs and denial outcomes recorded.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-125
**Scope:** CITIZEN — implement frontend

F-125  |  P1  |  APPROVED
APPROVED REQUIREMENT  Payment history, beneficiary lists and search remain responsive as the number of records grows.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-109  •  Current state: UNVERIFIED
F-125-T01 SUCCESS  ACT: Run repeatable representative record-volume performance tests on existing history, beneficiaries and search at agreed mobile/desktop baselines.  EXPECT: Latency and responsiveness compared to explicitly recorded current baseline and acceptable thresholds, no data loss.
F-125-T02 NEGATIVE/PERMISSION  ACT: Slow/failed fetch must not expose stale wrong-account records or break approved UI.  EXPECT: Slow/failed fetch must not expose stale wrong-account records or break approved UI.
F-125-T03 RECOVERY  ACT: Retry/reload after network delay; correct state and pagination/filter restored.  EXPECT: Retry/reload after network delay; correct state and pagination/filter restored.
F-125-T04 PERSISTENCE/PARITY  ACT: Data counts/correctness and real sampled timing/environment; field INP marked UNVERIFIED if unavailable.  EXPECT: Data counts/correctness and real sampled timing/environment; field INP marked UNVERIFIED if unavailable.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-126
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-126  |  P1  |  APPROVED
APPROVED REQUIREMENT  The website, stored Sohojkor records and Office view show matching payment details.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-071, US-072, US-107, US-111  •  Current state: UNVERIFIED
F-126-T01 SUCCESS  ACT: For same known permitted transaction compare Taxpayer UI, original Taxpayer SQL, separate Office SQL and Office detail view.  EXPECT: Every original ID, payer, beneficiary, head, AY, amount, status and document reference matches; no missing/duplicate allocation.
F-126-T02 NEGATIVE/PERMISSION  ACT: No cross-database switch or partial mirror falsely called full parity.  EXPECT: No cross-database switch or partial mirror falsely called full parity.
F-126-T03 RECOVERY  ACT: Replay delayed permitted bridge event and confirm convergence.  EXPECT: Replay delayed permitted bridge event and confirm convergence.
F-126-T04 PERSISTENCE/PARITY  ACT: Full source and Office normalized record fingerprints, genuine linked IDs and UI capture.  EXPECT: Full source and Office normalized record fingerprints, genuine linked IDs and UI capture.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-129
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-129  |  P1  |  APPROVED
APPROVED REQUIREMENT  The live website displays the correct saved transaction and receipt details.
System: Existing release process  •  Story links: US-050, US-115  •  Current state: UNVERIFIED
F-129-T01 SUCCESS  ACT: At actual production URL open a permitted saved transaction and receipt, record built SHA/version and compare to source.  EXPECT: Public deployment matches released SHA and shows original stored payment totals/details without fabricated data.
F-129-T02 NEGATIVE/PERMISSION  ACT: Passing PR/build/preview does not satisfy LIVE; unrelated or blocked record cannot be accessed.  EXPECT: Passing PR/build/preview does not satisfy LIVE; unrelated or blocked record cannot be accessed.
F-129-T03 RECOVERY  ACT: Reload actual live route/retrieve same authorized reference after transient error.  EXPECT: Reload actual live route/retrieve same authorized reference after transient error.
F-129-T04 PERSISTENCE/PARITY  ACT: Actual live URL/headers/version, release SHA, source transaction/document IDs, screenshots and readback evidence.  EXPECT: Actual live URL/headers/version, release SHA, source transaction/document IDs, screenshots and readback evidence.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-130
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-130  |  P1  |  APPROVED
APPROVED REQUIREMENT  Preserve existing payment journeys and the separate Sohojkor and Office databases while improving the system.
System: Existing release process  •  Story links: US-103, US-108, US-115  •  Current state: UNVERIFIED
F-130-T01 SUCCESS  ACT: Check no regression in prior solved journeys and confirm live Taxpayer and Office SQL stay distinct original project refs.  EXPECT: Previous PASS proof intact, approved UI unchanged outside scoped fix and prod never uses clone DB.
F-130-T02 NEGATIVE/PERMISSION  ACT: Reject migration or environment change that swaps original DB or recreates solved features.  EXPECT: Reject migration or environment change that swaps original DB or recreates solved features.
F-130-T03 RECOVERY  ACT: Rollback scoped code/config via tested backup after triggered regression; do not blind reset.  EXPECT: Rollback scoped code/config via tested backup after triggered regression; do not blind reset.
F-130-T04 PERSISTENCE/PARITY  ACT: Main/deployed SHAs, independent backup proof and original project-ref config/readback.  EXPECT: Main/deployed SHAs, independent backup proof and original project-ref config/readback.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-131
**Scope:** CITIZEN — implement frontend

F-131  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show the external-data dashboard row only after successful non-empty retrieval; otherwise remove the row and shift content up
System: Taxpayer website · Sohojkor SQL  •  Story links: US-127  •  Current state: UNVERIFIED
F-131-T01 SUCCESS  ACT: Simulate unavailable and empty eligible external dashboard source in isolation and inspect first-row conditional rendering.  EXPECT: Entire external-data row hidden for failed/empty fetch and next row shifts up without fixed blank space.
F-131-T02 NEGATIVE/PERMISSION  ACT: Never show false zero or stale external figure.  EXPECT: Never show false zero or stale external figure.
F-131-T03 RECOVERY  ACT: After source recovery row appears with genuine data and spacing stays correct.  EXPECT: After source recovery row appears with genuine data and spacing stays correct.
F-131-T04 PERSISTENCE/PARITY  ACT: Fetch result state and DOM/layout capture match approved dashboard; no invented external value.  EXPECT: Fetch result state and DOM/layout capture match approved dashboard; no invented external value.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-132
**Scope:** CITIZEN — implement frontend

F-132  |  P1  |  APPROVED
APPROVED REQUIREMENT  Dedicated Tax Credit Certificates menu for eligible existing tax-credit documents. Keep these source-specific records separate from the automatically generated Sohojkor Payment Certificate for each completed payment.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-129  •  Current state: UNVERIFIED
F-132-T01 SUCCESS  ACT: Open dedicated Tax Credit Certificates menu and view/download only source-proven available tax-credit records.  EXPECT: Dedicated Tax Credit Certificates menu for eligible existing tax-credit documents. Keep these source-specific records separate from the automatically generated Sohojkor Payment Certificate for each completed payment.
F-132-T02 NEGATIVE/PERMISSION  ACT: Never label auto-generated Sohojkor Payment Certificate an official tax-credit certificate.  EXPECT: Never label auto-generated Sohojkor Payment Certificate an official tax-credit certificate
F-132-T03 RECOVERY  ACT: Refresh from offline/unavailable official source; show truthful unavailable/empty state.  EXPECT: Refresh from offline/unavailable official source; show truthful unavailable/empty state
F-132-T04 PERSISTENCE/PARITY  ACT: Document type and entitlement metadata distinguish official source from internal payment docs.  EXPECT: Document type and entitlement metadata distinguish official source from internal payment docs
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-133
**Scope:** CITIZEN — implement frontend

F-133  |  P2  |  APPROVED
APPROVED REQUIREMENT  Show Travel Tax under Pay Tax dropdown; never duplicate it as a top-level menu
System: Taxpayer website  •  Story links: US-130, US-141, US-142  •  Current state: UNVERIFIED
F-133-T01 SUCCESS  ACT: Open Pay Tax overlay menu at desktop/mobile, choose Travel Tax and follow exactly one existing separate Travel Tax form.  EXPECT: Dropdown overlays navigation; Travel Tax not top-level duplicate; existing journey remains correct logged-in and guest.
F-133-T02 NEGATIVE/PERMISSION  ACT: No expanded sidebar width, duplicate wizard or wrong destination on selection.  EXPECT: No expanded sidebar width, duplicate wizard or wrong destination on selection.
F-133-T03 RECOVERY  ACT: Close/back/open dropdown and preserve original nav width/state.  EXPECT: Close/back/open dropdown and preserve original nav width/state.
F-133-T04 PERSISTENCE/PARITY  ACT: Approved sidebar screenshots, actual route IDs and enabled public/account contexts.  EXPECT: Approved sidebar screenshots, actual route IDs and enabled public/account contexts.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-134
**Scope:** CITIZEN — implement frontend

F-134  |  P1  |  APPROVED
APPROVED REQUIREMENT  Beneficiary list/profile display: first line taxpayer name · final tag; second line TIN digits only, no repeated label
System: Taxpayer website  •  Story links: US-131  •  Current state: UNVERIFIED
F-134-T01 SUCCESS  ACT: Open beneficiary row/profile and confirm first line 'name · final tag', second line TIN digits only.  EXPECT: Beneficiary list/profile display: first line taxpayer name · final tag; second line TIN digits only, no repeated label
F-134-T02 NEGATIVE/PERMISSION  ACT: Do not duplicate relationship text or add 'TIN:' prefix contrary to approved display.  EXPECT: Do not duplicate relationship text or add 'TIN:' prefix contrary to approved display
F-134-T03 RECOVERY  ACT: Rename tag and refresh; rendered one final tag updates without losing record.  EXPECT: Rename tag and refresh; rendered one final tag updates without losing record
F-134-T04 PERSISTENCE/PARITY  ACT: Stored latest beneficiary tag/TIN and display order match approved existing component.  EXPECT: Stored latest beneficiary tag/TIN and display order match approved existing component
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-135
**Scope:** SHARED CONTRACT — citizen consumer only; backend frozen

F-135  |  P2  |  APPROVED
APPROVED REQUIREMENT  Office preview and live banner match: fixed left content, slide artwork/colours, no extra Taxpayer zoom or crop
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-034, US-134  •  Current state: UNVERIFIED
F-135-T01 SUCCESS  ACT: Compare existing Office CMS preview for each five-banner art/palette against published public banner on desktop/mobile/EN–BN.  EXPECT: Identical fixed-left text/button and image-derived colors with no taxpayer extra zoom/crop.
F-135-T02 NEGATIVE/PERMISSION  ACT: Preview-published mismatches or hidden CTA are failures; do not invent crop to force parity.  EXPECT: Preview-published mismatches or hidden CTA are failures; do not invent crop to force parity.
F-135-T03 RECOVERY  ACT: After cache reload show correct published revision without stale image overlay.  EXPECT: After cache reload show correct published revision without stale image overlay.
F-135-T04 PERSISTENCE/PARITY  ACT: Office publish version, asset checksum, derived palette, public screenshot matched to approved.  EXPECT: Office publish version, asset checksum, derived palette, public screenshot matched to approved.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-136
**Scope:** CITIZEN — implement frontend

F-136  |  P1  |  APPROVED
APPROVED REQUIREMENT  Saved-first TIN discovery; explicit fallback lookup, 30 sample suggestion profiles and confirmation
System: Taxpayer website · Sohojkor SQL  •  Story links: US-015, US-123, US-132  •  Current state: UNVERIFIED
F-136-T01 SUCCESS  ACT: In payment TIN selector type saved beneficiary; see saved match first; for absent match use explicit TIN fallback and confirm.  EXPECT: Saved-first TIN discovery; explicit fallback lookup, 30 sample suggestion profiles and confirmation
F-136-T02 NEGATIVE/PERMISSION  ACT: Do not confuse 30 example suggestions with verified TIN match or private list membership.  EXPECT: Do not confuse 30 example suggestions with verified TIN match or private list membership
F-136-T03 RECOVERY  ACT: Recover failed fallback request and confirm correct taxpayer without auto-saving.  EXPECT: Recover failed fallback request and confirm correct taxpayer without auto-saving
F-136-T04 PERSISTENCE/PARITY  ACT: Selected TIN/person is explicit and owned saved/fallback status retained correctly.  EXPECT: Selected TIN/person is explicit and owned saved/fallback status retained correctly
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-137
**Scope:** CITIZEN — implement frontend

F-137  |  P1  |  APPROVED
APPROVED REQUIREMENT  Exhaustive valid/invalid combination matrix for Return versus all mapped non-Return heads
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-005, US-107, US-135  •  Current state: UNVERIFIED
F-137-T01 SUCCESS  ACT: Execute valid non-Return multi-beneficiary × multiple-head × multiple-AY combination and negative Return matrix.  EXPECT: Exhaustive valid/invalid combination matrix for Return versus all mapped non-Return heads
F-137-T02 NEGATIVE/PERMISSION  ACT: Do not limit mixed payment to one legacy enum or generate receipt per head.  EXPECT: Do not limit mixed payment to one legacy enum or generate receipt per head
F-137-T03 RECOVERY  ACT: Retry combined submission or edit lines before confirm, retaining one parent.  EXPECT: Retry combined submission or edit lines before confirm, retaining one parent
F-137-T04 PERSISTENCE/PARITY  ACT: All allocations and totals, document count and Office mirror correct with idempotency.  EXPECT: All allocations and totals, document count and Office mirror correct with idempotency
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-138
**Scope:** CITIZEN — implement frontend

F-138  |  P1  |  APPROVED
APPROVED REQUIREMENT  Individual payment-row Pay Again action with full original batch reconstruction
System: Taxpayer website · Sohojkor SQL  •  Story links: US-007, US-133  •  Current state: UNVERIFIED
F-138-T01 SUCCESS  ACT: Click Pay Again on an individual completed payment row, inspect full editable original batch and submit a new one.  EXPECT: Individual payment-row Pay Again action with full original batch reconstruction
F-138-T02 NEGATIVE/PERMISSION  ACT: A table filter or row unrelated to paid status must not trigger Pay Again.  EXPECT: A table filter or row unrelated to paid status must not trigger Pay Again
F-138-T03 RECOVERY  ACT: Return from editing to history and reopen same row; original untouched.  EXPECT: Return from editing to history and reopen same row; original untouched
F-138-T04 PERSISTENCE/PARITY  ACT: Original and new payment parent IDs distinct; new lines, AY requirements and documents correct.  EXPECT: Original and new payment parent IDs distinct; new lines, AY requirements and documents correct
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-139
**Scope:** CITIZEN — implement frontend

F-139  |  P3  |  APPROVED
APPROVED REQUIREMENT  Bilingual static step-by-step user guides for each payment service
System: Taxpayer website  •  Story links: US-136  •  Current state: UNVERIFIED
F-139-T01 SUCCESS  ACT: Read each existing payment service step-by-step guide in EN and BN and follow approved links to existing journeys.  EXPECT: Every service guide has coherent matching EN/BN steps and existing path; no new payment UI created.
F-139-T02 NEGATIVE/PERMISSION  ACT: Missing translation, dead link or outdated step fails without altering code path.  EXPECT: Missing translation, dead link or outdated step fails without altering code path.
F-139-T03 RECOVERY  ACT: Reload guide or switch language after navigation and return to same section.  EXPECT: Reload guide or switch language after navigation and return to same section.
F-139-T04 PERSISTENCE/PARITY  ACT: Guide content revision/last updated, route paths and translation parity documented.  EXPECT: Guide content revision/last updated, route paths and translation parity documented.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-140
**Scope:** CITIZEN — implement frontend

F-140  |  P3  |  APPROVED
APPROVED REQUIREMENT  Bilingual FAQ and plain-language payment terminology glossary
System: Taxpayer website  •  Story links: US-137  •  Current state: UNVERIFIED
F-140-T01 SUCCESS  ACT: Open existing public FAQ and glossary in EN and BN and cross-check terms for real payment, receipt, AY and correction flows.  EXPECT: FAQ/glossary are correct and discoverable, language parity and help link preserve original UI.
F-140-T02 NEGATIVE/PERMISSION  ACT: No fabricated tax guidance or contradictory payment terminology.  EXPECT: No fabricated tax guidance or contradictory payment terminology.
F-140-T03 RECOVERY  ACT: Recover broken search/expand/navigation while preserving guest access.  EXPECT: Recover broken search/expand/navigation while preserving guest access.
F-140-T04 PERSISTENCE/PARITY  ACT: Published source content and approved bilingual glossary entries match UI.  EXPECT: Published source content and approved bilingual glossary entries match UI.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-141
**Scope:** CITIZEN — implement frontend

F-141  |  P3  |  APPROVED
APPROVED REQUIREMENT  Static contact/help information and checked official resource links
System: Taxpayer website  •  Story links: US-138  •  Current state: UNVERIFIED
F-141-T01 SUCCESS  ACT: From public Help locate approved contacts and official resource links, open safe destination.  EXPECT: Static contact/help information and checked official resource links
F-141-T02 NEGATIVE/PERMISSION  ACT: Do not include broken/unsupported official-looking links or private contact values.  EXPECT: Do not include broken/unsupported official-looking links or private contact values
F-141-T03 RECOVERY  ACT: Return from external link and continue public Help without forced sign-in.  EXPECT: Return from external link and continue public Help without forced sign-in
F-141-T04 PERSISTENCE/PARITY  ACT: Configured links verified against authoritative approved resource list, no app data mutation.  EXPECT: Configured links verified against authoritative approved resource list, no app data mutation
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-142
**Scope:** CITIZEN — implement frontend

F-142  |  P3  |  APPROVED
APPROVED REQUIREMENT  Privacy, terms, current demonstration system boundaries and legal information pages
System: Taxpayer website  •  Story links: US-139  •  Current state: UNVERIFIED
F-142-T01 SUCCESS  ACT: Open current public terms/privacy pages and inspect scope and accessible navigation.  EXPECT: Privacy, terms, current demonstration system boundaries and legal information pages
F-142-T02 NEGATIVE/PERMISSION  ACT: Do not promise unsupported government issuance or expose personal data in public text.  EXPECT: Do not promise unsupported government issuance or expose personal data in public text
F-142-T03 RECOVERY  ACT: Reload legal page and switch language; maintain readable current content.  EXPECT: Reload legal page and switch language; maintain readable current content
F-142-T04 PERSISTENCE/PARITY  ACT: Published policy version/date and current link navigation consistent.  EXPECT: Published policy version/date and current link navigation consistent
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-143
**Scope:** CITIZEN — implement frontend

F-143  |  P3  |  APPROVED
APPROVED REQUIREMENT  Keep existing public guides up to date and show their last-updated date.
System: Taxpayer website · Office SQL · Office/Admin  •  Story links: US-140, US-067  •  Current state: UNVERIFIED
F-143-T01 SUCCESS  ACT: Open guide content from public site and check displayed last-updated date against current approved guide revision.  EXPECT: Source-backed update date displayed for maintained guide without fake/current-date substitution.
F-143-T02 NEGATIVE/PERMISSION  ACT: Do not show timestamp unrelated to version or expose draft CMS changes.  EXPECT: Do not show timestamp unrelated to version or expose draft CMS changes.
F-143-T03 RECOVERY  ACT: Refresh after real permitted guide update and retain correct version/date.  EXPECT: Refresh after real permitted guide update and retain correct version/date.
F-143-T04 PERSISTENCE/PARITY  ACT: Guide published version and authoritative modification timestamp align with UI.  EXPECT: Guide published version and authoritative modification timestamp align with UI.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-144
**Scope:** CITIZEN — implement frontend

F-144  |  P1  |  APPROVED
APPROVED REQUIREMENT  Travel Tax access for visitors and signed-in taxpayers
System: Taxpayer website  •  Story links: US-116, US-141, US-142  •  Current state: UNVERIFIED
F-144-T01 SUCCESS  ACT: From signed-in Pay Tax overlay choose Travel Tax and open same existing passenger flow.  EXPECT: Travel Tax access for visitors and signed-in taxpayers
F-144-T02 NEGATIVE/PERMISSION  ACT: Do not show two inconsistent Travel Tax UIs or drop active account state.  EXPECT: Do not show two inconsistent Travel Tax UIs or drop active account state
F-144-T03 RECOVERY  ACT: Return to signed-in dashboard and reopen Travel Tax without cross-account leakage.  EXPECT: Return to signed-in dashboard and reopen Travel Tax without cross-account leakage
F-144-T04 PERSISTENCE/PARITY  ACT: One canonical Travel Tax destination and owner-authenticated form state.  EXPECT: One canonical Travel Tax destination and owner-authenticated form state
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-145
**Scope:** CITIZEN — implement frontend

F-145  |  P1  |  APPROVED
APPROVED REQUIREMENT  Choose land or water travel
System: Taxpayer website  •  Story links: US-143  •  Current state: UNVERIFIED
F-145-T01 SUCCESS  ACT: In Travel Tax choose land or water, then inspect compatible port/service options.  EXPECT: Choose land or water travel
F-145-T02 NEGATIVE/PERMISSION  ACT: Incompatible route/port combination must not be accepted or mislabeled official zone.  EXPECT: Incompatible route/port combination must not be accepted or mislabeled official zone
F-145-T03 RECOVERY  ACT: Switch mode and return; dependent port resets only when invalid.  EXPECT: Switch mode and return; dependent port resets only when invalid
F-145-T04 PERSISTENCE/PARITY  ACT: Stored route and selected port are compatible and review reflects current choice.  EXPECT: Stored route and selected port are compatible and review reflects current choice
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-146
**Scope:** CITIZEN — implement frontend

F-146  |  P1  |  APPROVED
APPROVED REQUIREMENT  Choose departure port without guessing tax zone
System: Taxpayer website · Sohojkor SQL  •  Story links: US-143, US-144  •  Current state: UNVERIFIED
F-146-T01 SUCCESS  ACT: Enter departure port, destination and planned travel date then proceed to passenger details.  EXPECT: Choose departure port without guessing tax zone
F-146-T02 NEGATIVE/PERMISSION  ACT: Reject missing/invalid past travel date or port mismatch where form requires it.  EXPECT: Reject missing/invalid past travel date or port mismatch where form requires it
F-146-T03 RECOVERY  ACT: Back from passenger step and correct route/date without losing valid passengers.  EXPECT: Back from passenger step and correct route/date without losing valid passengers
F-146-T04 PERSISTENCE/PARITY  ACT: Review and draft retain exact selected port/destination/date.  EXPECT: Review and draft retain exact selected port/destination/date
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-147
**Scope:** CITIZEN — implement frontend

F-147  |  P1  |  APPROVED
APPROVED REQUIREMENT  Enter destination and planned travel date
System: Taxpayer website  •  Story links: US-144  •  Current state: UNVERIFIED
F-147-T01 SUCCESS  ACT: Enter departure port, destination and planned travel date then proceed to passenger details.  EXPECT: Enter destination and planned travel date
F-147-T02 NEGATIVE/PERMISSION  ACT: Reject missing/invalid past travel date or port mismatch where form requires it.  EXPECT: Reject missing/invalid past travel date or port mismatch where form requires it
F-147-T03 RECOVERY  ACT: Back from passenger step and correct route/date without losing valid passengers.  EXPECT: Back from passenger step and correct route/date without losing valid passengers
F-147-T04 PERSISTENCE/PARITY  ACT: Review and draft retain exact selected port/destination/date.  EXPECT: Review and draft retain exact selected port/destination/date
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-148
**Scope:** CITIZEN — implement frontend

F-148  |  P1  |  APPROVED
APPROVED REQUIREMENT  Enter a Bangladeshi passenger passport
System: Taxpayer website  •  Story links: US-145  •  Current state: UNVERIFIED
F-148-T01 SUCCESS  ACT: For Bangladeshi passenger provide approved passport, identity and birth date fields then continue.  EXPECT: Enter a Bangladeshi passenger passport
F-148-T02 NEGATIVE/PERMISSION  ACT: Reject incomplete/invalid passport or missing mandatory identity details.  EXPECT: Reject incomplete/invalid passport or missing mandatory identity details
F-148-T03 RECOVERY  ACT: Edit passport error, preserve other passenger information and continue.  EXPECT: Edit passport error, preserve other passenger information and continue
F-148-T04 PERSISTENCE/PARITY  ACT: Passenger record contains exactly validated BD passport details, no invented verification.  EXPECT: Passenger record contains exactly validated BD passport details, no invented verification
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-149
**Scope:** CITIZEN — implement frontend

F-149  |  P1  |  APPROVED
APPROVED REQUIREMENT  Enter a foreign passenger passport and nationality country
System: Taxpayer website  •  Story links: US-146  •  Current state: UNVERIFIED
F-149-T01 SUCCESS  ACT: For foreign passenger choose nationality country, passport, name and birth date and continue.  EXPECT: Enter a foreign passenger passport and nationality country
F-149-T02 NEGATIVE/PERMISSION  ACT: Reject missing nationality or invalid passport without silently changing country.  EXPECT: Reject missing nationality or invalid passport without silently changing country
F-149-T03 RECOVERY  ACT: Back to identity step and correct foreign nationality/passport.  EXPECT: Back to identity step and correct foreign nationality/passport
F-149-T04 PERSISTENCE/PARITY  ACT: Stored passenger nationality and passport fields match review and final submitted payload.  EXPECT: Stored passenger nationality and passport fields match review and final submitted payload
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-150
**Scope:** CITIZEN — implement frontend

F-150  |  P1  |  APPROVED
APPROVED REQUIREMENT  Calculate a passenger’s age on the travel date
System: Taxpayer website · Sohojkor SQL  •  Story links: US-147  •  Current state: UNVERIFIED
F-150-T01 SUCCESS  ACT: Enter passenger DOB and actual travel date, verify age derived for that date including boundary birthdays.  EXPECT: Calculate a passenger’s age on the travel date
F-150-T02 NEGATIVE/PERMISSION  ACT: Reject impossible DOB or age based on current date instead of travel date.  EXPECT: Reject impossible DOB or age based on current date instead of travel date
F-150-T03 RECOVERY  ACT: Change travel date and recalculate all dependent ages without losing passengers.  EXPECT: Change travel date and recalculate all dependent ages without losing passengers
F-150-T04 PERSISTENCE/PARITY  ACT: Age/eligibility and input dates in review consistent with existing rule.  EXPECT: Age/eligibility and input dates in review consistent with existing rule
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-151
**Scope:** CITIZEN — implement frontend

F-151  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show sample Travel Tax amounts for each passenger
System: Taxpayer website · Sohojkor SQL  •  Story links: US-121, US-148, US-166  •  Current state: UNVERIFIED
F-151-T01 SUCCESS  ACT: Inspect each Travel Tax passenger amount, source rate classification, age reduction and combined total for approved sample rate mapping.  EXPECT: Illustrative rate source and amount type are not misrepresented as verified government settlement; sums accurate.
F-151-T02 NEGATIVE/PERMISSION  ACT: No unsupported official tax rate or automatic medical exemption is claimed.  EXPECT: No unsupported official tax rate or automatic medical exemption is claimed.
F-151-T03 RECOVERY  ACT: Change age/date/route and recalculate accurately without stale passenger totals.  EXPECT: Change age/date/route and recalculate accurately without stale passenger totals.
F-151-T04 PERSISTENCE/PARITY  ACT: Stored approved mapping/version and item amounts equal review and receipt; demo/test data not misrepresented.  EXPECT: Stored approved mapping/version and item amounts equal review and receipt; demo/test data not misrepresented.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-152
**Scope:** CITIZEN — implement frontend

F-152  |  P1  |  APPROVED
APPROVED REQUIREMENT  Add several passengers to one Travel Tax payment
System: Taxpayer website · Sohojkor SQL  •  Story links: US-118, US-149  •  Current state: UNVERIFIED
F-152-T01 SUCCESS  ACT: Add multiple distinct Travel Tax passengers, confirm each and review combined total in one payment.  EXPECT: Add several passengers to one Travel Tax payment
F-152-T02 NEGATIVE/PERMISSION  ACT: Duplicate passports or unconfirmed passenger must not proceed.  EXPECT: Duplicate passports or unconfirmed passenger must not proceed
F-152-T03 RECOVERY  ACT: Remove/edit a passenger after review, update total and keep others.  EXPECT: Remove/edit a passenger after review, update total and keep others
F-152-T04 PERSISTENCE/PARITY  ACT: Exactly one transaction with each confirmed passenger and sum of amounts.  EXPECT: Exactly one transaction with each confirmed passenger and sum of amounts
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-153
**Scope:** CITIZEN — implement frontend

F-153  |  P1  |  APPROVED
APPROVED REQUIREMENT  Edit or remove a passenger before confirming
System: Taxpayer website  •  Story links: US-150  •  Current state: UNVERIFIED
F-153-T01 SUCCESS  ACT: Edit or remove one passenger from an existing multi-person Travel Tax draft, then review updated list.  EXPECT: Edit or remove a passenger before confirming
F-153-T02 NEGATIVE/PERMISSION  ACT: Removing one must not erase another or leave stale total.  EXPECT: Removing one must not erase another or leave stale total
F-153-T03 RECOVERY  ACT: Cancel a removal/edit and restore prior valid passenger fields.  EXPECT: Cancel a removal/edit and restore prior valid passenger fields
F-153-T04 PERSISTENCE/PARITY  ACT: Latest draft passengers, count and amount totals match UI.  EXPECT: Latest draft passengers, count and amount totals match UI
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-154
**Scope:** CITIZEN — implement frontend

F-154  |  P1  |  APPROVED
APPROVED REQUIREMENT  Prevent duplicate passports and incomplete passengers
System: Taxpayer website · Sohojkor SQL  •  Story links: US-151  •  Current state: UNVERIFIED
F-154-T01 SUCCESS  ACT: Enter same passport twice or omit mandatory passenger data; observe field errors before submitting.  EXPECT: Prevent duplicate passports and incomplete passengers
F-154-T02 NEGATIVE/PERMISSION  ACT: No duplicate passport or incomplete passenger may be accepted.  EXPECT: No duplicate passport or incomplete passenger may be accepted
F-154-T03 RECOVERY  ACT: Correct affected passport/field and proceed without reentering other passengers.  EXPECT: Correct affected passport/field and proceed without reentering other passengers
F-154-T04 PERSISTENCE/PARITY  ACT: Validated passenger list unique by required passport rules, no duplicate submitted.  EXPECT: Validated passenger list unique by required passport rules, no duplicate submitted
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-155
**Scope:** CITIZEN — implement frontend

F-155  |  P1  |  APPROVED
APPROVED REQUIREMENT  Explicitly confirm each traveller
System: Taxpayer website  •  Story links: US-152  •  Current state: UNVERIFIED
F-155-T01 SUCCESS  ACT: Inspect each passenger review row and explicitly confirm all before payment step enables.  EXPECT: Explicitly confirm each traveller
F-155-T02 NEGATIVE/PERMISSION  ACT: One unchecked passenger prevents advance, without losing current data.  EXPECT: One unchecked passenger prevents advance, without losing current data
F-155-T03 RECOVERY  ACT: Navigate Back from payment to confirmation and keep valid confirmations.  EXPECT: Navigate Back from payment to confirmation and keep valid confirmations
F-155-T04 PERSISTENCE/PARITY  ACT: Per-passenger confirmation state and reviewed amounts preserved as designed.  EXPECT: Per-passenger confirmation state and reviewed amounts preserved as designed
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-156
**Scope:** CITIZEN — implement frontend

F-156  |  P1  |  APPROVED
APPROVED REQUIREMENT  Handle medical exemption/referral without falsely granting relief
System: Taxpayer website · Sohojkor SQL  •  Story links: US-153  •  Current state: UNVERIFIED
F-156-T01 SUCCESS  ACT: Select medical exemption/referral case and follow existing information or review path without automatic relief.  EXPECT: Handle medical exemption/referral without falsely granting relief
F-156-T02 NEGATIVE/PERMISSION  ACT: Do not grant unverified official exemption or change financial amount without source.  EXPECT: Do not grant unverified official exemption or change financial amount without source
F-156-T03 RECOVERY  ACT: Return to passenger detail from referral guidance without losing entered fields.  EXPECT: Return to passenger detail from referral guidance without losing entered fields
F-156-T04 PERSISTENCE/PARITY  ACT: Recorded referral/evidence state remains honest; no false relief approval.  EXPECT: Recorded referral/evidence state remains honest; no false relief approval
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-157
**Scope:** CITIZEN — implement frontend

F-157  |  P1  |  APPROVED
APPROVED REQUIREMENT  Collect required contact mobile without forcing email
System: Taxpayer website  •  Story links: US-120, US-154  •  Current state: UNVERIFIED
F-157-T01 SUCCESS  ACT: Enter required contact mobile on Travel Tax and proceed with optional email empty.  EXPECT: Collect required contact mobile without forcing email
F-157-T02 NEGATIVE/PERMISSION  ACT: Do not require email or accept invalid mandatory mobile.  EXPECT: Do not require email or accept invalid mandatory mobile
F-157-T03 RECOVERY  ACT: Back/reload a saved form, preserve verified mobile and optional empty email.  EXPECT: Back/reload a saved form, preserve verified mobile and optional empty email
F-157-T04 PERSISTENCE/PARITY  ACT: Contact mobile appears correctly on recorded receipt without forced email.  EXPECT: Contact mobile appears correctly on recorded receipt without forced email
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-158
**Scope:** CITIZEN — implement frontend

F-158  |  P1  |  APPROVED
APPROVED REQUIREMENT  Choose available payment channel and method
System: Taxpayer website  •  Story links: US-155, US-179  •  Current state: UNVERIFIED
F-158-T01 SUCCESS  ACT: Choose available Travel Tax payment channel and method, inspect selected choice on review and receipt.  EXPECT: Choose available payment channel and method
F-158-T02 NEGATIVE/PERMISSION  ACT: Reject unsupported channel/method combination and stale price without duplicate submit.  EXPECT: Reject unsupported channel/method combination and stale price without duplicate submit
F-158-T03 RECOVERY  ACT: Return from review to method step, change valid choice and preserve passengers.  EXPECT: Return from review to method step, change valid choice and preserve passengers
F-158-T04 PERSISTENCE/PARITY  ACT: Chosen method/channel and payment reference persist with Travel Tax parent.  EXPECT: Chosen method/channel and payment reference persist with Travel Tax parent
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-159
**Scope:** CITIZEN — implement frontend

F-159  |  P1  |  APPROVED
APPROVED REQUIREMENT  Show a full Travel Tax review before payment
System: Taxpayer website  •  Story links: US-156  •  Current state: UNVERIFIED
F-159-T01 SUCCESS  ACT: Review all passengers, route, contact, methods, per-person amounts and grand total before confirming payment.  EXPECT: Show a full Travel Tax review before payment
F-159-T02 NEGATIVE/PERMISSION  ACT: Do not allow submission with unconfirmed passenger, mismatched sum or missing mandatory detail.  EXPECT: Do not allow submission with unconfirmed passenger, mismatched sum or missing mandatory detail
F-159-T03 RECOVERY  ACT: Back from review to edit and return with updated correct summary.  EXPECT: Back from review to edit and return with updated correct summary
F-159-T04 PERSISTENCE/PARITY  ACT: Review snapshot matches persisted submission payload and one receipt.  EXPECT: Review snapshot matches persisted submission payload and one receipt
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-160
**Scope:** CITIZEN — implement frontend

F-160  |  P1  |  APPROVED
APPROVED REQUIREMENT  Save Travel Tax payment once and show one complete receipt
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-157, US-163  •  Current state: UNVERIFIED
F-160-T01 SUCCESS  ACT: Finish permitted Travel Tax and inspect success message, stable original receipt, certificate and itemized passengers.  EXPECT: Save Travel Tax payment once and show one complete receipt
F-160-T02 NEGATIVE/PERMISSION  ACT: Do not create second payment or issue certificate before completed saved result.  EXPECT: Do not create second payment or issue certificate before completed saved result
F-160-T03 RECOVERY  ACT: Refresh success screen and retrieve original documents by same reference.  EXPECT: Refresh success screen and retrieve original documents by same reference
F-160-T04 PERSISTENCE/PARITY  ACT: One parent/receipt/certificate with all passenger allocations in source and Office.  EXPECT: One parent/receipt/certificate with all passenger allocations in source and Office
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-161
**Scope:** CITIZEN — implement frontend

F-161  |  P1  |  APPROVED
APPROVED REQUIREMENT  Save and resume a signed-in traveller’s unfinished Travel Tax form.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-160  •  Current state: UNVERIFIED
F-161-T01 SUCCESS  ACT: Save incomplete Travel Tax with multiple passenger fields, resume from draft and finish or discard.  EXPECT: Save and resume a signed-in traveller’s unfinished Travel Tax form.
F-161-T02 NEGATIVE/PERMISSION  ACT: No draft counted as paid or exposed to another account.  EXPECT: No draft counted as paid or exposed to another account
F-161-T03 RECOVERY  ACT: Close/relogin or refresh and restore safe field/step without duplicate.  EXPECT: Close/relogin or refresh and restore safe field/step without duplicate
F-161-T04 PERSISTENCE/PARITY  ACT: Owner-scoped Travel Tax draft, passenger list and step state persist accurately.  EXPECT: Owner-scoped Travel Tax draft, passenger list and step state persist accurately
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-162
**Scope:** CITIZEN — implement frontend

F-162  |  P1  |  APPROVED
APPROVED REQUIREMENT  Guest and signed-in Travel Tax payment history retains the original receipt and generated Payment Certificate under the same transaction reference.
System: Taxpayer website · Sohojkor SQL · Office SQL  •  Story links: US-119, US-158, US-159  •  Current state: UNVERIFIED
F-162-T01 SUCCESS  ACT: Open permitted Payments & Activity after Travel Tax and find original transaction/document by date/reference.  EXPECT: Guest and signed-in Travel Tax payment history retains the original receipt and generated Payment Certificate under the same transaction reference.
F-162-T02 NEGATIVE/PERMISSION  ACT: Do not expose another person's protected passport or missing line.  EXPECT: Do not expose another person's protected passport or missing line
F-162-T03 RECOVERY  ACT: Sign out/relogin and recover same eligible Travel Tax history.  EXPECT: Sign out/relogin and recover same eligible Travel Tax history
F-162-T04 PERSISTENCE/PARITY  ACT: Source original payment/receipt and owner/session binding preserved.  EXPECT: Source original payment/receipt and owner/session binding preserved
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-163
**Scope:** CITIZEN — implement frontend

F-163  |  P1  |  APPROVED
APPROVED REQUIREMENT  Travel Tax Pay Again creates a new payment and new Payment Certificate after successful completion. Preserve the previous transaction and its certificate.
System: Taxpayer website · Sohojkor SQL · Office SQL  •  Story links: US-161  •  Current state: UNVERIFIED
F-163-T01 SUCCESS  ACT: From completed original Travel Tax row use Pay Again; review safe prefilled itinerary/passengers, revalidate protected identity/passport and complete new parent.  EXPECT: Original transaction and certificate remain unchanged; new parent/receipt/certificate created with correct passenger lines.
F-163-T02 NEGATIVE/PERMISSION  ACT: Masked prior passport is not treated as verified; no new document on interrupted repeat.  EXPECT: Masked prior passport is not treated as verified; no new document on interrupted repeat.
F-163-T03 RECOVERY  ACT: Exit/reenter repeat and revalidate mandatory values, with original history untouched.  EXPECT: Exit/reenter repeat and revalidate mandatory values, with original history untouched.
F-163-T04 PERSISTENCE/PARITY  ACT: Old/new parent IDs and document refs distinct, itemized source/Office match.  EXPECT: Old/new parent IDs and document refs distinct, itemized source/Office match.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-164
**Scope:** CITIZEN — implement frontend

F-164  |  P1  |  APPROVED
APPROVED REQUIREMENT  Travel Tax beneficiary/recipient visibility and Office reporting
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-162, US-163, US-164  •  Current state: UNVERIFIED
F-164-T01 SUCCESS  ACT: As verified travel recipient open only own permitted travel allocation and linked document access.  EXPECT: Travel Tax beneficiary/recipient visibility and Office reporting
F-164-T02 NEGATIVE/PERMISSION  ACT: Do not reveal other passengers' passport/name data from same parent.  EXPECT: Do not reveal other passengers' passport/name data from same parent
F-164-T03 RECOVERY  ACT: Reopen after account refresh or entitlement change and enforce current scope.  EXPECT: Reopen after account refresh or entitlement change and enforce current scope
F-164-T04 PERSISTENCE/PARITY  ACT: Per-recipient verified identity relationship, allocation ID and disclosure boundaries.  EXPECT: Per-recipient verified identity relationship, allocation ID and disclosure boundaries
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-165
**Scope:** CITIZEN — implement frontend

F-165  |  P1  |  APPROVED
APPROVED REQUIREMENT  Travel Tax mobile, Bangla and English usability
System: Taxpayer website  •  Story links: US-165, US-108  •  Current state: UNVERIFIED
F-165-T01 SUCCESS  ACT: Complete Travel Tax journey on mobile and desktop with EN/BN, keyboard, Back and receipt.  EXPECT: Travel Tax mobile, Bangla and English usability
F-165-T02 NEGATIVE/PERMISSION  ACT: No clipped field, missing floating Pay/bottom nav or broken translated validation.  EXPECT: No clipped field, missing floating Pay/bottom nav or broken translated validation
F-165-T03 RECOVERY  ACT: Switch language/viewport mid-journey; save/resume original form state.  EXPECT: Switch language/viewport mid-journey; save/resume original form state
F-165-T04 PERSISTENCE/PARITY  ACT: Same validated passenger/payment payload regardless of device/language.  EXPECT: Same validated passenger/payment payload regardless of device/language
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-166
**Scope:** CITIZEN — implement frontend

F-166  |  P1  |  APPROVED
APPROVED REQUIREMENT  Single taxpayer profile with the 24 agreed registration fields and top summary. Keep the current TIN, phone and email masking with eye/copy actions; use the existing certificate view.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-167, US-178  •  Current state: UNVERIFIED
F-166-T01 SUCCESS  ACT: Open single signed-in taxpayer profile; compare all 24 existing field keys and sourced values to supplied original certificate; check eye reveal and adjacent copy buttons for TIN/phone/email.  EXPECT: No extra/omitted/duplicate fields, correct masked last 2–3 digits, legitimate show/copy, top summary and existing approved spacing.
F-166-T02 NEGATIVE/PERMISSION  ACT: No fake certificate values or cross-account exposure; no paste icon replacing copy.  EXPECT: No fake certificate values or cross-account exposure; no paste icon replacing copy.
F-166-T03 RECOVERY  ACT: Toggle masks, refresh/relogin and restore owner-specific correctly masked profile.  EXPECT: Toggle masks, refresh/relogin and restore owner-specific correctly masked profile.
F-166-T04 PERSISTENCE/PARITY  ACT: 24 code-defined fields compared against original certificate and both SQL projections, approved screenshots required.  EXPECT: 24 code-defined fields compared against original certificate and both SQL projections, approved screenshots required.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-167
**Scope:** CITIZEN — implement frontend

F-167  |  P1  |  APPROVED
APPROVED REQUIREMENT  Optional walk-in payer TIN: search and confirm a match, then link the recorded payment to the payer’s verified account history
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-003, US-168  •  Current state: UNVERIFIED
F-167-T01 SUCCESS  ACT: In walk-in Other Tax leave payer TIN empty then optionally enter validated 12-digit payer TIN, complete payment and later find it after verified sign-in.  EXPECT: Optional walk-in payer TIN: search and confirm a match, then link the recorded payment to the payer’s verified account history
F-167-T02 NEGATIVE/PERMISSION  ACT: Reject invalid payer TIN but never force it, and do not grant account history by typed TIN alone.  EXPECT: Reject invalid payer TIN but never force it, and do not grant account history by typed TIN alone
F-167-T03 RECOVERY  ACT: Recover payer TIN lookup failure and continue permitted walk-in; later authenticated claim only.  EXPECT: Recover payer TIN lookup failure and continue permitted walk-in; later authenticated claim only
F-167-T04 PERSISTENCE/PARITY  ACT: Payer TIN stored separate from recipient; original payment/Office records match verified payer linkage.  EXPECT: Payer TIN stored separate from recipient; original payment/Office records match verified payer linkage
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-168
**Scope:** CITIZEN — implement frontend

F-168  |  P1  |  APPROVED
APPROVED REQUIREMENT  Signed-in taxpayer can view available certificates, ledger, payment history and receipts, including automatically generated Payment Certificates, and view, print or download each permitted document.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-169  •  Current state: UNVERIFIED
F-168-T01 SUCCESS  ACT: Open logged-in ledger and list recorded payments, receipts, auto certificates and available genuine credit documents; view/print/download permitted items.  EXPECT: Signed-in taxpayer can view available certificates, ledger, payment history and receipts, including automatically generated Payment Certificates, and view, print or download each permitted document.
F-168-T02 NEGATIVE/PERMISSION  ACT: Never show unavailable government certificate as existing or leak another account's ledger.  EXPECT: Never show unavailable government certificate as existing or leak another account's ledger
F-168-T03 RECOVERY  ACT: Refresh account after temporary document fetch error and restore permitted history.  EXPECT: Refresh account after temporary document fetch error and restore permitted history
F-168-T04 PERSISTENCE/PARITY  ACT: Original parent/document references and confirmed official entitlement sources remain distinct.  EXPECT: Original parent/document references and confirmed official entitlement sources remain distinct
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-169
**Scope:** CITIZEN — implement frontend

F-169  |  P1  |  APPROVED
APPROVED REQUIREMENT  Require existing taxpayer sign-in before starting a correction, including payments originally made as walk-in
System: Taxpayer website · Sohojkor SQL  •  Story links: US-008, US-170  •  Current state: UNVERIFIED
F-169-T01 SUCCESS  ACT: From permitted walk-in original transaction request correction; first require existing verified sign-in then submit authorized case.  EXPECT: Correction only after login, immutable original linked, Office receives case and taxpayer sees later decision.
F-169-T02 NEGATIVE/PERMISSION  ACT: Logged-out or unrelated user cannot submit case.  EXPECT: Logged-out or unrelated user cannot submit case.
F-169-T03 RECOVERY  ACT: Recover interrupted login/submit using same case ID.  EXPECT: Recover interrupted login/submit using same case ID.
F-169-T04 PERSISTENCE/PARITY  ACT: Owner binding/case ID/Office decision and original payment refs match.  EXPECT: Owner binding/case ID/Office decision and original payment refs match.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-170
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-170  |  P1  |  APPROVED
APPROVED REQUIREMENT  Complete verified taxpayer event history in Admin with a dated fishbone timeline (TIN application/issue, jurisdiction, name changes, corrections and payments)
System: Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-022, US-171  •  Current state: UNVERIFIED
F-170-T01 SUCCESS  ACT: For authorized taxpayer open Admin dated fishbone timeline with TIN application/issue, jurisdiction/name changes, payments and corrections when source events are verified.  EXPECT: All available genuine event types are represented with date/actor/provenance; absent sources are not invented.
F-170-T02 NEGATIVE/PERMISSION  ACT: Do not manufacture application/issue dates or private saved contact events.  EXPECT: Do not manufacture application/issue dates or private saved contact events.
F-170-T03 RECOVERY  ACT: Reopen after delayed source-linked event and preserve chronological history.  EXPECT: Reopen after delayed source-linked event and preserve chronological history.
F-170-T04 PERSISTENCE/PARITY  ACT: Event IDs/timestamps and source provenance reconcile to Office timeline and historic immutable records.  EXPECT: Event IDs/timestamps and source provenance reconcile to Office timeline and historic immutable records.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-171
**Scope:** CITIZEN — implement frontend

F-171  |  P1  |  APPROVED
APPROVED REQUIREMENT  Keep “Find a payment record” below the homepage banner. Search by challan, token or transaction reference and display the permitted result or a clear no-match message.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-050, US-172  •  Current state: UNVERIFIED
F-171-T01 SUCCESS  ACT: Find payment record under banner by approved challan/token/transaction reference, including result and no-match states.  EXPECT: Existing approved search placement and one original receipt/certificate retrieval; no duplicate payment.
F-171-T02 NEGATIVE/PERMISSION  ACT: Restricted or unmatched reference reveals no protected data or invented receipt.  EXPECT: Restricted or unmatched reference reveals no protected data or invented receipt.
F-171-T03 RECOVERY  ACT: Retry after network failure with entered reference retained; home layout unchanged.  EXPECT: Retry after network failure with entered reference retained; home layout unchanged.
F-171-T04 PERSISTENCE/PARITY  ACT: Source original ID and permitted receipt/certificate refs from exact lookup, approved home screenshot.  EXPECT: Source original ID and permitted receipt/certificate refs from exact lookup, approved home screenshot.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-172
**Scope:** CITIZEN — implement frontend

F-172  |  P1  |  APPROVED
APPROVED REQUIREMENT  Every successfully completed payment automatically generates exactly one Sohojkor Payment Certificate, separate from its receipt. For Tax with Return, Other Tax, combined payments, self/others, Pay Again and Travel Tax, generate it from the original saved transaction with a stable certificate reference, payment date, payer/recipient and itemized heads, years or passenger lines, amounts and total. Show View, Print and Download PDF on success and permitted history/reference pages. For a combined payment, issue one combined certificate. Do not expose test labels, internal technical statuses or fake government validation/settlement claims.
System: Taxpayer website · Sohojkor SQL · Office SQL · Office/Admin  •  Story links: US-049, US-051, US-173  •  Current state: UNVERIFIED
F-172-T01 SUCCESS  ACT: Using permitted existing/isolated completed Return, Other, combined, Travel and Pay Again records, inspect one automatic certificate per parent and PDF View/Print/Download.  EXPECT: Document is separate from receipt, matches original itemization, one per parent, valid PDF bytes and no fake official validation.
F-172-T02 NEGATIVE/PERMISSION  ACT: No extra certificate on retry and no internal technical test labels.  EXPECT: No extra certificate on retry and no internal technical test labels.
F-172-T03 RECOVERY  ACT: Reload confirmation/history/reference and retrieve the same original certificate ID.  EXPECT: Reload confirmation/history/reference and retrieve the same original certificate ID.
F-172-T04 PERSISTENCE/PARITY  ACT: Original parent→receipt→certificate refs and PDF content match Taxpayer SQL and Office mirror.  EXPECT: Original parent→receipt→certificate refs and PDF content match Taxpayer SQL and Office mirror.
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-173
**Scope:** DEFERRED PROPOSAL

F-173  |  P3  |  PROPOSED
UNAPPROVED CANDIDATE  Existing public guide-based Help chat: open panel, ask a supported payment/receipt question, receive an answer from maintained guide content and close or recover safely. No external AI service is introduced.
System: Taxpayer website  •  Story links: US-174  •  Current state: UNVERIFIED / NOT AUTHORIZED FOR EXECUTION
F-173-T01 SUCCESS  ACT: As guest open Help panel, ask existing supported payment/receipt/Travel Tax question, inspect guide-based bilingual answer and close.  EXPECT: Existing public guide-based Help chat: open panel, ask a supported payment/receipt question, receive an answer from maintained guide content and close or recover safely. No external AI service is introduced.
F-173-T02 NEGATIVE/PERMISSION  ACT: Unsupported question must point to existing guide without fabricating official answer or requiring sign-in.  EXPECT: Unsupported question must point to existing guide without fabricating official answer or requiring sign-in
F-173-T03 RECOVERY  ACT: Close panel and reopen after navigation; focus returns to trigger and context retained.  EXPECT: Close panel and reopen after navigation; focus returns to trigger and context retained
F-173-T04 PERSISTENCE/PARITY  ACT: Read-only guide content version and public route; no taxpayer/payment write.  EXPECT: Read-only guide content version and public route; no taxpayer/payment write
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-174
**Scope:** DEFERRED PROPOSAL

F-174  |  P3  |  PROPOSED
UNAPPROVED CANDIDATE  Existing public payment-head catalogue: browse and filter reference heads, distinguish mapped from unapproved records and link to only eligible payment choices.
System: Taxpayer website  •  Story links: US-175  •  Current state: UNVERIFIED / NOT AUTHORIZED FOR EXECUTION
F-174-T01 SUCCESS  ACT: From public services open payment-head catalogue, search by name/code, inspect description and eligibility and return to existing payment route.  EXPECT: Existing public payment-head catalogue: browse and filter reference heads, distinguish mapped from unapproved records and link to only eligible payment choices.
F-174-T02 NEGATIVE/PERMISSION  ACT: Unmapped/reference-only head must not become executable payment choice.  EXPECT: Unmapped/reference-only head must not become executable payment choice
F-174-T03 RECOVERY  ACT: Clear no-match search and retry, restoring catalogue filters and existing public route.  EXPECT: Clear no-match search and retry, restoring catalogue filters and existing public route
F-174-T04 PERSISTENCE/PARITY  ACT: Published head mapping/eligibility checked against current app catalog; no financial record created.  EXPECT: Published head mapping/eligibility checked against current app catalog; no financial record created
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-175
**Scope:** DEFERRED PROPOSAL

F-175  |  P2  |  PROPOSED
UNAPPROVED CANDIDATE  Existing signed-in account profile settings: edit supported display name and preferences, save per account and restore on refresh without altering taxpayer TIN-registration data.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-176, US-178  •  Current state: UNVERIFIED / NOT AUTHORIZED FOR EXECUTION
F-175-T01 SUCCESS  ACT: In account settings edit supported display name/language, Save, refresh and sign in again to verify owner-only preference.  EXPECT: Existing signed-in account profile settings: edit supported display name and preferences, save per account and restore on refresh without altering taxpayer TIN-registration data.
F-175-T02 NEGATIVE/PERMISSION  ACT: Do not modify immutable registered TIN name/registration certificate or another user's settings.  EXPECT: Do not modify immutable registered TIN name/registration certificate or another user's settings
F-175-T03 RECOVERY  ACT: Recover failed save with edits retained and explicit retry; preserve prior stored version until success.  EXPECT: Recover failed save with edits retained and explicit retry; preserve prior stored version until success
F-175-T04 PERSISTENCE/PARITY  ACT: Account preference owner ID/revision and values persisted independently of TIN registration record.  EXPECT: Account preference owner ID/revision and values persisted independently of TIN registration record
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.

### F-176
**Scope:** DEFERRED PROPOSAL

F-176  |  P2  |  PROPOSED
UNAPPROVED CANDIDATE  Existing account notification preference control: enable/disable in-app account alerts without deleting historic notices or introducing email/SMS.
System: Taxpayer website · Sohojkor SQL  •  Story links: US-177  •  Current state: UNVERIFIED / NOT AUTHORIZED FOR EXECUTION
F-176-T01 SUCCESS  ACT: Toggle existing in-app notification preference, Save and reload while preserving old notices and read state.  EXPECT: Existing account notification preference control: enable/disable in-app account alerts without deleting historic notices or introducing email/SMS.
F-176-T02 NEGATIVE/PERMISSION  ACT: Preference off cannot delete historic notices or invent email/SMS delivery.  EXPECT: Preference off cannot delete historic notices or invent email/SMS delivery
F-176-T03 RECOVERY  ACT: Recover interrupted save and display actual server-confirmed choice.  EXPECT: Recover interrupted save and display actual server-confirmed choice
F-176-T04 PERSISTENCE/PARITY  ACT: Only account-owned preference flag changes, past event/notice records remain intact.  EXPECT: Only account-owned preference flag changes, past event/notice records remain intact
Feature closure  Full explicit requirement + all applicable linked APPROVED stories + role, error/recovery, data and frozen UI evidence. An anchor alone is insufficient.


### F-177
**Scope:** OFFICE-ONLY — no implementation; preserve existing boundary

F-177  |  P1  |  APPROVED
APPROVED REQUIREMENT  Detailed Taxpayer Ledger in Office Management: maintain a consolidated, transaction-level view of tax payments and verified tax deductions regardless of payment method/source. Include BRTA, e-TDS, iBAS++, NSD, Sub-Registrar Office, Bank and SA Coder source categories, and persist the corresponding Dhara, Source and Payment Amount with source reference/provenance, taxpayer identity and necessary reconciliation fields. Preserve separate Taxpayer and Office SQL/auth architectures; do not fabricate unavailable external integrations.
System: Office/Admin + separate Office SQL; original Taxpayer SQL/guarded bridge for Sohojkor events; verified external-source adapters/imports only where authorized  •  Story links: US-180; related existing US-022, US-024, US-025, US-169  •  Current state: UNVERIFIED
F-177-T01 SUCCESS  ACT: With authorized isolated representative records for Sohojkor and seven stated source categories, retrieve the correct TIN consolidated ledger, show each original attributable line with Dhara, Source and Amount (৳), open its evidence/reference and reconcile report totals.  EXPECT: Correct sourced, verified records without falsely claiming unavailable live connectors.
F-177-T02 NEGATIVE/PERMISSION  ACT: Replay overlapping source references, attempt another taxpayer TIN, submit unsupported/missing Dhara mapping and compare deduction with confirmed deposit.  EXPECT: No duplicated lines/totals, unauthorized disclosure, fabricated section, settlement or tax-credit entitlement; invalid/missing data is visibly flagged for reconciliation.
F-177-T03 RECOVERY  ACT: Interrupt/restore a verified import/bridge and reload the same taxpayer after late source delivery.  EXPECT: Idempotent resume, exact source IDs, no duplicate entries, accurate pending/unverified indicators and preserved existing Office views.
F-177-T04 PERSISTENCE/PARITY  ACT: Compare authoritative original source line(s), original Sohojkor SQL where applicable, separate Office SQL line IDs, Office Taxpayer 360/detail, filtered totals and export; verify one source line maps once and every line amount/source/Dhara/recipient matches.  EXPECT: Reconciled, permission-scoped evidence for each truly connected/imported source; unverified source coverage remains UNVERIFIED, not PASS.
Feature closure  Complete only after US-180 and affected US-022/024/025/169 assertions, all real source/status/permission/duplicate checks, Office source and report reconciliation, preserved approved UI and verified production release pass.

### F-178
**Scope:** CITIZEN — implement frontend

F-178  |  P1  |  APPROVED
APPROVED REQUIREMENT  Add a dedicated optional multiline Remarks / Comments field to the existing challan payment journey. Accept free-text information in English and Bengali beyond the current 20-character limit; persist it in the original challan/payment record, retain it in review/drafts/Pay Again and read it in permitted taxpayer and Office details without truncation or changes to structured payment rules.
System: Taxpayer payment forms + original Taxpayer SQL/API + guarded separate Office SQL/Admin details  •  Story links: US-181; related existing US-001, US-002, US-006  •  Current state: UNVERIFIED
F-178-T01 SUCCESS  ACT: In guest and signed-in Tax with Return and Other Tax challan flows, enter multiline EN/BN comments longer than 20 characters; review, submit permitted isolated payment and reopen the original challan/document.  EXPECT: Exact complete text visible, optional blank accepted, no 20-character error or silent truncation.
F-178-T02 NEGATIVE/PERMISSION  ACT: Enter punctuation, Unicode, literal markup and long multiline text; attempt to use comments to override tax head, Dhara, payer, amounts or source status.  EXPECT: Safe plain-text rendering, no execution/injection, no indirect changes to structured fields; consistent documented technical size validation if any.
F-178-T03 RECOVERY  ACT: Back/Edit/Review, Save Draft/Resume and interrupted retry; create Pay Again from an original payment with remarks and edit only the new copy.  EXPECT: Remarks recover exactly with owner scope; original paid challan stays immutable and retry does not duplicate payment.
F-178-T04 PERSISTENCE/PARITY  ACT: Compare entered remarks character-for-character across form, API payload, original Taxpayer SQL, guarded Office mirror, Office detail and generated permitted challan output.  EXPECT: Exact Unicode/line-break preservation with no 20-character limit in any layer; no unapproved Travel Tax form or frozen UI regression.
Feature closure  Complete only after US-181, applicable original payment journeys, document readback, error/recovery, source/Office parity and approved UI/EN-BN/mobile evidence PASS.


## Full user-story records — all source wording and cases
### US-001
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-001  |  P1  |  APPROVED
STORY  As a visitor with a TIN, I want to pay Tax with Return without signing in, receive confirmation and a receipt, and see that payment in my own history after I sign in.
EXPECTED  After a completed guest Tax with Return payment, show one confirmation, receipt and Payment Certificate. The verified account later opens the exact original transaction and both documents.
Module: Taxpayer TIN lookup  •  Linked features: F-011, F-021, F-026, F-030, F-031
ORIGINAL JOURNEY  Open public Sohojkor homepage → Pay Tax → Tax with Return → enter and confirm own TIN → select the one assessment year → review amount → make payment → view confirmation and receipt and certificate → later sign in → open Payment History.
ENTRY  Public homepage → Pay Tax → Tax with Return (guest); later verified sign-in → Payment History
US-001-T01  SUCCESS  ACT: From public home complete one guest Tax with Return for confirmed TIN and AY, view original receipt and certificate, then sign into the verified matching account and find that same payment in history  EXPECT: After a completed guest Tax with Return payment, show one confirmation, receipt and Payment Certificate. The verified account later opens the exact original transaction and both documents.
US-001-T02  NEGATIVE / PERMISSION  ACT: Try adding a second beneficiary, a second AY or another head to Tax with Return; reject before financial submission  EXPECT: Try adding a second beneficiary, a second AY or another head to Tax with Return; reject before financial submission
US-001-T03  RECOVERY / RETRY  ACT: Interrupt after guest confirmation; reopen by saved reference and later verified sign-in without duplicating the payment  EXPECT: Interrupt after guest confirmation; reopen by saved reference and later verified sign-in without duplicating the payment
US-001-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original parent ID, receipt/certificate IDs and verified account linkage match Taxpayer SQL and permitted Office mirror  EXPECT: Original parent ID, receipt/certificate IDs and verified account linkage match Taxpayer SQL and permitted Office mirror
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-002
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-002  |  P1  |  APPROVED
STORY  As a guest, I want to pay several eligible Other Tax heads for different assessment years in one transaction, receive one complete receipt, and later see all its payment lines in my history.
EXPECTED  All eligible heads, years and beneficiaries are saved under one parent payment and shown on one combined receipt and Payment Certificate. Linked payer history reproduces every line.
Module: Other Tax, Advance Tax & Source Tax  •  Linked features: F-032, F-034, F-035, F-037, F-038, F-045, F-049
ORIGINAL JOURNEY  Homepage → Pay Tax → Other Tax → Walk-in Payment → enter payer/recipient details → add eligible head-and-year lines → review each amount and total → pay → confirmation/combined receipt and certificate → sign in later → Payment History.
ENTRY  Pay Tax → Other Tax / walk-in
US-002-T01  SUCCESS  ACT: Complete guest Other Tax with at least two eligible heads and different AYs, review line totals, submit once and retrieve one combined receipt/certificate and full history  EXPECT: All eligible heads, years and beneficiaries are saved under one parent payment and shown on one combined receipt and Payment Certificate. Linked payer history reproduces every line.
US-002-T02  NEGATIVE / PERMISSION  ACT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines  EXPECT: Try duplicate beneficiary/head/AY line and Return head inside mixed batch; reject without losing valid lines
US-002-T03  RECOVERY / RETRY  ACT: Retry the same submitted request after network loss; maintain one parent and all valid lines  EXPECT: Retry the same submitted request after network loss; maintain one parent and all valid lines
US-002-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match  EXPECT: Original parent ID, each recipient/head/AY allocation, total, document references and Office mirror match
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-003
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-003  |  P1  |  APPROVED
STORY  As a payer, I want to pay another taxpayer’s tax, see the payment in my own history when my optional payer TIN is verified, and have the recipient see their allocated payment and its notifications.
EXPECTED  Payer A gets the receipt and Payment Certificate and later sees the verified payment history; recipient B sees only their eligible allocation and receives its in-app notification.
Module: In-app notifications and activity  •  Linked features: F-011, F-022, F-167, F-081, F-082
ORIGINAL JOURNEY  Pay for another taxpayer → enter and check B’s TIN → choose allowed payment type/lines → optionally enter and verify A’s separate payer TIN → pay → confirmation and receipt and certificate → A signs in to view payer history → B signs in to view received payment and notice.
ENTRY  Guest/signed-in Pay Tax → Pay for another taxpayer → payer confirmation; later payer/recipient accounts → their respective histories/notifications
US-003-T01  SUCCESS  ACT: Pay for recipient B using B's verified TIN, optionally supply payer A TIN, then separately inspect A's payer history and B's own received share and notification  EXPECT: Payer A gets the receipt and Payment Certificate and later sees the verified payment history; recipient B sees only their eligible allocation and receives its in-app notification.
US-003-T02  NEGATIVE / PERMISSION  ACT: Sign in as unrelated C and try to open B's recipient allocation or A's private saved list; deny access  EXPECT: Sign in as unrelated C and try to open B's recipient allocation or A's private saved list; deny access
US-003-T03  RECOVERY / RETRY  ACT: Reconnect B after notification delay; deliver once and retain read status  EXPECT: Reconnect B after notification delay; deliver once and retain read status
US-003-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Payer/recipient identities, B share, original payment/document ID and notice ID match stored roles and Office allocation  EXPECT: Payer/recipient identities, B share, original payment/document ID and notice ID match stored roles and Office allocation
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-004
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-004  |  P1  |  APPROVED
STORY  As a taxpayer with a TIN who has never signed in to Sohojkor, I want the existing demonstration first-login flow to accept demo OTP 111111, sign me in automatically, welcome me, and show older payment notifications one by one.
EXPECTED  A person may already have a TIN and receive payments without any Sohojkor account visit. On their first demo sign-in, the existing login flow presents the demo OTP step; entering 111111 completes demo sign-in and opens the account. Show the successful-login message first, then present each previously unseen received-payment notice sequentially, saving all notices in the in-app list. eReturn credentials/API linking are later scope and are not built now.
Module: Sign-in and taxpayer profile  •  Linked features: F-012, F-013, F-083
ORIGINAL JOURNEY  Person has valid TIN but no previous Sohojkor login → other people may pay for that TIN → first demo sign-in → enter demo OTP 111111 → automatically open matching account → show sign-in success → show first unseen payment popup → acknowledge/next → repeat for remaining unseen notices → view full Notifications list.
ENTRY  First demo login → OTP 111111 → welcome → unseen notices
US-004-T01  SUCCESS  ACT: For non-production first login only, submit the documented demonstration OTP, show welcome before queued unseen notices, acknowledge each in sequence and inspect Notifications list  EXPECT: A person may already have a TIN and receive payments without any Sohojkor account visit. On their first demo sign-in, the existing login flow presents the demo OTP step; entering 111111 completes demo sign-in and opens the account. Show the successful-login message first, then present each previously unseen received-payment notice sequentially, saving all notices in the in-app list. eReturn credentials/API linking are later scope and are not built now.
US-004-T02  NEGATIVE / PERMISSION  ACT: Reject incorrect OTP; never let demonstration OTP authenticate a production account or reveal another account's notices  EXPECT: Reject incorrect OTP; never let demonstration OTP authenticate a production account or reveal another account's notices
US-004-T03  RECOVERY / RETRY  ACT: Interrupt between acknowledgement and next queued popup; reopen demonstration account and resume only unread items  EXPECT: Interrupt between acknowledgement and next queued popup; reopen demonstration account and resume only unread items
US-004-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Verified demo account binding and per-event notice IDs/read timestamps persist without duplicate popup  EXPECT: Verified demo account binding and per-event notice IDs/read timestamps persist without duplicate popup
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-005
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-005  |  P1  |  APPROVED
APPROVED PARALLEL SCOPE (22 NOV 2026)  This requirement includes Return on one taxpayer row with Advance Tax on a different taxpayer row in the same checkout. Keep the Return row to one taxpayer and one AY, with no other head on that row. Any historical US-005 story/test wording that rejects the distinct-row pairing is superseded; its original wording is retained as history. The scoped preview passed at Main SHA 975ccd6c; full payment, SQL and Office acceptance remain UNVERIFIED, and the scenario was not rerun after PR #951.
STORY  As a guest or signed-in payer, I want Tax with Return to be limited to one taxpayer, one assessment year and its own exclusive payment so it cannot be mixed with other tax heads.
EXPECTED  The Return option remains separate. Do not accept multiple beneficiaries, multiple assessment years or another head in the same Tax with Return payment, regardless of logged-in or guest status.
Module: Tax with Return  •  Linked features: F-026, F-027, F-028, F-029, F-030, F-031, F-137
ORIGINAL JOURNEY  Pay Tax → Tax with Return → select exactly one taxpayer and one assessment year → review → pay; if extra taxpayer, year or head is added, show the existing relevant validation.
ENTRY  Pay Tax → Tax with Return
US-005-T01  SUCCESS  ACT: Open Return payment as guest and signed-in payer, select exactly one beneficiary and one AY, review and submit valid exclusive transaction  EXPECT: The Return option remains separate. Do not accept multiple beneficiaries, multiple assessment years or another head in the same Tax with Return payment, regardless of logged-in or guest status.
US-005-T02  NEGATIVE / PERMISSION  ACT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation  EXPECT: Attempt to add another person, another AY or any non-Return head, and reject at frontend and SQL validation
US-005-T03  RECOVERY / RETRY  ACT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction  EXPECT: Go back from invalid combination, remove prohibited selections and resubmit only one valid exclusive transaction
US-005-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office  EXPECT: Return parent keeps exactly one eligible beneficiary/AY and no combined non-Return allocation in source or Office
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-006
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-006  |  P1  |  APPROVED
STORY  As a payer, I want to combine eligible Other Tax heads, several recipients and different assessment years in one payment.
EXPECTED  One beneficiary can have many permitted heads and years, and a payment can contain several beneficiaries. Each head/year/recipient line remains separately identifiable while all allowed lines share one parent payment and combined receipt.
Module: Other Tax, Advance Tax & Source Tax  •  Linked features: F-032, F-033, F-034, F-035, F-038, F-045
ORIGINAL JOURNEY  Other Tax → select one or more recipients → add permitted heads and assessment years for each → adjust amounts → review per-person totals and grand total → pay.
ENTRY  Pay Tax → Other Tax / walk-in
US-006-T01  SUCCESS  ACT: Use existing Other Tax composer with multiple beneficiaries, multiple eligible heads per beneficiary and several AYs, verify grand sum and submit one combined parent  EXPECT: One beneficiary can have many permitted heads and years, and a payment can contain several beneficiaries. Each head/year/recipient line remains separately identifiable while all allowed lines share one parent payment and combined receipt.
US-006-T02  NEGATIVE / PERMISSION  ACT: Reject invalid or repeated recipient/head/AY rows; do not forbid otherwise eligible combinations  EXPECT: Reject invalid or repeated recipient/head/AY rows; do not forbid otherwise eligible combinations
US-006-T03  RECOVERY / RETRY  ACT: Edit an allocation after Back, then retry network-interrupted submit with same idempotency key  EXPECT: Edit an allocation after Back, then retry network-interrupted submit with same idempotency key
US-006-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Line sum equals saved parent total; each head/year/beneficiary and one receipt/certificate match source and Office  EXPECT: Line sum equals saved parent total; each head/year/beneficiary and one receipt/certificate match source and Office
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-007
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-007  |  P1  |  APPROVED
STORY  As a signed-in payer, I want to select Pay Again on an individual successful payment and reuse its full beneficiary/head/year combination in an editable form.
EXPECTED  Pay Again starts from the full editable original payment. A new completed transaction has a new receipt and Payment Certificate and does not change the original payment.
Module: Payment history, beneficiary profile and Pay Again  •  Linked features: F-071, F-072, F-073, F-138
ORIGINAL JOURNEY  Sign in → Payment History → choose a completed row → Pay Again → inspect prefilled entire transaction → edit recipients/heads/years/amounts → review → pay.
ENTRY  Payment History → beneficiary profile
US-007-T01  SUCCESS  ACT: From one completed payment row select Pay Again, clone entire prior batch into existing editable form, change/add/remove rows, supply required noncurrent AY and create a new transaction  EXPECT: Pay Again starts from the full editable original payment. A new completed transaction has a new receipt and Payment Certificate and does not change the original payment.
US-007-T02  NEGATIVE / PERMISSION  ACT: Require explicit noncurrent AY and reject stale owner/original reference; never overwrite past paid record  EXPECT: Require explicit noncurrent AY and reject stale owner/original reference; never overwrite past paid record
US-007-T03  RECOVERY / RETRY  ACT: Close and reopen editable repeat before submitting; preserve changed values and immutable original  EXPECT: Close and reopen editable repeat before submitting; preserve changed values and immutable original
US-007-T04  PERSISTENCE / CROSS-SYSTEM  ACT: New parent, new documents, cloned line provenance and Office readback; original parent and receipt unchanged  EXPECT: New parent, new documents, cloned line provenance and Office readback; original parent and receipt unchanged
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-008
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-008  |  P1  |  APPROVED
STORY  As a taxpayer, I want to request correction of an eligible payment and receive an Admin approve/reject result in Sohojkor.
EXPECTED  Login is required for correction requests, even for a walk-in original payment. The existing payment stays intact; the linked correction request is recorded, Office sees it, decides and saves the result, and the taxpayer sees the updated status/notification.
Module: Corrections and unwanted payments  •  Linked features: F-090, F-093, F-169
ORIGINAL JOURNEY  Find owned eligible payment → sign in if needed → Request Correction → enter corrected information/reason → submit → Office review → approve or reject → see decision, date and status in account.
ENTRY  Payment details → correction / report
US-008-T01  SUCCESS  ACT: From eligible owned payment sign in, submit correction with evidence, allow authorized Office decision and refresh taxpayer case/status  EXPECT: Login is required for correction requests, even for a walk-in original payment. The existing payment stays intact; the linked correction request is recorded, Office sees it, decides and saves the result, and the taxpayer sees the updated status/notification.
US-008-T02  NEGATIVE / PERMISSION  ACT: While signed out or as unrelated user attempt correction; refuse while preserving original financial record  EXPECT: While signed out or as unrelated user attempt correction; refuse while preserving original financial record
US-008-T03  RECOVERY / RETRY  ACT: After submit disconnect, reload saved case ID and obtain latest permitted Office decision  EXPECT: After submit disconnect, reload saved case ID and obtain latest permitted Office decision
US-008-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Immutable original payment plus case ID, actor, evidence, decision/status, timestamp across both DBs  EXPECT: Immutable original payment plus case ID, actor, evidence, decision/status, timestamp across both DBs
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-009
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-009  |  P1  |  APPROVED
STORY  As a payer, I want each successfully completed ordinary recorded payment to show confirmation and a receipt.
EXPECTED  Every completed payment shows confirmation, original reference, receipt and Payment Certificate with View, Print and Download actions; replays must not duplicate the transaction.
Module: Receipts, certificates and ledger  •  Linked features: F-047, F-048, F-054
ORIGINAL JOURNEY  Choose eligible payment → review → complete the existing payment journey → receive success confirmation → view or download receipt.
ENTRY  Payment record → receipt / certificates
US-009-T01  SUCCESS  ACT: Complete authorized ordinary payment and inspect confirmation, original receipt, certificate View, Print and true PDF Download  EXPECT: Every completed payment shows confirmation, original reference, receipt and Payment Certificate with View, Print and Download actions; replays must not duplicate the transaction.
US-009-T02  NEGATIVE / PERMISSION  ACT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created  EXPECT: Attempt duplicate confirmation/replay; ensure no second payment, receipt or certificate is created
US-009-T03  RECOVERY / RETRY  ACT: Reload confirmation or search original reference after interruption and retrieve same documents  EXPECT: Reload confirmation or search original reference after interruption and retrieve same documents
US-009-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office  EXPECT: Payment/receipt/certificate references, PDF file signature and stored amount/detail match original record and Office
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-010
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-010  |  P1  |  APPROVED
STORY  As a signed-in payer, I want to create lists, add beneficiaries and apply the required predefined tag or relationship.
EXPECTED  Create or rename lists; add a person through the existing single-entry form, search/check TIN, select Clients, Friends & Family or Other and supply a mandatory allowed final tag. Saved entries belong only to this account and persist across browsers.
Module: Beneficiaries and lists  •  Linked features: F-055, F-057, F-058, F-059, F-060, F-063
ORIGINAL JOURNEY  Sign in → Beneficiaries → Create List → name list → Add Beneficiary → enter/check TIN → select system tag/relationship → save → see person in list.
ENTRY  Beneficiaries → list → person
US-010-T01  SUCCESS  ACT: Create named owned beneficiary list, use Add Beneficiary, confirm TIN, choose mandatory category/tag, save and find record after new browser sign-in  EXPECT: Create or rename lists; add a person through the existing single-entry form, search/check TIN, select Clients, Friends & Family or Other and supply a mandatory allowed final tag. Saved entries belong only to this account and persist across browsers.
US-010-T02  NEGATIVE / PERMISSION  ACT: Omit mandatory tag or enter Others free text over 80 chars; show error and no new contact  EXPECT: Omit mandatory tag or enter Others free text over 80 chars; show error and no new contact
US-010-T03  RECOVERY / RETRY  ACT: Interrupt before save, resume valid fields; after save reload another session without changing owner  EXPECT: Interrupt before save, resume valid fields; after save reload another session without changing owner
US-010-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Owner ID, list membership, mandatory final tag and saved TIN persist; other account cannot read/edit  EXPECT: Owner ID, list membership, mandatory final tag and saved TIN persist; other account cannot read/edit
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-011
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-011  |  P1  |  APPROVED
STORY  As a payer, I want to open a saved beneficiary profile and see only the payments I made for that exact recipient, arranged by date.
EXPECTED  Each beneficiary profile displays THIS payer’s own dated payments for that TIN, their beneficiary-specific allocations, receipts and permitted certificates; no other payer’s private beneficiary list leaks.
Module: Payment history, beneficiary profile and Pay Again  •  Linked features: F-067, F-068, F-069, F-070
ORIGINAL JOURNEY  Sign in → Beneficiaries / Payment History → open beneficiary → profile → dated timeline → select payment → see line details → open combined receipt.
ENTRY  Signed-in payer → Beneficiaries / Payment History → beneficiary profile → that payer’s dated recipient allocations
US-011-T01  SUCCESS  ACT: Open saved beneficiary profile from history and inspect dated payments made by this payer for exact recipient, filtered lines and linked original receipts  EXPECT: Each beneficiary profile displays THIS payer’s own dated payments for that TIN, their beneficiary-specific allocations, receipts and permitted certificates; no other payer’s private beneficiary list leaks.
US-011-T02  NEGATIVE / PERMISSION  ACT: Sign in as another payer for same TIN; never expose first payer's private beneficiary history  EXPECT: Sign in as another payer for same TIN; never expose first payer's private beneficiary history
US-011-T03  RECOVERY / RETRY  ACT: Refresh beneficiary timeline after changing filters, reopen selected payment and return to same context  EXPECT: Refresh beneficiary timeline after changing filters, reopen selected payment and return to same context
US-011-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Payer-owner plus recipient TIN allocation query matches dates/amounts/heads/AY and only eligible historical receipts  EXPECT: Payer-owner plus recipient TIN allocation query matches dates/amounts/heads/AY and only eligible historical receipts
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-012
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-012  |  P1  |  APPROVED
STORY  As a taxpayer, I want a list of payments other people have made for my TIN.
EXPECTED  After verified sign-in, the taxpayer sees received-payment entries, including date, payer information where permitted, head, year, amount, reference and receipt access for their own share.
Module: In-app notifications and activity  •  Linked features: F-066, F-082
ORIGINAL JOURNEY  Sign in → Received Payments / Payments & Activity → filter by date or head → open permitted payment detail.
ENTRY  Verified recipient account → Payments & Activity → Received payments
US-012-T01  SUCCESS  ACT: Sign into recipient account and open Received Payments, filter by date/head and inspect each permitted incoming allocation and receipt share  EXPECT: After verified sign-in, the taxpayer sees received-payment entries, including date, payer information where permitted, head, year, amount, reference and receipt access for their own share.
US-012-T02  NEGATIVE / PERMISSION  ACT: Attempt to expose other recipients' allocations or private payer lists from shared parent; deny  EXPECT: Attempt to expose other recipients' allocations or private payer lists from shared parent; deny
US-012-T03  RECOVERY / RETRY  ACT: Sign out and back in or reload after notice delay; same received entries remain, no duplicate  EXPECT: Sign out and back in or reload after notice delay; same received entries remain, no duplicate
US-012-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Recipient account/TIN binding, allocation IDs and per-recipient totals, not full unrelated parent amounts  EXPECT: Recipient account/TIN binding, allocation IDs and per-recipient totals, not full unrelated parent amounts
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-013
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-013  |  P1  |  APPROVED
STORY  As a payer for someone else, I want to choose a saved beneficiary from my existing lists when starting a tax payment.
EXPECTED  The payment journey shows the saved people/lists and a single-select option for Tax with Return. Other Tax may allow multi-select. Search, choose and confirm the target before opening the relevant payment form.
Module: Beneficiaries and lists  •  Linked features: F-055
ORIGINAL JOURNEY  Pay Tax → Facilitate another taxpayer → view existing beneficiaries → search/select one person for Return or one/more for eligible Other Tax → continue.
ENTRY  Beneficiaries → list → person
US-013-T01  SUCCESS  ACT: Start Pay Tax for another person, choose saved entry from own list; Return allows one choice and non-Return permits multiple, then reach current payment form  EXPECT: The payment journey shows the saved people/lists and a single-select option for Tax with Return. Other Tax may allow multi-select. Search, choose and confirm the target before opening the relevant payment form.
US-013-T02  NEGATIVE / PERMISSION  ACT: Attempt cross-account beneficiary selection and multiple Return recipients; reject safely  EXPECT: Attempt cross-account beneficiary selection and multiple Return recipients; reject safely
US-013-T03  RECOVERY / RETRY  ACT: Return to beneficiary selection from form, preserving eligible selected recipients and role  EXPECT: Return to beneficiary selection from form, preserving eligible selected recipients and role
US-013-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Chosen owned beneficiary IDs match confirmed TIN and subsequent payment targets, with no private list leak  EXPECT: Chosen owned beneficiary IDs match confirmed TIN and subsequent payment targets, with no private list leak
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-014
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-014  |  P1  |  APPROVED
STORY  As an Other Tax payer, I want to use existing beneficiaries and add a new taxpayer by TIN lookup in the same payment.
EXPECTED  Select one or more saved beneficiaries, search a new TIN not in the saved list, confirm the matching taxpayer, and allocate allowed heads/years to each person.
Module: Other Tax, Advance Tax & Source Tax  •  Linked features: F-039
ORIGINAL JOURNEY  Other Tax → existing beneficiary list → select saved persons → Add another TIN → search/confirm → assign heads, years and amounts → review → pay.
ENTRY  Pay Tax → Other Tax / walk-in
US-014-T01  SUCCESS  ACT: Begin Other Tax, select saved beneficiary, add confirmed new TIN through lookup, allocate different heads/AYs to each and complete one batch  EXPECT: Select one or more saved beneficiaries, search a new TIN not in the saved list, confirm the matching taxpayer, and allocate allowed heads/years to each person.
US-014-T02  NEGATIVE / PERMISSION  ACT: Reject duplicated recipient/line and mismatched new TIN; do not auto-save one-time contact  EXPECT: Reject duplicated recipient/line and mismatched new TIN; do not auto-save one-time contact
US-014-T03  RECOVERY / RETRY  ACT: Cancel/new TIN lookup and retry without losing existing saved-recipient lines  EXPECT: Cancel/new TIN lookup and retry without losing existing saved-recipient lines
US-014-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Saved list remains unchanged unless explicitly saved; both recipient allocations exist under one parent in source/Office  EXPECT: Saved list remains unchanged unless explicitly saved; both recipient allocations exist under one parent in source/Office
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-015
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-015  |  P1  |  APPROVED
STORY  As a payer, I want a TIN search box that shows saved beneficiary matches first, then lets me search and confirm a taxpayer not in my list.
EXPECTED  When entering a TIN, show a matching saved beneficiary and name if present. If absent, offer existing TIN lookup, show a successful matched taxpayer for confirmation, and allow continuing. Demonstration suggestions are reference data, not automatic identity verification.
Module: Taxpayer TIN lookup  •  Linked features: F-019, F-020, F-021, F-136
ORIGINAL JOURNEY  Payment form → TIN search → saved match appears or Search TIN fallback → confirm name/TIN → continue to head/year selection.
ENTRY  Pay Tax → taxpayer TIN lookup
US-015-T01  SUCCESS  ACT: Type known saved TIN in payment lookup and observe saved match first; type absent valid TIN, use explicit fallback, confirm name/TIN and continue  EXPECT: When entering a TIN, show a matching saved beneficiary and name if present. If absent, offer existing TIN lookup, show a successful matched taxpayer for confirmation, and allow continuing. Demonstration suggestions are reference data, not automatic identity verification.
US-015-T02  NEGATIVE / PERMISSION  ACT: Reject malformed or unmatched TIN without implying a sample suggestion is verified identity  EXPECT: Reject malformed or unmatched TIN without implying a sample suggestion is verified identity
US-015-T03  RECOVERY / RETRY  ACT: Recover failed fallback lookup and confirm correct same TIN before continuing  EXPECT: Recover failed fallback lookup and confirm correct same TIN before continuing
US-015-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Lookup and selected TIN correspond; no account authorization or private history granted by entry alone  EXPECT: Lookup and selected TIN correspond; no account authorization or private history granted by entry alone
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-016
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-016  |  P1  |  APPROVED
STORY  As a payer, I want to pay tax for another person either by saving them to my beneficiary list or by making a one-time payment.
EXPECTED  Choose saved-beneficiary flow or one-time lookup. Both complete the same payment/receipt journey; saving a contact is not mandatory.
Module: Taxpayer TIN lookup  •  Linked features: F-022, F-023
ORIGINAL JOURNEY  Pay for others → choose existing saved person OR enter/check new TIN for one-time payment → choose eligible tax type → pay.
ENTRY  Pay Tax → taxpayer TIN lookup
US-016-T01  SUCCESS  ACT: Pay another taxpayer once through fresh TIN lookup without saving, then separately exercise the saved-beneficiary selection flow and verify both reach same payment review  EXPECT: Choose saved-beneficiary flow or one-time lookup. Both complete the same payment/receipt journey; saving a contact is not mandatory.
US-016-T02  NEGATIVE / PERMISSION  ACT: Do not require saving a new contact to complete a permitted one-time payment; reject invalid lookup  EXPECT: Do not require saving a new contact to complete a permitted one-time payment; reject invalid lookup
US-016-T03  RECOVERY / RETRY  ACT: Back from payment form to recipient choice and re-enter one-time TIN without losing completed original payment  EXPECT: Back from payment form to recipient choice and re-enter one-time TIN without losing completed original payment
US-016-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Financial transaction has correct recipient regardless of private address-book membership; no unintended contact creation  EXPECT: Financial transaction has correct recipient regardless of private address-book membership; no unintended contact creation
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-017
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-017  |  P1  |  APPROVED
STORY  As a payer, I want to save the recipient of a past one-time payment into my beneficiary list after completing the payment.
EXPECTED  From a permitted payment detail or received list, choose Save Beneficiary, select the mandatory tag and list, and save. Existing payment history remains untouched.
Module: Beneficiaries and lists  •  Linked features: F-024
ORIGINAL JOURNEY  Payment History → open one-time payment → Save Beneficiary → choose list/tag/relationship → save → view beneficiary profile.
ENTRY  Beneficiaries → list → person
US-017-T01  SUCCESS  ACT: From an existing authorized one-time payment row choose Save Beneficiary, assign list and mandatory final tag, save and open new profile  EXPECT: From a permitted payment detail or received list, choose Save Beneficiary, select the mandatory tag and list, and save. Existing payment history remains untouched.
US-017-T02  NEGATIVE / PERMISSION  ACT: Reject save without tag or attempted save to someone else's list  EXPECT: Reject save without tag or attempted save to someone else's list
US-017-T03  RECOVERY / RETRY  ACT: After save, refresh or change browser; saved beneficiary remains while historical payment unchanged  EXPECT: After save, refresh or change browser; saved beneficiary remains while historical payment unchanged
US-017-T04  PERSISTENCE / CROSS-SYSTEM  ACT: New owner-specific contact references original recipient TIN; original paid ID/allocations unchanged  EXPECT: New owner-specific contact references original recipient TIN; original paid ID/allocations unchanged
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-018
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-018  |  P1  |  APPROVED
STORY  As a signed-in recipient, I want to report a payment someone else made for my TIN that I did not request.
EXPECTED  The recipient selects their own received-payment line and submits a report/reason. Office receives a linked case for review, and the taxpayer sees the updates. The historical payment remains recorded.
Module: Corrections and unwanted payments  •  Linked features: F-094, F-095
ORIGINAL JOURNEY  Sign in → Received Payments → select one eligible line → Report this payment → add reason → submit → track Office response.
ENTRY  Payment details → correction / report
US-018-T01  SUCCESS  ACT: Sign into verified recipient account, choose unsolicited received-payment line, report with reason and follow Office case review response  EXPECT: The recipient selects their own received-payment line and submits a report/reason. Office receives a linked case for review, and the taxpayer sees the updates. The historical payment remains recorded.
US-018-T02  NEGATIVE / PERMISSION  ACT: Deny reporting a stranger's received allocation; no fictional reversal or direct payment mutation  EXPECT: Deny reporting a stranger's received allocation; no fictional reversal or direct payment mutation
US-018-T03  RECOVERY / RETRY  ACT: After report submission reload saved case and follow Office review status  EXPECT: After report submission reload saved case and follow Office review status
US-018-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Unsolicited case ID linked to exact recipient allocation, original payment immutable and Office state synchronized  EXPECT: Unsolicited case ID linked to exact recipient allocation, original payment immutable and Office state synchronized
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-019
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-019  |  P1  |  APPROVED
STORY  As a signed-in taxpayer, I want the dashboard to show accurate information about my payments, drafts, correction requests and other saved activities.
EXPECTED  Use existing recorded completed payments, saved drafts, correction cases and available confirmed external information. Hide the external-data row when the source is missing or has no verified data.
Module: Taxpayer dashboard  •  Linked features: F-098, F-099, F-100, F-102
ORIGINAL JOURNEY  Sign in → dashboard → view completed payments, saved drafts, corrections and linked activity → open a detail or resume eligible draft.
ENTRY  Signed-in taxpayer → existing dashboard bento cards
US-019-T01  SUCCESS  ACT: Sign in and compare dashboard Completed Payments, Saved Drafts, Correction Requests and recent linked activity to existing owned records  EXPECT: Use existing recorded completed payments, saved drafts, correction cases and available confirmed external information. Hide the external-data row when the source is missing or has no verified data.
US-019-T02  NEGATIVE / PERMISSION  ACT: With unavailable external integration, hide its entire conditional row; do not invent zero payment/liable balance  EXPECT: With unavailable external integration, hide its entire conditional row; do not invent zero payment/liable balance
US-019-T03  RECOVERY / RETRY  ACT: Reload after partial/failed external fetch and recover correct layout and existing account cards  EXPECT: Reload after partial/failed external fetch and recover correct layout and existing account cards
US-019-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Card values and drill-downs agree with account-owned payment/draft/correction queries; source-backed only  EXPECT: Card values and drill-downs agree with account-owned payment/draft/correction queries; source-backed only
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-020
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-020  |  P1  |  APPROVED
STORY  As a taxpayer, I want one dated timeline of every verified relevant action involving my TIN and account, whether I paid for myself, paid for others or received a payment.
EXPECTED  The activity view combines self payments, other-recipient payments made by me, incoming payments by others, correction requests, unwanted-payment reports, notifications and available linked account/external changes.
Module: In-app notifications and activity  •  Linked features: F-086, F-087, F-097
ORIGINAL JOURNEY  Sign in → Payments & Activity → chronological timeline → filter by payment type/year/beneficiary → open individual event.
ENTRY  In-app notifications → activity
US-020-T01  SUCCESS  ACT: Open Payments & Activity, filter chronological self/other/received payments, corrections, reports and verified events, then open an item  EXPECT: The activity view combines self payments, other-recipient payments made by me, incoming payments by others, correction requests, unwanted-payment reports, notifications and available linked account/external changes.
US-020-T02  NEGATIVE / PERMISSION  ACT: Try an event belonging to a different account; exclude it and avoid duplicate event entries  EXPECT: Try an event belonging to a different account; exclude it and avoid duplicate event entries
US-020-T03  RECOVERY / RETRY  ACT: Reload timeline after delayed sync, keeping stable event order and filters  EXPECT: Reload timeline after delayed sync, keeping stable event order and filters
US-020-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Chronological event IDs, actor, timestamps, payment/case links and role scopes match stored authorized events  EXPECT: Chronological event IDs, actor, timestamps, payment/case links and role scopes match stored authorized events
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-021
**Scope:** OFFICE-ONLY — no implementation

US-021  |  P1  |  APPROVED
STORY  As an authorized Office Admin, I want to receive prompt in-app notifications for new recorded Sohojkor transactions.
EXPECTED  When a new eligible payment is synchronized into Office, update the current payment register/dashboard and trigger the Office notification bell promptly; recovering from disconnection must collect missed events without duplicates.
Module: Office/Admin payment views  •  Linked features: F-089, F-108
ORIGINAL JOURNEY  Taxpayer pays → Sohojkor SQL stores payment → Office SQL receives it → Admin transaction/notification view updates → Admin opens payment details.
ENTRY  Office/Admin → taxpayer payment details
US-021-T01  SUCCESS  ACT: Record an authorized disposable payment in source and verify Office bridge delivery, Office register/bell refresh and linked detail  EXPECT: When a new eligible payment is synchronized into Office, update the current payment register/dashboard and trigger the Office notification bell promptly; recovering from disconnection must collect missed events without duplicates.
US-021-T02  NEGATIVE / PERMISSION  ACT: Replay same outbox event twice; do not double-insert Office payment or notification  EXPECT: Replay same outbox event twice; do not double-insert Office payment or notification
US-021-T03  RECOVERY / RETRY  ACT: Disconnect Office delivery then restore and replay queued event exactly once  EXPECT: Disconnect Office delivery then restore and replay queued event exactly once
US-021-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Source outbox, Office inbox/payment ID, receipt/certificate reference and alert ID trace the same original event  EXPECT: Source outbox, Office inbox/payment ID, receipt/certificate reference and alert ID trace the same original event
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-022
**Scope:** OFFICE-ONLY — no implementation

US-022  |  P1  |  APPROVED
STORY  As an authorized Office Admin, I want to see a taxpayer’s complete recorded payment history, dated timeline and payment-linked payer/beneficiary relationships.
EXPECTED  Search a verified taxpayer TIN and open their payment 360 view. Show amounts paid by or for that taxpayer, tax heads/years, combined allocations, payment references, correction/report events and verified historical changes. An Admin may view the list of taxpayers linked to payments, not another account’s private saved-beneficiary address book.
Module: Office/Admin payment views  •  Linked features: F-106, F-107, F-170
ORIGINAL JOURNEY  Office → search taxpayer TIN → taxpayer 360 → fishbone timeline → open payment → inspect payer, recipients and per-head/year amounts → open correction/report if linked.
ENTRY  Office/Admin → taxpayer payment details
US-022-T01  SUCCESS  ACT: Office Admin searches verified TIN, opens taxpayer 360 fishbone and payment-linked payer/recipient records, inspects allocations and linked corrections  EXPECT: Search a verified taxpayer TIN and open their payment 360 view. Show amounts paid by or for that taxpayer, tax heads/years, combined allocations, payment references, correction/report events and verified historical changes. An Admin may view the list of taxpayers linked to payments, not another account’s private saved-beneficiary address book.
US-022-T02  NEGATIVE / PERMISSION  ACT: Attempt to view payer's private saved-beneficiary address book or unverified historical events; exclude  EXPECT: Attempt to view payer's private saved-beneficiary address book or unverified historical events; exclude
US-022-T03  RECOVERY / RETRY  ACT: Refresh taxpayer 360 after a newly synchronized event and retain correct TIN context  EXPECT: Refresh taxpayer 360 after a newly synchronized event and retain correct TIN context
US-022-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Event source/provenance, actor, original parent and line relationships in Office SQL correspond to Taxpayer records  EXPECT: Event source/provenance, actor, original parent and line relationships in Office SQL correspond to Taxpayer records
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-023
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-023  |  P1  |  APPROVED
STORY  As an authorized Admin, I want to initiate or review a correction for a taxpayer TIN and have the taxpayer see the result and any verified external changes after signing in.
EXPECTED  Admin selects the verified taxpayer/payment, starts or acts on an existing correction case, and records the outcome. The taxpayer sees the correction status after login. If a connected external source later reports a confirmed change relevant to the taxpayer, show an appropriate popup and notification-list entry; no external API integration is invented for deferred sources.
Module: Corrections and unwanted payments  •  Linked features: F-093, F-096, F-097, F-110
ORIGINAL JOURNEY  Office → taxpayer TIN/payment → create/review correction → save approved outcome → taxpayer signs in → view case and notice → if any verified integrated change exists, see separate change popup/list item.
ENTRY  Payment details → correction / report
US-023-T01  SUCCESS  ACT: Office reviewer initiates/decides an existing permitted correction case; taxpayer later signs in to see saved decision and only confirmed external notices  EXPECT: Admin selects the verified taxpayer/payment, starts or acts on an existing correction case, and records the outcome. The taxpayer sees the correction status after login. If a connected external source later reports a confirmed change relevant to the taxpayer, show an appropriate popup and notification-list entry; no external API integration is invented for deferred sources.
US-023-T02  NEGATIVE / PERMISSION  ACT: Attempt unauthorized officer transition or fabricated external name/circle change; deny  EXPECT: Attempt unauthorized officer transition or fabricated external name/circle change; deny
US-023-T03  RECOVERY / RETRY  ACT: Retry after Office decision network failure; restore same case revision and notification once  EXPECT: Retry after Office decision network failure; restore same case revision and notification once
US-023-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original payment unchanged; authorized case state/revision, decision timestamps and source-linked external events match both systems  EXPECT: Original payment unchanged; authorized case state/revision, decision timestamps and source-linked external events match both systems
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-024
**Scope:** OFFICE-ONLY — no implementation

US-024  |  P1  |  APPROVED
STORY  As an Office Admin, I want reports covering the recorded payments and their taxpayer, head, year, status and correction details.
EXPECTED  Use existing search, filtering and export to report payments by date, assessment year, payer, recipient, tax head and relevant corrections. Do not double-count combined parent payments.
Module: Office/Admin payment views  •  Linked features: F-109, F-111
ORIGINAL JOURNEY  Office → Payment Reports → select filters → inspect totals and breakdown → export displayed records.
ENTRY  Office/Admin → taxpayer payment details
US-024-T01  SUCCESS  ACT: In Office Payment Reports filter by date, AY, head, payer and recipient; inspect parent/line totals and export filtered result  EXPECT: Use existing search, filtering and export to report payments by date, assessment year, payer, recipient, tax head and relevant corrections. Do not double-count combined parent payments.
US-024-T02  NEGATIVE / PERMISSION  ACT: Apply invalid/mismatched filter or multiple allocations that could double-count parent; totals must remain correct  EXPECT: Apply invalid/mismatched filter or multiple allocations that could double-count parent; totals must remain correct
US-024-T03  RECOVERY / RETRY  ACT: Reload Office report after export interruption and reproduce same filters and report count  EXPECT: Reload Office report after export interruption and reproduce same filters and report count
US-024-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office stored payment IDs and line allocations produce exported totals identical to filtered source/Office rows  EXPECT: Office stored payment IDs and line allocations produce exported totals identical to filtered source/Office rows
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-025
**Scope:** OFFICE-ONLY — no implementation

US-025  |  P1  |  APPROVED
STORY  As an Office Admin, I want the payment dashboard to give a complete, current view of transaction activity and outstanding operational cases.
EXPECTED  The dashboard shows sourced total payments, trends, head/year breakdowns, recent incoming transactions, correction/report activity, and available mirror/queue status, with links into the corresponding detailed records.
Module: Office/Admin payment views  •  Linked features: F-104, F-111
ORIGINAL JOURNEY  Office → Payments Dashboard → see key metrics and charts → open a transaction, taxpayer or correction case from the relevant card.
ENTRY  Office/Admin → taxpayer payment details
US-025-T01  SUCCESS  ACT: Office Admin opens payment dashboard, verifies sourced totals/trends/head-year breakdowns/recent/correction indicators and opens linked details  EXPECT: The dashboard shows sourced total payments, trends, head/year breakdowns, recent incoming transactions, correction/report activity, and available mirror/queue status, with links into the corresponding detailed records.
US-025-T02  NEGATIVE / PERMISSION  ACT: With no data or sync exception, do not show fabricated transactions or misleading zero/external totals  EXPECT: With no data or sync exception, do not show fabricated transactions or misleading zero/external totals
US-025-T03  RECOVERY / RETRY  ACT: Reconnect after bridge delay and refresh counts and linked transaction navigation  EXPECT: Reconnect after bridge delay and refresh counts and linked transaction navigation
US-025-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Displayed amounts/queues/links reconcile to Office SQL and source identifiers with no parent overcount  EXPECT: Displayed amounts/queues/links reconcile to Office SQL and source identifiers with no parent overcount
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-026
**Scope:** OFFICE-ONLY — no implementation

US-026  |  P2  |  APPROVED
STORY  As a content Admin, I want to manage Sohojkor logo files in the existing Office CMS.
EXPECTED  Keep existing crop, preview, publication and public-display behavior. Do not change the approved logo design unless supplied by its owner.
Module: Homepage & payment record search  •  Linked features: F-003
ENTRY  Office CMS → public homepage banner
US-026-T01  SUCCESS  ACT: Office content Admin selects approved Sohojkor logo asset using existing CMS upload/edit path, previews and publishes only approved version  EXPECT: Keep existing crop, preview, publication and public-display behavior. Do not change the approved logo design unless supplied by its owner.
US-026-T02  NEGATIVE / PERMISSION  ACT: Reject unauthorized logo publication and unacceptable asset; never redesign owner-supplied logo  EXPECT: Reject unauthorized logo publication and unacceptable asset; never redesign owner-supplied logo
US-026-T03  RECOVERY / RETRY  ACT: Return to saved draft after upload failure, preserving last published logo  EXPECT: Return to saved draft after upload failure, preserving last published logo
US-026-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office logo asset/version and public asset URL/content match; no payment data changed  EXPECT: Office logo asset/version and public asset URL/content match; no payment data changed
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-027
**Scope:** OFFICE-ONLY — no implementation

US-027  |  P2  |  APPROVED
STORY  As a content Admin, I want to crop and adjust the logo before publishing.
EXPECTED  Crop and export preserve approved original artwork and show correctly across breakpoints.
Module: Homepage & payment record search  •  Linked features: F-003
ENTRY  Office CMS → public homepage banner
US-027-T01  SUCCESS  ACT: In Office logo crop editor adjust only crop, preview desktop/mobile, publish and compare rendered logo against approved artwork  EXPECT: Crop and export preserve approved original artwork and show correctly across breakpoints.
US-027-T02  NEGATIVE / PERMISSION  ACT: Reject crop that destroys required artwork or leaves unusable dimensions without confirmation  EXPECT: Reject crop that destroys required artwork or leaves unusable dimensions without confirmation
US-027-T03  RECOVERY / RETRY  ACT: Cancel crop edit and reopen original image with old published version intact  EXPECT: Cancel crop edit and reopen original image with old published version intact
US-027-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Saved crop dimensions/asset bytes match intended Office preview and public mobile/desktop render  EXPECT: Saved crop dimensions/asset bytes match intended Office preview and public mobile/desktop render
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-028
**Scope:** OFFICE-ONLY — no implementation

US-028  |  P2  |  APPROVED
STORY  As a content Admin, I want to preview logo changes.
EXPECTED  Preview shows the intended desktop/mobile logo appearance without prematurely changing the public site.
Module: Homepage & payment record search  •  Linked features: F-003
ENTRY  Office CMS → public homepage banner
US-028-T01  SUCCESS  ACT: Edit a candidate logo in Office and preview at desktop/mobile without publishing  EXPECT: Preview shows the intended desktop/mobile logo appearance without prematurely changing the public site.
US-028-T02  NEGATIVE / PERMISSION  ACT: Closing preview must not change live public logo or approved dimensions  EXPECT: Closing preview must not change live public logo or approved dimensions
US-028-T03  RECOVERY / RETRY  ACT: Reopen preview after cancelling; unpublished candidate remains non-public  EXPECT: Reopen preview after cancelling; unpublished candidate remains non-public
US-028-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office draft differs from unchanged published version; public readback remains current  EXPECT: Office draft differs from unchanged published version; public readback remains current
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-029
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-029  |  P2  |  APPROVED
STORY  As an Office content editor, I want a published logo to appear on the public site.
EXPECTED  The chosen logo stays published after a refresh and looks the same in Office preview and Sohojkor.
Module: Homepage & payment record search  •  Linked features: F-009, F-121
ENTRY  Office CMS → public homepage banner
US-029-T01  SUCCESS  ACT: Publish approved logo revision from Office CMS and compare public header/mobile logo after refresh in EN and BN  EXPECT: The chosen logo stays published after a refresh and looks the same in Office preview and Sohojkor.
US-029-T02  NEGATIVE / PERMISSION  ACT: Stale asset URL or unauthorized session cannot change published logo  EXPECT: Stale asset URL or unauthorized session cannot change published logo
US-029-T03  RECOVERY / RETRY  ACT: Invalidate allowed cache/reload public site and see latest published revision once  EXPECT: Invalidate allowed cache/reload public site and see latest published revision once
US-029-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office publish ID, asset checksum, public URL and rendered logo match  EXPECT: Office publish ID, asset checksum, public URL and rendered logo match
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-030
**Scope:** OFFICE-ONLY — no implementation

US-030  |  P2  |  APPROVED
STORY  As a content Admin, I want to manage banners with a fixed left text-and-button area.
EXPECTED  The left copy and button stay stationary; the banner image, its colours and other existing slide settings continue to change as already approved.
Module: Homepage & payment record search  •  Linked features: F-004
ENTRY  Office CMS → public homepage banner
US-030-T01  SUCCESS  ACT: Edit a banner in Office CMS; preview fixed left heading, description and exactly two stationary payment actions while artwork changes  EXPECT: The left copy and button stay stationary; the banner image, its colours and other existing slide settings continue to change as already approved.
US-030-T02  NEGATIVE / PERMISSION  ACT: Reject layout that moves or duplicates left buttons or removes a banner without permission  EXPECT: Reject layout that moves or duplicates left buttons or removes a banner without permission
US-030-T03  RECOVERY / RETRY  ACT: Reload banner editor after preview; unchanged fixed-left copy/buttons remain intact  EXPECT: Reload banner editor after preview; unchanged fixed-left copy/buttons remain intact
US-030-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Published banner settings keep fixed content and all five artwork entries with correct versions  EXPECT: Published banner settings keep fixed content and all five artwork entries with correct versions
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-031
**Scope:** OFFICE-ONLY — no implementation

US-031  |  P2  |  APPROVED
STORY  As a content Admin, I want to replace an existing banner image.
EXPECTED  Replacement updates only intended banner artwork and retains other banner content and order.
Module: Homepage & payment record search  •  Linked features: F-007
ENTRY  Office CMS → public homepage banner
US-031-T01  SUCCESS  ACT: Replace artwork for one selected existing banner, preview then publish without changing other banners or left copy  EXPECT: Replacement updates only intended banner artwork and retains other banner content and order.
US-031-T02  NEGATIVE / PERMISSION  ACT: Reject invalid image or accidental replacement of other slide IDs  EXPECT: Reject invalid image or accidental replacement of other slide IDs
US-031-T03  RECOVERY / RETRY  ACT: Cancel replacement or retry upload; restore selected prior published artwork  EXPECT: Cancel replacement or retry upload; restore selected prior published artwork
US-031-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Only intended slide asset ID/version changes; order, five slots and fixed-left content retained  EXPECT: Only intended slide asset ID/version changes; order, five slots and fixed-left content retained
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-032
**Scope:** OFFICE-ONLY — no implementation

US-032  |  P2  |  APPROVED
STORY  As a content Admin, I want to automatically select colors from uploaded artwork.
EXPECTED  Analyzer selects a defensible color family from actual pixels, not a generic unrelated palette.
Module: Homepage & payment record search  •  Linked features: F-005
ENTRY  Office CMS → public homepage banner
US-032-T01  SUCCESS  ACT: Upload artwork in Office analyzer and review actual derived light background/dark text/outline button palette before preview  EXPECT: Analyzer selects a defensible color family from actual pixels, not a generic unrelated palette.
US-032-T02  NEGATIVE / PERMISSION  ACT: If analysis fails or contrast is unsuitable, block unsupported automatic color claim  EXPECT: If analysis fails or contrast is unsuitable, block unsupported automatic color claim
US-032-T03  RECOVERY / RETRY  ACT: Retry analyzer on same uploaded image while preserving previous published palette  EXPECT: Retry analyzer on same uploaded image while preserving previous published palette
US-032-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Saved palette values associated with the correct image/version and reflected in preview  EXPECT: Saved palette values associated with the correct image/version and reflected in preview
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-033
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-033  |  P2  |  APPROVED
STORY  As a content Admin, I want each changing banner image to supply its background and text/button colours.
EXPECTED  Keep the existing image-derived light background and darker heading, body and secondary outline-button colours for every slide.
Module: Homepage & payment record search  •  Linked features: F-004, F-005
ENTRY  Office CMS → public homepage banner
US-033-T01  SUCCESS  ACT: Cycle all five images and confirm slide-specific derived backgrounds, dark text and secondary outline button colors  EXPECT: Keep the existing image-derived light background and darker heading, body and secondary outline-button colours for every slide.
US-033-T02  NEGATIVE / PERMISSION  ACT: Check color mismatch/poor contrast on one image; do not silently use unrelated global palette  EXPECT: Check color mismatch/poor contrast on one image; do not silently use unrelated global palette
US-033-T03  RECOVERY / RETRY  ACT: Reload a slide after analysis interruption and restore same image-specific colors  EXPECT: Reload a slide after analysis interruption and restore same image-specific colors
US-033-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office published per-slide image+palette and taxpayer public computed colors agree  EXPECT: Office published per-slide image+palette and taxpayer public computed colors agree
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-034
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-034  |  P2  |  APPROVED
STORY  As a content Admin, I want Office preview to show the fixed-left banner exactly as it will appear on Sohojkor.
EXPECTED  Preview retains the latest image, text, two payment actions, dynamic colours and responsive layout without additional taxpayer-side crop or zoom.
Module: Homepage & payment record search  •  Linked features: F-006, F-135
ENTRY  Office CMS → public homepage banner
US-034-T01  SUCCESS  ACT: Preview complete Office banner with current image, fixed left copy, two buttons and responsive crop; compare to published render  EXPECT: Preview retains the latest image, text, two payment actions, dynamic colours and responsive layout without additional taxpayer-side crop or zoom.
US-034-T02  NEGATIVE / PERMISSION  ACT: Reject taxpayer-side extra zoom/crop and preview that hides any action  EXPECT: Reject taxpayer-side extra zoom/crop and preview that hides any action
US-034-T03  RECOVERY / RETRY  ACT: After edit cancellation/public reload, preserve previously published full layout  EXPECT: After edit cancellation/public reload, preserve previously published full layout
US-034-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Pixel/context comparison at agreed breakpoints and Office asset versions match without cropping  EXPECT: Pixel/context comparison at agreed breakpoints and Office asset versions match without cropping
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-035
**Scope:** OFFICE-ONLY — no implementation

US-035  |  P2  |  APPROVED
STORY  As a content Admin, I want to manage banner order and visibility.
EXPECTED  Publishing, reordering and hiding preserve exact selected order and do not resurrect deleted/hidden versions.
Module: Homepage & payment record search  •  Linked features: F-007
ENTRY  Office CMS → public homepage banner
US-035-T01  SUCCESS  ACT: Change approved banner order and hide selected slide in Office, publish and check only visible slides appear in chosen order  EXPECT: Publishing, reordering and hiding preserve exact selected order and do not resurrect deleted/hidden versions.
US-035-T02  NEGATIVE / PERMISSION  ACT: Do not resurrect hidden slide or silently delete stored history  EXPECT: Do not resurrect hidden slide or silently delete stored history
US-035-T03  RECOVERY / RETRY  ACT: Resolve stale order publication conflict and recover previous visible ordering  EXPECT: Resolve stale order publication conflict and recover previous visible ordering
US-035-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office order/visibility revision and five-slot public slideshow agree after reload  EXPECT: Office order/visibility revision and five-slot public slideshow agree after reload
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-036
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-036  |  P2  |  APPROVED
STORY  As a content Admin, I want banner changes in Office to appear unchanged in Sohojkor.
EXPECTED  Published image, colours, fixed left text/button, action links and order persist after reload and match in the Office preview and taxpayer site.
Module: Homepage & payment record search  •  Linked features: F-009, F-121
ENTRY  Office CMS → public homepage banner
US-036-T01  SUCCESS  ACT: Publish an approved Office banner edit and compare Taxpayer homepage image, colors, left copy, two links, order and mobile treatment  EXPECT: Published image, colours, fixed left text/button, action links and order persist after reload and match in the Office preview and taxpayer site.
US-036-T02  NEGATIVE / PERMISSION  ACT: Reject stale cached public version or taxpayer-side recomputation that changes artwork/colors  EXPECT: Reject stale cached public version or taxpayer-side recomputation that changes artwork/colors
US-036-T03  RECOVERY / RETRY  ACT: Reload after cached asset invalidation and verify same published revision  EXPECT: Reload after cached asset invalidation and verify same published revision
US-036-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office publish ID and public banner version, paths and visual state match  EXPECT: Office publish ID and public banner version, paths and visual state match
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-037
**Scope:** OFFICE-ONLY — no implementation

US-037  |  P2  |  APPROVED
STORY  As a content Admin, I want to manage English and Bangla banner copy.
EXPECTED  Each language shows its approved text with preserved button action and image.
Module: Homepage & payment record search  •  Linked features: F-004
ENTRY  Office CMS → public homepage banner
US-037-T01  SUCCESS  ACT: Update one banner EN and BN text in existing Office CMS, publish and switch languages on public banner  EXPECT: Each language shows its approved text with preserved button action and image.
US-037-T02  NEGATIVE / PERMISSION  ACT: Do not replace missing BN copy with unrelated EN or alter payment destinations  EXPECT: Do not replace missing BN copy with unrelated EN or alter payment destinations
US-037-T03  RECOVERY / RETRY  ACT: Reload language toggle after publication and recover intended copy  EXPECT: Reload language toggle after publication and recover intended copy
US-037-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office localized text fields and public EN/BN content match same published version  EXPECT: Office localized text fields and public EN/BN content match same published version
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-038
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-038  |  P2  |  APPROVED
STORY  As a public visitor, I want to see responsive banners on desktop, tablet and mobile.
EXPECTED  No clipped image/text/button, accidental crop/zoom or horizontal overflow at approved viewports.
Module: Homepage & payment record search  •  Linked features: F-006
ENTRY  Office CMS → public homepage banner
US-038-T01  SUCCESS  ACT: Open banner on approved desktop, tablet and mobile breakpoints; inspect text/buttons/image and no horizontal overflow  EXPECT: No clipped image/text/button, accidental crop/zoom or horizontal overflow at approved viewports.
US-038-T02  NEGATIVE / PERMISSION  ACT: At smallest approved viewport, no clipped CTA/incorrect crop/scroll trap  EXPECT: At smallest approved viewport, no clipped CTA/incorrect crop/scroll trap
US-038-T03  RECOVERY / RETRY  ACT: Rotate phone or expand Bengali text; restore same banner without layout break  EXPECT: Rotate phone or expand Bengali text; restore same banner without layout break
US-038-T04  PERSISTENCE / CROSS-SYSTEM  ACT: No content loss; screenshots at each viewport match approved responsive constraints  EXPECT: No content loss; screenshots at each viewport match approved responsive constraints
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-039
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-039  |  P2  |  APPROVED
STORY  As a visitor, I want the banner buttons to start Pay Tax or Pay Travel Tax.
EXPECTED  Exactly two approved service journeys are offered; both open the current existing flow for guests and signed-in users, with correct back navigation. No third payment wizard.
Module: Homepage & payment record search  •  Linked features: F-008
ENTRY  Office CMS → public homepage banner
US-039-T01  SUCCESS  ACT: From each of the two banner buttons open existing Pay Tax and separate Travel Tax for guest and signed-in contexts, then Back  EXPECT: Exactly two approved service journeys are offered; both open the current existing flow for guests and signed-in users, with correct back navigation. No third payment wizard.
US-039-T02  NEGATIVE / PERMISSION  ACT: No third wizard or wrong destination; neither button may open the other's form  EXPECT: No third wizard or wrong destination; neither button may open the other's form
US-039-T03  RECOVERY / RETRY  ACT: Back from either journey returns to landing without resetting unrelated state  EXPECT: Back from either journey returns to landing without resetting unrelated state
US-039-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Two correct established route identifiers and existing published action links remain intact  EXPECT: Two correct established route identifiers and existing published action links remain intact
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-040
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-040  |  P2  |  APPROVED
STORY  As a visitor, I want banners to dissolve smoothly while their left-side copy and buttons stay still.
EXPECTED  Only the slide image/background and approved slide-specific colours change during the dissolve; the left text and button do not slide or change position.
Module: Homepage & payment record search  •  Linked features: F-004, F-007
ENTRY  Office CMS → public homepage banner
US-040-T01  SUCCESS  ACT: Observe full banner cycle: images dissolve; left heading/description/two buttons remain stationary  EXPECT: Only the slide image/background and approved slide-specific colours change during the dissolve; the left text and button do not slide or change position.
US-040-T02  NEGATIVE / PERMISSION  ACT: Disable/reduce motion and ensure no horizontal slide or moving left copy  EXPECT: Disable/reduce motion and ensure no horizontal slide or moving left copy
US-040-T03  RECOVERY / RETRY  ACT: Reload during transition and verify image visibility and button access remain safe  EXPECT: Reload during transition and verify image visibility and button access remain safe
US-040-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Existing slide timing/transition settings and fixed-left content retained  EXPECT: Existing slide timing/transition settings and fixed-left content retained
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-041
**Scope:** OFFICE-ONLY — no implementation

US-041  |  P2  |  APPROVED
STORY  As a content Admin, I want to review changes and recover from publication conflicts.
EXPECTED  Version history records actor/time; stale writes conflict clearly; deliberate retry preserves approved content.
Module: Homepage & payment record search  •  Linked features: F-010
ENTRY  Office CMS → public homepage banner
US-041-T01  SUCCESS  ACT: Open version history, edit candidate publication, trigger stale-version conflict and recover via authorized retry  EXPECT: Version history records actor/time; stale writes conflict clearly; deliberate retry preserves approved content.
US-041-T02  NEGATIVE / PERMISSION  ACT: Reject conflicting stale write without overriding newly published content  EXPECT: Reject conflicting stale write without overriding newly published content
US-041-T03  RECOVERY / RETRY  ACT: Recover previously approved version from Office publish history  EXPECT: Recover previously approved version from Office publish history
US-041-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office actor/time/version audit and public published revision consistent  EXPECT: Office actor/time/version audit and public published revision consistent
Fixture: Existing authorized Office CMS session, published asset/version, approved current artwork and read-only public comparison; no new payment fixture.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-042
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-042  |  P2  |  APPROVED
STORY  As a taxpayer, I want to switch between English and Bangla.
EXPECTED  Navigation, forms, validation, receipts and key notifications display consistent selected language.
Module: Data continuity and performance  •  Linked features: F-122
ENTRY  Existing citizen/Office screen for the stated role and capability
US-042-T01  SUCCESS  ACT: Change site language EN→BN→EN while navigating forms, errors, receipts and notifications  EXPECT: Navigation, forms, validation, receipts and key notifications display consistent selected language.
US-042-T02  NEGATIVE / PERMISSION  ACT: No mixed locale error, lost form value, clipped BN text or missing action  EXPECT: No mixed locale error, lost form value, clipped BN text or missing action
US-042-T03  RECOVERY / RETRY  ACT: Reload while BN selected and resume same authorized form/navigation  EXPECT: Reload while BN selected and resume same authorized form/navigation
US-042-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Chosen language persisted per current guest/account rules, with unchanged data  EXPECT: Chosen language persisted per current guest/account rules, with unchanged data
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-043
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-043  |  P2  |  APPROVED
STORY  As a signed-in taxpayer, I want to keep my selected language after sign-out and sign-in.
EXPECTED  Preference persists per account and does not leak across other users.
Module: Sign-in and taxpayer profile  •  Linked features: F-018
ENTRY  Language menu → English / বাংলা
US-043-T01  SUCCESS  ACT: Save signed-in language selection, sign out and back into same account, then inspect selected language  EXPECT: Preference persists per account and does not leak across other users.
US-043-T02  NEGATIVE / PERMISSION  ACT: Second account must not inherit first account's private preference  EXPECT: Second account must not inherit first account's private preference
US-043-T03  RECOVERY / RETRY  ACT: Refresh and sign in again; restore same selected language  EXPECT: Refresh and sign in again; restore same selected language
US-043-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Saved account preference owner ID and resulting EN/BN navigation match  EXPECT: Saved account preference owner ID and resulting EN/BN navigation match
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-044
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-044  |  P1  |  APPROVED
STORY  As a payer, I want to save an unfinished payment draft.
EXPECTED  Every eligible draft saves accurately with user/session scope; draft is never posted as a payment.
Module: Saved drafts  •  Linked features: F-075, F-077, F-078, F-080
ENTRY  Payment form → Save Draft → Continue
US-044-T01  SUCCESS  ACT: Fill partial existing payment form, Save Draft, inspect draft list and resume exact values without submission  EXPECT: Every eligible draft saves accurately with user/session scope; draft is never posted as a payment.
US-044-T02  NEGATIVE / PERMISSION  ACT: Attempt to count unfinished draft as paid transaction or expose another account's draft; deny  EXPECT: Attempt to count unfinished draft as paid transaction or expose another account's draft; deny
US-044-T03  RECOVERY / RETRY  ACT: Close and reopen current session or sign in again as applicable, then resume saved draft  EXPECT: Close and reopen current session or sign in again as applicable, then resume saved draft
US-044-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Draft ID/owner/session, fields/lines and timestamps persist; no payment parent created  EXPECT: Draft ID/owner/session, fields/lines and timestamps persist; no payment parent created
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-045
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-045  |  P1  |  APPROVED
STORY  As a payer, I want to resume or discard a saved draft.
EXPECTED  Resume restores all valid information; discard clears only selected draft after confirmation.
Module: Saved drafts  •  Linked features: F-075, F-077, F-078, F-079
ENTRY  Payment form → Save Draft → Continue
US-045-T01  SUCCESS  ACT: Select saved draft, Resume all original fields; separately Discard selected draft with confirmation  EXPECT: Resume restores all valid information; discard clears only selected draft after confirmation.
US-045-T02  NEGATIVE / PERMISSION  ACT: Cancel discard, preserve draft; ensure discarded draft cannot silently erase another saved draft  EXPECT: Cancel discard, preserve draft; ensure discarded draft cannot silently erase another saved draft
US-045-T03  RECOVERY / RETRY  ACT: Interrupt resume, reload and reopen same version or show version conflict safely  EXPECT: Interrupt resume, reload and reopen same version or show version conflict safely
US-045-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Correct draft ID and field revision restored/discarded only as authorized; no finance event  EXPECT: Correct draft ID and field revision restored/discarded only as authorized; no finance event
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-046
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-046  |  P1  |  APPROVED
STORY  As a payer, I want to receive save/discard choice when closing a draft-eligible payment.
EXPECTED  Close icon, overlay and browser back respect non-discard policy; avoid silent information loss.
Module: Saved drafts  •  Linked features: F-076, F-079
ENTRY  Payment form → Save Draft → Continue
US-046-T01  SUCCESS  ACT: With unsaved changes in draft-eligible form use close icon, overlay and browser Back; choose Save/Discard/Cancel  EXPECT: Close icon, overlay and browser back respect non-discard policy; avoid silent information loss.
US-046-T02  NEGATIVE / PERMISSION  ACT: Closing modal without choice must not silently discard entered valid fields  EXPECT: Closing modal without choice must not silently discard entered valid fields
US-046-T03  RECOVERY / RETRY  ACT: Choose Cancel and return to form with all fields, or Save and resume from draft  EXPECT: Choose Cancel and return to form with all fields, or Save and resume from draft
US-046-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Saved draft or intact form state remains and modal focus/back behavior matches approved UI  EXPECT: Saved draft or intact form state remains and modal focus/back behavior matches approved UI
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-047
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-047  |  P1  |  APPROVED
STORY  As a taxpayer, I want to search my payment history and open the relevant beneficiary or payment.
EXPECTED  Search/filter by permitted reference, date, head, year, tag and TIN. The payment row opens details or the correct beneficiary profile; only this account’s records appear.
Module: Payment history, beneficiary profile and Pay Again  •  Linked features: F-065, F-069
ENTRY  Payment History → beneficiary profile
US-047-T01  SUCCESS  ACT: Search owned history by reference, date, head, AY, tag and beneficiary; open chosen payment and beneficiary profile  EXPECT: Search/filter by permitted reference, date, head, year, tag and TIN. The payment row opens details or the correct beneficiary profile; only this account’s records appear.
US-047-T02  NEGATIVE / PERMISSION  ACT: Search other account's reference/TIN; must not reveal private rows or contact list  EXPECT: Search other account's reference/TIN; must not reveal private rows or contact list
US-047-T03  RECOVERY / RETRY  ACT: Refresh filtered history and return from detail without losing filters  EXPECT: Refresh filtered history and return from detail without losing filters
US-047-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Authorized filtered row IDs align with payer-owned payment allocations  EXPECT: Authorized filtered row IDs align with payer-owned payment allocations
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-048
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-048  |  P1  |  APPROVED
STORY  As a taxpayer, I want to export only my filtered history.
EXPECTED  CSV/file output reflects permitted filtered rows and does not leak sensitive data.
Module: Payment history, beneficiary profile and Pay Again  •  Linked features: F-065, F-074
ENTRY  Payment History → beneficiary profile
US-048-T01  SUCCESS  ACT: Filter owned payment history and export; compare exported row count, amounts and columns to current result  EXPECT: CSV/file output reflects permitted filtered rows and does not leak sensitive data.
US-048-T02  NEGATIVE / PERMISSION  ACT: Attempt export of unfiltered or other-account rows; refuse data leakage  EXPECT: Attempt export of unfiltered or other-account rows; refuse data leakage
US-048-T03  RECOVERY / RETRY  ACT: Repeat export after interrupted download and obtain same filtered snapshot  EXPECT: Repeat export after interrupted download and obtain same filtered snapshot
US-048-T04  PERSISTENCE / CROSS-SYSTEM  ACT: CSV rows exactly match authorized filtered table and original payment IDs  EXPECT: CSV rows exactly match authorized filtered table and original payment IDs
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-049
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-049  |  P1  |  APPROVED
STORY  As a payer, I want to download or print my recorded payment receipt.
EXPECTED  The original receipt and generated Payment Certificate are both viewable, printable and downloadable and show matching transaction details and breakdown.
Module: Receipts, certificates and ledger  •  Linked features: F-047, F-049, F-172
ENTRY  Payment record → receipt / certificates
US-049-T01  SUCCESS  ACT: Open saved completed payment, view receipt and certificate, Print and Download, verify same breakdown  EXPECT: The original receipt and generated Payment Certificate are both viewable, printable and downloadable and show matching transaction details and breakdown.
US-049-T02  NEGATIVE / PERMISSION  ACT: If print/download unavailable or lacks line detail, show truthful error and no unrelated document  EXPECT: If print/download unavailable or lacks line detail, show truthful error and no unrelated document
US-049-T03  RECOVERY / RETRY  ACT: Retry export after browser download interruption; do not create new payment  EXPECT: Retry export after browser download interruption; do not create new payment
US-049-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Document IDs, bytes and itemization refer to exact original stored payment  EXPECT: Document IDs, bytes and itemization refer to exact original stored payment
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-050
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-050  |  P1  |  APPROVED
STORY  As a payer, I want to retrieve a stored receipt using an approved reference.
EXPECTED  Payment-record search retrieves the original permitted receipt and Payment Certificate using the existing reference-lookup behavior, without exposing private information.
Module: Receipts, certificates and ledger  •  Linked features: F-051, F-171, F-129
ENTRY  Payment record → receipt / certificates
US-050-T01  SUCCESS  ACT: From homepage reference lookup enter permitted challan/token/transaction ID and retrieve original receipt/certificate  EXPECT: Payment-record search retrieves the original permitted receipt and Payment Certificate using the existing reference-lookup behavior, without exposing private information.
US-050-T02  NEGATIVE / PERMISSION  ACT: No-match or restricted reference reveals no personal history and no fabricated receipt  EXPECT: No-match or restricted reference reveals no personal history and no fabricated receipt
US-050-T03  RECOVERY / RETRY  ACT: Retry lookup after network error with reference preserved  EXPECT: Retry lookup after network error with reference preserved
US-050-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original immutable receipt/certificate reference returned; no new document or payment created  EXPECT: Original immutable receipt/certificate reference returned; no new document or payment created
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-051
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-051  |  P1  |  APPROVED
STORY  As a taxpayer, I want to view recorded payment certificates.
EXPECTED  Every completed payment automatically creates a Payment Certificate that can be viewed, printed and downloaded as PDF; the original stays linked to its transaction.
Module: Receipts, certificates and ledger  •  Linked features: F-050, F-052, F-172, F-054
ENTRY  Payment record → receipt / certificates
US-051-T01  SUCCESS  ACT: Open account's recorded Payment Certificate, view/print and download actual PDF matching saved transaction  EXPECT: Every completed payment automatically creates a Payment Certificate that can be viewed, printed and downloaded as PDF; the original stays linked to its transaction.
US-051-T02  NEGATIVE / PERMISSION  ACT: Reject HTML renamed to PDF, invalid document reference or unpermitted viewer  EXPECT: Reject HTML renamed to PDF, invalid document reference or unpermitted viewer
US-051-T03  RECOVERY / RETRY  ACT: Reload historical certificate view and retry PDF download using same ID  EXPECT: Reload historical certificate view and retry PDF download using same ID
US-051-T04  PERSISTENCE / CROSS-SYSTEM  ACT: PDF header and amounts/payer/recipient data match original certificate/payment ID  EXPECT: PDF header and amounts/payer/recipient data match original certificate/payment ID
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-052
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-052  |  P1  |  APPROVED
STORY  As a payer, I want the Excel import option hidden for now.
EXPECTED  Manual Add Beneficiary opens directly. Hide Excel entry points on mobile/desktop without deleting existing import code, templates or data.
Module: Beneficiaries and lists  •  Linked features: F-062
ENTRY  Beneficiaries → list → person
US-052-T01  SUCCESS  ACT: Open beneficiary page on mobile/desktop and confirm Add Beneficiary remains, while Excel import entry points are absent  EXPECT: Manual Add Beneficiary opens directly. Hide Excel entry points on mobile/desktop without deleting existing import code, templates or data.
US-052-T02  NEGATIVE / PERMISSION  ACT: Hidden import must not delete template/parser/source data or unrelated Add/Edit functions  EXPECT: Hidden import must not delete template/parser/source data or unrelated Add/Edit functions
US-052-T03  RECOVERY / RETRY  ACT: Return after page refresh and still see manual add only  EXPECT: Return after page refresh and still see manual add only
US-052-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Dormant import code unchanged; visible affordances only match approved policy  EXPECT: Dormant import code unchanged; visible affordances only match approved policy
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-053
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-053  |  P1  |  APPROVED
STORY  As a payer, I want to edit, retag, move or remove a saved beneficiary.
EXPECTED  Use existing Edit modal with Delete inside it; save owner-only changes, keep Make Payment as the primary row action and retain immutable historical payment records.
Module: Beneficiaries and lists  •  Linked features: F-057, F-058, F-059, F-061
ENTRY  Beneficiaries → list → person
US-053-T01  SUCCESS  ACT: Open owned beneficiary Edit modal, change relation/tag/list, save; delete from modal and confirm payment history stays  EXPECT: Use existing Edit modal with Delete inside it; save owner-only changes, keep Make Payment as the primary row action and retain immutable historical payment records.
US-053-T02  NEGATIVE / PERMISSION  ACT: Reject unauthorized edit, duplicate tag, missing final tag and unexpected historical payment deletion  EXPECT: Reject unauthorized edit, duplicate tag, missing final tag and unexpected historical payment deletion
US-053-T03  RECOVERY / RETRY  ACT: Cancel Edit/Delete modal, reopen and confirm original saved values  EXPECT: Cancel Edit/Delete modal, reopen and confirm original saved values
US-053-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Owner's latest contact revision persisted; original historical paid allocations unchanged  EXPECT: Owner's latest contact revision persisted; original historical paid allocations unchanged
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-054
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-054  |  P1  |  APPROVED
STORY  As a payer, I want to see spending by saved tag and relationship.
EXPECTED  Counts and amounts use only my paid shares; tag history and untagged payments are displayed fairly.
Module: Taxpayer dashboard  •  Linked features: F-100, F-101
ENTRY  Signed-in taxpayer → existing dashboard bento cards
US-054-T01  SUCCESS  ACT: From dashboard inspect relationship/tag spending and drill down to matching owned payments  EXPECT: Counts and amounts use only my paid shares; tag history and untagged payments are displayed fairly.
US-054-T02  NEGATIVE / PERMISSION  ACT: Duplicate parent allocation across tags must not inflate totals  EXPECT: Duplicate parent allocation across tags must not inflate totals
US-054-T03  RECOVERY / RETRY  ACT: Switch filters/refresh and retain accurate tag breakdown  EXPECT: Switch filters/refresh and retain accurate tag breakdown
US-054-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Each payer-owned allocation counted once under correct tag and period  EXPECT: Each payer-owned allocation counted once under correct tag and period
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-055
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-055  |  P1  |  APPROVED
STORY  As a taxpayer, I want an assessment-year filter that does not distort combined payment totals.
EXPECTED  Show only the matching allocation shares for that year. Keep the parent transaction’s one combined receipt and do not count its full total again for each payee or year.
Module: Payment history, beneficiary profile and Pay Again  •  Linked features: F-065, F-070
ENTRY  Payment History → beneficiary profile
US-055-T01  SUCCESS  ACT: Filter combined payment history to one AY, inspect per-allocation amounts and original one-parent receipt  EXPECT: Show only the matching allocation shares for that year. Keep the parent transaction’s one combined receipt and do not count its full total again for each payee or year.
US-055-T02  NEGATIVE / PERMISSION  ACT: Do not show full batch total in every matching row or leak other AY allocations  EXPECT: Do not show full batch total in every matching row or leak other AY allocations
US-055-T03  RECOVERY / RETRY  ACT: Clear/reapply AY filter and recover correct totals without altering parent  EXPECT: Clear/reapply AY filter and recover correct totals without altering parent
US-055-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Filtered sum equals selected AY allocations; parent receipt remains one original total  EXPECT: Filtered sum equals selected AY allocations; parent receipt remains one original total
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-056
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-056  |  P3  |  APPROVED
STORY  As a public visitor, I want to access service guidance without signing in.
EXPECTED  Public services and explanatory material are reachable before login and do not demand private profile.
Module: Homepage & payment record search  •  Linked features: F-001, F-002
ENTRY  Public home → User Guide / Help
US-056-T01  SUCCESS  ACT: As guest open existing public guide/help/catalogue from homepage without authentication  EXPECT: Public services and explanatory material are reachable before login and do not demand private profile.
US-056-T02  NEGATIVE / PERMISSION  ACT: Do not ask for sign-in or reveal private profile in a public guide  EXPECT: Do not ask for sign-in or reveal private profile in a public guide
US-056-T03  RECOVERY / RETRY  ACT: After navigation error go back to homepage and reopen same public guide  EXPECT: After navigation error go back to homepage and reopen same public guide
US-056-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Public guide routes and content available without account read/write  EXPECT: Public guide routes and content available without account read/write
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-057
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-057  |  P3  |  APPROVED
STORY  As a visitor, I want to report a support issue.
EXPECTED  Save the report with a reference so the existing Office team can view it.
Module: Corrections and unwanted payments  •  Linked features: F-002
ENTRY  Public homepage → Report → existing Report a problem form (no sign-in for a general issue)
US-057-T01  SUCCESS  ACT: As guest open Report a problem, select issue type, enter details, review and submit through an existing approved intake; receive tracking reference  EXPECT: Save the report with a reference so the existing Office team can view it.
US-057-T02  NEGATIVE / PERMISSION  ACT: Reject empty/too-short description and duplicate submission; do not substitute unsolicited-payment correction flow  EXPECT: Reject empty/too-short description and duplicate submission; do not substitute unsolicited-payment correction flow
US-057-T03  RECOVERY / RETRY  ACT: After post timeout retry safely, retrieve same case rather than create duplicate  EXPECT: After post timeout retry safely, retrieve same case rather than create duplicate
US-057-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Stored general support case ID/description/category and authorized Office intake/readback, if an existing contract is verified; otherwise BLOCKED  EXPECT: Stored general support case ID/description/category and authorized Office intake/readback, if an existing contract is verified; otherwise BLOCKED
Fixture: Public support form and an existing approved persistent intake contract; if none exists, mark the submit step BLOCKED rather than invent a new system.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-058
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-058  |  P1  |  APPROVED
STORY  As a taxpayer, I want to use same core workflows on phone and desktop.
EXPECTED  Preserve the existing desktop and mobile navigation. On public mobile, retain the bottom navigation, floating Pay action and top-right Help icon; do not rebuild the footer. EN/BN forms and controls remain usable.
Module: Data continuity and performance  •  Linked features: F-122, F-123
ENTRY  Existing citizen/Office screen for the stated role and capability
US-058-T01  SUCCESS  ACT: Run existing core payment/search/receipt journeys on phone and desktop in EN/BN, preserving bottom nav/Pay/Help  EXPECT: Preserve the existing desktop and mobile navigation. On public mobile, retain the bottom navigation, floating Pay action and top-right Help icon; do not rebuild the footer. EN/BN forms and controls remain usable.
US-058-T02  NEGATIVE / PERMISSION  ACT: Ensure no missing mobile footer, removed control, clipped input or unexpected desktop redesign  EXPECT: Ensure no missing mobile footer, removed control, clipped input or unexpected desktop redesign
US-058-T03  RECOVERY / RETRY  ACT: Rotate/resize during form and recover input/focus and safe areas  EXPECT: Rotate/resize during form and recover input/focus and safe areas
US-058-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Same business result IDs across viewports, UI screenshot parity against approved baseline  EXPECT: Same business result IDs across viewports, UI screenshot parity against approved baseline
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-059
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-059  |  P1  |  APPROVED
STORY  As a taxpayer, I want to view my payment-related activity and notices.
EXPECTED  Authorized saved in the database events display correctly with search, read state and no duplicate notification.
Module: In-app notifications and activity  •  Linked features: F-081, F-085, F-088, F-119
ENTRY  In-app notifications → activity
US-059-T01  SUCCESS  ACT: Sign in, open Notifications & Activity and inspect sourced payments/corrections/read state, filter and open event  EXPECT: Authorized saved in the database events display correctly with search, read state and no duplicate notification.
US-059-T02  NEGATIVE / PERMISSION  ACT: Do not duplicate same notice or reveal another account's activity  EXPECT: Do not duplicate same notice or reveal another account's activity
US-059-T03  RECOVERY / RETRY  ACT: Reconnect and reopen list; retain acknowledgement and chronological event  EXPECT: Reconnect and reopen list; retain acknowledgement and chronological event
US-059-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Correct owner event IDs, read timestamps and deep-link targets persist  EXPECT: Correct owner event IDs, read timestamps and deep-link targets persist
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-060
**Scope:** OFFICE-ONLY — no implementation

US-060  |  P1  |  APPROVED
STORY  As an Office Admin, I want to search and filter transactions.
EXPECTED  Search the records stored in Office and open the exact payment and its individual details.
Module: Office/Admin payment views  •  Linked features: F-104
ENTRY  Office/Admin → taxpayer payment details
US-060-T01  SUCCESS  ACT: In Office payment table search/filter by supported reference, payer/recipient/head/date and open selected transaction  EXPECT: Search the records stored in Office and open the exact payment and its individual details.
US-060-T02  NEGATIVE / PERMISSION  ACT: Do not show unauthorized Office data or incorrect filtered count  EXPECT: Do not show unauthorized Office data or incorrect filtered count
US-060-T03  RECOVERY / RETRY  ACT: Refresh Office table with same selected filter and open exact row  EXPECT: Refresh Office table with same selected filter and open exact row
US-060-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Filtered Office SQL rows match table IDs and detail drawer  EXPECT: Filtered Office SQL rows match table IDs and detail drawer
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-061
**Scope:** OFFICE-ONLY — no implementation

US-061  |  P1  |  APPROVED
STORY  As an Office Admin, I want to inspect a payment and its full payment lines.
EXPECTED  Payment detail shows payer, recipients, heads/assessment years, amounts, recorded status, receipt and matching automatic certificate, all linked to the same original source transaction.
Module: Office/Admin payment views  •  Linked features: F-105, F-108
ENTRY  Office/Admin → taxpayer payment details
US-061-T01  SUCCESS  ACT: Office Admin opens one original transaction and detail drawer with payer, recipients, all head/AY lines, total and receipt/certificate  EXPECT: Payment detail shows payer, recipients, heads/assessment years, amounts, recorded status, receipt and matching automatic certificate, all linked to the same original source transaction.
US-061-T02  NEGATIVE / PERMISSION  ACT: Do not omit a child allocation or treat per-head line as separate parent/receipt  EXPECT: Do not omit a child allocation or treat per-head line as separate parent/receipt
US-061-T03  RECOVERY / RETRY  ACT: Close and reopen drawer after refresh; return same original reference  EXPECT: Close and reopen drawer after refresh; return same original reference
US-061-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office original parent and all lines/receipt/certificate IDs match source and authorized views  EXPECT: Office original parent and all lines/receipt/certificate IDs match source and authorized views
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-062
**Scope:** OFFICE-ONLY — no implementation

US-062  |  P1  |  APPROVED
STORY  As an Office Admin, I want to export payment records.
EXPECTED  Exports reflect applied filters and authorized fields with matching totals and details.
Module: Office/Admin payment views  •  Linked features: F-109
ENTRY  Office/Admin → taxpayer payment details
US-062-T01  SUCCESS  ACT: Apply Office payment filters and export matching rows; inspect file columns, totals and receipts  EXPECT: Exports reflect applied filters and authorized fields with matching totals and details.
US-062-T02  NEGATIVE / PERMISSION  ACT: No extra unfiltered or unauthorized rows; correct parent/line granularity  EXPECT: No extra unfiltered or unauthorized rows; correct parent/line granularity
US-062-T03  RECOVERY / RETRY  ACT: Retry interrupted export without changing selected report filters  EXPECT: Retry interrupted export without changing selected report filters
US-062-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Export file ID set and sums equal filtered Office stored payment rows  EXPECT: Export file ID set and sums equal filtered Office stored payment rows
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-063
**Scope:** OFFICE-ONLY — no implementation

US-063  |  P1  |  APPROVED
STORY  As an Office Admin, I want to review selected taxpayer activity.
EXPECTED  TIN-level 360 distinguishes self, payer-for-others, others-paid-for-user and audit events.
Module: Office/Admin payment views  •  Linked features: F-106
ENTRY  Office/Admin → taxpayer payment details
US-063-T01  SUCCESS  ACT: In Office taxpayer 360 select verified TIN; separate self, paid-for-others, received-by-others and event history  EXPECT: TIN-level 360 distinguishes self, payer-for-others, others-paid-for-user and audit events.
US-063-T02  NEGATIVE / PERMISSION  ACT: Prevent payer/recipient reversal and private address-book exposure  EXPECT: Prevent payer/recipient reversal and private address-book exposure
US-063-T03  RECOVERY / RETRY  ACT: Navigate away/return to same TIN and restore authorized transaction timeline  EXPECT: Navigate away/return to same TIN and restore authorized transaction timeline
US-063-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office payment roles and allocations/time order match same source events  EXPECT: Office payment roles and allocations/time order match same source events
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-064
**Scope:** OFFICE-ONLY — no implementation

US-064  |  P1  |  APPROVED
STORY  As an Office Admin, I want to view payment analytics by year and category.
EXPECTED  Totals count transaction once and allocate head/year sums without duplication.
Module: Office/Admin payment views  •  Linked features: F-104, F-109
ENTRY  Office/Admin → taxpayer payment details
US-064-T01  SUCCESS  ACT: Filter Office analytics by AY and head and reconcile chart values against original source lines  EXPECT: Totals count transaction once and allocate head/year sums without duplication.
US-064-T02  NEGATIVE / PERMISSION  ACT: No parent double count when multiple allocations match a chart category  EXPECT: No parent double count when multiple allocations match a chart category
US-064-T03  RECOVERY / RETRY  ACT: Change filter repeatedly and reload; totals remain stable  EXPECT: Change filter repeatedly and reload; totals remain stable
US-064-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Each payment counted once for parent totals, allocation amounts for head/AY breakdown  EXPECT: Each payment counted once for parent totals, allocation amounts for head/AY breakdown
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-065
**Scope:** OFFICE-ONLY — no implementation

US-065  |  P1  |  APPROVED
STORY  As an Office Admin, I want to mark transaction notifications as read.
EXPECTED  State persists across refresh/devices for authorized operator with unread count correct.
Module: Office/Admin payment views  •  Linked features: F-108
ENTRY  Office/Admin → taxpayer payment details
US-065-T01  SUCCESS  ACT: Office operator reads new transaction alert, marks read and refreshes or signs in on second device  EXPECT: State persists across refresh/devices for authorized operator with unread count correct.
US-065-T02  NEGATIVE / PERMISSION  ACT: An unrelated Office role cannot mark other's protected alert or reset the original payment  EXPECT: An unrelated Office role cannot mark other's protected alert or reset the original payment
US-065-T03  RECOVERY / RETRY  ACT: Reconnect after read-save timeout and reconcile actual read state  EXPECT: Reconnect after read-save timeout and reconcile actual read state
US-065-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Notification event ID, operator/role and durable read timestamp plus unread count match  EXPECT: Notification event ID, operator/role and durable read timestamp plus unread count match
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-066
**Scope:** OFFICE-ONLY — no implementation

US-066  |  P2  |  APPROVED
STORY  As a content Admin, I want to review previously published site content.
EXPECTED  Versioned banner/logo audit shows change details, actor and time.
Module: Homepage & payment record search  •  Linked features: F-010
ENTRY  Office CMS → public homepage banner
US-066-T01  SUCCESS  ACT: Office CMS Admin selects prior published banner/logo revision and inspects actor, timestamp and change details  EXPECT: Versioned banner/logo audit shows change details, actor and time.
US-066-T02  NEGATIVE / PERMISSION  ACT: History must not fabricate an actor or overwrite prior publication  EXPECT: History must not fabricate an actor or overwrite prior publication
US-066-T03  RECOVERY / RETRY  ACT: Recover older read-only history after stale-version refresh  EXPECT: Recover older read-only history after stale-version refresh
US-066-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Version ledger and asset checksum match published events without payment changes  EXPECT: Version ledger and asset checksum match published events without payment changes
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-067
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-067  |  P2  |  APPROVED
STORY  As a content Admin, I want to manage approved public homepage content.
EXPECTED  Edits reach public site through authorized publishing, without changing payment records.
Module: Homepage & payment record search  •  Linked features: F-001, F-143
ENTRY  Office CMS → public homepage banner
US-067-T01  SUCCESS  ACT: Authorized CMS Admin edits an approved homepage content field, previews and publishes then checks public result  EXPECT: Edits reach public site through authorized publishing, without changing payment records.
US-067-T02  NEGATIVE / PERMISSION  ACT: Unauthorized edit must not publish or alter payment records or fixed payment routes  EXPECT: Unauthorized edit must not publish or alter payment records or fixed payment routes
US-067-T03  RECOVERY / RETRY  ACT: Resolve revision conflict and restore latest approved public content  EXPECT: Resolve revision conflict and restore latest approved public content
US-067-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office CMS publish record + public version equal, Taxpayer payment tables unchanged  EXPECT: Office CMS publish record + public version equal, Taxpayer payment tables unchanged
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-068
**Scope:** OFFICE-ONLY — no implementation

US-068  |  P1  |  APPROVED
STORY  As an Office Admin, I want to see whether Sohojkor payments have reached Office.
EXPECTED  Show delivered payments, remaining records and any mismatched amounts or references.
Module: Taxpayer-to-Office records  •  Linked features: F-115
ENTRY  Sohojkor SQL → Office SQL → Admin
US-068-T01  SUCCESS  ACT: Office Admin compares current source payment delivery status to Office rows including missing and mismatched references  EXPECT: Show delivered payments, remaining records and any mismatched amounts or references.
US-068-T02  NEGATIVE / PERMISSION  ACT: Missing/different Office row cannot be labelled delivered or silently corrected in UI  EXPECT: Missing/different Office row cannot be labelled delivered or silently corrected in UI
US-068-T03  RECOVERY / RETRY  ACT: After bridge replay, refresh mismatch list and confirm resolved reference once  EXPECT: After bridge replay, refresh mismatch list and confirm resolved reference once
US-068-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Outbox/inbox status, source and Office IDs, amount and line fingerprints agree  EXPECT: Outbox/inbox status, source and Office IDs, amount and line fingerprints agree
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-069
**Scope:** OFFICE-ONLY — no implementation

US-069  |  P1  |  APPROVED
STORY  As an Office Admin, I want to see only the Office information in my existing role.
EXPECTED  Keep the established Office role settings; do not build new roles.
Module: Data continuity and performance  •  Linked features: F-112, F-124
ENTRY  Existing citizen/Office screen for the stated role and capability
US-069-T01  SUCCESS  ACT: Sign into Office roles with different authorized scopes, open payment/admin views and check only permitted records  EXPECT: Keep the established Office role settings; do not build new roles.
US-069-T02  NEGATIVE / PERMISSION  ACT: Deny unauthorized query/action and do not create new role or bypass existing Office auth  EXPECT: Deny unauthorized query/action and do not create new role or bypass existing Office auth
US-069-T03  RECOVERY / RETRY  ACT: Log out/switch role/refresh; no previous role's records remain  EXPECT: Log out/switch role/refresh; no previous role's records remain
US-069-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office RLS/authorization and UI readback correspond to existing permissions  EXPECT: Office RLS/authorization and UI readback correspond to existing permissions
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-070
**Scope:** OFFICE-ONLY — no implementation

US-070  |  P1  |  APPROVED
STORY  As an Office Admin, I want to review platform activity and investigate mismatches.
EXPECTED  Admin can trace authorized payment and event references and see discrepancy/repair outcomes.
Module: Office/Admin payment views  •  Linked features: F-110
ENTRY  Office/Admin → taxpayer payment details
US-070-T01  SUCCESS  ACT: Open Office payment exception/repair trail, trace source event to Office receive record and inspect resolution  EXPECT: Admin can trace authorized payment and event references and see discrepancy/repair outcomes.
US-070-T02  NEGATIVE / PERMISSION  ACT: Prevent unapproved manual financial correction or untraceable exception closure  EXPECT: Prevent unapproved manual financial correction or untraceable exception closure
US-070-T03  RECOVERY / RETRY  ACT: Retry after transient source sync error; unresolved mismatch remains visible  EXPECT: Retry after transient source sync error; unresolved mismatch remains visible
US-070-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Case/bridge event IDs, actor/time, original amounts and repair state remain auditable  EXPECT: Case/bridge event IDs, actor/time, original amounts and repair state remain auditable
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-071
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-071  |  P1  |  APPROVED
STORY  As an Office Admin, I want each payment to have the same reference in Sohojkor and Office.
EXPECTED  The reference and recorded total match in both places.
Module: Taxpayer-to-Office records  •  Linked features: F-115, F-117, F-126
ENTRY  Sohojkor SQL → Office SQL → Admin
US-071-T01  SUCCESS  ACT: Compare same completed payment reference in Taxpayer SQL, Office SQL and both visible transaction details  EXPECT: The reference and recorded total match in both places.
US-071-T02  NEGATIVE / PERMISSION  ACT: Reject Office duplicate or altered reference during retry  EXPECT: Reject Office duplicate or altered reference during retry
US-071-T03  RECOVERY / RETRY  ACT: Replay original event after temporary outage without generating new ID  EXPECT: Replay original event after temporary outage without generating new ID
US-071-T04  PERSISTENCE / CROSS-SYSTEM  ACT: One original parent ID/reference and recorded total identical across both SQL stores  EXPECT: One original parent ID/reference and recorded total identical across both SQL stores
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-072
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-072  |  P1  |  APPROVED
STORY  As an Office Admin, I want the exact beneficiary, tax head and year for every payment line.
EXPECTED  Show the same individual amounts as the payer’s receipt and Sohojkor record.
Module: Taxpayer-to-Office records  •  Linked features: F-113, F-117, F-126
ENTRY  Sohojkor SQL → Office SQL → Admin
US-072-T01  SUCCESS  ACT: Open a combined payment in Office and inspect every recipient/head/year/amount against original taxpayer receipt  EXPECT: Show the same individual amounts as the payer’s receipt and Sohojkor record.
US-072-T02  NEGATIVE / PERMISSION  ACT: Fail if any child line missing, reassigned or amount changed  EXPECT: Fail if any child line missing, reassigned or amount changed
US-072-T03  RECOVERY / RETRY  ACT: Refresh line drawer after delayed child arrival and show consistent final state  EXPECT: Refresh line drawer after delayed child arrival and show consistent final state
US-072-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Exact ordered allocation IDs/recipient/head/AY/amount totals and original receipt match  EXPECT: Exact ordered allocation IDs/recipient/head/AY/amount totals and original receipt match
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-073
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-073  |  P1  |  APPROVED
STORY  As an Office Admin, I want to know who paid and whose tax was paid.
EXPECTED  Store and display payer and recipient separately in Sohojkor and Office.
Module: Taxpayer-to-Office records  •  Linked features: F-113, F-118
ENTRY  Sohojkor SQL → Office SQL → Admin
US-073-T01  SUCCESS  ACT: Inspect payer and tax beneficiary columns in Taxpayer and Office transaction views for self and third-party cases  EXPECT: Store and display payer and recipient separately in Sohojkor and Office.
US-073-T02  NEGATIVE / PERMISSION  ACT: Do not substitute payer TIN for recipient or disclose another account's private profile  EXPECT: Do not substitute payer TIN for recipient or disclose another account's private profile
US-073-T03  RECOVERY / RETRY  ACT: Reload row details and verify attribution unchanged  EXPECT: Reload row details and verify attribution unchanged
US-073-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Explicit payer/recipient IDs and allocated amount preserved across two DBs  EXPECT: Explicit payer/recipient IDs and allocated amount preserved across two DBs
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-074
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-074  |  P1  |  APPROVED
STORY  As a taxpayer, I want my eligible earlier guest payments to appear after I sign in.
EXPECTED  Link only payments that belong to my account using the existing matching method.
Module: Sign-in and taxpayer profile  •  Linked features: F-012, F-016
ENTRY  Existing sign-in → taxpayer profile
US-074-T01  SUCCESS  ACT: Sign in as verified payer after previously completed eligible guest payment and find exact source payment in own history  EXPECT: Link only payments that belong to my account using the existing matching method.
US-074-T02  NEGATIVE / PERMISSION  ACT: Typed TIN alone or unrelated sign-in must not claim guest financial history  EXPECT: Typed TIN alone or unrelated sign-in must not claim guest financial history
US-074-T03  RECOVERY / RETRY  ACT: Sign out/in again and recover history using established account binding  EXPECT: Sign out/in again and recover history using established account binding
US-074-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Verified payer binding joins only allowed guest parent IDs and receipt links  EXPECT: Verified payer binding joins only allowed guest parent IDs and receipt links
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-075
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-075  |  P1  |  APPROVED
STORY  As a taxpayer, I want to see eligible payments that other people made for my TIN before I signed in.
EXPECTED  After verified sign-in, show the recipient’s own allocations made by others even if they arrived before first login; not other people’s shares.
Module: Sign-in and taxpayer profile  •  Linked features: F-011, F-016, F-118
ENTRY  Existing sign-in → taxpayer profile
US-075-T01  SUCCESS  ACT: Sign into verified recipient account for first time after others paid its TIN and inspect previous received shares  EXPECT: After verified sign-in, show the recipient’s own allocations made by others even if they arrived before first login; not other people’s shares.
US-075-T02  NEGATIVE / PERMISSION  ACT: Do not show another recipient's lines or claim ownership from typed TIN  EXPECT: Do not show another recipient's lines or claim ownership from typed TIN
US-075-T03  RECOVERY / RETRY  ACT: After first login and backlog notice, refresh and retain received history  EXPECT: After first login and backlog notice, refresh and retain received history
US-075-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Account-to-recipient verified linkage and source allocations correctly scoped  EXPECT: Account-to-recipient verified linkage and source allocations correctly scoped
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-076
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-076  |  P1  |  APPROVED
STORY  As a taxpayer, I want my private payment history to belong to my own account.
EXPECTED  Entering another TIN must not show another person’s private records; reuse existing account access.
Module: Sign-in and taxpayer profile  •  Linked features: F-015, F-017, F-025
ENTRY  Existing sign-in → taxpayer profile
US-076-T01  SUCCESS  ACT: Switch accounts A and B after loading private payer history and verify only active owner's records display  EXPECT: Entering another TIN must not show another person’s private records; reuse existing account access.
US-076-T02  NEGATIVE / PERMISSION  ACT: Entering another TIN or reusing cached A rows must not reveal A after B login  EXPECT: Entering another TIN or reusing cached A rows must not reveal A after B login
US-076-T03  RECOVERY / RETRY  ACT: Sign out, clear active session, sign into B and refresh protected views  EXPECT: Sign out, clear active session, sign into B and refresh protected views
US-076-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Account owner/session claims isolate payments, beneficiaries, drafts and corrections  EXPECT: Account owner/session claims isolate payments, beneficiaries, drafts and corrections
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-077
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-077  |  P1  |  APPROVED
STORY  As an Office Admin, I want every completed recorded payment to reach Office.
EXPECTED  A saved payment and its details are queued together so none are missing.
Module: Taxpayer-to-Office records  •  Linked features: F-113, F-114, F-115
ENTRY  Sohojkor SQL → Office SQL → Admin
US-077-T01  SUCCESS  ACT: Submit permitted disposable completed source payment and inspect Office outbox/inbox and linked allocation receipt  EXPECT: A saved payment and its details are queued together so none are missing.
US-077-T02  NEGATIVE / PERMISSION  ACT: No completed payment line may be dropped by queue; do not record phantom settlement  EXPECT: No completed payment line may be dropped by queue; do not record phantom settlement
US-077-T03  RECOVERY / RETRY  ACT: Simulate temporary bridge pause; resume queue and deliver same parent once  EXPECT: Simulate temporary bridge pause; resume queue and deliver same parent once
US-077-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Payment parent/allocation/doc IDs persist source and Office delivery  EXPECT: Payment parent/allocation/doc IDs persist source and Office delivery
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-078
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-078  |  P1  |  APPROVED
STORY  As an Office Admin, I want each payment recorded only once.
EXPECTED  Repeated delivery or retries never double-count a payment.
Module: Taxpayer-to-Office records  •  Linked features: F-048, F-114, F-116
ENTRY  Sohojkor SQL → Office SQL → Admin
US-078-T01  SUCCESS  ACT: Deliver exact same original payment event twice, inspect Office table/count and receipt count  EXPECT: Repeated delivery or retries never double-count a payment.
US-078-T02  NEGATIVE / PERMISSION  ACT: No duplicate parent, child or certificate from repeat event/idempotent retry  EXPECT: No duplicate parent, child or certificate from repeat event/idempotent retry
US-078-T03  RECOVERY / RETRY  ACT: Replay after ack timeout and recover original delivery acknowledgment  EXPECT: Replay after ack timeout and recover original delivery acknowledgment
US-078-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original idempotency/event key uniquely identifies one saved Office parent  EXPECT: Original idempotency/event key uniquely identifies one saved Office parent
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-079
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-079  |  P1  |  APPROVED
STORY  As an Office Admin, I want the latest correct payment information.
EXPECTED  Later changes are not overwritten by older arriving information.
Module: Taxpayer-to-Office records  •  Linked features: F-116
ENTRY  Sohojkor SQL → Office SQL → Admin
US-079-T01  SUCCESS  ACT: Deliver two ordered versions of permitted payment metadata out of order and inspect Office latest state  EXPECT: Later changes are not overwritten by older arriving information.
US-079-T02  NEGATIVE / PERMISSION  ACT: Stale lower revision must never overwrite verified newer revision or financial immutable fields  EXPECT: Stale lower revision must never overwrite verified newer revision or financial immutable fields
US-079-T03  RECOVERY / RETRY  ACT: Reconnect out-of-order events and reconcile latest revision  EXPECT: Reconnect out-of-order events and reconcile latest revision
US-079-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Version number/event timestamp and immutable original records preserved  EXPECT: Version number/event timestamp and immutable original records preserved
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-080
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-080  |  P1  |  APPROVED
STORY  As an Office Admin, I want payments to sync after a temporary interruption.
EXPECTED  Queued payments finish syncing when the connection returns.
Module: Taxpayer-to-Office records  •  Linked features: F-114, F-116
ENTRY  Sohojkor SQL → Office SQL → Admin
US-080-T01  SUCCESS  ACT: Queue source payment event while Office bridge unavailable, resume bridge and inspect delivered row  EXPECT: Queued payments finish syncing when the connection returns.
US-080-T02  NEGATIVE / PERMISSION  ACT: Do not discard queued event or mark delivered before Office receipt  EXPECT: Do not discard queued event or mark delivered before Office receipt
US-080-T03  RECOVERY / RETRY  ACT: Recover outage with same source event and no duplicate parent  EXPECT: Recover outage with same source event and no duplicate parent
US-080-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Outbox queued→delivered transition and Office inbox/row match  EXPECT: Outbox queued→delivered transition and Office inbox/row match
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-081
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-081  |  P1  |  APPROVED
STORY  As an Office Admin, I want to find discrepancies between the two payment records.
EXPECTED  Identify missing, duplicate or different payment lines and their references.
Module: Taxpayer-to-Office records  •  Linked features: F-117
ENTRY  Sohojkor SQL → Office SQL → Admin
US-081-T01  SUCCESS  ACT: Compare all permitted source and Office payment identifiers/line fingerprints and open discrepancies with reason  EXPECT: Identify missing, duplicate or different payment lines and their references.
US-081-T02  NEGATIVE / PERMISSION  ACT: Detect missing/duplicate/different recipient/head/year/amount instead of calling sync complete  EXPECT: Detect missing/duplicate/different recipient/head/year/amount instead of calling sync complete
US-081-T03  RECOVERY / RETRY  ACT: Recheck after supported targeted replay and close only evidenced discrepancy  EXPECT: Recheck after supported targeted replay and close only evidenced discrepancy
US-081-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Persist comparison run, mismatch IDs and later verified parity, not manual source rewrite  EXPECT: Persist comparison run, mismatch IDs and later verified parity, not manual source rewrite
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-082
**Scope:** OFFICE-ONLY — no implementation

US-082  |  P1  |  APPROVED
STORY  As an Office Admin, I want to see when a payment or correction was recorded.
EXPECTED  Keep the recorded date and action history in the correct taxpayer timeline.
Module: Taxpayer-to-Office records  •  Linked features: F-115
ENTRY  Sohojkor SQL → Office SQL → Admin
US-082-T01  SUCCESS  ACT: Open Office taxpayer timeline for payment and correction event, inspect original event date and actor  EXPECT: Keep the recorded date and action history in the correct taxpayer timeline.
US-082-T02  NEGATIVE / PERMISSION  ACT: Do not replace original event time with delayed Office delivery time or invent change  EXPECT: Do not replace original event time with delayed Office delivery time or invent change
US-082-T03  RECOVERY / RETRY  ACT: Reload historical fishbone after newer event and maintain chronological sort  EXPECT: Reload historical fishbone after newer event and maintain chronological sort
US-082-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Source creation/update event timestamps and Office audit projection match  EXPECT: Source creation/update event timestamps and Office audit projection match
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-083
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-083  |  P1  |  APPROVED
STORY  As a recipient, I want to receive only the share of payment allocated to my checked TIN.
EXPECTED  Multi-beneficiary receipt never exposes other taxpayers’ protected details through recipient view/notification.
Module: In-app notifications and activity  •  Linked features: F-066, F-082, F-118
ENTRY  In-app notifications → activity
US-083-T01  SUCCESS  ACT: Sign in as one recipient from multi-beneficiary batch and open only own received allocation/notice  EXPECT: Multi-beneficiary receipt never exposes other taxpayers’ protected details through recipient view/notification.
US-083-T02  NEGATIVE / PERMISSION  ACT: Attempt direct link to another recipient's share; deny without revealing protected lines  EXPECT: Attempt direct link to another recipient's share; deny without revealing protected lines
US-083-T03  RECOVERY / RETRY  ACT: After refresh restore only permitted own share and notice  EXPECT: After refresh restore only permitted own share and notice
US-083-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Recipient allocation scoped by verified account binding not full batch participant list  EXPECT: Recipient allocation scoped by verified account binding not full batch participant list
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-084
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-084  |  P1  |  APPROVED
STORY  As a user, I want to acknowledge payment notifications once and retain them in history.
EXPECTED  Acknowledged popup does not reappear on reload; notification-list item preserves source event and read timestamp.
Module: In-app notifications and activity  •  Linked features: F-084, F-085, F-119
ENTRY  In-app notifications → activity
US-084-T01  SUCCESS  ACT: Open received-payment popup, acknowledge once, refresh/relogin and inspect item in Notifications history  EXPECT: Acknowledged popup does not reappear on reload; notification-list item preserves source event and read timestamp.
US-084-T02  NEGATIVE / PERMISSION  ACT: Previously acknowledged popup must not replay or disappear from historical list  EXPECT: Previously acknowledged popup must not replay or disappear from historical list
US-084-T03  RECOVERY / RETRY  ACT: Simulate interrupted acknowledgement and reconcile single saved read state  EXPECT: Simulate interrupted acknowledgement and reconcile single saved read state
US-084-T04  PERSISTENCE / CROSS-SYSTEM  ACT: One original notice ID, read timestamp, and source event preserved  EXPECT: One original notice ID, read timestamp, and source event preserved
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-085
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-085  |  P1  |  APPROVED
STORY  As a user, I want to receive offline/backlog events after signing in again.
EXPECTED  First-login backlog appears sequentially after welcome; missed events are recovered on return, read state is saved, and no acknowledged popup reappears or duplicates.
Module: In-app notifications and activity  •  Linked features: F-013, F-083, F-084, F-119
ENTRY  In-app notifications → activity
US-085-T01  SUCCESS  ACT: Accumulate eligible received-payment events while signed out; on login show welcome then each unseen popup and saved list  EXPECT: First-login backlog appears sequentially after welcome; missed events are recovered on return, read state is saved, and no acknowledged popup reappears or duplicates.
US-085-T02  NEGATIVE / PERMISSION  ACT: Never duplicate already-read events or show multiple overlapping popups  EXPECT: Never duplicate already-read events or show multiple overlapping popups
US-085-T03  RECOVERY / RETRY  ACT: Interrupt backlog mid-sequence and resume remaining unread items only  EXPECT: Interrupt backlog mid-sequence and resume remaining unread items only
US-085-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Source event IDs, queued/ack status and unique persisted notices match  EXPECT: Source event IDs, queued/ack status and unique persisted notices match
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-086
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-086  |  P1  |  APPROVED
STORY  As a user, I want to follow a notification to the exact relevant transaction or case.
EXPECTED  Deep link opens authorized payment/correction/report details and shows safe inaccessible state if rights changed.
Module: In-app notifications and activity  •  Linked features: F-085
ENTRY  In-app notifications → activity
US-086-T01  SUCCESS  ACT: Click payment/correction/report notification and navigate to corresponding authorized original detail or case  EXPECT: Deep link opens authorized payment/correction/report details and shows safe inaccessible state if rights changed.
US-086-T02  NEGATIVE / PERMISSION  ACT: After permission revoked/unrelated account, deep link must show inaccessible state and not leak detail  EXPECT: After permission revoked/unrelated account, deep link must show inaccessible state and not leak detail
US-086-T03  RECOVERY / RETRY  ACT: Return from deep-linked view, keep read state and list position  EXPECT: Return from deep-linked view, keep read state and list position
US-086-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Notification target type+original ID and current authorization match stored event  EXPECT: Notification target type+original ID and current authorization match stored event
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-087
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-087  |  P1  |  APPROVED
STORY  As a taxpayer, I want one dated activity history.
EXPECTED  Show recorded payments, corrections, reports and account events in the right time order.
Module: In-app notifications and activity  •  Linked features: F-086, F-087, F-102
ENTRY  In-app notifications → activity
US-087-T01  SUCCESS  ACT: Open account Activity and sort dated payments, corrections, reports and account events, then inspect linked originals  EXPECT: Show recorded payments, corrections, reports and account events in the right time order.
US-087-T02  NEGATIVE / PERMISSION  ACT: Do not invent TIN history or reorder items using local rendered time instead of stored event timestamp  EXPECT: Do not invent TIN history or reorder items using local rendered time instead of stored event timestamp
US-087-T03  RECOVERY / RETRY  ACT: Reconnect after late event and maintain deterministic chronology  EXPECT: Reconnect after late event and maintain deterministic chronology
US-087-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Actor/source/timestamp/event ID and original reference consistent across views  EXPECT: Actor/source/timestamp/event ID and original reference consistent across views
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-088
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-088  |  P1  |  APPROVED
STORY  As someone who requested a correction, I want to see the latest Office decision.
EXPECTED  Show the same correction status and date after I refresh the page.
Module: Corrections and unwanted payments  •  Linked features: F-092
ENTRY  Payment details → correction / report
US-088-T01  SUCCESS  ACT: Submit previously permitted correction and open most recent Office decision/status in account after reload  EXPECT: Show the same correction status and date after I refresh the page.
US-088-T02  NEGATIVE / PERMISSION  ACT: Older status must not replace current reviewed decision  EXPECT: Older status must not replace current reviewed decision
US-088-T03  RECOVERY / RETRY  ACT: Reconnect after Office status update and refresh original case  EXPECT: Reconnect after Office status update and refresh original case
US-088-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office decision revision, reason, timestamp and taxpayer view match  EXPECT: Office decision revision, reason, timestamp and taxpayer view match
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-089
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-089  |  P1  |  APPROVED
STORY  As an Office reviewer, I want to invoke an existing authorized correction queue and decision API.
EXPECTED  Correct named production database function/API exists, authorizes officer, validates case/transition, prevents duplicates and returns refresh.
Module: Corrections and unwanted payments  •  Linked features: F-091
ENTRY  Payment details → correction / report
US-089-T01  SUCCESS  ACT: Authorized Office reviewer invokes existing correction queue/API on permitted case and records valid transition  EXPECT: Correct named production database function/API exists, authorizes officer, validates case/transition, prevents duplicates and returns refresh.
US-089-T02  NEGATIVE / PERMISSION  ACT: Reject unauthorized role, invalid transition, duplicate decision or nonexistent case  EXPECT: Reject unauthorized role, invalid transition, duplicate decision or nonexistent case
US-089-T03  RECOVERY / RETRY  ACT: Retry same accepted action after timeout and return same case revision  EXPECT: Retry same accepted action after timeout and return same case revision
US-089-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Named existing RPC/API contract, case owner/state, audit actor and Office-to-source status verified  EXPECT: Named existing RPC/API contract, case owner/state, audit actor and Office-to-source status verified
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-090
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-090  |  P1  |  APPROVED
STORY  As a taxpayer, I want an Office correction decision to appear in my account.
EXPECTED  Show the same status, reason and date saved in Office and the Sohojkor database.
Module: Corrections and unwanted payments  •  Linked features: F-092
ENTRY  Payment details → correction / report
US-090-T01  SUCCESS  ACT: For a known correction case, compare Office saved decision reason/date and taxpayer's account-visible status  EXPECT: Show the same status, reason and date saved in Office and the Sohojkor database.
US-090-T02  NEGATIVE / PERMISSION  ACT: No conflicting stale status or invented approval shown  EXPECT: No conflicting stale status or invented approval shown
US-090-T03  RECOVERY / RETRY  ACT: Refresh after delayed sync; keep last confirmed Office revision  EXPECT: Refresh after delayed sync; keep last confirmed Office revision
US-090-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office/source case ID, state, decision date and reason agree  EXPECT: Office/source case ID, state, decision date and reason agree
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-091
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-091  |  P1  |  APPROVED
STORY  As an Office reviewer, I want to review unwanted-payment reports.
EXPECTED  Show the report, related payment and decision without falsely recording a financial reversal.
Module: Corrections and unwanted payments  •  Linked features: F-091, F-095, F-110
ENTRY  Payment details → correction / report
US-091-T01  SUCCESS  ACT: Office reviewer opens unwanted-payment report with original payment and decides using established case workflow  EXPECT: Show the report, related payment and decision without falsely recording a financial reversal.
US-091-T02  NEGATIVE / PERMISSION  ACT: No financial reversal recorded solely by reporting; deny wrong-office-role decision  EXPECT: No financial reversal recorded solely by reporting; deny wrong-office-role decision
US-091-T03  RECOVERY / RETRY  ACT: Retry case read after connection loss, preserving report ID and original payment  EXPECT: Retry case read after connection loss, preserving report ID and original payment
US-091-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Case ID, recipient allocation, decision and immutable original payment traceable  EXPECT: Case ID, recipient allocation, decision and immutable original payment traceable
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-092
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-092  |  P1  |  APPROVED
STORY  As an Office Admin, I want to record attribution change to a checked taxpayer.
EXPECTED  Any correction to TIN/payee/head/assessment year requires approved evidence and an audit event, never in-place silent mutation.
Module: Corrections and unwanted payments  •  Linked features: F-093
ENTRY  Payment details → correction / report
US-092-T01  SUCCESS  ACT: Office Admin with approved evidence records attribution-change request/decision and an auditable before/after event  EXPECT: Any correction to TIN/payee/head/assessment year requires approved evidence and an audit event, never in-place silent mutation.
US-092-T02  NEGATIVE / PERMISSION  ACT: Reject silent in-place change to TIN, head, payee or AY without authorized case/evidence  EXPECT: Reject silent in-place change to TIN, head, payee or AY without authorized case/evidence
US-092-T03  RECOVERY / RETRY  ACT: After interrupted approval, reload saved revision and audit event once  EXPECT: After interrupted approval, reload saved revision and audit event once
US-092-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Actor, evidence, original value, approved new value and immutable original preserved  EXPECT: Actor, evidence, original value, approved new value and immutable original preserved
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-093
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-093  |  P1  |  APPROVED
STORY  As a taxpayer, I want to see a confirmed external change when one becomes available.
EXPECTED  Show only verified linked events; do not invent past external events.
Module: Corrections and unwanted payments  •  Linked features: F-087, F-096
ENTRY  Payment details → correction / report
US-093-T01  SUCCESS  ACT: When a truly source-confirmed external change exists, show its dated notice in taxpayer account  EXPECT: Show only verified linked events; do not invent past external events.
US-093-T02  NEGATIVE / PERMISSION  ACT: No connected/verified event means no fabricated TIN/circle/name change popup  EXPECT: No connected/verified event means no fabricated TIN/circle/name change popup
US-093-T03  RECOVERY / RETRY  ACT: Reopen account after event delivery delay and show only verified pending alert  EXPECT: Reopen account after event delivery delay and show only verified pending alert
US-093-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Event source reference, effective date, taxpayer identity and alert ID verified  EXPECT: Event source reference, effective date, taxpayer identity and alert ID verified
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-094
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-094  |  P1  |  APPROVED
STORY  As a taxpayer, I want to see self-paid and received-paid totals without double counting.
EXPECTED  Payer total counts whole payment once; received total counts only applicable payment lines; filters match detail.
Module: Taxpayer dashboard  •  Linked features: F-098
ENTRY  Signed-in taxpayer → existing dashboard bento cards
US-094-T01  SUCCESS  ACT: From taxpayer dashboard compare self-paid, paid-for-others and received totals with original parent and own allocations  EXPECT: Payer total counts whole payment once; received total counts only applicable payment lines; filters match detail.
US-094-T02  NEGATIVE / PERMISSION  ACT: Combined parent total must not be counted once per recipient or both paid and received in one category  EXPECT: Combined parent total must not be counted once per recipient or both paid and received in one category
US-094-T03  RECOVERY / RETRY  ACT: Switch date/head filters and recalc without double count  EXPECT: Switch date/head filters and recalc without double count
US-094-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Account-owned payer totals and recipient-only allocation sums from actual SQL  EXPECT: Account-owned payer totals and recipient-only allocation sums from actual SQL
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-095
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-095  |  P1  |  APPROVED
STORY  As a taxpayer, I want to see meaningful empty states rather than fictional zeroes.
EXPECTED  New/empty accounts show no-data state and guidance, not synthesized account liabilities or fake payment success.
Module: Taxpayer dashboard  •  Linked features: F-103
ENTRY  Signed-in taxpayer → existing dashboard bento cards
US-095-T01  SUCCESS  ACT: Open empty newly created permitted account; inspect dashboard and payment history explanatory no-data states  EXPECT: New/empty accounts show no-data state and guidance, not synthesized account liabilities or fake payment success.
US-095-T02  NEGATIVE / PERMISSION  ACT: No invented liabilities, fictional payment totals or fabricated government data  EXPECT: No invented liabilities, fictional payment totals or fabricated government data
US-095-T03  RECOVERY / RETRY  ACT: Reload after failed integration and retain truthful empty/loading/error distinction  EXPECT: Reload after failed integration and retain truthful empty/loading/error distinction
US-095-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Zero owned saved records remain zero; UI never generates phantom data  EXPECT: Zero owned saved records remain zero; UI never generates phantom data
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-096
**Scope:** OFFICE-ONLY — no implementation

US-096  |  P1  |  APPROVED
STORY  As an Office operator, I want to see an operational alert promptly and recover missed alerts.
EXPECTED  Push or bounded-poll target is documented; focus/reconnect catches backlogs; click opens correct record.
Module: Office/Admin payment views  •  Linked features: F-089
ENTRY  Office/Admin → taxpayer payment details
US-096-T01  SUCCESS  ACT: Office operator receives transaction alert, verifies prompt badge, disconnects and reconnects to recover missed ones  EXPECT: Push or bounded-poll target is documented; focus/reconnect catches backlogs; click opens correct record.
US-096-T02  NEGATIVE / PERMISSION  ACT: Replay must not produce duplicate alert or expose unrelated officer data  EXPECT: Replay must not produce duplicate alert or expose unrelated officer data
US-096-T03  RECOVERY / RETRY  ACT: Reconnect and process queued Office events in original order  EXPECT: Reconnect and process queued Office events in original order
US-096-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original payment event and Office notification IDs/ack timestamps match  EXPECT: Original payment event and Office notification IDs/ack timestamps match
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-097
**Scope:** OFFICE-ONLY — no implementation

US-097  |  P1  |  APPROVED
STORY  As an Office Admin, I want to open the payments behind a chart or report total.
EXPECTED  Click a total to see the matching transactions and amounts; the numbers must agree.
Module: Office/Admin payment views  •  Linked features: F-109, F-111
ENTRY  Office/Admin → taxpayer payment details
US-097-T01  SUCCESS  ACT: Click an Office chart/report aggregate and inspect exact underlying filtered payment rows  EXPECT: Click a total to see the matching transactions and amounts; the numbers must agree.
US-097-T02  NEGATIVE / PERMISSION  ACT: Do not show unrelated source records or row total differing from chart  EXPECT: Do not show unrelated source records or row total differing from chart
US-097-T03  RECOVERY / RETRY  ACT: Refresh after filtering and restore same aggregate/detail relationship  EXPECT: Refresh after filtering and restore same aggregate/detail relationship
US-097-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Chart amount = sum permitted underlying source/Office rows without double parent counting  EXPECT: Chart amount = sum permitted underlying source/Office rows without double parent counting
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-098
**Scope:** OFFICE-ONLY — no implementation

US-098  |  P1  |  APPROVED
STORY  As an Office Admin, I want to inspect payment-linked beneficiary details without browsing private address books.
EXPECTED  Office view displays only payment-derived relations and permitted tags; owner-only address book is not mass-exposed.
Module: Office/Admin payment views  •  Linked features: F-064, F-107
ENTRY  Office/Admin → taxpayer payment details
US-098-T01  SUCCESS  ACT: Open authorized Office payment-linked payer/recipient relationship information for one verified taxpayer  EXPECT: Office view displays only payment-derived relations and permitted tags; owner-only address book is not mass-exposed.
US-098-T02  NEGATIVE / PERMISSION  ACT: Do not reveal private saved-beneficiary address-book tags/lists not supported by payment-linked records  EXPECT: Do not reveal private saved-beneficiary address-book tags/lists not supported by payment-linked records
US-098-T03  RECOVERY / RETRY  ACT: Close/reopen taxpayer details and retain authorized allocation links  EXPECT: Close/reopen taxpayer details and retain authorized allocation links
US-098-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Only payment-derived relationship IDs and amounts from SQL, not private list IDs  EXPECT: Only payment-derived relationship IDs and amounts from SQL, not private list IDs
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-099
**Scope:** OFFICE-ONLY — no implementation

US-099  |  P1  |  APPROVED
STORY  As an Office Admin, I want to filter taxpayers by paid-for-me, paid-for-others and self payment.
EXPECTED  Taxpayer 360 treats payer and recipient distinct and supports date, assessment year, service, amount, receipt links.
Module: Office/Admin payment views  •  Linked features: F-107
ENTRY  Office/Admin → taxpayer payment details
US-099-T01  SUCCESS  ACT: Filter taxpayer 360 between paid-by-me, paid-for-me and self categories  EXPECT: Taxpayer 360 treats payer and recipient distinct and supports date, assessment year, service, amount, receipt links.
US-099-T02  NEGATIVE / PERMISSION  ACT: Do not misattribute same parent to wrong payer/recipient category  EXPECT: Do not misattribute same parent to wrong payer/recipient category
US-099-T03  RECOVERY / RETRY  ACT: Toggle category then return and keep source-backed counts stable  EXPECT: Toggle category then return and keep source-backed counts stable
US-099-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Classification derived from payer vs recipient source IDs and allocation shares  EXPECT: Classification derived from payer vs recipient source IDs and allocation shares
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-100
**Scope:** OFFICE-ONLY — no implementation

US-100  |  P1  |  APPROVED
STORY  As an Office analyst, I want to export matching and exception reports.
EXPECTED  Exports show outstanding delivery, correction backlog, mismatched payment lines and resolution timestamps.
Module: Office/Admin payment views  •  Linked features: F-110
ENTRY  Office/Admin → taxpayer payment details
US-100-T01  SUCCESS  ACT: Export Office matching/missing/exception report for a selected reconciliation time window  EXPECT: Exports show outstanding delivery, correction backlog, mismatched payment lines and resolution timestamps.
US-100-T02  NEGATIVE / PERMISSION  ACT: Export may not hide unresolved exception IDs or falsely mark them resolved  EXPECT: Export may not hide unresolved exception IDs or falsely mark them resolved
US-100-T03  RECOVERY / RETRY  ACT: Retry interrupted export; reproduce same source snapshot version  EXPECT: Retry interrupted export; reproduce same source snapshot version
US-100-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Exception reference, mismatch type, observed values, timestamps and resolution state in output  EXPECT: Exception reference, mismatch type, observed values, timestamps and resolution state in output
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-101
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-101  |  P1  |  APPROVED
STORY  As a taxpayer, I want only my own payment, beneficiary and correction records.
EXPECTED  Keep the existing account boundaries; no additional login or security feature is requested.
Module: Data continuity and performance  •  Linked features: F-025, F-063, F-088, F-124
ENTRY  Existing citizen/Office screen for the stated role and capability
US-101-T01  SUCCESS  ACT: Switch taxpayer account A→B and inspect payment, beneficiary, correction and notification lists  EXPECT: Keep the existing account boundaries; no additional login or security feature is requested.
US-101-T02  NEGATIVE / PERMISSION  ACT: Never show A's private rows in B or via direct URL  EXPECT: Never show A's private rows in B or via direct URL
US-101-T03  RECOVERY / RETRY  ACT: Refresh every account-bound view after sign out; cached data purged correctly  EXPECT: Refresh every account-bound view after sign out; cached data purged correctly
US-101-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Existing account/RLS owner fields and denial tests for all private resources  EXPECT: Existing account/RLS owner fields and denial tests for all private resources
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-102
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-102  |  P1  |  APPROVED
STORY  As a taxpayer, I want my personal details kept within my proper account.
EXPECTED  Continue using existing access rules; do not introduce new sign-in or verification steps.
Module: Data continuity and performance  •  Linked features: F-124
ENTRY  Existing citizen/Office screen for the stated role and capability
US-102-T01  SUCCESS  ACT: Access only current account's TIN profile, phone, email and masked fields via authorized login  EXPECT: Continue using existing access rules; do not introduce new sign-in or verification steps.
US-102-T02  NEGATIVE / PERMISSION  ACT: Typing an unrelated TIN must not grant another account's registration profile  EXPECT: Typing an unrelated TIN must not grant another account's registration profile
US-102-T03  RECOVERY / RETRY  ACT: Logout then login another authorized account, no stale profile values  EXPECT: Logout then login another authorized account, no stale profile values
US-102-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Server-side account/TIN binding, no unauthorized session cache or data exposure  EXPECT: Server-side account/TIN binding, no unauthorized session cache or data exposure
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-103
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-103  |  P1  |  APPROVED
STORY  As an Office user, I want Office and taxpayer records to remain separate.
EXPECTED  Keep the existing Office account system and do not use a taxpayer login to open Office data.
Module: Data continuity and performance  •  Linked features: F-064, F-112, F-120, F-124, F-130
ENTRY  Existing citizen/Office screen for the stated role and capability
US-103-T01  SUCCESS  ACT: Open matched taxpayer/Office payment reference and verify two independent databases and roles  EXPECT: Keep the existing Office account system and do not use a taxpayer login to open Office data.
US-103-T02  NEGATIVE / PERMISSION  ACT: Do not reuse Taxpayer login in Office or silently switch the production DB to clone  EXPECT: Do not reuse Taxpayer login in Office or silently switch the production DB to clone
US-103-T03  RECOVERY / RETRY  ACT: Reconnect each integration independently after service interruption  EXPECT: Reconnect each integration independently after service interruption
US-103-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Separate immutable project refs, auth contexts, common source payment IDs and mirrored financial fields  EXPECT: Separate immutable project refs, auth contexts, common source payment IDs and mirrored financial fields
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-107
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-107  |  P1  |  APPROVED
STORY  As a payer, I want all valid beneficiary, tax head and assessment year combinations to work.
EXPECTED  Self/others, guest/logged-in, single/multiple heads, years, edits and receipts stay correct, and Office shows each allocation accurately.
Module: Data continuity and performance  •  Linked features: F-029, F-033, F-137, F-126
ENTRY  Existing citizen/Office screen for the stated role and capability
US-107-T01  SUCCESS  ACT: Exercise full allowed self/others × multiple non-Return heads × multiple AYs and exclusive Return invalid combinations  EXPECT: Self/others, guest/logged-in, single/multiple heads, years, edits and receipts stay correct, and Office shows each allocation accurately.
US-107-T02  NEGATIVE / PERMISSION  ACT: Do not block allowed non-Return combos or permit Return with another beneficiary/head/year  EXPECT: Do not block allowed non-Return combos or permit Return with another beneficiary/head/year
US-107-T03  RECOVERY / RETRY  ACT: Back/edit/retry a complex batch; only one parent and no duplicate allocation  EXPECT: Back/edit/retry a complex batch; only one parent and no duplicate allocation
US-107-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Frontend validation, source SQL, Office SQL, receipt and certificate show same allowed matrix  EXPECT: Frontend validation, source SQL, Office SQL, receipt and certificate show same allowed matrix
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-108
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-108  |  P1  |  APPROVED
STORY  As a taxpayer, I want payment journeys to work properly in English and Bangla on phone and desktop.
EXPECTED  Existing navigation, forms, receipt tables, modals and back buttons stay usable and match the approved design.
Module: Data continuity and performance  •  Linked features: F-165, F-130, F-122
ENTRY  Existing citizen/Office screen for the stated role and capability
US-108-T01  SUCCESS  ACT: Complete changed core guest/signed-in payment journeys in EN and BN on mobile and desktop  EXPECT: Existing navigation, forms, receipt tables, modals and back buttons stay usable and match the approved design.
US-108-T02  NEGATIVE / PERMISSION  ACT: No missing button, untranslated error, lost form value or mobile navigation regression  EXPECT: No missing button, untranslated error, lost form value or mobile navigation regression
US-108-T03  RECOVERY / RETRY  ACT: Switch language mid-form and refresh while retaining approved content and draft  EXPECT: Switch language mid-form and refresh while retaining approved content and draft
US-108-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Same underlying payment/draft IDs and values across language/viewport variants  EXPECT: Same underlying payment/draft IDs and values across language/viewport variants
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-109
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-109  |  P1  |  APPROVED
STORY  As a taxpayer with many payments, I want my history and beneficiary search to remain fast.
EXPECTED  Filtering and opening the correct records works as the data grows.
Module: Data continuity and performance  •  Linked features: F-125
ENTRY  Existing citizen/Office screen for the stated role and capability
US-109-T01  SUCCESS  ACT: With representative allowed larger list inspect search/filter/pagination responsiveness for payment history and beneficiaries  EXPECT: Filtering and opening the correct records works as the data grows.
US-109-T02  NEGATIVE / PERMISSION  ACT: No stale cache after add/edit/delete or wrong account rows shown  EXPECT: No stale cache after add/edit/delete or wrong account rows shown
US-109-T03  RECOVERY / RETRY  ACT: Return after tab/sort/refresh and observe newest persisted values  EXPECT: Return after tab/sort/refresh and observe newest persisted values
US-109-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Correct source query result identity/order and measurable reproducible performance baseline  EXPECT: Correct source query result identity/order and measurable reproducible performance baseline
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-110
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-110  |  P1  |  APPROVED
STORY  As an Office Admin, I want the current Sohojkor payment database to stay the source of truth.
EXPECTED  Keep the separate replacement copy unused and avoid mixing old and new databases.
Module: Taxpayer-to-Office records  •  Linked features: F-120
ENTRY  Sohojkor SQL → Office SQL → Admin
US-110-T01  SUCCESS  ACT: Check production Taxpayer SQL project reference and compare source payment record to Office mirror  EXPECT: Keep the separate replacement copy unused and avoid mixing old and new databases.
US-110-T02  NEGATIVE / PERMISSION  ACT: Do not write to historical clone or replace original Taxpayer DB endpoint  EXPECT: Do not write to historical clone or replace original Taxpayer DB endpoint
US-110-T03  RECOVERY / RETRY  ACT: After connection loss restore original source link and observe correct records  EXPECT: After connection loss restore original source link and observe correct records
US-110-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Exact original project reference, schema/table contract and mirrored IDs  EXPECT: Exact original project reference, schema/table contract and mirrored IDs
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-111
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-111  |  P1  |  APPROVED
STORY  As an Office Admin, I want published content and payment data to match the source records.
EXPECTED  Display any missing or conflicting information rather than replacing it with made-up data.
Module: Taxpayer-to-Office records  •  Linked features: F-121, F-126
ENTRY  Sohojkor SQL → Office SQL → Admin
US-111-T01  SUCCESS  ACT: Compare Office-published content and Taxpayer live banner plus source-linked payment data in both frontends  EXPECT: Display any missing or conflicting information rather than replacing it with made-up data.
US-111-T02  NEGATIVE / PERMISSION  ACT: No static fake banner or payment data should override verified source content  EXPECT: No static fake banner or payment data should override verified source content
US-111-T03  RECOVERY / RETRY  ACT: Invalidate stale cache and reload both applications, retaining published and source versions  EXPECT: Invalidate stale cache and reload both applications, retaining published and source versions
US-111-T04  PERSISTENCE / CROSS-SYSTEM  ACT: CMS version and payment source events match respective Office/public views  EXPECT: CMS version and payment source events match respective Office/public views
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-112
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-112  |  P1  |  APPROVED
STORY  As an Office Admin, I want to see whether payment syncing is up to date.
EXPECTED  Show recent successful syncs and outstanding mismatches.
Module: Taxpayer-to-Office records  •  Linked features: F-117, F-120
ENTRY  Sohojkor SQL → Office SQL → Admin
US-112-T01  SUCCESS  ACT: Open permitted sync health/exception view and inspect delivery watermark or pending outbox  EXPECT: Show recent successful syncs and outstanding mismatches.
US-112-T02  NEGATIVE / PERMISSION  ACT: Do not claim 100% from a handful of matching demo rows or queued delivery  EXPECT: Do not claim 100% from a handful of matching demo rows or queued delivery
US-112-T03  RECOVERY / RETRY  ACT: Resume interrupted bridge and observe pending item transition through Office receipt  EXPECT: Resume interrupted bridge and observe pending item transition through Office receipt
US-112-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Source and Office high-water marks, outstanding IDs and exact parity readback  EXPECT: Source and Office high-water marks, outstanding IDs and exact parity readback
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-113
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-113  |  P2  |  APPROVED
STORY  As a user, I want to operate all forms using keyboard and assistive technology.
EXPECTED  Form labels, focus order, accessible names, error summary, modal focus and reduced motion are checked.
Module: Data continuity and performance  •  Linked features: F-123
ENTRY  Existing citizen/Office screen for the stated role and capability
US-113-T01  SUCCESS  ACT: Navigate representative forms/modal/errors entirely by keyboard and assistive roles in EN and BN  EXPECT: Form labels, focus order, accessible names, error summary, modal focus and reduced motion are checked.
US-113-T02  NEGATIVE / PERMISSION  ACT: Focus must not trap outside approved modal, hide error or skip required control  EXPECT: Focus must not trap outside approved modal, hide error or skip required control
US-113-T03  RECOVERY / RETRY  ACT: Open/close modal with Escape/back and verify return focus and retained form data  EXPECT: Open/close modal with Escape/back and verify return focus and retained form data
US-113-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Accessibility checks and unchanged business data on keyboard-only journeys  EXPECT: Accessibility checks and unchanged business data on keyboard-only journeys
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-115
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-115  |  P1  |  APPROVED
STORY  As a taxpayer, I want previously working payments, receipts and drafts to remain intact.
EXPECTED  Changes to other areas do not erase my records or change approved payment behavior.
Module: Data continuity and performance  •  Linked features: F-080, F-129, F-130
ENTRY  Existing citizen/Office screen for the stated role and capability
US-115-T01  SUCCESS  ACT: Replay focused previously PASS payment, receipt, Pay Again and draft regressions after new fix  EXPECT: Changes to other areas do not erase my records or change approved payment behavior.
US-115-T02  NEGATIVE / PERMISSION  ACT: No fixed journey or approved UI must disappear/duplicate after unrelated patch  EXPECT: No fixed journey or approved UI must disappear/duplicate after unrelated patch
US-115-T03  RECOVERY / RETRY  ACT: Reload in guest and signed-in contexts and compare baseline acceptance evidence  EXPECT: Reload in guest and signed-in contexts and compare baseline acceptance evidence
US-115-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Previously accepted IDs, tests and screenshot state retained on targeted dependencies  EXPECT: Previously accepted IDs, tests and screenshot state retained on targeted dependencies
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-116
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-116  |  P1  |  APPROVED
STORY  As a guest or signed-in traveller, I want to start the dedicated Travel Tax process from public services or Tax Pay menu.
EXPECTED  Correct form loads without forcing login for guest; desktop and mobile navigation stays in current approved process.
Module: Travel Tax — separate journey  •  Linked features: F-044, F-144
ENTRY  Pay Travel Tax → passenger journey
US-116-T01  SUCCESS  ACT: Enter existing Travel Tax via public service or Pay Tax menu and follow its dedicated four steps  EXPECT: Correct form loads without forcing login for guest; desktop and mobile navigation stays in current approved process.
US-116-T02  NEGATIVE / PERMISSION  ACT: Do not navigate to ordinary Tax/duplicate wizard or demand login for guest  EXPECT: Do not navigate to ordinary Tax/duplicate wizard or demand login for guest
US-116-T03  RECOVERY / RETRY  ACT: Back to home then reopen Travel Tax without losing unrelated browser state  EXPECT: Back to home then reopen Travel Tax without losing unrelated browser state
US-116-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Correct established route and permitted form/draft data, no new payment path  EXPECT: Correct established route and permitted form/draft data, no new payment path
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-117
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-117  |  P1  |  APPROVED
STORY  As a traveller, I want to enter required travel, passport, passenger and route details.
EXPECTED  Validation covers passport, nationality, departure and applicable passenger fields with useful focus and error messages.
Module: Travel Tax — separate journey  •  Linked features: F-041, F-042
ENTRY  Pay Travel Tax → passenger journey
US-117-T01  SUCCESS  ACT: Enter travel route, date and each passenger's required passport/identity details in existing form  EXPECT: Validation covers passport, nationality, departure and applicable passenger fields with useful focus and error messages.
US-117-T02  NEGATIVE / PERMISSION  ACT: Reject invalid passport, nationality, route or incomplete passenger without dropping valid companions  EXPECT: Reject invalid passport, nationality, route or incomplete passenger without dropping valid companions
US-117-T03  RECOVERY / RETRY  ACT: Back to passenger step and correct invalid field while retaining others  EXPECT: Back to passenger step and correct invalid field while retaining others
US-117-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Persist/review exactly typed valid passenger fields in existing Travel Tax draft/submission  EXPECT: Persist/review exactly typed valid passenger fields in existing Travel Tax draft/submission
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-118
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-118  |  P1  |  APPROVED
STORY  As a traveller, I want to confirm one or more passengers on a Travel Tax payment.
EXPECTED  All selected passenger details and individual amounts match one recorded receipt, and no duplicate traveller is added by back/forward.
Module: Travel Tax — separate journey  •  Linked features: F-041, F-152
ENTRY  Pay Travel Tax → passenger journey
US-118-T01  SUCCESS  ACT: Add two or more passengers, review each and confirm grouped Travel Tax payment  EXPECT: All selected passenger details and individual amounts match one recorded receipt, and no duplicate traveller is added by back/forward.
US-118-T02  NEGATIVE / PERMISSION  ACT: Reject duplicate passport or invalid one-person total across passengers  EXPECT: Reject duplicate passport or invalid one-person total across passengers
US-118-T03  RECOVERY / RETRY  ACT: Edit passenger list then return to review without losing confirmations  EXPECT: Edit passenger list then return to review without losing confirmations
US-118-T04  PERSISTENCE / CROSS-SYSTEM  ACT: One payment parent, every confirmed passenger allocation and exact summed total  EXPECT: One payment parent, every confirmed passenger allocation and exact summed total
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-119
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-119  |  P1  |  APPROVED
STORY  As a traveller, I want to view Travel Tax records and receipts in my correct history.
EXPECTED  Recorded Travel Tax transaction appears in permitted account/session views and Office mirror with the same reference and details.
Module: Travel Tax — separate journey  •  Linked features: F-162
ENTRY  Pay Travel Tax → passenger journey
US-119-T01  SUCCESS  ACT: Complete permitted Travel Tax and find original receipt/certificate in correct guest or signed-in history  EXPECT: Recorded Travel Tax transaction appears in permitted account/session views and Office mirror with the same reference and details.
US-119-T02  NEGATIVE / PERMISSION  ACT: Do not show another person's travel/passport data based only on reference search  EXPECT: Do not show another person's travel/passport data based only on reference search
US-119-T03  RECOVERY / RETRY  ACT: Reload permitted Travel Tax history and retrieve same original payment/documents  EXPECT: Reload permitted Travel Tax history and retrieve same original payment/documents
US-119-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Stable original payment ID, linked receipt/certificate and actor/session entitlement  EXPECT: Stable original payment ID, linked receipt/certificate and actor/session entitlement
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-120
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-120  |  P1  |  APPROVED
STORY  As a traveller, I want to avoid unnecessary email collection in the Travel Tax process.
EXPECTED  Travel Tax does not require or introduce an email field unless specifically approved; existing receipt fields remain intact.
Module: Travel Tax — separate journey  •  Linked features: F-157
ENTRY  Pay Travel Tax → passenger journey
US-120-T01  SUCCESS  ACT: Open Travel Tax form and complete contact details with required mobile but no email  EXPECT: Travel Tax does not require or introduce an email field unless specifically approved; existing receipt fields remain intact.
US-120-T02  NEGATIVE / PERMISSION  ACT: Email must never be mandatory or fabricated from unrelated profile  EXPECT: Email must never be mandatory or fabricated from unrelated profile
US-120-T03  RECOVERY / RETRY  ACT: Back from review to contact and retain mobile with empty email  EXPECT: Back from review to contact and retain mobile with empty email
US-120-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Stored validated mobile/contact and no forced email field in payload  EXPECT: Stored validated mobile/contact and no forced email field in payload
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-121
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-121  |  P1  |  APPROVED
STORY  As a traveller, I want to see clearly marked illustrative Travel Tax rates until official integration.
EXPECTED  screen/receipt never claims a sample rate or reference establishes official tax liability; external rate integrations remain future scope.
Module: Travel Tax — separate journey  •  Linked features: F-151
ENTRY  Pay Travel Tax → passenger journey
US-121-T01  SUCCESS  ACT: Show currently configured illustrative Travel Tax amount with clear source limitations in reference context  EXPECT: screen/receipt never claims a sample rate or reference establishes official tax liability; external rate integrations remain future scope.
US-121-T02  NEGATIVE / PERMISSION  ACT: Do not claim official passport/port/rate confirmation without connected verified source  EXPECT: Do not claim official passport/port/rate confirmation without connected verified source
US-121-T03  RECOVERY / RETRY  ACT: Recompute after passenger edits while keeping clearly scoped example  EXPECT: Recompute after passenger edits while keeping clearly scoped example
US-121-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Displayed amount originates in approved local reference mapping, not fake official endpoint  EXPECT: Displayed amount originates in approved local reference mapping, not fake official endpoint
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-122
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-122  |  P1  |  APPROVED
STORY  As a signed-in taxpayer, I want sign-out to work properly.
EXPECTED  My private history, beneficiary lists and notices are not shown to the next signed-in account.
Module: Sign-in and taxpayer profile  •  Linked features: F-017, F-063
ENTRY  Existing sign-in → taxpayer profile
US-122-T01  SUCCESS  ACT: Sign into taxpayer A, open private account; sign out and sign into B, inspect no A data remains  EXPECT: My private history, beneficiary lists and notices are not shown to the next signed-in account.
US-122-T02  NEGATIVE / PERMISSION  ACT: Reject reuse of stale A token or cached private data after logout  EXPECT: Reject reuse of stale A token or cached private data after logout
US-122-T03  RECOVERY / RETRY  ACT: Refresh protected page after sign-out, route to existing safe sign-in state  EXPECT: Refresh protected page after sign-out, route to existing safe sign-in state
US-122-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Session invalidated and account-isolation query denies A data to B  EXPECT: Session invalidated and account-isolation query denies A data to B
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-123
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-123  |  P1  |  APPROVED
STORY  As a payer, I want saved TIN details and example suggestions to be clearly different.
EXPECTED  Saved entries show existing saved names; example suggestions are not shown as official verified records.
Module: Taxpayer TIN lookup  •  Linked features: F-136
ENTRY  Pay Tax → taxpayer TIN lookup
US-123-T01  SUCCESS  ACT: In TIN lookup distinguish saved verified beneficiary matches from example suggestion and explicit fallback search  EXPECT: Saved entries show existing saved names; example suggestions are not shown as official verified records.
US-123-T02  NEGATIVE / PERMISSION  ACT: Sample profile selection must not grant private account access or claim true TIN certificate  EXPECT: Sample profile selection must not grant private account access or claim true TIN certificate
US-123-T03  RECOVERY / RETRY  ACT: Clear input, retry fallback lookup and preserve chosen verified identity only  EXPECT: Clear input, retry fallback lookup and preserve chosen verified identity only
US-123-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Sample metadata vs verified lookup flag remain distinct; no account binding by suggestion  EXPECT: Sample metadata vs verified lookup flag remain distinct; no account binding by suggestion
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-124
**Scope:** OFFICE-ONLY — no implementation

US-124  |  P2  |  APPROVED
STORY  As an Office content editor, I want the current CMS login and logout to work.
EXPECTED  Use the existing Office session to publish content; do not add a new login or approval workflow.
Module: Homepage & payment record search  •  Linked features: F-112
ENTRY  Office CMS → public homepage banner
US-124-T01  SUCCESS  ACT: Use existing Office CMS login and logout then navigate back to a protected edit route  EXPECT: Use the existing Office session to publish content; do not add a new login or approval workflow.
US-124-T02  NEGATIVE / PERMISSION  ACT: Cannot publish while logged out or show previous Office session data  EXPECT: Cannot publish while logged out or show previous Office session data
US-124-T03  RECOVERY / RETRY  ACT: Sign in again via existing Office auth and resume authorized CMS view  EXPECT: Sign in again via existing Office auth and resume authorized CMS view
US-124-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Existing Office session permissions/auth and content version unchanged  EXPECT: Existing Office session permissions/auth and content version unchanged
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-125
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-125  |  P1  |  APPROVED
STORY  As a payer, I want one place to find every beneficiary I have saved.
EXPECTED  All Beneficiaries includes every owned list/member; name, TIN, tag, relationship and list filtering share one clear toolbar on desktop/mobile. Open the correct beneficiary profile and actions.
Module: Beneficiaries and lists  •  Linked features: F-055, F-056, F-061
ENTRY  Beneficiaries → list → person
US-125-T01  SUCCESS  ACT: Open All Beneficiaries and inspect all owner-owned entries from all lists with one search/filter toolbar  EXPECT: All Beneficiaries includes every owned list/member; name, TIN, tag, relationship and list filtering share one clear toolbar on desktop/mobile. Open the correct beneficiary profile and actions.
US-125-T02  NEGATIVE / PERMISSION  ACT: Do not lose people in hidden list or mix another account's saved people  EXPECT: Do not lose people in hidden list or mix another account's saved people
US-125-T03  RECOVERY / RETRY  ACT: Refresh after list move/edit and restore complete owned aggregate  EXPECT: Refresh after list move/edit and restore complete owned aggregate
US-125-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Owned beneficiary IDs across all lists equal displayed total and filter results  EXPECT: Owned beneficiary IDs across all lists equal displayed total and filter results
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-126
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-126  |  P1  |  APPROVED
STORY  As an Other Tax payer, I want to return to a previous payment step without losing valid taxpayer/head/year lines.
EXPECTED  Back navigation and modal changes preserve all confirmed selections; totals and final receipt are identical after resuming.
Module: Other Tax, Advance Tax & Source Tax  •  Linked features: F-036
ENTRY  Pay Tax → Other Tax / walk-in
US-126-T01  SUCCESS  ACT: From multi-step ordinary payment press Back, change prior beneficiary/head/year, then continue and review  EXPECT: Back navigation and modal changes preserve all confirmed selections; totals and final receipt are identical after resuming.
US-126-T02  NEGATIVE / PERMISSION  ACT: No entered valid rows or draft must be lost on Back or arbitrary card remount  EXPECT: No entered valid rows or draft must be lost on Back or arbitrary card remount
US-126-T03  RECOVERY / RETRY  ACT: Reopen form after navigating backward and forward; inputs retain exact values  EXPECT: Reopen form after navigating backward and forward; inputs retain exact values
US-126-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Review payload and stored draft reflect latest selected fields, not stale state  EXPECT: Review payload and stored draft reflect latest selected fields, not stale state
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-127
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-127  |  P1  |  APPROVED
STORY  As a taxpayer, I want external-system dashboard panels to appear only when actual data is available.
EXPECTED  If the external read fails, has no data or cannot be verified, hide the whole first row and move the following dashboard row up with no blank placeholder.
Module: Taxpayer dashboard  •  Linked features: F-131
ENTRY  Signed-in taxpayer → existing dashboard bento cards
US-127-T01  SUCCESS  ACT: Load dashboard with successful empty or failed external source response and verify first row disappears and content shifts up  EXPECT: If the external read fails, has no data or cannot be verified, hide the whole first row and move the following dashboard row up with no blank placeholder.
US-127-T02  NEGATIVE / PERMISSION  ACT: Never show placeholder external balances/zeroed values as actual fetched results  EXPECT: Never show placeholder external balances/zeroed values as actual fetched results
US-127-T03  RECOVERY / RETRY  ACT: Restore external source and reload; row reappears only with verified nonempty data  EXPECT: Restore external source and reload; row reappears only with verified nonempty data
US-127-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Render condition tied to actual fetch status+rows; internal account metrics unaffected  EXPECT: Render condition tied to actual fetch status+rows; internal account metrics unaffected
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-128
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-128  |  P1  |  APPROVED
STORY  As a taxpayer, I want dashboard indicators for Completed Payments, Saved Drafts and Correction Requests.
EXPECTED  Replace Failed, Pending, Unmatched and Requests in that dashboard area; show a separate Correction Requests section with the correct account-specific data.
Module: Taxpayer dashboard  •  Linked features: F-099
ENTRY  Signed-in taxpayer → existing dashboard bento cards
US-128-T01  SUCCESS  ACT: Inspect dashboard metric cards showing Completed Payments, Saved Drafts and Correction Requests, then open each list  EXPECT: Replace Failed, Pending, Unmatched and Requests in that dashboard area; show a separate Correction Requests section with the correct account-specific data.
US-128-T02  NEGATIVE / PERMISSION  ACT: No Failed/Pending/Unmatched substitution or count from nonexistent records  EXPECT: No Failed/Pending/Unmatched substitution or count from nonexistent records
US-128-T03  RECOVERY / RETRY  ACT: Return from each detailed view, refetch and preserve correct three cards  EXPECT: Return from each detailed view, refetch and preserve correct three cards
US-128-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Three card queries and drill-down counts match corresponding owner-specific saved tables  EXPECT: Three card queries and drill-down counts match corresponding owner-specific saved tables
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-129
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-129  |  P1  |  APPROVED
STORY  As a taxpayer, I want a separate Tax Credit Certificates menu to view and download available certificates.
EXPECTED  The Tax Credit Certificates menu shows genuine available eligible credit certificates; ordinary successful payments always have separate downloadable payment certificates in their payment detail/history.
Module: Receipts, certificates and ledger  •  Linked features: F-132
ENTRY  Payment record → receipt / certificates
US-129-T01  SUCCESS  ACT: Open dedicated Tax Credit Certificates menu and view/download only source-proven available tax-credit records  EXPECT: The Tax Credit Certificates menu shows genuine available eligible credit certificates; ordinary successful payments always have separate downloadable payment certificates in their payment detail/history.
US-129-T02  NEGATIVE / PERMISSION  ACT: Never label auto-generated Sohojkor Payment Certificate an official tax-credit certificate  EXPECT: Never label auto-generated Sohojkor Payment Certificate an official tax-credit certificate
US-129-T03  RECOVERY / RETRY  ACT: Refresh from offline/unavailable official source; show truthful unavailable/empty state  EXPECT: Refresh from offline/unavailable official source; show truthful unavailable/empty state
US-129-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Document type and entitlement metadata distinguish official source from internal payment docs  EXPECT: Document type and entitlement metadata distinguish official source from internal payment docs
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-130
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-130  |  P2  |  APPROVED
STORY  As a visitor, I want Travel Tax under the Pay Tax dropdown.
EXPECTED  Desktop and mobile show Travel Tax within Pay Tax, not in duplicate top-level navigation; it opens the existing separate Travel Tax process.
Module: Travel Tax — separate journey  •  Linked features: F-133
ENTRY  Pay Tax dropdown → Travel Tax
US-130-T01  SUCCESS  ACT: Open Pay Tax dropdown overlay and choose separate Travel Tax existing destination without expanding sidebar layout  EXPECT: Desktop and mobile show Travel Tax within Pay Tax, not in duplicate top-level navigation; it opens the existing separate Travel Tax process.
US-130-T02  NEGATIVE / PERMISSION  ACT: Do not create extra top-level Travel Tax nav or redirect into ordinary Tax form  EXPECT: Do not create extra top-level Travel Tax nav or redirect into ordinary Tax form
US-130-T03  RECOVERY / RETRY  ACT: Close overlay and reopen, preserving nav position and selected route  EXPECT: Close overlay and reopen, preserving nav position and selected route
US-130-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Menu action maps to existing separate Travel Tax route; no layout change  EXPECT: Menu action maps to existing separate Travel Tax route; no layout change
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-131
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-131  |  P1  |  APPROVED
STORY  As a payer, I want a clear beneficiary name, tag and TIN display.
EXPECTED  First line is “Taxpayer name · Final tag”; second line is TIN digits only. Do not repeat the relationship, label or TIN prefix.
Module: Beneficiaries and lists  •  Linked features: F-134
ENTRY  Beneficiaries → list → person
US-131-T01  SUCCESS  ACT: Open beneficiary row/profile and confirm first line 'name · final tag', second line TIN digits only  EXPECT: First line is “Taxpayer name · Final tag”; second line is TIN digits only. Do not repeat the relationship, label or TIN prefix.
US-131-T02  NEGATIVE / PERMISSION  ACT: Do not duplicate relationship text or add 'TIN:' prefix contrary to approved display  EXPECT: Do not duplicate relationship text or add 'TIN:' prefix contrary to approved display
US-131-T03  RECOVERY / RETRY  ACT: Rename tag and refresh; rendered one final tag updates without losing record  EXPECT: Rename tag and refresh; rendered one final tag updates without losing record
US-131-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Stored latest beneficiary tag/TIN and display order match approved existing component  EXPECT: Stored latest beneficiary tag/TIN and display order match approved existing component
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-132
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-132  |  P1  |  APPROVED
STORY  As a payer, I want saved-beneficiary-first search and a safe fallback lookup for a new TIN.
EXPECTED  Exact saved match shows saved name; otherwise offer explicit TIN lookup and confirmation; preserve the approved 30 sample suggestions without treating them as checked government profiles.
Module: Taxpayer TIN lookup  •  Linked features: F-019, F-020, F-136
ENTRY  Pay Tax → taxpayer TIN lookup
US-132-T01  SUCCESS  ACT: In payment TIN selector type saved beneficiary; see saved match first; for absent match use explicit TIN fallback and confirm  EXPECT: Exact saved match shows saved name; otherwise offer explicit TIN lookup and confirmation; preserve the approved 30 sample suggestions without treating them as checked government profiles.
US-132-T02  NEGATIVE / PERMISSION  ACT: Do not confuse 30 example suggestions with verified TIN match or private list membership  EXPECT: Do not confuse 30 example suggestions with verified TIN match or private list membership
US-132-T03  RECOVERY / RETRY  ACT: Recover failed fallback request and confirm correct taxpayer without auto-saving  EXPECT: Recover failed fallback request and confirm correct taxpayer without auto-saving
US-132-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Selected TIN/person is explicit and owned saved/fallback status retained correctly  EXPECT: Selected TIN/person is explicit and owned saved/fallback status retained correctly
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-133
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-133  |  P1  |  APPROVED
STORY  As a payer, I want Pay Again attached to an individual paid transaction, not a table filter.
EXPECTED  Row action reconstructs full owned multi-person/head/year batch, allows edits/add/removes, keeps current assessment year 2026–27 and requires explicit noncurrent years.
Module: Payment history, beneficiary profile and Pay Again  •  Linked features: F-071, F-073, F-138
ENTRY  Payment History → beneficiary profile
US-133-T01  SUCCESS  ACT: Click Pay Again on an individual completed payment row, inspect full editable original batch and submit a new one  EXPECT: Row action reconstructs full owned multi-person/head/year batch, allows edits/add/removes, keeps current assessment year 2026–27 and requires explicit noncurrent years.
US-133-T02  NEGATIVE / PERMISSION  ACT: A table filter or row unrelated to paid status must not trigger Pay Again  EXPECT: A table filter or row unrelated to paid status must not trigger Pay Again
US-133-T03  RECOVERY / RETRY  ACT: Return from editing to history and reopen same row; original untouched  EXPECT: Return from editing to history and reopen same row; original untouched
US-133-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original and new payment parent IDs distinct; new lines, AY requirements and documents correct  EXPECT: Original and new payment parent IDs distinct; new lines, AY requirements and documents correct
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-134
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-134  |  P2  |  APPROVED
STORY  As a content Admin, I want the Office banner preview and public Sohojkor banner to look the same.
EXPECTED  Use the same slide image, image-derived light background, dark text/outline button, fixed left content and responsive crop. Taxpayer does not apply extra zoom/crop.
Module: Homepage & payment record search  •  Linked features: F-135
ENTRY  Office CMS → public homepage banner
US-134-T01  SUCCESS  ACT: Compare Office CMS preview and taxpayer published banner across all five slides and EN/BN/mobile states  EXPECT: Use the same slide image, image-derived light background, dark text/outline button, fixed left content and responsive crop. Taxpayer does not apply extra zoom/crop.
US-134-T02  NEGATIVE / PERMISSION  ACT: No extra public crop/zoom, wrong left copy or mismatched color compared with preview  EXPECT: No extra public crop/zoom, wrong left copy or mismatched color compared with preview
US-134-T03  RECOVERY / RETRY  ACT: After public cache refresh compare same Office publish ID again  EXPECT: After public cache refresh compare same Office publish ID again
US-134-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Published image bytes/order/palette/button routes and screenshots agree  EXPECT: Published image bytes/order/palette/button routes and screenshots agree
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-135
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-135  |  P1  |  APPROVED
STORY  As a payer, I want every allowed non-Return payment combination to work correctly.
EXPECTED  Guest and signed-in payment combinations across taxpayers, heads and years preserve original amounts and match receipts and Office payment lines; Return remains exclusive.
Module: Other Tax, Advance Tax & Source Tax  •  Linked features: F-036, F-037, F-137
ENTRY  Pay Tax → Other Tax / walk-in
US-135-T01  SUCCESS  ACT: Execute valid non-Return multi-beneficiary × multiple-head × multiple-AY combination and negative Return matrix  EXPECT: Guest and signed-in payment combinations across taxpayers, heads and years preserve original amounts and match receipts and Office payment lines; Return remains exclusive.
US-135-T02  NEGATIVE / PERMISSION  ACT: Do not limit mixed payment to one legacy enum or generate receipt per head  EXPECT: Do not limit mixed payment to one legacy enum or generate receipt per head
US-135-T03  RECOVERY / RETRY  ACT: Retry combined submission or edit lines before confirm, retaining one parent  EXPECT: Retry combined submission or edit lines before confirm, retaining one parent
US-135-T04  PERSISTENCE / CROSS-SYSTEM  ACT: All allocations and totals, document count and Office mirror correct with idempotency  EXPECT: All allocations and totals, document count and Office mirror correct with idempotency
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-136
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-136  |  P3  |  APPROVED
STORY  As a public visitor, I want step-by-step payment instructions.
EXPECTED  The English and Bangla guide explains Tax with Return, Other Tax, Travel Tax and receipts, with links to working pages.
Module: Homepage & payment record search  •  Linked features: F-002, F-139
ENTRY  Public home → User Guide / Help
US-136-T01  SUCCESS  ACT: From public User Guide choose each existing payment service and follow bilingual step-by-step instructions  EXPECT: The English and Bangla guide explains Tax with Return, Other Tax, Travel Tax and receipts, with links to working pages.
US-136-T02  NEGATIVE / PERMISSION  ACT: No guide may direct to missing wizard or introduce unsupported payment condition  EXPECT: No guide may direct to missing wizard or introduce unsupported payment condition
US-136-T03  RECOVERY / RETRY  ACT: Switch EN/BN mid-guide and return to same selected service page  EXPECT: Switch EN/BN mid-guide and return to same selected service page
US-136-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Published guide version/last-updated and existing real action routes match  EXPECT: Published guide version/last-updated and existing real action routes match
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-137
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-137  |  P3  |  APPROVED
STORY  As a visitor, I want clear answers to common payment questions.
EXPECTED  Show simple English and Bangla explanations and a glossary, with links to existing working services.
Module: Homepage & payment record search  •  Linked features: F-140
ENTRY  Public home → User Guide / Help
US-137-T01  SUCCESS  ACT: Browse FAQ and glossary by topic, switch language and use answers to locate existing payment information  EXPECT: Show simple English and Bangla explanations and a glossary, with links to existing working services.
US-137-T02  NEGATIVE / PERMISSION  ACT: Do not show FAQ section in excluded homepage area or invent official rules  EXPECT: Do not show FAQ section in excluded homepage area or invent official rules
US-137-T03  RECOVERY / RETRY  ACT: Retry missing/empty search with clear no-match and return to catalogue  EXPECT: Retry missing/empty search with clear no-match and return to catalogue
US-137-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Bilingual maintained FAQ content and route stay consistent without account writes  EXPECT: Bilingual maintained FAQ content and route stay consistent without account writes
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-138
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-138  |  P3  |  APPROVED
STORY  As a visitor, I want reliable support contacts and links.
EXPECTED  Show the current support information and any supported official resource links.
Module: Homepage & payment record search  •  Linked features: F-141
ENTRY  Public home → User Guide / Help
US-138-T01  SUCCESS  ACT: From public Help locate approved contacts and official resource links, open safe destination  EXPECT: Show the current support information and any supported official resource links.
US-138-T02  NEGATIVE / PERMISSION  ACT: Do not include broken/unsupported official-looking links or private contact values  EXPECT: Do not include broken/unsupported official-looking links or private contact values
US-138-T03  RECOVERY / RETRY  ACT: Return from external link and continue public Help without forced sign-in  EXPECT: Return from external link and continue public Help without forced sign-in
US-138-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Configured links verified against authoritative approved resource list, no app data mutation  EXPECT: Configured links verified against authoritative approved resource list, no app data mutation
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-139
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-139  |  P3  |  APPROVED
STORY  As a visitor, I want to read the service terms and privacy information.
EXPECTED  Show the available terms and explain the difference between recorded example payments and real government settlement.
Module: Homepage & payment record search  •  Linked features: F-142
ENTRY  Public home → User Guide / Help
US-139-T01  SUCCESS  ACT: Open current public terms/privacy pages and inspect scope and accessible navigation  EXPECT: Show the available terms and explain the difference between recorded example payments and real government settlement.
US-139-T02  NEGATIVE / PERMISSION  ACT: Do not promise unsupported government issuance or expose personal data in public text  EXPECT: Do not promise unsupported government issuance or expose personal data in public text
US-139-T03  RECOVERY / RETRY  ACT: Reload legal page and switch language; maintain readable current content  EXPECT: Reload legal page and switch language; maintain readable current content
US-139-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Published policy version/date and current link navigation consistent  EXPECT: Published policy version/date and current link navigation consistent
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-140
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-140  |  P3  |  APPROVED
STORY  As a visitor, I want the guides to stay current.
EXPECTED  Existing content editors can update the guide text and its last-updated date.
Module: Homepage & payment record search  •  Linked features: F-143
ENTRY  Public home → User Guide / Help
US-140-T01  SUCCESS  ACT: Update existing service guide through approved content owner and show its last-updated date to public  EXPECT: Existing content editors can update the guide text and its last-updated date.
US-140-T02  NEGATIVE / PERMISSION  ACT: Do not mark edited content published before authorized CMS action  EXPECT: Do not mark edited content published before authorized CMS action
US-140-T03  RECOVERY / RETRY  ACT: Recover CMS edit conflict and retain last published guide date/version  EXPECT: Recover CMS edit conflict and retain last published guide date/version
US-140-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office guide publish actor/version and public displayed last-updated date agree  EXPECT: Office guide publish actor/version and public displayed last-updated date agree
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-141
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-141  |  P1  |  APPROVED
STORY  As a guest, I want to open Travel Tax from Pay Tax without logging in.
EXPECTED  The public Pay Tax menu opens the same four-step Travel Tax process without mandatory sign-in.
Module: Travel Tax — separate journey  •  Linked features: F-144, F-133
ENTRY  Pay Travel Tax → passenger journey
US-141-T01  SUCCESS  ACT: From guest Pay Tax overlay choose Travel Tax and progress into existing four-step passenger journey  EXPECT: The public Pay Tax menu opens the same four-step Travel Tax process without mandatory sign-in.
US-141-T02  NEGATIVE / PERMISSION  ACT: No login requirement, wrong ordinary tax route or duplicated menu  EXPECT: No login requirement, wrong ordinary tax route or duplicated menu
US-141-T03  RECOVERY / RETRY  ACT: Back to public home and reopen dedicated Travel Tax route  EXPECT: Back to public home and reopen dedicated Travel Tax route
US-141-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Guest route state and local eligible draft survive without account creation  EXPECT: Guest route state and local eligible draft survive without account creation
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-142
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-142  |  P1  |  APPROVED
STORY  As a signed-in user, I want to open Travel Tax directly from my account.
EXPECTED  Account login stays active; I can return to dashboard and my payment history without a second login.
Module: Travel Tax — separate journey  •  Linked features: F-144, F-133
ENTRY  Pay Travel Tax → passenger journey
US-142-T01  SUCCESS  ACT: From signed-in Pay Tax overlay choose Travel Tax and open same existing passenger flow  EXPECT: Account login stays active; I can return to dashboard and my payment history without a second login.
US-142-T02  NEGATIVE / PERMISSION  ACT: Do not show two inconsistent Travel Tax UIs or drop active account state  EXPECT: Do not show two inconsistent Travel Tax UIs or drop active account state
US-142-T03  RECOVERY / RETRY  ACT: Return to signed-in dashboard and reopen Travel Tax without cross-account leakage  EXPECT: Return to signed-in dashboard and reopen Travel Tax without cross-account leakage
US-142-T04  PERSISTENCE / CROSS-SYSTEM  ACT: One canonical Travel Tax destination and owner-authenticated form state  EXPECT: One canonical Travel Tax destination and owner-authenticated form state
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-143
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-143  |  P1  |  APPROVED
STORY  As a traveller, I want to choose whether I travel by land or water.
EXPECTED  I see the correct port options for the selected travel mode, and changing the mode clears only invalid choices.
Module: Travel Tax — separate journey  •  Linked features: F-145, F-146
ENTRY  Pay Travel Tax → passenger journey
US-143-T01  SUCCESS  ACT: In Travel Tax choose land or water, then inspect compatible port/service options  EXPECT: I see the correct port options for the selected travel mode, and changing the mode clears only invalid choices.
US-143-T02  NEGATIVE / PERMISSION  ACT: Incompatible route/port combination must not be accepted or mislabeled official zone  EXPECT: Incompatible route/port combination must not be accepted or mislabeled official zone
US-143-T03  RECOVERY / RETRY  ACT: Switch mode and return; dependent port resets only when invalid  EXPECT: Switch mode and return; dependent port resets only when invalid
US-143-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Stored route and selected port are compatible and review reflects current choice  EXPECT: Stored route and selected port are compatible and review reflects current choice
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-144
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-144  |  P1  |  APPROVED
STORY  As a traveller, I want to provide my departure port, destination and travel date.
EXPECTED  I must enter a usable route and travel date and can review these before payment.
Module: Travel Tax — separate journey  •  Linked features: F-146, F-147
ENTRY  Pay Travel Tax → passenger journey
US-144-T01  SUCCESS  ACT: Enter departure port, destination and planned travel date then proceed to passenger details  EXPECT: I must enter a usable route and travel date and can review these before payment.
US-144-T02  NEGATIVE / PERMISSION  ACT: Reject missing/invalid past travel date or port mismatch where form requires it  EXPECT: Reject missing/invalid past travel date or port mismatch where form requires it
US-144-T03  RECOVERY / RETRY  ACT: Back from passenger step and correct route/date without losing valid passengers  EXPECT: Back from passenger step and correct route/date without losing valid passengers
US-144-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Review and draft retain exact selected port/destination/date  EXPECT: Review and draft retain exact selected port/destination/date
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-145
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-145  |  P1  |  APPROVED
STORY  As a traveller paying for a Bangladeshi passenger, I want to use passport information.
EXPECTED  Only labelled sample passport lookups work in this current demonstration system; unknown passports are not falsely checked.
Module: Travel Tax — separate journey  •  Linked features: F-148
ENTRY  Pay Travel Tax → passenger journey
US-145-T01  SUCCESS  ACT: For Bangladeshi passenger provide approved passport, identity and birth date fields then continue  EXPECT: Only labelled sample passport lookups work in this current demonstration system; unknown passports are not falsely checked.
US-145-T02  NEGATIVE / PERMISSION  ACT: Reject incomplete/invalid passport or missing mandatory identity details  EXPECT: Reject incomplete/invalid passport or missing mandatory identity details
US-145-T03  RECOVERY / RETRY  ACT: Edit passport error, preserve other passenger information and continue  EXPECT: Edit passport error, preserve other passenger information and continue
US-145-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Passenger record contains exactly validated BD passport details, no invented verification  EXPECT: Passenger record contains exactly validated BD passport details, no invented verification
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-146
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-146  |  P1  |  APPROVED
STORY  As a traveller paying for a foreign passenger, I want to enter their passport, name, birth date and nationality country.
EXPECTED  The foreign-passenger form checks every required field and retains it when I go back.
Module: Travel Tax — separate journey  •  Linked features: F-149
ENTRY  Pay Travel Tax → passenger journey
US-146-T01  SUCCESS  ACT: For foreign passenger choose nationality country, passport, name and birth date and continue  EXPECT: The foreign-passenger form checks every required field and retains it when I go back.
US-146-T02  NEGATIVE / PERMISSION  ACT: Reject missing nationality or invalid passport without silently changing country  EXPECT: Reject missing nationality or invalid passport without silently changing country
US-146-T03  RECOVERY / RETRY  ACT: Back to identity step and correct foreign nationality/passport  EXPECT: Back to identity step and correct foreign nationality/passport
US-146-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Stored passenger nationality and passport fields match review and final submitted payload  EXPECT: Stored passenger nationality and passport fields match review and final submitted payload
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-147
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-147  |  P1  |  APPROVED
STORY  As a traveller, I want the passenger’s age calculated for the actual travel date.
EXPECTED  A birthday before/after the travel date gives the correct under-five, child or adult bracket.
Module: Travel Tax — separate journey  •  Linked features: F-150
ENTRY  Pay Travel Tax → passenger journey
US-147-T01  SUCCESS  ACT: Enter passenger DOB and actual travel date, verify age derived for that date including boundary birthdays  EXPECT: A birthday before/after the travel date gives the correct under-five, child or adult bracket.
US-147-T02  NEGATIVE / PERMISSION  ACT: Reject impossible DOB or age based on current date instead of travel date  EXPECT: Reject impossible DOB or age based on current date instead of travel date
US-147-T03  RECOVERY / RETRY  ACT: Change travel date and recalculate all dependent ages without losing passengers  EXPECT: Change travel date and recalculate all dependent ages without losing passengers
US-147-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Age/eligibility and input dates in review consistent with existing rule  EXPECT: Age/eligibility and input dates in review consistent with existing rule
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-148
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-148  |  P1  |  APPROVED
STORY  As a traveller, I want to understand how Travel Tax is calculated.
EXPECTED  I see the rate, any age-based reduction, each passenger amount and the final total, clearly labelled as example rates.
Module: Travel Tax — separate journey  •  Linked features: F-151
ENTRY  Pay Travel Tax → passenger journey
US-148-T01  SUCCESS  ACT: View per-passenger Travel Tax amount and total in the current calculation explanation  EXPECT: I see the rate, any age-based reduction, each passenger amount and the final total, clearly labelled as example rates.
US-148-T02  NEGATIVE / PERMISSION  ACT: Do not claim illustrative amount is an official verified government tax rate  EXPECT: Do not claim illustrative amount is an official verified government tax rate
US-148-T03  RECOVERY / RETRY  ACT: Edit passenger age/route and recalculate shown amount transparently  EXPECT: Edit passenger age/route and recalculate shown amount transparently
US-148-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Stored derived amount and explanatory source flag match existing approved mapping  EXPECT: Stored derived amount and explanatory source flag match existing approved mapping
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-149
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-149  |  P1  |  APPROVED
STORY  As a payer, I want to pay for several passengers in one transaction.
EXPECTED  I can add multiple different passengers and get one summary and one linked receipt.
Module: Travel Tax — separate journey  •  Linked features: F-152
ENTRY  Pay Travel Tax → passenger journey
US-149-T01  SUCCESS  ACT: Add multiple distinct Travel Tax passengers, confirm each and review combined total in one payment  EXPECT: I can add multiple different passengers and get one summary and one linked receipt.
US-149-T02  NEGATIVE / PERMISSION  ACT: Duplicate passports or unconfirmed passenger must not proceed  EXPECT: Duplicate passports or unconfirmed passenger must not proceed
US-149-T03  RECOVERY / RETRY  ACT: Remove/edit a passenger after review, update total and keep others  EXPECT: Remove/edit a passenger after review, update total and keep others
US-149-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Exactly one transaction with each confirmed passenger and sum of amounts  EXPECT: Exactly one transaction with each confirmed passenger and sum of amounts
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-150
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-150  |  P1  |  APPROVED
STORY  As a payer, I want to edit or remove passengers before paying.
EXPECTED  I can edit/remove a passenger without duplicate entries; totals recalculate immediately.
Module: Travel Tax — separate journey  •  Linked features: F-153
ENTRY  Pay Travel Tax → passenger journey
US-150-T01  SUCCESS  ACT: Edit or remove one passenger from an existing multi-person Travel Tax draft, then review updated list  EXPECT: I can edit/remove a passenger without duplicate entries; totals recalculate immediately.
US-150-T02  NEGATIVE / PERMISSION  ACT: Removing one must not erase another or leave stale total  EXPECT: Removing one must not erase another or leave stale total
US-150-T03  RECOVERY / RETRY  ACT: Cancel a removal/edit and restore prior valid passenger fields  EXPECT: Cancel a removal/edit and restore prior valid passenger fields
US-150-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Latest draft passengers, count and amount totals match UI  EXPECT: Latest draft passengers, count and amount totals match UI
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-151
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-151  |  P1  |  APPROVED
STORY  As a payer, I want the form to catch duplicate passport numbers and missing information.
EXPECTED  The form blocks duplicate passports, invalid dates and incomplete identity with a clear field-level explanation.
Module: Travel Tax — separate journey  •  Linked features: F-042, F-154
ENTRY  Pay Travel Tax → passenger journey
US-151-T01  SUCCESS  ACT: Enter same passport twice or omit mandatory passenger data; observe field errors before submitting  EXPECT: The form blocks duplicate passports, invalid dates and incomplete identity with a clear field-level explanation.
US-151-T02  NEGATIVE / PERMISSION  ACT: No duplicate passport or incomplete passenger may be accepted  EXPECT: No duplicate passport or incomplete passenger may be accepted
US-151-T03  RECOVERY / RETRY  ACT: Correct affected passport/field and proceed without reentering other passengers  EXPECT: Correct affected passport/field and proceed without reentering other passengers
US-151-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Validated passenger list unique by required passport rules, no duplicate submitted  EXPECT: Validated passenger list unique by required passport rules, no duplicate submitted
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-152
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-152  |  P1  |  APPROVED
STORY  As a payer, I want to confirm every passenger before moving to payment.
EXPECTED  All passengers must be explicitly confirmed; the Back button does not lose entered information.
Module: Travel Tax — separate journey  •  Linked features: F-155
ENTRY  Pay Travel Tax → passenger journey
US-152-T01  SUCCESS  ACT: Inspect each passenger review row and explicitly confirm all before payment step enables  EXPECT: All passengers must be explicitly confirmed; the Back button does not lose entered information.
US-152-T02  NEGATIVE / PERMISSION  ACT: One unchecked passenger prevents advance, without losing current data  EXPECT: One unchecked passenger prevents advance, without losing current data
US-152-T03  RECOVERY / RETRY  ACT: Navigate Back from payment to confirmation and keep valid confirmations  EXPECT: Navigate Back from payment to confirmation and keep valid confirmations
US-152-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Per-passenger confirmation state and reviewed amounts preserved as designed  EXPECT: Per-passenger confirmation state and reviewed amounts preserved as designed
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-153
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-153  |  P1  |  APPROVED
STORY  As a traveller with a medical referral, I want to see what to do next.
EXPECTED  The system explains that documents must be handled at the port and does not automatically grant exemption.
Module: Travel Tax — separate journey  •  Linked features: F-156
ENTRY  Pay Travel Tax → passenger journey
US-153-T01  SUCCESS  ACT: Select medical exemption/referral case and follow existing information or review path without automatic relief  EXPECT: The system explains that documents must be handled at the port and does not automatically grant exemption.
US-153-T02  NEGATIVE / PERMISSION  ACT: Do not grant unverified official exemption or change financial amount without source  EXPECT: Do not grant unverified official exemption or change financial amount without source
US-153-T03  RECOVERY / RETRY  ACT: Return to passenger detail from referral guidance without losing entered fields  EXPECT: Return to passenger detail from referral guidance without losing entered fields
US-153-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Recorded referral/evidence state remains honest; no false relief approval  EXPECT: Recorded referral/evidence state remains honest; no false relief approval
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-154
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-154  |  P1  |  APPROVED
STORY  As a guest, I want to provide a mobile number for the recorded receipt without giving an email.
EXPECTED  Travel Tax does not ask for or require email; only fields approved for the current process appear.
Module: Travel Tax — separate journey  •  Linked features: F-157
ENTRY  Pay Travel Tax → passenger journey
US-154-T01  SUCCESS  ACT: Enter required contact mobile on Travel Tax and proceed with optional email empty  EXPECT: Travel Tax does not ask for or require email; only fields approved for the current process appear.
US-154-T02  NEGATIVE / PERMISSION  ACT: Do not require email or accept invalid mandatory mobile  EXPECT: Do not require email or accept invalid mandatory mobile
US-154-T03  RECOVERY / RETRY  ACT: Back/reload a saved form, preserve verified mobile and optional empty email  EXPECT: Back/reload a saved form, preserve verified mobile and optional empty email
US-154-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Contact mobile appears correctly on recorded receipt without forced email  EXPECT: Contact mobile appears correctly on recorded receipt without forced email
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-155
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-155  |  P1  |  APPROVED
STORY  As a payer, I want to select a supported payment channel and payment method.
EXPECTED  Pay Now or OTC choices and available methods reflect the existing flow and are confirmed on review.
Module: Travel Tax — separate journey  •  Linked features: F-158
ENTRY  Pay Travel Tax → passenger journey
US-155-T01  SUCCESS  ACT: Choose available Travel Tax payment channel and method, inspect selected choice on review and receipt  EXPECT: Pay Now or OTC choices and available methods reflect the existing flow and are confirmed on review.
US-155-T02  NEGATIVE / PERMISSION  ACT: Reject unsupported channel/method combination and stale price without duplicate submit  EXPECT: Reject unsupported channel/method combination and stale price without duplicate submit
US-155-T03  RECOVERY / RETRY  ACT: Return from review to method step, change valid choice and preserve passengers  EXPECT: Return from review to method step, change valid choice and preserve passengers
US-155-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Chosen method/channel and payment reference persist with Travel Tax parent  EXPECT: Chosen method/channel and payment reference persist with Travel Tax parent
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-156
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-156  |  P1  |  APPROVED
STORY  As a payer, I want to see my entire Travel Tax payment before submitting.
EXPECTED  The review shows mode, port, destination, date, every passenger, individual amounts and total.
Module: Travel Tax — separate journey  •  Linked features: F-159
ENTRY  Pay Travel Tax → passenger journey
US-156-T01  SUCCESS  ACT: Review all passengers, route, contact, methods, per-person amounts and grand total before confirming payment  EXPECT: The review shows mode, port, destination, date, every passenger, individual amounts and total.
US-156-T02  NEGATIVE / PERMISSION  ACT: Do not allow submission with unconfirmed passenger, mismatched sum or missing mandatory detail  EXPECT: Do not allow submission with unconfirmed passenger, mismatched sum or missing mandatory detail
US-156-T03  RECOVERY / RETRY  ACT: Back from review to edit and return with updated correct summary  EXPECT: Back from review to edit and return with updated correct summary
US-156-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Review snapshot matches persisted submission payload and one receipt  EXPECT: Review snapshot matches persisted submission payload and one receipt
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-157
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-157  |  P1  |  APPROVED
STORY  As a guest, I want a success message and complete Travel Tax receipt.
EXPECTED  Travel Tax success shows the original reference, one complete receipt and one automatically generated Travel Tax certificate; both are printable/downloadable without creating duplicate transactions.
Module: Travel Tax — separate journey  •  Linked features: F-043, F-160
ENTRY  Pay Travel Tax → passenger journey
US-157-T01  SUCCESS  ACT: Finish permitted Travel Tax and inspect success message, stable original receipt, certificate and itemized passengers  EXPECT: Travel Tax success shows the original reference, one complete receipt and one automatically generated Travel Tax certificate; both are printable/downloadable without creating duplicate transactions.
US-157-T02  NEGATIVE / PERMISSION  ACT: Do not create second payment or issue certificate before completed saved result  EXPECT: Do not create second payment or issue certificate before completed saved result
US-157-T03  RECOVERY / RETRY  ACT: Refresh success screen and retrieve original documents by same reference  EXPECT: Refresh success screen and retrieve original documents by same reference
US-157-T04  PERSISTENCE / CROSS-SYSTEM  ACT: One parent/receipt/certificate with all passenger allocations in source and Office  EXPECT: One parent/receipt/certificate with all passenger allocations in source and Office
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-158
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-158  |  P1  |  APPROVED
STORY  As a signed-in payer, I want my Travel Tax payment in Payments & Activity.
EXPECTED  Travel Tax payer history opens the same stored receipt and automatically generated certificate after verified sign-in.
Module: Travel Tax — separate journey  •  Linked features: F-043, F-162
ENTRY  Pay Travel Tax → passenger journey
US-158-T01  SUCCESS  ACT: Open permitted Payments & Activity after Travel Tax and find original transaction/document by date/reference  EXPECT: Travel Tax payer history opens the same stored receipt and automatically generated certificate after verified sign-in.
US-158-T02  NEGATIVE / PERMISSION  ACT: Do not expose another person's protected passport or missing line  EXPECT: Do not expose another person's protected passport or missing line
US-158-T03  RECOVERY / RETRY  ACT: Sign out/relogin and recover same eligible Travel Tax history  EXPECT: Sign out/relogin and recover same eligible Travel Tax history
US-158-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Source original payment/receipt and owner/session binding preserved  EXPECT: Source original payment/receipt and owner/session binding preserved
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-159
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-159  |  P1  |  APPROVED
STORY  As a guest who later signs in, I want to recover Travel Tax history that I can prove belongs to me.
EXPECTED  checked session/account linking makes eligible records visible without relying only on a typed TIN.
Module: Travel Tax — separate journey  •  Linked features: F-016, F-162
ENTRY  Pay Travel Tax → passenger journey
US-159-T01  SUCCESS  ACT: Use verified payer/recipient entitlement to recover historic Travel Tax receipts when signing in  EXPECT: checked session/account linking makes eligible records visible without relying only on a typed TIN.
US-159-T02  NEGATIVE / PERMISSION  ACT: Typed passport or TIN alone cannot claim another person's paid history  EXPECT: Typed passport or TIN alone cannot claim another person's paid history
US-159-T03  RECOVERY / RETRY  ACT: Recover after interrupted verified account association with original IDs  EXPECT: Recover after interrupted verified account association with original IDs
US-159-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Allowed original Travel Tax IDs linked to correct account and privacy scope  EXPECT: Allowed original Travel Tax IDs linked to correct account and privacy scope
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-160
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-160  |  P1  |  APPROVED
STORY  As a signed-in payer, I want to save and resume an unfinished Travel Tax form.
EXPECTED  Owner-only draft reloads safely; identity, passport and travel date are checked again before submission.
Module: Travel Tax — separate journey  •  Linked features: F-161
ENTRY  Pay Travel Tax → passenger journey
US-160-T01  SUCCESS  ACT: Save incomplete Travel Tax with multiple passenger fields, resume from draft and finish or discard  EXPECT: Owner-only draft reloads safely; identity, passport and travel date are checked again before submission.
US-160-T02  NEGATIVE / PERMISSION  ACT: No draft counted as paid or exposed to another account  EXPECT: No draft counted as paid or exposed to another account
US-160-T03  RECOVERY / RETRY  ACT: Close/relogin or refresh and restore safe field/step without duplicate  EXPECT: Close/relogin or refresh and restore safe field/step without duplicate
US-160-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Owner-scoped Travel Tax draft, passenger list and step state persist accurately  EXPECT: Owner-scoped Travel Tax draft, passenger list and step state persist accurately
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-161
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-161  |  P1  |  APPROVED
STORY  As a payer, I want to repeat an earlier Travel Tax payment with changes.
EXPECTED  Pay Again copies safe passenger and itinerary information, but never restores a masked passport as a checked value.
Module: Travel Tax — separate journey  •  Linked features: F-163
ENTRY  Pay Travel Tax → passenger journey
US-161-T01  SUCCESS  ACT: From prior completed Travel Tax row click Pay Again, inspect editable safe itinerary/passenger values and submit new trip  EXPECT: Pay Again copies safe passenger and itinerary information, but never restores a masked passport as a checked value.
US-161-T02  NEGATIVE / PERMISSION  ACT: Masked passport must not be restored as verified complete credential; old record immutable  EXPECT: Masked passport must not be restored as verified complete credential; old record immutable
US-161-T03  RECOVERY / RETRY  ACT: Back out and reopen repeat; new validation requested for sensitive values  EXPECT: Back out and reopen repeat; new validation requested for sensitive values
US-161-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original/new payment IDs separate with new receipt/certificate and authorized passenger data  EXPECT: Original/new payment IDs separate with new receipt/certificate and authorized passenger data
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-162
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-162  |  P1  |  APPROVED
STORY  As a person whose travel was paid by someone else, I want only my permitted payment details.
EXPECTED  Recipient access needs a checked identity relationship; one payer’s other passengers remain private.
Module: Travel Tax — separate journey  •  Linked features: F-164
ENTRY  Pay Travel Tax → passenger journey
US-162-T01  SUCCESS  ACT: As verified travel recipient open only own permitted travel allocation and linked document access  EXPECT: Recipient access needs a checked identity relationship; one payer’s other passengers remain private.
US-162-T02  NEGATIVE / PERMISSION  ACT: Do not reveal other passengers' passport/name data from same parent  EXPECT: Do not reveal other passengers' passport/name data from same parent
US-162-T03  RECOVERY / RETRY  ACT: Reopen after account refresh or entitlement change and enforce current scope  EXPECT: Reopen after account refresh or entitlement change and enforce current scope
US-162-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Per-recipient verified identity relationship, allocation ID and disclosure boundaries  EXPECT: Per-recipient verified identity relationship, allocation ID and disclosure boundaries
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-163
**Scope:** SHARED CONTRACT — citizen consequence only; no Office work

US-163  |  P1  |  APPROVED
STORY  As an Admin, I want the Travel Tax transaction and every passenger amount in Office.
EXPECTED  Office receives the original Travel Tax payment reference, all passenger allocation amounts and the linked certificate; no duplicate payment or certificate is created.
Module: Travel Tax — separate journey  •  Linked features: F-043, F-160, F-164
ENTRY  Pay Travel Tax → passenger journey
US-163-T01  SUCCESS  ACT: Office Admin opens received Travel Tax parent and inspects each passenger amount, total and certificate  EXPECT: Office receives the original Travel Tax payment reference, all passenger allocation amounts and the linked certificate; no duplicate payment or certificate is created.
US-163-T02  NEGATIVE / PERMISSION  ACT: Repeated bridge delivery cannot create extra passenger/parent or certificate  EXPECT: Repeated bridge delivery cannot create extra passenger/parent or certificate
US-163-T03  RECOVERY / RETRY  ACT: Replay delayed original Travel Tax delivery and compare Office row  EXPECT: Replay delayed original Travel Tax delivery and compare Office row
US-163-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Office parent, passenger lines and certificate reference agree with source and one saved parent  EXPECT: Office parent, passenger lines and certificate reference agree with source and one saved parent
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-164
**Scope:** OFFICE-ONLY — no implementation

US-164  |  P1  |  APPROVED
STORY  As an Admin, I want Travel Tax totals and activity included in reports.
EXPECTED  Reports count each payment once and match Travel Tax source records.
Module: Travel Tax — separate journey  •  Linked features: F-164
ENTRY  Pay Travel Tax → passenger journey
US-164-T01  SUCCESS  ACT: Apply Office reporting filters that include Travel Tax and reconcile charts/exports with stored travel payments  EXPECT: Reports count each payment once and match Travel Tax source records.
US-164-T02  NEGATIVE / PERMISSION  ACT: No omission or double parent count when several passengers share payment  EXPECT: No omission or double parent count when several passengers share payment
US-164-T03  RECOVERY / RETRY  ACT: Refresh report after later synchronized Travel Tax record and rerun totals  EXPECT: Refresh report after later synchronized Travel Tax record and rerun totals
US-164-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Reported travel parent and passenger amount sums match Office/source SQL  EXPECT: Reported travel parent and passenger amount sums match Office/source SQL
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-165
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-165  |  P1  |  APPROVED
STORY  As a guest or signed-in user, I want Travel Tax to work well on phones and in Bangla or English.
EXPECTED  Passenger controls, confirmation, Back, payment and receipt fit mobile and retain the chosen language.
Module: Travel Tax — separate journey  •  Linked features: F-044, F-165
ENTRY  Pay Travel Tax → passenger journey
US-165-T01  SUCCESS  ACT: Complete Travel Tax journey on mobile and desktop with EN/BN, keyboard, Back and receipt  EXPECT: Passenger controls, confirmation, Back, payment and receipt fit mobile and retain the chosen language.
US-165-T02  NEGATIVE / PERMISSION  ACT: No clipped field, missing floating Pay/bottom nav or broken translated validation  EXPECT: No clipped field, missing floating Pay/bottom nav or broken translated validation
US-165-T03  RECOVERY / RETRY  ACT: Switch language/viewport mid-journey; save/resume original form state  EXPECT: Switch language/viewport mid-journey; save/resume original form state
US-165-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Same validated passenger/payment payload regardless of device/language  EXPECT: Same validated passenger/payment payload regardless of device/language
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-166
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-166  |  P1  |  APPROVED
STORY  As a user, I want to know if an official passport, port or rate check is unavailable.
EXPECTED  The current demonstration system clearly says what is example and never claims government verification without a connected official service.
Module: Travel Tax — separate journey  •  Linked features: F-151
ENTRY  Pay Travel Tax → passenger journey
US-166-T01  SUCCESS  ACT: Inspect passport/port/rate verification status when official source not connected; show truthful limitations  EXPECT: The current demonstration system clearly says what is example and never claims government verification without a connected official service.
US-166-T02  NEGATIVE / PERMISSION  ACT: Do not use 'officially verified' without verified connected service or invent tax rate  EXPECT: Do not use 'officially verified' without verified connected service or invent tax rate
US-166-T03  RECOVERY / RETRY  ACT: Retry unavailable source check and keep prior honest state/valid input  EXPECT: Retry unavailable source check and keep prior honest state/valid input
US-166-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Verification status has real source ID or explicitly unavailable; no fabricated approval  EXPECT: Verification status has real source ID or explicitly unavailable; no fabricated approval
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-167
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-167  |  P1  |  APPROVED
STORY  As a signed-in taxpayer, I want one clear profile page showing my existing TIN details and certificate actions.
EXPECTED  Keep a single profile view, without Overview or TIN & Certificate tabs or a detached Account card. Reuse the already supplied User1 TIN certificate/registration fields exactly and reflect them in Office. Keep the existing actions. The top summary keeps TIN type, Tax Circle, Registered since and Last login in the same row. Do not invent taxpayer information; do not confuse a deployed screen with verified between Sohojkor and Office readback.
Module: Sign-in and taxpayer profile  •  Linked features: F-015, F-166
ENTRY  Verified signed-in account → existing single taxpayer profile screen
US-167-T01  SUCCESS  ACT: Sign into User1 existing profile, inspect one page and top summary plus all code-defined certificate fields and actions  EXPECT: Keep a single profile view, without Overview or TIN & Certificate tabs or a detached Account card. Reuse the already supplied User1 TIN certificate/registration fields exactly and reflect them in Office. Keep the existing actions. The top summary keeps TIN type, Tax Circle, Registered since and Last login in the same row. Do not invent taxpayer information; do not confuse a deployed screen with verified between Sohojkor and Office readback.
US-167-T02  NEGATIVE / PERMISSION  ACT: No duplicate Overview/TIN tabs, detached Account card or invented source values  EXPECT: No duplicate Overview/TIN tabs, detached Account card or invented source values
US-167-T03  RECOVERY / RETRY  ACT: Reload profile from authorized SQL after error, retaining masked eye/copy controls  EXPECT: Reload profile from authorized SQL after error, retaining masked eye/copy controls
US-167-T04  PERSISTENCE / CROSS-SYSTEM  ACT: 24 declared code rows and original certificate source values must be compared externally; exact Office projection unverified until readback  EXPECT: 24 declared code rows and original certificate source values must be compared externally; exact Office projection unverified until readback
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-168
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-168  |  P1  |  APPROVED
STORY  As a walk-in payer paying Other Tax for someone else, I want to optionally enter and confirm my own TIN so I can see that completed transaction after signing in.
EXPECTED  Optional payer TIN: empty is allowed; if supplied, check 12-digit format and TIN match. Store separately from recipient. After account ownership is established at sign-in, show original transaction in payer history; never grant access based on a typed TIN alone.
Module: Other Tax, Advance Tax & Source Tax  •  Linked features: F-167
ENTRY  Guest Pay Tax → Other/Advance/Source Tax → pay for another → optional payer TIN
US-168-T01  SUCCESS  ACT: In walk-in Other Tax leave payer TIN empty then optionally enter validated 12-digit payer TIN, complete payment and later find it after verified sign-in  EXPECT: Optional payer TIN: empty is allowed; if supplied, check 12-digit format and TIN match. Store separately from recipient. After account ownership is established at sign-in, show original transaction in payer history; never grant access based on a typed TIN alone.
US-168-T02  NEGATIVE / PERMISSION  ACT: Reject invalid payer TIN but never force it, and do not grant account history by typed TIN alone  EXPECT: Reject invalid payer TIN but never force it, and do not grant account history by typed TIN alone
US-168-T03  RECOVERY / RETRY  ACT: Recover payer TIN lookup failure and continue permitted walk-in; later authenticated claim only  EXPECT: Recover payer TIN lookup failure and continue permitted walk-in; later authenticated claim only
US-168-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Payer TIN stored separate from recipient; original payment/Office records match verified payer linkage  EXPECT: Payer TIN stored separate from recipient; original payment/Office records match verified payer linkage
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-169
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-169  |  P1  |  APPROVED
STORY  As a logged-in taxpayer, I want to see my available certificate, complete recorded tax ledger and full tax history, and download my certificate.
EXPECTED  The account displays its recorded ledger, tax/payment history, receipts, automatic certificates for every completed payment, and genuine official certificates when available. Allow viewing, printing and downloading the permitted documents.
Module: Receipts, certificates and ledger  •  Linked features: F-168
ENTRY  Payment record → receipt / certificates
US-169-T01  SUCCESS  ACT: Open logged-in ledger and list recorded payments, receipts, auto certificates and available genuine credit documents; view/print/download permitted items  EXPECT: The account displays its recorded ledger, tax/payment history, receipts, automatic certificates for every completed payment, and genuine official certificates when available. Allow viewing, printing and downloading the permitted documents.
US-169-T02  NEGATIVE / PERMISSION  ACT: Never show unavailable government certificate as existing or leak another account's ledger  EXPECT: Never show unavailable government certificate as existing or leak another account's ledger
US-169-T03  RECOVERY / RETRY  ACT: Refresh account after temporary document fetch error and restore permitted history  EXPECT: Refresh account after temporary document fetch error and restore permitted history
US-169-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original parent/document references and confirmed official entitlement sources remain distinct  EXPECT: Original parent/document references and confirmed official entitlement sources remain distinct
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-170
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-170  |  P1  |  APPROVED
STORY  As a taxpayer, I want to sign in before requesting a payment correction, including for a walk-in payment.
EXPECTED  Use the existing login. Keep the original walk-in reference and show my request and Office decision.
Module: Corrections and unwanted payments  •  Linked features: F-090, F-169
ENTRY  Verified or walk-in payment reference → existing sign-in → Correction Request
US-170-T01  SUCCESS  ACT: From a walk-in payment reference attempt correction signed out, then sign in through existing login and submit eligible linked request  EXPECT: Use the existing login. Keep the original walk-in reference and show my request and Office decision.
US-170-T02  NEGATIVE / PERMISSION  ACT: Unsigned request cannot write correction, typed TIN not sufficient to claim payment  EXPECT: Unsigned request cannot write correction, typed TIN not sufficient to claim payment
US-170-T03  RECOVERY / RETRY  ACT: Return from sign-in to original payment/correction context and recover saved case  EXPECT: Return from sign-in to original payment/correction context and recover saved case
US-170-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Original walk-in payment ID, verified claimant identity and Office case state linked without financial mutation  EXPECT: Original walk-in payment ID, verified claimant identity and Office case state linked without financial mutation
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-171
**Scope:** OFFICE-ONLY — no implementation

US-171  |  P1  |  APPROVED
STORY  As an authorized Admin, I want to see each taxpayer’s full verified historical journey on a fishbone timeline.
EXPECTED  Display dated events for TIN application, issuance, name changes, jurisdiction changes, payments and corrections where verified source records exist; show actor/source and before/after values when available. Preserve original events, avoid invented history and respect existing Office permissions.
Module: Office/Admin payment views  •  Linked features: F-106, F-170
ENTRY  Office/Admin → taxpayer payment details
US-171-T01  SUCCESS  ACT: Office Admin searches verified taxpayer and inspects dated fishbone TIN issue/application, jurisdiction/name, payment and correction events when source exists  EXPECT: Display dated events for TIN application, issuance, name changes, jurisdiction changes, payments and corrections where verified source records exist; show actor/source and before/after values when available. Preserve original events, avoid invented history and respect existing Office permissions.
US-171-T02  NEGATIVE / PERMISSION  ACT: No fabricated historical event, actor, timestamp or private unrelated TIN record  EXPECT: No fabricated historical event, actor, timestamp or private unrelated TIN record
US-171-T03  RECOVERY / RETRY  ACT: Reload timeline after new authorized event; chronological events remain stable  EXPECT: Reload timeline after new authorized event; chronological events remain stable
US-171-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Each node carries source event ID, type, actor, date and before/after values when available  EXPECT: Each node carries source event ID, type, actor, date and before/after values when available
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-172
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-172  |  P1  |  APPROVED
STORY  As a guest or logged-in visitor, I want to find a payment record from the homepage using its challan, token or transaction reference.
EXPECTED  Homepage search by challan, token or transaction reference opens only public/permitted payment status, receipt and corresponding automatically generated certificate. Private records require existing authorization.
Module: Receipts, certificates and ledger  •  Linked features: F-001, F-051, F-171
ENTRY  Payment record → receipt / certificates
US-172-T01  SUCCESS  ACT: On homepage Find a payment record search by challan, token and transaction reference; open permitted result/receipt/certificate  EXPECT: Homepage search by challan, token or transaction reference opens only public/permitted payment status, receipt and corresponding automatically generated certificate. Private records require existing authorization.
US-172-T02  NEGATIVE / PERMISSION  ACT: Unmatched or restricted reference must show safe no-match or authorization state, not private history  EXPECT: Unmatched or restricted reference must show safe no-match or authorization state, not private history
US-172-T03  RECOVERY / RETRY  ACT: Retry lookup after timeout preserving entered reference and original layout  EXPECT: Retry lookup after timeout preserving entered reference and original layout
US-172-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Lookup uses stored original ID/status and existing public entitlement, never generates payment/doc  EXPECT: Lookup uses stored original ID/status and existing public entitlement, never generates payment/doc
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-173
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-173  |  P1  |  APPROVED
STORY  As a guest or signed-in payer, I want every successful Sohojkor payment to give me a certificate that I can view, print and download.
EXPECTED  Every completed transaction has one automatically generated Sohojkor Payment Certificate based on its recorded payment data. It shows the same reference, date, payer and beneficiaries, itemized heads/years or travel/passenger data, amounts and total as the saved record and receipt. View, Print and Download PDF are available on the confirmation screen and permitted history/search views. Combined payments produce one certificate; replays reuse it, while a new Pay Again transaction receives its own certificate. No internal test or technical status labels appear in the UI or generated document.
Module: Receipts, certificates and ledger  •  Linked features: F-048, F-049, F-050, F-052, F-172
ORIGINAL JOURNEY  Choose any eligible payment → complete and save transaction → see payment confirmation, receipt and Payment Certificate → View or Print/Download PDF → return to the original document through permitted history or reference lookup.
ENTRY  Pay Tax / Other Tax / Travel Tax → success → certificate
US-173-T01  SUCCESS  ACT: After completed Return/Other/combined/Travel/Pay Again transactions inspect exactly one automatic payment certificate; View, Print and actual PDF Download  EXPECT: Every completed transaction has one automatically generated Sohojkor Payment Certificate based on its recorded payment data. It shows the same reference, date, payer and beneficiaries, itemized heads/years or travel/passenger data, amounts and total as the saved record and receipt. View, Print and Download PDF are available on the confirmation screen and permitted history/search views. Combined payments produce one certificate; replays reuse it, while a new Pay Again transaction receives its own certificate. No internal test or technical status labels appear in the UI or generated document.
US-173-T02  NEGATIVE / PERMISSION  ACT: Duplicate replay cannot create extra certificate; no internal test code or fake official stamp shown  EXPECT: Duplicate replay cannot create extra certificate; no internal test code or fake official stamp shown
US-173-T03  RECOVERY / RETRY  ACT: Reload confirmation and retrieve existing document through permitted history/reference search  EXPECT: Reload confirmation and retrieve existing document through permitted history/reference search
US-173-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Certificate original ID, payer/recipient/line items/total and valid PDF bytes match saved parent; Office reference aligned  EXPECT: Certificate original ID, payer/recipient/line items/total and valid PDF bytes match saved parent; Office reference aligned
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-174
**Scope:** DEFERRED PROPOSAL

US-174  |  P3  |  PROPOSED
STORY  As a public visitor, I want to ask a payment, receipt or Travel Tax question in the existing guide-based Help panel so I can find the correct maintained information without signing in.
EXPECTED  Help opens and closes with working focus; supported questions use existing bilingual guide content; unavailable answers direct me to the existing guide, without claiming external expert verification.
Module: Homepage & payment record search  •  Linked features: F-173
ORIGINAL JOURNEY  Homepage → Help icon → open panel → choose or type a supported question → read guide-based answer → follow User guide if necessary → close and return focus.
ENTRY  Public homepage → top-right Help icon → existing bilingual guide panel
US-174-T01  SUCCESS  ACT: As guest open Help panel, ask existing supported payment/receipt/Travel Tax question, inspect guide-based bilingual answer and close  EXPECT: Help opens and closes with working focus; supported questions use existing bilingual guide content; unavailable answers direct me to the existing guide, without claiming external expert verification.
US-174-T02  NEGATIVE / PERMISSION  ACT: Unsupported question must point to existing guide without fabricating official answer or requiring sign-in  EXPECT: Unsupported question must point to existing guide without fabricating official answer or requiring sign-in
US-174-T03  RECOVERY / RETRY  ACT: Close panel and reopen after navigation; focus returns to trigger and context retained  EXPECT: Close panel and reopen after navigation; focus returns to trigger and context retained
US-174-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Read-only guide content version and public route; no taxpayer/payment write  EXPECT: Read-only guide content version and public route; no taxpayer/payment write
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-175
**Scope:** DEFERRED PROPOSAL

US-175  |  P3  |  PROPOSED
STORY  As a visitor, I want to browse the existing payment-head reference catalogue so I can understand which heads are shown and distinguish a reference listing from an eligible payment.
EXPECTED  Public head catalogue opens, searches and displays supported reference descriptions; unverified or unmapped reference heads cannot silently become executable payment choices.
Module: Homepage & payment record search  •  Linked features: F-002, F-174, F-032
ORIGINAL JOURNEY  Public services → Payment head catalogue → search by name or code → inspect description/category/eligibility → return to a supported Pay Tax entry.
ENTRY  Public navigation → existing payment-head reference catalogue
US-175-T01  SUCCESS  ACT: From public services open payment-head catalogue, search by name/code, inspect description and eligibility and return to existing payment route  EXPECT: Public head catalogue opens, searches and displays supported reference descriptions; unverified or unmapped reference heads cannot silently become executable payment choices.
US-175-T02  NEGATIVE / PERMISSION  ACT: Unmapped/reference-only head must not become executable payment choice  EXPECT: Unmapped/reference-only head must not become executable payment choice
US-175-T03  RECOVERY / RETRY  ACT: Clear no-match search and retry, restoring catalogue filters and existing public route  EXPECT: Clear no-match search and retry, restoring catalogue filters and existing public route
US-175-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Published head mapping/eligibility checked against current app catalog; no financial record created  EXPECT: Published head mapping/eligibility checked against current app catalog; no financial record created
Fixture: Existing permitted content/owned account context, with a frozen approved UI reference if presentation changes are involved.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-176
**Scope:** DEFERRED PROPOSAL

US-176  |  P2  |  PROPOSED
STORY  As a signed-in user, I want to edit my supported application-account display name and settings so that those preferences persist only for my account.
EXPECTED  Existing profile settings save supported values, show success/error and recover on refresh without overwriting TIN-registration fields or another account.
Module: Sign-in and taxpayer profile  •  Linked features: F-018, F-175
ORIGINAL JOURNEY  Sign in → Account → Profile settings → edit supported name/language → Save → see confirmation → refresh or sign back in → see same account-only choice.
ENTRY  Existing signed-in taxpayer account → Profile / account settings
US-176-T01  SUCCESS  ACT: In account settings edit supported display name/language, Save, refresh and sign in again to verify owner-only preference  EXPECT: Existing profile settings save supported values, show success/error and recover on refresh without overwriting TIN-registration fields or another account.
US-176-T02  NEGATIVE / PERMISSION  ACT: Do not modify immutable registered TIN name/registration certificate or another user's settings  EXPECT: Do not modify immutable registered TIN name/registration certificate or another user's settings
US-176-T03  RECOVERY / RETRY  ACT: Recover failed save with edits retained and explicit retry; preserve prior stored version until success  EXPECT: Recover failed save with edits retained and explicit retry; preserve prior stored version until success
US-176-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Account preference owner ID/revision and values persisted independently of TIN registration record  EXPECT: Account preference owner ID/revision and values persisted independently of TIN registration record
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-177
**Scope:** DEFERRED PROPOSAL

US-177  |  P2  |  PROPOSED
STORY  As a signed-in user, I want to control my existing in-app account notification preference without losing records of earlier payment or review events.
EXPECTED  Switching on/off updates only my preference, persists after refresh and preserves original sourced notices and read history; no email or SMS sending is added.
Module: In-app notifications and activity  •  Linked features: F-176
ORIGINAL JOURNEY  Sign in → Profile settings → set in-app notification preference → Save → return to Notifications → confirm prior notices remain → refresh and recheck preference.
ENTRY  Signed-in payer or recipient → Notifications / Payments & Activity
US-177-T01  SUCCESS  ACT: Toggle existing in-app notification preference, Save and reload while preserving old notices and read state  EXPECT: Switching on/off updates only my preference, persists after refresh and preserves original sourced notices and read history; no email or SMS sending is added.
US-177-T02  NEGATIVE / PERMISSION  ACT: Preference off cannot delete historic notices or invent email/SMS delivery  EXPECT: Preference off cannot delete historic notices or invent email/SMS delivery
US-177-T03  RECOVERY / RETRY  ACT: Recover interrupted save and display actual server-confirmed choice  EXPECT: Recover interrupted save and display actual server-confirmed choice
US-177-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Only account-owned preference flag changes, past event/notice records remain intact  EXPECT: Only account-owned preference flag changes, past event/notice records remain intact
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-178
**Scope:** DEFERRED PROPOSAL

US-178  |  P2  |  PROPOSED
STORY  As a signed-in taxpayer, I want to reveal or copy my masked TIN, phone and email from my existing profile controls without losing the default privacy masking.
EXPECTED  Only the agreed 2–3 characters remain visible by default, the adjacent eye reveals or hides the stored value and Copy copies exactly that permitted value; buttons have distinct correct icons and accessible names.
Module: Sign-in and taxpayer profile  •  Linked features: F-166, F-175
ORIGINAL JOURNEY  Sign in → Profile → locate TIN, phone or email → inspect masked value → activate eye to reveal → toggle back to masking → use adjacent Copy → confirm correct copied value.
ENTRY  Existing signed-in taxpayer account → Profile / account settings
US-178-T01  SUCCESS  ACT: Sign in and inspect default masked TIN/phone/email, toggle eye, use adjacent Copy and confirm clipboard contains exact permitted value  EXPECT: Only the agreed 2–3 characters remain visible by default, the adjacent eye reveals or hides the stored value and Copy copies exactly that permitted value; buttons have distinct correct icons and accessible names.
US-178-T02  NEGATIVE / PERMISSION  ACT: Do not display whole value by default, use paste icon for Copy or copy masked string  EXPECT: Do not display whole value by default, use paste icon for Copy or copy masked string
US-178-T03  RECOVERY / RETRY  ACT: Reload or switch account and restore correct default masking without leaking prior account value  EXPECT: Reload or switch account and restore correct default masking without leaking prior account value
US-178-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Only client visibility changes; stored profile values unchanged and current account access enforced  EXPECT: Only client visibility changes; stored profile values unchanged and current account access enforced
Fixture: The precise existing account/session, with separate A/B accounts where owner-isolation is tested; never use typed TIN as authentication.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.

### US-179
**Scope:** DEFERRED PROPOSAL

US-179  |  P1  |  PROPOSED
STORY  As a payer using the existing ordinary-tax payment flow, I want to choose an available payment channel and method and see the same choice on the review and receipt screens.
EXPECTED  Supported payment channel/method selections preserve all beneficiary, head, year and totals data; unsupported combinations cannot silently proceed; submitted choice is reflected in the recorded receipt.
Module: Other Tax, Advance Tax & Source Tax  •  Linked features: F-045, F-158
ORIGINAL JOURNEY  Pay Tax → choose permitted service and recipients → enter head/year/amount → choose an available method → review including method and totals → submit once → inspect receipt.
ENTRY  Pay Tax → existing non-Return payment composer
US-179-T01  SUCCESS  ACT: In ordinary payment select supported channel/method, review unchanged beneficiary/head/AY/amount and submit once to see same method on receipt  EXPECT: Supported payment channel/method selections preserve all beneficiary, head, year and totals data; unsupported combinations cannot silently proceed; submitted choice is reflected in the recorded receipt.
US-179-T02  NEGATIVE / PERMISSION  ACT: Unsupported method combination must fail without losing valid allocations or double payment  EXPECT: Unsupported method combination must fail without losing valid allocations or double payment
US-179-T03  RECOVERY / RETRY  ACT: Back to method selection, change supported method and return to review with original lines  EXPECT: Back to method selection, change supported method and return to review with original lines
US-179-T04  PERSISTENCE / CROSS-SYSTEM  ACT: Method/channel persisted against original payment and Office mirror with correct total  EXPECT: Method/channel persisted against original payment and Office mirror with correct total
Fixture: An existing authorized original payment/case or an isolated disposable nonfinancial fixture; no unauthorized production payment or TIN binding.  •  Environment: state changes NONPROD_ISOLATED only  •  Current test result UNVERIFIED.


### US-180
**Scope:** OFFICE-ONLY — no implementation

US-180  |  P1  |  APPROVED
STORY  As an authorized Office Admin, I want a detailed consolidated taxpayer ledger that records every legitimately sourced tax payment and applicable tax deduction, regardless of source or payment method, with its Dhara, Source and Payment Amount, so I can investigate a taxpayer’s complete verified tax-payment history.
EXPECTED  From the existing Taxpayer 360 context, search one verified taxpayer TIN, inspect all available source-backed ledger entries for BRTA, e-TDS, iBAS++, NSD, Sub-Registrar Office, Bank, SA Coder and Sohojkor, inspect the original reference/line and verified status, and filter/export accurately. The system keeps original source/deduction/deposit/credit distinctions, deduplicates overlap and does not claim unsupported external feeds are connected or complete.
Module: Office/Admin taxpayer ledger + source integration  •  Linked features: F-177; related F-104, F-105, F-106, F-107, F-109, F-111, F-168
ORIGINAL JOURNEY  Existing Office login → Taxpayer 360 → search verified taxpayer → Ledger → filter by source/Dhara/year → open original source record/line → compare/reconcile totals → export permitted report.
ENTRY  Office/Admin → Taxpayer 360 → Ledger, with existing payment overview cross-link.
US-180-T01 SUCCESS  ACT: Open an authorized taxpayer’s ledger containing an original Sohojkor entry and sourced external entries in allowed isolated fixtures, inspect Dhara/Source/Amount and evidence and export current filtered result.  EXPECT: Correct complete source-backed records for the evidence actually available.
US-180-T02 NEGATIVE / PERMISSION  ACT: Open another taxpayer’s ledger without an authorized Office role; repeat one external challan through overlapping source/import deliveries; attempt to show missing Dhara or unconfirmed deductions as settled credits.  EXPECT: Existing permission boundaries, accurate counts and truthful provenance/status, no invented data.
US-180-T03 RECOVERY / RETRY  ACT: Resume an interrupted source feed/import and refresh the existing ledger/filters.  EXPECT: Newly confirmed source lines arrive once with original IDs; failed source coverage remains indicated without false zero totals.
US-180-T04 PERSISTENCE / CROSS-SYSTEM  ACT: Trace stored original external evidence or Taxpayer SQL parent/allocation into separate Office SQL, authorized Admin lines, reports/exports and an eligible taxpayer view; reconcile Dhara/Source/Amount, identity, original reference and status.  EXPECT: Exact parity for every source actually verified, no double-counting; other sources UNVERIFIED.
Fixture: Existing authorized financial evidence or isolated disposable source/SQL fixtures only; source-provider permissions and available history independently checked.  •  Environment: PROD_READ or NONPROD_ISOLATED as appropriate, no unauthorized production finance mutation.  •  Current test result: UNVERIFIED.

### US-181
**Scope:** CITIZEN / CONSUMER — map exact applicable clauses

US-181  |  P1  |  APPROVED
STORY  As a guest or signed-in taxpayer completing a challan, I want to enter optional free-text Remarks / Comments longer than 20 characters so that additional information remains attached to the correct payment and can be reviewed later.
EXPECTED  The dedicated multiline field accepts English/Bengali long text without arbitrary 20-character truncation, appears after structured payment details, survives review, Back/Edit, Save Draft/Resume and permitted retry, and is preserved in the original payment/challan, protected Office view and supported printable output. Pay Again makes a separately editable copy without changing the original.
Module: Tax with Return + Other/combined challan forms, original API/SQL and Office transaction details  •  Linked features: F-178; related F-026, F-031, F-032, F-036, F-038, F-071
ORIGINAL JOURNEY  Pay Tax → select existing valid challan type/beneficiary/head/year/amount → enter optional Remarks → Review → confirm submitted payment → open original challan → see complete remarks; later recover draft or Pay Again editable copy.
ENTRY  Existing Pay Tax / Tax with Return or Other Tax payment form, without new navigation route.
US-181-T01 SUCCESS  ACT: Write 20+ character multiline Bangla/English remarks in a permitted guest and signed-in payment, including blank optional case, then complete and view original document.  EXPECT: Correct full text persists and displays without truncation.
US-181-T02 NEGATIVE / PERMISSION  ACT: Paste Unicode, markup and long text; attempt financial field alteration through comments.  EXPECT: Inert escaped text, preserved existing payment validation and usable consistent size/error handling; no arbitrary 20-character restriction.
US-181-T03 RECOVERY / RETRY  ACT: Enter remarks, Back/Edit, Save Draft, refresh/reopen, resume and Pay Again; retry after network loss.  EXPECT: Original and new transaction remark versions remain separately correct, owner boundaries intact and no duplicate payment.
US-181-T04 PERSISTENCE / CROSS-SYSTEM  ACT: Compare exact text/codepoints and line breaks from client payload through Taxpayer SQL to separate Office SQL and original challan/permitted receipt.  EXPECT: Exact source-to-Office concordance; original financial fields/approved UI unaffected.
Fixture: Permitted account/guest forms and disposable nonproduction payment state; no fabricated production payment.  •  Environment: NONPROD_ISOLATED for writes; PROD_READ for existing behavior.  •  Current test result: UNVERIFIED.


## Required evidence mapping before implementation
For every applicable F-ID/US-ID and T-ID record route, entry, actor, authorization, visible component, exact field mapping, action, defaults, validation, empty/loading/error/success, persistence/recovery, API method and actual response, device/locale/theme, fixture and test evidence. Mark unavailable or inconsistent contract UNVERIFIED; never modify SQL, Office or original production to pass. Map later Gift Tax, Home 2 and v12 requirements as approved changes; do not silently renumber original IDs.
