# FoodBridge implementation TODO

This checklist turns the architecture in [README.md](README.md) into buildable work. Complete items in phase order unless a dependency is explicitly marked optional. Items marked **[MVP]** are required before the first public release; items marked **[Later]** are intentionally deferred.

## Project controls

- [ ] **[MVP]** Choose the production project name, Firebase project ID, primary region, support email address, and public domain.
- [ ] **[MVP]** Nominate the initial platform administrator(s) and document the admin-access approval process.
- [ ] **[MVP]** Confirm the launch geographic/service area and the local food-safety guidance that applies to it.
- [ ] **[MVP]** Confirm the supported donation categories, units, and prohibited items.
- [ ] **[MVP]** Confirm whether every donation needs manual moderation; default to manual approval for launch.
- [ ] **[MVP]** Confirm whether the public can browse donation summaries or only signed-in users can do so.
- [ ] **[MVP]** Confirm whether organizations can request partial quantities; default to partial orders.
- [ ] **[MVP]** Define each sponsorship type, required fulfillment evidence, and its verification owner.
- [ ] **[MVP]** Approve the privacy notice, terms, community rules, food-safety rules, and media-consent policy.
- [ ] **[MVP]** Define measurable launch targets: organizations verified, donations received, estimated meals, and order completion rate.
- [ ] **[MVP]** Create a delivery backlog from this file and assign an owner, priority, and target date to every MVP item.

## Phase 0 — repository and developer setup

- [x] **[MVP]** Keep the existing React + TypeScript + Vite application as the web client.
- [x] **[MVP]** Initialize a Git repository if one is not already present.
- [ ] **[MVP]** Protect the remote `main` branch using the documented repository-administrator handoff.
- [x] **[MVP]** Add a `.editorconfig` and agree on formatting/linting conventions.
- [x] **[MVP]** Add Prettier (or an agreed formatter) and format-check scripts.
- [x] **[MVP]** Add a `typecheck` script and run it in local development and CI.
- [x] **[MVP]** Add a test runner and coverage reporting.
- [x] **[MVP]** Add a `.env.example` containing only non-secret Firebase web-config variable names.
- [x] **[MVP]** Add `.env`, Firebase service-account files, and local emulator data to `.gitignore`.
- [ ] **[MVP]** Create separate Firebase development, staging, and production projects; never test moderation with production data.
- [ ] **[MVP]** Choose a Firebase Functions region close to the launch area and use it consistently.
- [ ] **[MVP]** Install/configure Firebase CLI and log in using a team-owned account.
- [x] **[MVP]** Initialize Firebase Hosting, Firestore, Storage, Functions, and Emulators in this repository.
- [x] **[MVP]** Choose Node.js/Functions runtime versions that are currently supported by Firebase.
- [x] **[MVP]** Configure the app to use Firebase emulators when `VITE_USE_FIREBASE_EMULATORS=true`.
- [x] **[MVP]** Create a repeatable local start command for web app plus emulators.
- [x] **[MVP]** Document setup steps and prerequisites in the README or a `docs/setup.md` file.
- [x] **[MVP]** Configure CI to run install, lint, typecheck, unit tests, security-rules tests, and production build.
- [x] **[MVP]** Add dependency-update and secret-scanning checks to CI.
- [x] **[MVP]** Add an error-boundary component and a client error-reporting strategy that excludes sensitive details.

### Phase 0 handoff still required

- Create distinct Firebase development, staging, and production projects, then add their aliases to `.firebaserc` and their web configuration to local environment files.
- Confirm the Firebase Functions region against the final launch/service area before the first FoodBridge function is deployed. The existing shared Firebase project currently uses `us-central1`.
- Move Firebase CLI ownership to a team-controlled account/service process rather than relying on an individual login.
- Apply the remote `main` branch-protection settings in [docs/branch-protection.md](docs/branch-protection.md).

## Phase 1 — Firebase configuration and shared domain model

- [ ] **[MVP]** Create `src/lib/firebase.ts` to initialize the Firebase app, Auth, Firestore, Storage, and Functions once.
- [ ] **[MVP]** Configure Firebase web environment variables for development/staging/production.
- [ ] **[MVP]** Enable Email/Password Authentication in each Firebase project.
- [ ] **[MVP]** Configure authorized domains for localhost, staging, and production.
- [ ] **[MVP]** Set appropriate password policy and email-enumeration protection in Firebase Auth.
- [ ] **[MVP]** Create typed TypeScript models for user, organization, application, donation, reservation, order, sponsorship, fulfillment, notification, story, consent, and audit log.
- [ ] **[MVP]** Define enums/unions for every status in one shared location; do not use free-text status values.
- [ ] **[MVP]** Create shared constants for donation categories, units, supported sponsorship types, and allowed image/document MIME types.
- [ ] **[MVP]** Create date/quantity formatting utilities with one authoritative time-zone policy.
- [ ] **[MVP]** Create typed Firestore converters/adapters so document parsing is centralized.
- [ ] **[MVP]** Use server timestamps for creation/update fields; do not trust browser clock values for workflow decisions.
- [ ] **[MVP]** Create Zod (or equivalent) schemas that match all client forms and callable-function payloads.
- [ ] **[MVP]** Define standard application errors: unauthenticated, unauthorized, invalid input, expired, conflict, not found, and unavailable.
- [ ] **[MVP]** Write a fixture factory for valid sample users, organizations, donations, orders, and stories.

## Phase 2 — database, Storage, indexes, and rules

### Firestore collections

- [ ] **[MVP]** Implement the `users/{uid}` profile document shape.
- [ ] **[MVP]** Implement unique username reservations in `usernames/{normalizedUsername}`.
- [ ] **[MVP]** Implement admin allow-list records in `adminUsers/{uid}`.
- [ ] **[MVP]** Implement flat `organizationMembers/{organizationId_uid}` lookup documents.
- [ ] **[MVP]** Implement `organizations/{organizationId}` records and public-profile fields.
- [ ] **[MVP]** Implement `organizationApplications/{applicationId}` records without exposing submitted verification documents.
- [ ] **[MVP]** Implement `organizationInvites/{inviteId}` only if invitations are included in MVP; otherwise leave it out until needed.
- [ ] **[MVP]** Implement `donations/{donationId}` records and `reservations` subcollections.
- [ ] **[MVP]** Implement `donationReports/{reportId}` for safety/policy reporting.
- [ ] **[MVP]** Implement `sponsorships/{sponsorshipId}` and `fulfillments` subcollections.
- [ ] **[MVP]** Implement `orders/{orderId}` and `collectionConfirmations/{confirmationId}`.
- [ ] **[MVP]** Implement `impactStories/{storyId}` and private `mediaConsents/{consentId}` records.
- [ ] **[MVP]** Implement `notifications/{notificationId}`, `auditLogs/{logId}`, `siteMetrics/current`, and `systemConfig/public`.
- [ ] **[MVP]** Ensure document IDs, ownership IDs, and denormalized display fields are specified consistently in TypeScript types.

### Cloud Storage

- [ ] **[MVP]** Create documented paths for donation images, organization verification documents, stories, consent documents, and sponsorship evidence.
- [ ] **[MVP]** Validate upload MIME type, file size, filename, and image dimensions server-side or with a trusted upload workflow.
- [ ] **[MVP]** Set limits for image count per donation/story and document count per application.
- [ ] **[MVP]** Reject executable files and non-approved file formats.
- [ ] **[MVP]** Ensure verification and consent files never have public download URLs.
- [ ] **[MVP]** Design public story image access so media becomes public only after associated story publication.
- [ ] **[MVP]** Add a deletion/retention process for rejected applications, withdrawn media consent, and user deletion requests.

### Indexes and data limits

- [ ] **[MVP]** Add indexes for available donations by status/category/expiry and status/pickup window.
- [ ] **[MVP]** Add indexes for a donor’s donations and orders by status/date.
- [ ] **[MVP]** Add indexes for organization orders by status/date and organization applications by review status/date.
- [ ] **[MVP]** Add indexes for sponsorship due dates, published stories, and unread notifications.
- [ ] **[MVP]** Record all indexes in `firestore.indexes.json` and deploy them with the application.
- [ ] **[MVP]** Review query patterns to avoid unbounded reads and expensive client-side filtering.
- [ ] **[MVP]** Use pagination/cursors for donation feeds, directory results, notifications, audit logs, and admin queues.

### Firestore and Storage security rules

- [ ] **[MVP]** Start all Firestore and Storage collections as deny-by-default.
- [ ] **[MVP]** Allow a user to read their own profile and update only safe display/preference fields.
- [ ] **[MVP]** Prevent a client from setting `platformRole`, `status`, `emailVerified`, ownership fields, server timestamps, or audit fields.
- [ ] **[MVP]** Read admin authorization from a custom claim and/or server-only allow-list—never from a client-writable field.
- [ ] **[MVP]** Make only approved, public organizations visible to anonymous visitors.
- [ ] **[MVP]** Restrict application records and verification files to the applicant and administrators.
- [ ] **[MVP]** Allow donors to create/edit only their own eligible donation drafts; prohibit direct client stock changes.
- [ ] **[MVP]** Permit organization members to read only order/listing data needed for their approved organization.
- [ ] **[MVP]** Restrict sponsorship and fulfillment data to its sponsor, permitted target organization members, and admins.
- [ ] **[MVP]** Make only published impact stories and their approved public media visible to anonymous visitors.
- [ ] **[MVP]** Restrict consent records, audit logs, admin allow-list, and system-only metrics writes to server/admin paths.
- [ ] **[MVP]** Allow users to mark only their own notification as read; server creates notifications.
- [ ] **[MVP]** Test every rule with Emulator Suite tests for allowed and denied paths.

## Phase 3 — application shell, public pages, and accessibility

- [ ] **[MVP]** Add React Router and define public, authenticated, organization, and admin route groups.
- [ ] **[MVP]** Build responsive layout shell: header, navigation, footer, content container, and mobile menu.
- [ ] **[MVP]** Add loading, empty, permission-denied, offline, not-found, and generic-error states.
- [ ] **[MVP]** Add a route-level error boundary and user-friendly retry option.
- [ ] **[MVP]** Build the home-page hero with Donate Food, Sponsor Support, and Register Organization calls to action.
- [ ] **[MVP]** Build an aggregate impact-statistics strip from `siteMetrics/current`.
- [ ] **[MVP]** Build the children-receiving-food impact-story gallery using published stories only.
- [ ] **[MVP]** Display only consent-verified, respectful imagery and sanitized public copy in the gallery.
- [ ] **[MVP]** Build the “How it works” flow: donate → organization orders → collection confirmed → impact recorded.
- [ ] **[MVP]** Build urgent donation cards sorted by expiry/pickup window.
- [ ] **[MVP]** Build featured approved shelter cards using server-configured IDs.
- [ ] **[MVP]** Build sponsorship callout and clearly state that payments are not processed.
- [ ] **[MVP]** Build public About, food-safety, Privacy, Terms, and contact/support pages.
- [ ] **[MVP]** Build shelter/organization directory with type, service-area, and needs filters.
- [ ] **[MVP]** Build the public organization profile page with public profile, needs, impact, and published stories.
- [ ] **[MVP]** Add semantic landmarks, visible focus styles, keyboard navigation, labels, and accessible error messages.
- [ ] **[MVP]** Supply meaningful alt text; leave decorative images with empty alt text.
- [ ] **[MVP]** Verify color contrast, touch targets, responsive layouts, and reduced-motion behavior.
- [ ] **[MVP]** Add a cookie/analytics choice only if non-essential analytics are enabled.

## Phase 4 — authentication, profile, and authorization UI

- [ ] **[MVP]** Create sign-up page with email, password, confirm password, username, display name, and terms acceptance.
- [ ] **[MVP]** Create real-time username-format feedback without revealing other users’ private information.
- [ ] **[MVP]** Implement callable `reserveUsername` transaction and compensation/cleanup if account creation fails.
- [ ] **[MVP]** Create sign-in and sign-out flows.
- [ ] **[MVP]** Create forgot-password and reset-password flows.
- [ ] **[MVP]** Send email verification after registration and expose resend/verification states.
- [ ] **[MVP]** Create profile/settings page for safe editable fields and notification preferences.
- [ ] **[MVP]** Protect sign-in-required routes and return users to their intended destination after authentication.
- [ ] **[MVP]** Protect organization routes with approved active membership checks.
- [ ] **[MVP]** Protect admin routes with refreshed Firebase admin custom claims.
- [ ] **[MVP]** Add suspended-account UI that explains how to contact support without leaking moderation details.
- [ ] **[MVP]** Handle Auth errors safely: invalid credentials, rate limits, expired links, and account-disabled state.
- [ ] **[MVP]** Implement `onAuthUserCreated` to create the minimal profile and welcome notification.
- [ ] **[MVP]** Build admin-only role-grant/removal workflow with two-person/manual approval policy if required by governance.
- [ ] **[MVP]** Audit every privilege change.

## Phase 5 — organization onboarding and shelter management

- [ ] **[MVP]** Create organization application page accessible to signed-in users.
- [ ] **[MVP]** Collect organization name, type, description, contact details, address/service area, capacity/beneficiary count, needs, and declarations.
- [ ] **[MVP]** Add validation-document upload with progress, failure recovery, and private storage paths.
- [ ] **[MVP]** Add applicant declaration that submitted information is accurate and consent documents are lawful.
- [ ] **[MVP]** Implement `submitOrganizationApplication` callable validation and audit logging.
- [ ] **[MVP]** Create application status screen: pending, approved, rejected, suspended, and decision reason where appropriate.
- [ ] **[MVP]** Build admin application queue with filters, document preview/download under protected access, review notes, and decision modal.
- [ ] **[MVP]** Implement `reviewOrganizationApplication` to approve/reject, set review fields, create organization, and add applicant as manager in one controlled workflow.
- [ ] **[MVP]** Notify applicant after every application decision.
- [ ] **[MVP]** Let organization managers edit allowed public profile fields after approval.
- [ ] **[MVP]** Prevent managers from changing verified identity, status, or review fields directly.
- [ ] **[MVP]** Build a member-management screen for managers if organization invitations are in MVP.
- [ ] **[MVP]** Implement invitation creation, expiry, acceptance, revocation, and manager/member permissions if enabled.
- [ ] **[MVP]** Let admins suspend/reinstate organizations and automatically block ordering while suspended.
- [ ] **[MVP]** Verify that only approved organizations are visible in the public shelter directory.

## Phase 6 — donation listing and moderation

- [ ] **[MVP]** Define approved food/item categories and clear food-safety guidance next to the listing form.
- [ ] **[MVP]** Create donation form with title, category, quantity, unit, description, food/non-food flag, photos, condition, allergens, expiry, and pickup window.
- [ ] **[MVP]** Require a future best-before/expiry date for perishable foods.
- [ ] **[MVP]** Validate quantity is positive and uses a supported unit.
- [ ] **[MVP]** Reject prohibited, unsafe, opened, contaminated, or temperature-compromised food via policy and moderation rules.
- [ ] **[MVP]** Keep exact pickup address private until an authorized order is active.
- [ ] **[MVP]** Allow donors to save drafts, submit for review, view status, and cancel only eligible listings.
- [ ] **[MVP]** Upload donation images to scoped Storage paths with progress and cleanup on abandoned drafts.
- [ ] **[MVP]** Implement `submitDonationForReview`; copy only safe display fields into public/listing views.
- [ ] **[MVP]** Build donor dashboard donation list with filters for draft, pending review, available, reserved, collected, expired, rejected, and cancelled.
- [ ] **[MVP]** Build donation detail page with role-specific information and an availability summary.
- [ ] **[MVP]** Build the admin donation moderation queue, detail review, approval/rejection reason, and status history.
- [ ] **[MVP]** Implement `moderateDonation` with audit log and donor notification.
- [ ] **[MVP]** Build safety/policy report form and admin resolution workflow.
- [ ] **[MVP]** Implement scheduled expiry processing and donor/order notifications.
- [ ] **[MVP]** Ensure expired/cancelled/rejected listings cannot receive an order.
- [ ] **[MVP]** Add server-side image scanning/moderation integration only if explicitly approved; do not rely on it as the sole safety measure.

## Phase 7 — organization ordering, reservation, and collection

- [ ] **[MVP]** Build available donation board for approved active organization members.
- [ ] **[MVP]** Add category, food type, quantity, expiry, and pickup-window filters with Firestore-supported queries.
- [ ] **[MVP]** Show only safe listing information before reservation; hide exact pickup address and private donor details.
- [ ] **[MVP]** Add requested-quantity input and show available quantity, unit, expiry, and safety/allergen information.
- [ ] **[MVP]** Validate user has active membership in an approved organization before the order UI is enabled.
- [ ] **[MVP]** Implement `createOrder` as a Firestore transaction that re-reads listing status and `quantityAvailable`.
- [ ] **[MVP]** Atomically decrement available quantity, create reservation, create order, and set donation status.
- [ ] **[MVP]** Define reservation expiry and automatically release stock for expired/cancelled/rejected orders.
- [ ] **[MVP]** Generate a high-entropy pickup code server-side; store only a hash and a safe final-four display value.
- [ ] **[MVP]** Send order-created notification to donor and requesting organization member.
- [ ] **[MVP]** Build donor order view to confirm, reject, and view pickup window according to policy.
- [ ] **[MVP]** Build organization order view with requested/confirmed quantity, pickup details, status timeline, and safety notes.
- [ ] **[MVP]** Implement `transitionOrder` with an explicit allowed-state map; never trust a client-supplied next status.
- [ ] **[MVP]** Implement pickup-code verification and record donor handover confirmation.
- [ ] **[MVP]** Implement organization receipt confirmation including final quantity received and optional beneficiaries served.
- [ ] **[MVP]** Update donation/order status and impact metrics only after valid confirmation sequence.
- [ ] **[MVP]** Build cancellation/rejection flow with reason capture, notifications, and atomic stock release.
- [ ] **[MVP]** Test simultaneous reservations so stock can never become negative or oversold.
- [ ] **[MVP]** Test partial orders and fully-reserved listings.
- [ ] **[MVP]** Test donor, organization, and admin access boundaries for each order state.

## Phase 8 — sponsorship pledges

- [ ] **[MVP]** Write simple sponsorship copy that explicitly describes pledges, not payment collection.
- [ ] **[MVP]** Create sponsorship options page for food baskets, meal support, supplies, and custom in-kind support.
- [ ] **[MVP]** Create sponsorship pledge form with type, frequency, quantity/unit, start date, target organization/category, and notes.
- [ ] **[MVP]** Do not collect card, bank, M-Pesa, wallet, or cash-transfer data.
- [ ] **[MVP]** Validate target organization is approved when one is selected.
- [ ] **[MVP]** Create sponsor dashboard with active, paused, completed, and cancelled pledges.
- [ ] **[MVP]** Let sponsor pause, resume, or cancel an eligible pledge with audit/event history.
- [ ] **[MVP]** Create fulfillment submission with delivery date, quantity, notes, and scoped evidence uploads.
- [ ] **[MVP]** Create review view for the permitted organization manager/admin to verify or reject fulfillment evidence.
- [ ] **[MVP]** Implement `verifySponsorshipFulfillment` and calculate the next due date only on verified fulfillment.
- [ ] **[MVP]** Notify sponsors about due dates, verification decisions, paused pledges, and completed commitments.
- [ ] **[MVP]** Show target organizations only the sponsorship data they are allowed to see.
- [ ] **[MVP]** Add sponsorship fulfillment totals to private/admin reports only after verification.

## Phase 9 — impact stories, photos, and safeguarding

- [ ] **[MVP]** Create an impact-story draft form for authorized organization members/admins.
- [ ] **[MVP]** Include title, summary, story text, organization, impact metrics, image uploads, and consent reference.
- [ ] **[MVP]** Create a private media-consent record/upload workflow with consent date, scope, expiry, and verification status.
- [ ] **[MVP]** Require guardian/authorized-organization consent before identifying child photos are uploaded or published.
- [ ] **[MVP]** Record whether images are identifying, group, or non-identifying; prefer non-identifying images whenever possible.
- [ ] **[MVP]** Prohibit beneficiary names, exact residence/location, health information, or traumatic personal history in public copy.
- [ ] **[MVP]** Build admin story review queue with consent status, media preview, publish/reject reason, and archive action.
- [ ] **[MVP]** Implement `publishImpactStory` to verify approved organization, valid consent record, and safe publication status.
- [ ] **[MVP]** Ensure Storage rules do not make a draft/rejected/withdrawn story’s media public.
- [ ] **[MVP]** Add consent withdrawal workflow that immediately unpublishes related stories and revokes public media access.
- [ ] **[MVP]** Add consent-expiry scheduled check and notify organization/admin before or at expiry.
- [ ] **[MVP]** Use published stories only in home-page gallery, featured content, and public organization profiles.
- [ ] **[MVP]** Perform a human safeguarding review of all launch stories and images.

## Phase 10 — notifications and communication

- [ ] **[MVP]** Create a typed notification-event catalog and standard short message templates.
- [ ] **[MVP]** Create `notifications` documents for account, application, donation, order, collection, sponsorship, and story events.
- [ ] **[MVP]** Build notification bell, unread count, inbox, read/unread state, and deep links.
- [ ] **[MVP]** Ensure a user can mark only their own notification as read.
- [ ] **[MVP]** Choose and configure a transactional email provider before sending email notifications.
- [ ] **[MVP]** Store email-provider credentials as Firebase Functions secrets, never in the client or source code.
- [ ] **[MVP]** Implement idempotent email sending and delivery-failure handling.
- [ ] **[MVP]** Keep exact pickup addresses, private documents, codes, and sensitive beneficiary details out of email/push notification previews.
- [ ] **[MVP]** Add user notification preferences for non-critical email categories.
- [ ] **[Later]** Enable browser push via Firebase Cloud Messaging after in-app/email notifications are stable and consent UX is complete.
- [ ] **[Later]** Do not add SMS, WhatsApp, or direct chat unless scope is formally expanded.

## Phase 11 — admin, reporting, and operations

- [ ] **[MVP]** Build admin dashboard cards for pending applications, listings awaiting review, expiring donations, active orders, reports, fulfillment reviews, and story reviews.
- [ ] **[MVP]** Build reusable admin tables with server-side compatible filters, pagination, search strategy, and status badges.
- [ ] **[MVP]** Build organization review detail, decision confirmation, reason entry, and audit-history display.
- [ ] **[MVP]** Build donation moderation detail and safety-report resolution screens.
- [ ] **[MVP]** Build sponsorship fulfillment review screens.
- [ ] **[MVP]** Build impact-story/consent review screen with protected media access.
- [ ] **[MVP]** Add account/organization suspension and reinstatement flows with access effects clearly explained.
- [ ] **[MVP]** Write append-only audit logs for approvals, rejections, status changes, stock changes, role changes, membership changes, and content publication.
- [ ] **[MVP]** Redact secrets, pickup codes, private addresses, and unnecessary personal data from audit payloads.
- [ ] **[MVP]** Implement/reconcile `siteMetrics/current` from received orders and verified fulfillment data.
- [ ] **[MVP]** Build reports for donated quantity/items, estimated meals, beneficiaries served, active shelters, active donors, organization approvals, and order completion.
- [ ] **[MVP]** Make reports aggregate by default and restrict personally identifying exports.
- [ ] **[MVP]** Set a documented report-export approval process and retention period.
- [ ] **[MVP]** Create operational runbooks for application review, unsafe-food reports, lost pickup codes, consent withdrawal, and account suspension appeals.

## Phase 12 — Cloud Functions and scheduled jobs

- [ ] **[MVP]** Set up TypeScript Firebase Functions project with linting, tests, emulator configuration, and secret access.
- [ ] **[MVP]** Implement `onAuthUserCreated` safely and idempotently.
- [ ] **[MVP]** Implement `reserveUsername` with normalization, reserved-word checks, uniqueness transaction, and rate limiting.
- [ ] **[MVP]** Implement admin role management using Firebase Admin SDK custom claims and audit records.
- [ ] **[MVP]** Implement application submit/review functions with authorization checks and atomic approval effects.
- [ ] **[MVP]** Implement donation submit/moderation functions.
- [ ] **[MVP]** Implement transactional order creation and reservation release.
- [ ] **[MVP]** Implement state-validated order transition and pickup-code verification.
- [ ] **[MVP]** Implement sponsorship fulfillment verification and due-date scheduling.
- [ ] **[MVP]** Implement consent-validated impact-story publication and unpublication.
- [ ] **[MVP]** Implement scheduled food expiry, order/reservation expiry, sponsorship reminders, consent-expiry checks, and metrics reconciliation.
- [ ] **[MVP]** Add idempotency keys/guards to every event-driven side effect, especially notifications and metric updates.
- [ ] **[MVP]** Validate all callable input server-side, even when the client form already validates it.
- [ ] **[MVP]** Return safe, actionable function errors and log sufficient internal diagnostic information.
- [ ] **[MVP]** Add rate limits/abuse controls to sign-up-adjacent, username, application, order, and upload-related functions.
- [ ] **[MVP]** Create function unit/integration tests for authorization, state transitions, concurrent orders, expiry, and failure retry behavior.

## Phase 13 — quality assurance and security testing

- [ ] **[MVP]** Test as visitor, regular user/donor, organization member, organization manager, suspended organization member, and admin.
- [ ] **[MVP]** Test sign-up, username conflict, sign-in, password reset, email verification, sign-out, and suspension states.
- [ ] **[MVP]** Test every organization application state and its notifications.
- [ ] **[MVP]** Test every donation state, including expiry during review and cancellation while partially reserved.
- [ ] **[MVP]** Test order quantity boundaries, simultaneous requests, cancellation, code failure, repeated confirmation, and receipt confirmation.
- [ ] **[MVP]** Test sponsorship creation, pause/resume/cancel, fulfillment rejection, verification, and next due-date calculation.
- [ ] **[MVP]** Test that a story cannot be published without a valid consent record and that withdrawal removes it from public views.
- [ ] **[MVP]** Run Firestore rules tests for both positive and negative cases on every collection.
- [ ] **[MVP]** Run Storage rules tests for public stories, private applications, private consents, and donor-owned uploads.
- [ ] **[MVP]** Verify a browser cannot forge an admin claim, review outcome, stock update, metrics update, pickup code, or audit entry.
- [ ] **[MVP]** Test client and function behavior with slow networks, offline state, duplicate clicks, stale data, and function timeout.
- [ ] **[MVP]** Test all primary routes on current mobile and desktop browsers.
- [ ] **[MVP]** Conduct keyboard-only and screen-reader checks of key flows.
- [ ] **[MVP]** Run a production build, inspect bundle size, and lazy-load admin/heavy routes where practical.
- [ ] **[MVP]** Complete a privacy/security review before creating real user or beneficiary data.
- [ ] **[MVP]** Conduct user acceptance testing with at least one donor, one organization manager, and one administrator using staging data.

## Phase 14 — deployment and launch

- [ ] **[MVP]** Create separate hosting targets/environments for staging and production.
- [ ] **[MVP]** Deploy Firestore indexes, Firestore rules, Storage rules, and Functions through a reviewed pipeline.
- [ ] **[MVP]** Enable Firebase App Check for production web app after validating legitimate traffic setup.
- [ ] **[MVP]** Configure custom domain, HTTPS, authorized Auth domains, and email action URLs.
- [ ] **[MVP]** Configure Firebase/Google Cloud budgets, alerts, quota monitoring, and function error alerts.
- [ ] **[MVP]** Set up backups/export policy and test a documented recovery procedure.
- [ ] **[MVP]** Verify production secrets are configured and no development secrets are present in build artifacts.
- [ ] **[MVP]** Seed only approved non-sensitive launch organizations, donation examples, and impact stories.
- [ ] **[MVP]** Review all public copy for clear no-payment/no-delivery boundaries.
- [ ] **[MVP]** Validate public sitemap, page titles, descriptions, robots settings, and social-preview imagery without child-identifying photos.
- [ ] **[MVP]** Publish contact/support and issue-reporting instructions.
- [ ] **[MVP]** Train administrators on review queues, data handling, safeguarding, food safety, and incident runbooks.
- [ ] **[MVP]** Conduct a final launch rehearsal in staging: register → apply → approve → donate → order → collect → receipt → impact report.
- [ ] **[MVP]** Obtain explicit go-live sign-off from product owner, safeguarding/organization reviewer, and technical owner.

## Post-launch backlog

- [ ] **[Later]** Add browser push notifications after users opt in.
- [ ] **[Later]** Add more advanced search if Firestore filters are insufficient; assess privacy and cost first.
- [ ] **[Later]** Add verified organization invitations and deeper organization-team administration if not included in MVP.
- [ ] **[Later]** Add multi-language support following translated legal/safety content review.
- [ ] **[Later]** Add payment processing only after legal, finance, fraud, reconciliation, refund, and data-protection requirements are designed.
- [ ] **[Later]** Add delivery/logistics only after partner, safety, routing, and insurance requirements are designed.
- [ ] **[Later]** Add mobile apps after web workflows are stable and accessibility-tested.
- [ ] **[Later]** Add carefully governed feedback/rating features only after moderation and safeguarding policies exist.

## MVP release gate

Do not launch until every **[MVP]** item required for the enabled feature set is complete, especially these non-negotiable controls:

- [ ] Authentication and admin authorization cannot be bypassed.
- [ ] Firestore/Storage rules have automated allow/deny coverage.
- [ ] Organization approval gates ordering access.
- [ ] Orders reserve stock atomically and cannot oversell a donation.
- [ ] Expired/unsafe food cannot be ordered.
- [ ] Sponsorships do not collect or process payments.
- [ ] Public child-impact media has valid consent and admin publication approval.
- [ ] Private documents, exact pickup details, beneficiary data, and consent records are not publicly accessible.
- [ ] Audit logs, monitoring, backups, and operational incident runbooks are in place.
