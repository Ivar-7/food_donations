# FoodBridge — TODO

## Phase 0 — Foundation & Firebase connection
- [x] Scaffold Vite + React + TS, strict mode on
- [x] Set up src/app/, src/features/, src/shared/ folders per architecture
- [x] Create Firebase project config, .env.example, wire VITE_ public config only (no secrets)
- [x] Enable Email/Password sign-in in Firebase Auth
- [x] Init Firestore, write initial (deny-by-default) security rules, deploy
- [x] Set up npm run dev:emulators
- [x] Add root providers: ThemeProvider.tsx (light/dark), query client provider
- [x] Add router skeleton with lazy-loaded route modules, base layout
- [x] Add src/shared/errors/ skeleton (normalized error type, user-message mapper, no raw errors shown)
- [x] Confirm format, lint, typecheck, build all pass on scaffold

## Phase 1 — Auth & Users
- [x] Sign-up form (email, password, username) with *.schema.ts validation
- [x] On sign-up: create users doc, role: "user" by default
- [x] Login / logout, persisted session, protected-route wrapper
- [x] Profile page (view/edit own username)
- [x] Document manual first-admin bootstrap step (Firebase console — not in-app)
- [x] Loading/empty/error states on all auth forms

## Phase 2 — Donations
- [x] Post-donation form (validated) → donations collection
- [x] Donation list + detail view
- [x] Edit/delete own donation while status: available
- [x] Firestore rules: only poster can edit/delete while available
- [x] Home page: available-donations feed
- [x] Loading/empty/success/error states

## Phase 3 — Organizations
- [x] Org application form → organizationApplications
- [x] Applicant status view (pending/approved/rejected)
- [x] Admin approvals dashboard (list pending, approve/reject)
- [x] On approve: create organizations doc, set ownerUserId, set organizationId on applicant's user
- [x] Firestore rules: only admin approves; only linked user acts as org
- [x] Home page: shelters/orgs section
- [x] Notification on application status change
- [x] Loading/empty/success/error states

## Phase 4 — Orders & Sponsorships
- [x] Org requests a donation → Firestore transaction reserves it (available → requested), prevents double-claim
- [x] Generate pickup code on order creation
- [x] Donor marks handoff complete; org confirms receipt; order closes (pickup → received)
- [x] Org posts a sponsorship need; users pledge; track fulfillment status
- [x] Notifications for order and sponsorship events
- [x] Firestore rules + required indexes for orders/sponsorships, deploy
- [x] Loading/empty/success/error states

## Phase 5 — Polish (no new features)
- [x] Home page impact totals (simple aggregate reads/counters — no stats pipeline)
- [x] Notifications center UI: bell, list, mark-read
- [x] Light/dark audit across every screen, Tailwind.
- [x] Motion pass: page transitions + interactive feedback only (no decorative animation)
- [x] State audit: confirm loading/empty/success/error exist in every feature
- [x] Minimal README per feature folder
- [x] Final format / lint / typecheck / build clean run
