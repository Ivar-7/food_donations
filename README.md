# FoodBridge — Food Donation & Shelter Support Platform

## 1. Project overview

FoodBridge is a **web-based** platform that connects individual donors and sponsors with approved shelters, NGOs, and similar charitable organizations. Donors can publish available food or other approved essential items. Approved organizations can browse the available stock, place an order (claim), collect it, and record receipt. The platform also shows transparent impact stories and aggregate statistics, including carefully approved photos of children receiving food.

The aim is to reduce usable food waste while making distribution to shelters more organized, traceable, and fair.

For the phase-by-phase build checklist, see [TODO.md](TODO.md).

### Primary users

| User type           | Description                                                   | Main capabilities                                                                                                                         |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Visitor             | Not signed in                                                 | View the landing page, impact stories, shelters, and public availability where appropriate.                                               |
| User                | A registered donor/sponsor with email, password, and username | Donate food/items, create sponsorship pledges, manage their contributions, receive notifications, and apply on behalf of an organization. |
| Organization member | A user linked to an approved organization                     | Browse and order donated stock for that organization, track orders, and record collection/receipt.                                        |
| Platform admin      | Trusted system administrator                                  | Approve or reject organizations, manage listings, stories, shelters, users, notifications, and reports.                                   |

`user` and `admin` are the only **platform roles**. Organization-level access is represented through membership records (`manager` or `member`), not by adding another platform role.

## 2. Scope and boundaries

### Included in the first release

- Email/password sign-up, sign-in, password reset, username selection, and user profiles.
- Role-based access for users and admins.
- Food and approved in-kind donation listings with availability, expiry, quantities, collection details, and status.
- Sponsorship pledges from users (for example, a monthly food basket commitment or an in-kind commitment).
- Public shelter/organization directory.
- Organization registration and an admin approval workflow.
- Ordering/claiming donated stock by approved organizations.
- Collection confirmation using a pickup/claim code.
- In-app notifications and email notifications for critical account/order events.
- Admin dashboard, moderation tools, audit trail, and basic impact reporting.
- Home-page impact content, including approved stories and photos of children receiving food.

### Explicitly out of scope for the first release

- Payment processing, wallets, bank/M-Pesa/card handling, or tax receipts for cash payments.
- Delivery, driver assignment, route planning, or live tracking.
- Mobile-native apps.
- SMS, WhatsApp, maps/geolocation, chat, ratings, AI recommendations, and multiple languages.
- Direct messaging between users.

> **Important sponsorship boundary:** FoodBridge records a sponsorship **pledge** and its fulfillment evidence. It does not accept, hold, transfer, or reconcile money. A future payment integration must be a separately approved phase.

## 3. Product goals and success measures

| Goal                           | Measurement                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Reduce food waste              | Total quantity/estimated meals marked as received.                                         |
| Serve legitimate organizations | Percentage of organization applications reviewed; number of approved active organizations. |
| Make distribution traceable    | Percentage of orders with collection and receipt confirmation.                             |
| Keep donors engaged            | Repeat donors/sponsors and fulfilled sponsorship pledges.                                  |
| Protect beneficiaries          | 100% of public child images have recorded consent and admin approval.                      |

## 4. User journeys

### A. Donor posts surplus food

1. A visitor signs up with email, password, and a unique username.
2. The user creates a donation listing: item, category, quantity, unit, description, expiry/best-before date, collection window, and pickup instructions.
3. The listing is `pending_review` or `available` depending on the chosen moderation policy. Admin review is recommended for the first release.
4. An approved organization reserves some or all of the listing by placing an order.
5. The donor and organization see a generated pickup code and collection details.
6. At handover, the donor or organization confirms collection; the organization confirms receipt. The quantity becomes part of the impact report.

### B. User makes a sponsorship pledge

1. The user selects a sponsorship type (for example, food basket, meals, or supplies) and a frequency.
2. The user records the pledged amount/quantity and optional target organization or category.
3. The pledge remains `active`; reminders are created before each due date.
4. The user submits a fulfillment record when they deliver/provide the pledged in-kind support.
5. An admin or the target organization verifies it, and the next due date is calculated.

### C. Organization registers and orders food

1. A signed-in user submits the organization registration form and supporting verification documents.
2. The application stays `pending` until an admin approves or rejects it with a reason.
3. Once approved, the applicant becomes the organization `manager` and can invite/add existing users as members.
4. A member selects an available donation and enters a requested quantity.
5. The system validates remaining stock, creates an order, and reserves stock atomically.
6. The organization collects the items, then confirms receipt and beneficiary count.

### D. Admin review

1. Admin opens the queue for organizations, donations, impact stories, or reports.
2. Admin approves, rejects, suspends, or requests correction with a reason.
3. The system writes an immutable audit record and notifies the affected user/organization.

## 5. Pages and navigation plan

| Route/page              | Audience                      | Contents and actions                                                                                                                                                               |
| ----------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` Home                | Everyone                      | Hero, mission, current impact totals, featured approved shelters, urgent available donations, sponsor call-to-action, and approved “children receiving food” impact story gallery. |
| `/about`                | Everyone                      | How the platform works, safety/food-quality guidance, and boundaries.                                                                                                              |
| `/shelters`             | Everyone                      | Searchable directory of approved shelters/organizations; public profile cards and needs.                                                                                           |
| `/shelters/:slug`       | Everyone                      | Organization story, verified status, needs, impact, and approved public photos.                                                                                                    |
| `/donations`            | Everyone / signed-in action   | Filtered available donation board; only approved organization members can reserve.                                                                                                 |
| `/donations/new`        | Signed-in user                | Create donation listing.                                                                                                                                                           |
| `/donations/:id`        | Relevant users/admin          | Listing details, stock, collection information, and order history allowed by access rules.                                                                                         |
| `/sponsorships`         | Everyone / signed-in action   | Sponsorship options, FAQ, and active campaigns.                                                                                                                                    |
| `/sponsorships/new`     | Signed-in user                | Create a pledge.                                                                                                                                                                   |
| `/organizations/apply`  | Signed-in user                | Organization application and document upload.                                                                                                                                      |
| `/dashboard`            | Signed-in user                | Contributions, sponsorships, linked organization memberships, notifications, profile.                                                                                              |
| `/organization/orders`  | Approved organization members | Available items, cart/order flow, active and completed orders.                                                                                                                     |
| `/admin`                | Admin only                    | Overview metrics and links to all moderation queues.                                                                                                                               |
| `/admin/organizations`  | Admin only                    | Review/approve/reject/suspend organizations.                                                                                                                                       |
| `/admin/donations`      | Admin only                    | Moderate listings and resolve disputes.                                                                                                                                            |
| `/admin/content`        | Admin only                    | Approve impact stories, photos, and consent records.                                                                                                                               |
| `/notifications`        | Signed-in user                | Notification inbox and read state.                                                                                                                                                 |
| `/privacy` and `/terms` | Everyone                      | Privacy, image-consent, and service terms.                                                                                                                                         |

## 6. Home page content plan

The home page must feel hopeful, credible, and action-oriented—not like a generic marketplace.

1. **Hero:** “Good food reaches growing futures.” Buttons: _Donate food_, _Sponsor support_, _Register an organization_.
2. **Impact strip:** live, aggregate counts such as meals supported, kilograms/items received, active shelters, and active donors. Do not show personally identifying beneficiary data.
3. **Children receiving food gallery:** 3–4 approved `impactStories`, each with an image, short caption, shelter name, and outcome. Images may be public only after child/guardian consent and admin review; otherwise use non-identifying images (hands, food packs, group activity from behind) or illustrations.
4. **How it works:** Donate → approved organization orders → collect & confirm → impact recorded.
5. **Urgent donations:** a small, expiry-sorted selection of safe, available food.
6. **Featured shelters:** approved organization cards linking to directory profiles.
7. **Sponsorship callout:** explains pledge-only first-release model, types of sponsorship, and how fulfillment is verified.
8. **Trust section:** verification process, food safety rules, no payment handling, and reporting transparency.

## 7. Firebase architecture

| Firebase service             | Responsibility                                                                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firebase Authentication      | Email/password identity, password reset, verified-email status, auth state.                                                                                                   |
| Cloud Firestore              | Application data, workflow state, memberships, notifications, reports, and audit records.                                                                                     |
| Cloud Storage                | Donation images, organization verification documents, impact-story images, and consent documents.                                                                             |
| Cloud Functions for Firebase | Trusted operations: username reservation, role claims, stock reservation, pickup-code generation, status changes, scheduled reminders/expiry handling, and aggregate metrics. |
| Firebase Cloud Messaging     | Browser push notifications (optional enhancement after in-app notifications).                                                                                                 |
| Firebase Hosting             | Deploy the React single-page application.                                                                                                                                     |
| Firebase App Check           | Reduce abuse from untrusted clients in production.                                                                                                                            |
| Emulator Suite               | Local Auth, Firestore, Storage, and Functions development/testing.                                                                                                            |

### Client and backend responsibility split

The React client may read public data and create its own drafts/requests. It must **not** grant roles, approve organizations, change stock directly, verify receipt, or change an order to a privileged state. These actions go through callable Cloud Functions or admin-only Firestore writes. Firebase Admin SDK runs only in Cloud Functions.

## 8. Firestore data model

Firestore uses collections rather than relational SQL tables. The following collection design is the project’s database plan. Every document has `createdAt`, `updatedAt`, and, where relevant, `createdBy`/`updatedBy` server timestamps.

### 8.1 Identity and access collections

| Collection / document                      | Key fields                                                                       | Purpose and access                                                                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `users/{uid}`                              | `email`, `username`, `displayName`, `phone?`, `photoURL?`, `platformRole: 'user' | 'admin'`, `status: 'active'                                                                                                                     | 'suspended'`, `emailVerified`, `notificationPreferences`                                  | Private profile. User reads/updates safe own fields; admin has controlled access. `platformRole` is server-managed. |
| `usernames/{normalizedUsername}`           | `uid`, `username`, `createdAt`                                                   | Unique username reservation. Written only by `reserveUsername` function; readable only as needed for availability checking or through function. |
| `adminUsers/{uid}`                         | `uid`, `grantedAt`, `grantedBy`, `active`                                        | Admin allow-list/audit record; source for custom claims. Never client-writable.                                                                 |
| `organizationMembers/{organizationId_uid}` | `organizationId`, `uid`, `memberRole: 'manager'                                  | 'member'`, `status`, `joinedAt`, `addedBy`                                                                                                      | Flat membership lookup used by security rules and queries. Only manager/admin changes it. |

### 8.2 Organizations and shelter directory

| Collection / document                      | Key fields                                                                                                                                               | Purpose and access                                                                                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `organizations/{organizationId}`           | `name`, `slug`, `type: 'shelter'                                                                                                                         | 'ngo'                                                                                                                                                             | 'community_group'`, `description`, `contactEmail`, `contactPhone`, `addressText`, `serviceArea`, `capacity?`, `beneficiaryCount?`, `needs[]`, `status: 'pending' | 'approved'                           | 'rejected'                                                                                      | 'suspended'`, `publicProfile`, `managerUid`, `review` | Primary organization/shelter record. Publicly readable only when `approved` and `publicProfile` is true. |
| `organizationApplications/{applicationId}` | `applicantUid`, `organizationId?`, organization form fields, `documentPaths[]`, `status`, `submittedAt`, `reviewedAt?`, `reviewedBy?`, `decisionReason?` | Immutable submitted application plus review decision. Applicant and admin access only. Approval function creates/updates the organization and manager membership. |
| `organizationInvites/{inviteId}`           | `organizationId`, `email`, `memberRole`, `status: 'pending'                                                                                              | 'accepted'                                                                                                                                                        | 'revoked'                                                                                                                                                        | 'expired'`, `expiresAt`, `invitedBy` | Optional controlled membership invitation workflow. Organization managers and admins manage it. |

### 8.3 Donations and inventory

| Collection / document                                 | Key fields                                                                                                                                                                                                                                                                                   | Purpose and access                                                                                                                                                                                                                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `donations/{donationId}`                              | `donorUid`, `title`, `description`, `category`, `isFood`, `quantityTotal`, `quantityAvailable`, `unit`, `estimatedMeals?`, `expiryDate?`, `allergens[]`, `conditionNotes`, `imagePaths[]`, `pickupWindowStart`, `pickupWindowEnd`, `pickupAddressText`, `status`, `moderation`, `visibility` | A donated food/item listing. Status: `draft`, `pending_review`, `available`, `partially_reserved`, `fully_reserved`, `collected`, `expired`, `cancelled`, `rejected`. Donor/admin manage; approved organization members can read safe available fields. |
| `donations/{donationId}/reservations/{reservationId}` | `orderId`, `organizationId`, `quantity`, `status`, `reservedAt`, `expiresAt?`                                                                                                                                                                                                                | Readable to involved parties/admin. Created only by transaction/function. Helps trace split allocations.                                                                                                                                                |
| `donationReports/{reportId}`                          | `donationId`, `reporterUid`, `reason`, `detail`, `status`, `resolution`, `resolvedBy?`                                                                                                                                                                                                       | Safety or policy report/dispute queue. Visible to reporter and admin.                                                                                                                                                                                   |

### 8.4 Sponsorships

| Collection / document                                       | Key fields                                                                                     | Purpose and access |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------ |
| `sponsorships/{sponsorshipId}`                              | `sponsorUid`, `title`, `sponsorshipType: 'food_basket'                                         | 'meal_support'     | 'supplies'                                      | 'custom'`, `frequency: 'one_time'                                                                                     | 'monthly' | 'quarterly'`, `quantity`, `unit`, `targetOrganizationId?`, `startDate`, `nextDueDate`, `status: 'active' | 'paused' | 'completed' | 'cancelled'`, `notes` | A non-payment pledge. Sponsor can manage own pledge; linked organization sees verified/relevant pledge only; admin moderates. |
| `sponsorships/{sponsorshipId}/fulfillments/{fulfillmentId}` | `fulfilledByUid`, `fulfilledAt`, `quantity`, `evidencePaths[]`, `verificationStatus: 'pending' | 'verified'         | 'rejected'`, `verifiedBy?`, `verificationNote?` | Proof and verification of each pledge fulfillment. Create by sponsor; verify by admin or target organization manager. |

### 8.5 Orders, collection, and impact

| Collection / document                      | Key fields                                                                                                                                                                                                                                              | Purpose and access                                                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orders/{orderId}`                         | `organizationId`, `requestedByUid`, `donationId`, `donorUid`, `items[]`, `quantityRequested`, `quantityApproved`, `pickupCodeHash`, `pickupCodeLast4`, `pickupWindowStart`, `pickupWindowEnd`, `status`, `notes`, `receivedAt?`, `beneficiariesServed?` | An organization’s claim/order from a donation. Status: `requested`, `confirmed`, `ready_for_collection`, `collected`, `received`, `cancelled`, `expired`, `rejected`. Item quantity is reserved atomically. |
| `collectionConfirmations/{confirmationId}` | `orderId`, `confirmedByUid`, `actor: 'donor'                                                                                                                                                                                                            | 'organization'                                                                                                                                                                                              | 'admin'`, `confirmationType: 'handover' | 'receipt'`, `confirmedAt`, `notes`, `evidencePaths[]` | Tamper-resistant handover/receipt history. Cloud Function updates order only after valid sequence. |
| `impactStories/{storyId}`                  | `organizationId`, `title`, `summary`, `content`, `imagePaths[]`, `coverImagePath?`, `consentStatus`, `status: 'draft'                                                                                                                                   | 'pending_review'                                                                                                                                                                                            | 'published'                             | 'rejected'                                            | 'archived'`, `publishedAt?`, `metrics`                                                             | Editorial content for the home page and organization profiles. Public only when published. |
| `mediaConsents/{consentId}`                | `organizationId`, `storyId?`, `subjectType`, `guardianName?`, `consentDocumentPath`, `consentDate`, `expiresAt?`, `verifiedBy`, `verifiedAt`, `status`                                                                                                  | Private safeguarding record. Never public or user-readable except narrowly authorized organization manager/admin access.                                                                                    |

### 8.6 Operational and system collections

| Collection / document            | Key fields                                                                                                    | Purpose and access                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `notifications/{notificationId}` | `recipientUid`, `type`, `title`, `body`, `link`, `readAt?`, `channel: 'in_app'                                | 'email'                                                                                                      | 'push'`, `createdAt` | Personal notification inbox. User sees only their own; admin/system creates. |
| `auditLogs/{logId}`              | `actorUid?`, `actorType`, `action`, `entityType`, `entityId`, `before?`, `after?`, `reason?`, `createdAt`     | Append-only compliance and debugging history; admin-only read. Sensitive values must be redacted.            |
| `siteMetrics/current`            | `totalDonationsReceived`, `estimatedMealsSupported`, `activeOrganizations`, `activeDonors`, `updatedAt`       | Public, aggregate home-page counter document. Cloud Functions update it from completed/verified events only. |
| `systemConfig/public`            | `maintenanceMode`, `featuredOrganizationIds`, `featuredStoryIds`, `supportedCategories`, `sponsorshipOptions` | Admin-managed public configuration, with safe values only.                                                   |

### 8.7 Cloud Storage path plan

| Storage path                                              | Files                            | Access                                                                                                           |
| --------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `donations/{donationId}/{fileName}`                       | Donation images/evidence         | Donor and admins write; available images may be readable by approved organization members as allowed by listing. |
| `organizations/{organizationId}/verification/{fileName}`  | Registration documents           | Applicant during submission and admin only; always private.                                                      |
| `stories/{storyId}/{fileName}`                            | Public impact-story images       | Upload by authorized organization/admin; public read only after the linked story is published.                   |
| `consents/{organizationId}/{consentId}/{fileName}`        | Guardian/media consent documents | Strictly organization manager/admin; never publicly readable.                                                    |
| `sponsorships/{sponsorshipId}/{fulfillmentId}/{fileName}` | Fulfillment evidence             | Sponsor, target organization manager where relevant, and admin.                                                  |

## 9. Data relationships and state rules

```text
Firebase Auth user
  └── users/{uid}
       ├── creates donations ──< orders >── organizationMembers ──> organizations
       ├── creates sponsorships ──< fulfillments
       └── receives notifications

organizations ──< impactStories ──< mediaConsents
organizations ──< organizationApplications (approval creates organization + manager membership)
donations ──< reservations ──> orders ──< collectionConfirmations
```

### Critical state transitions

| Entity                   | Allowed flow                                                                                                                           | Who can trigger it                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Organization application | `pending → approved` / `rejected`; approved organization can later be `suspended`                                                      | Admin Cloud Function only.                                                                                                      |
| Donation                 | `draft → pending_review → available → partially_reserved/fully_reserved → collected`; may become `expired`, `cancelled`, or `rejected` | Donor can draft/submit/cancel before reservation; admin moderates; function handles reservation/expiry.                         |
| Order                    | `requested → confirmed → ready_for_collection → collected → received`                                                                  | Function validates acting donor/org/admin and pickup-code requirements. Cancellation/rejection releases reservation atomically. |
| Sponsorship              | `active ↔ paused`; `active → completed/cancelled`; fulfillment `pending → verified/rejected`                                           | Sponsor manages their pledge; admin/target-org manager verifies fulfillment.                                                    |
| Impact story             | `draft → pending_review → published/rejected → archived`                                                                               | Organization author submits; admin publishes only after consent validation.                                                     |

## 10. Security and privacy plan

### Authentication and authorization

- Use Firebase Auth email/password. Require password-strength guidance and send a verification email; block sensitive actions until verified if desired.
- Store username separately in `users` and reserve it in `usernames` through a transaction in a callable function. Use lowercase normalized values and restrict changes (for example, once every 30 days).
- Set the Firebase custom claim `platformRole: 'admin'` only through the Admin SDK. Firestore fields are a mirror for display/audit, not the authority for admin access.
- Check organization membership plus organization `approved` status before an order can be created.
- Use Cloud Functions for any stock change, approval, role assignment, pickup-code verification, metric increment, or outgoing email.

### Firestore rules policy matrix

| Resource                                   | Read                                                       | Create/update/delete                                                                         |
| ------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Own `users/{uid}`                          | Owner; admin where necessary                               | Owner may change allowed profile fields only; server manages role/status/email.              |
| Approved public organizations/stories      | Anyone                                                     | Admin publishes; authorized organization users create drafts only.                           |
| Pending applications and verification docs | Applicant and admin                                        | Applicant creates/updates only while pending; admin decides.                                 |
| Available donation details                 | Authenticated visitor or public subset by product decision | Donor creates/edits own unreserved listing; admin moderates; reservations only via function. |
| Orders and confirmations                   | Involved donor, organization members, admin                | Only callable functions create transitions and confirmations.                                |
| Sponsorships/fulfillments                  | Sponsor, applicable target organization, admin             | Sponsor creates own; verification via controlled function.                                   |
| Notifications                              | Recipient only                                             | Server/admin only creates; recipient can set `readAt` only.                                  |
| Audit logs, consents, admin allow-list     | Admin only                                                 | Server/admin only; audit logs append-only.                                                   |

### Safeguarding requirements for child images

- Obtain and store documented guardian/authorized-organization consent before upload/publication.
- Do not expose children’s names, exact locations, health data, or personal histories in public content.
- An admin must verify a linked, current `mediaConsents` record before an impact story can become `published`.
- Give the organization a withdrawal/removal process; unpublish images promptly when consent expires or is withdrawn.
- Prefer respectful, non-identifying photography. Use images solely for impact communication, never for advertising unrelated products.

### Food safety and abuse prevention

- Require expiry/best-before dates for perishable food and automatically hide/expire past items.
- Show allergen and condition warnings; forbid unsafe, opened, contaminated, or temperature-compromised food under published guidelines.
- Rate-limit sensitive callable functions, enable App Check, validate every payload server-side, and log moderation actions.
- Keep exact pickup information visible only to parties in an active, approved order—not on public cards.

## 11. Cloud Functions plan

| Function                        | Trigger/type         | Responsibility                                                                                                   |
| ------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `onAuthUserCreated`             | Auth trigger         | Create minimal `users/{uid}` profile and welcome notification.                                                   |
| `reserveUsername`               | Callable             | Validate/normalize username and atomically reserve it.                                                           |
| `setAdminRole`                  | Callable/admin-only  | Set/remove admin custom claim and write audit record.                                                            |
| `submitOrganizationApplication` | Callable             | Validate submission and create application/document references.                                                  |
| `reviewOrganizationApplication` | Callable/admin-only  | Approve/reject, create/update organization, add manager membership, notify applicant.                            |
| `submitDonationForReview`       | Callable             | Validate item data, image references, expiry, and transition to review queue.                                    |
| `moderateDonation`              | Callable/admin-only  | Approve/reject listing and notify donor.                                                                         |
| `createOrder`                   | Callable             | Re-read donation and membership; transactionally reserve available quantity, create order, generate pickup code. |
| `transitionOrder`               | Callable             | Enforce actor/state checks; release stock on cancel/expire; update donation status and metrics.                  |
| `verifyPickupCode`              | Callable             | Compare hashed code; record handover confirmation without exposing full code.                                    |
| `verifySponsorshipFulfillment`  | Callable             | Verify/reject evidence, calculate next due date, notify sponsor.                                                 |
| `publishImpactStory`            | Callable/admin-only  | Check consent document/status and publish or reject story.                                                       |
| `expireStaleItems`              | Scheduled            | Mark expired donations/reservations/orders and notify relevant parties.                                          |
| `sendNotification`              | Firestore trigger    | Deliver configured email/push notifications from notification events.                                            |
| `recalculateMetrics`            | Scheduled/admin-only | Reconcile aggregate metrics and detect inconsistent counts.                                                      |

## 12. Required Firestore indexes

Create these composite indexes during implementation (exact requirements may also be surfaced by Firebase console errors):

| Collection                 | Fields                                           |
| -------------------------- | ------------------------------------------------ |
| `donations`                | `status ASC, category ASC, expiryDate ASC`       |
| `donations`                | `status ASC, pickupWindowEnd ASC`                |
| `donations`                | `donorUid ASC, createdAt DESC`                   |
| `organizations`            | `status ASC, type ASC, name ASC`                 |
| `organizations`            | `status ASC, publicProfile ASC, updatedAt DESC`  |
| `organizationApplications` | `status ASC, submittedAt ASC`                    |
| `orders`                   | `organizationId ASC, status ASC, createdAt DESC` |
| `orders`                   | `donorUid ASC, status ASC, createdAt DESC`       |
| `sponsorships`             | `sponsorUid ASC, status ASC, nextDueDate ASC`    |
| `impactStories`            | `status ASC, publishedAt DESC`                   |
| `notifications`            | `recipientUid ASC, readAt ASC, createdAt DESC`   |

## 13. Front-end implementation plan

### Recommended stack

- React + TypeScript + Vite (already initialized).
- React Router for protected/public routes.
- Firebase JavaScript SDK: Auth, Firestore, Storage, Functions, Analytics (if privacy policy permits), and Messaging later.
- A component/style approach selected before build (for example, Tailwind CSS + accessible headless components, or CSS Modules). Keep the initial bundle lightweight.
- React Hook Form + Zod (or equivalent) for safe client forms; Cloud Functions remain the final validator.

### Suggested source structure

```text
src/
  app/                 # router, providers, route guards
  components/          # reusable UI, forms, status badges
  features/
    auth/
    donations/
    organizations/
    orders/
    sponsorships/
    stories/
    notifications/
    admin/
  lib/firebase.ts      # Firebase client initialization
  services/            # typed Firestore/Function adapters
  types/               # shared TypeScript domain models
  pages/
  styles/
functions/src/         # Firebase Cloud Functions (separate Firebase project folder)
firestore.rules
storage.rules
firestore.indexes.json
```

### Core reusable UI

- App shell, responsive navigation, authenticated account menu, and role-aware route guard.
- Donation card, category/expiry badges, quantity selector, order-status timeline, and pickup-code display.
- Organization card, verification badge, needs list, and profile header.
- Moderation table with filters, review drawer, decision reason modal, and audit history.
- Notification bell/inbox and empty/error/loading states.
- Consent-aware impact-story card with clear organization attribution.

## 14. Validation rules

| Feature                  | Required validation                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Registration             | Valid email; password meets policy; username 3–30 characters, normalized unique, allowed characters only.                                |
| Organization application | Name/type/contact/address required; one or more valid verification files; applicant must accept terms.                                   |
| Food donation            | Title/category/quantity/unit/pickup window required; quantity > 0; perishable items require future expiry; no prohibited category.       |
| Order                    | Requester is active member of approved organization; requested quantity > 0 and ≤ current available stock; pickup window is still valid. |
| Sponsorship              | Valid type/frequency/quantity; target organization must be approved when specified; no monetary processing fields.                       |
| Story/image              | An approved organization author, current consent record, safe caption, and admin review before public display.                           |

## 15. Notifications

| Event                                    | Recipients                                  | Channel                              |
| ---------------------------------------- | ------------------------------------------- | ------------------------------------ |
| Account/profile created                  | New user                                    | In-app; optional email welcome.      |
| Organization submitted/approved/rejected | Applicant and managers                      | In-app + email.                      |
| Donation approved/rejected/expiring      | Donor                                       | In-app + email for rejection/expiry. |
| Order created/confirmed/cancelled/ready  | Donor and requesting organization member    | In-app + email.                      |
| Collection/receipt confirmed             | Donor and organization                      | In-app + email.                      |
| Sponsorship due/verified/rejected        | Sponsor; target organization where relevant | In-app + email.                      |
| Story review outcome                     | Organization author                         | In-app.                              |

Every notification must contain a short message, deep link, creation time, read state, and no sensitive pickup address in email/push previews.

## 16. Reporting and dashboards

### User dashboard

- Draft, active, reserved, collected, expired, and rejected donation listings.
- Orders involving the user as a donor.
- Active sponsorships, due dates, fulfillment history, and verification status.
- Linked organization membership and related order actions.
- Notification inbox and profile settings.

### Organization dashboard

- Current available items, active orders, pickup windows, and receipt actions.
- Organization profile completeness and approval status.
- Quantities received, estimated beneficiaries served, and verified sponsorship support.

### Admin dashboard

- Counts and queues: pending organization applications, donations awaiting review, expiring food, open reports, unverified sponsorship fulfillment, and stories awaiting consent review.
- Impact: completed donations, items/kg collected, estimated meals, beneficiaries served, active organizations, and active donors.
- Audit-log access and export-ready filtered reports. Avoid exposing private personal data in aggregate reports.

## 17. Delivery roadmap

| Phase                           | Deliverable                                                                           | Acceptance criteria                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 0. Foundation                   | Firebase projects, local emulator, environment configuration, typed models, CI checks | App starts locally with emulators; secrets are not committed.                                   |
| 1. Identity & access            | Auth, profile/username, route guards, admin claim setup                               | User cannot access admin routes; username is unique; protected profile fields cannot be forged. |
| 2. Organization onboarding      | Application form, private documents, approval/rejection queue, directory              | Only approved organizations appear publicly and can order.                                      |
| 3. Donation lifecycle           | Listing creation, moderation, availability board, expiry handling                     | Unsafe/expired listings do not appear; listing quantities are correct.                          |
| 4. Orders & collection          | Atomic reservation, orders, pickup code, handover/receipt                             | Concurrent requests cannot oversell a donation; cancellation releases stock.                    |
| 5. Sponsorships & notifications | Pledges, fulfillment evidence, reminders, inbox/email                                 | Pledge never processes money; reminders and verification work.                                  |
| 6. Impact & home page           | Metrics, consent-aware stories/gallery, featured shelters                             | No unapproved child imagery is public; counters reconcile with received orders.                 |
| 7. Hardening & release          | Rules tests, accessibility, performance, backups, monitoring, hosting deployment      | Critical workflows tested in Emulator Suite; production rules reviewed.                         |

## 18. Testing and acceptance checklist

- Unit-test validation, quantity calculations, state transitions, username normalization, and pickup-code hashing.
- Test Cloud Functions using Firebase Emulator Suite, including concurrent order attempts against one donation.
- Write Firestore/Storage rules tests proving users cannot read private documents or promote themselves to admin.
- Test every role journey: visitor, donor, organization member, organization manager, and admin.
- Check accessibility: keyboard navigation, labels, focus states, alt text, contrast, status messages, responsive screens.
- Verify expiry behaviour across time zones and that only server timestamps are trusted.
- Test consent withdrawal: a published story becomes unavailable promptly and its media is no longer public.
- Perform a manual content/privacy review before launch.

## 19. Configuration and environment variables

Use Firebase web configuration in a local `.env` file and expose only safe client values through Vite variables. Never commit service-account keys or secret email-provider credentials.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_FIREBASE_EMULATORS=false
```

Cloud Functions secrets (email-provider credentials and other server-only values) are configured with Firebase secret management, not in this file.

## 20. Key implementation decisions to confirm before coding

These decisions can be made during UI/design implementation without changing the core plan:

1. **Moderation:** approve every donation before publishing (recommended for launch) or allow trusted donors to publish instantly.
2. **Visibility:** whether the public can browse donation cards, or whether listing details require sign-in.
3. **Food units:** use fixed units/categories only, or allow free-form units alongside a standard set.
4. **Order model:** allow partial orders (recommended) or require an organization to claim an entire listing.
5. **Email delivery provider:** select the transactional email service before enabling email notifications.
6. **Sponsorship terms:** finalize pledge types, expected fulfillment evidence, and verification responsibility.

## 21. Definition of done for the MVP

The MVP is ready when a user can create an authenticated account with a unique username, submit a donation, and receive a status notification; an organization can apply and be approved by an admin; an approved organization can reserve and collect an available donation without overselling its quantity; both sides can confirm receipt; sponsorships are recorded without processing payments; public shelter/impact pages render only approved content; and the Firebase security rules, Storage rules, functions, and role checks have automated test coverage.
