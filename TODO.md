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
- [ ] Post-donation form (validated) → donations collection
- [ ] Donation list + detail view
- [ ] Edit/delete own donation while status: available
- [ ] Firestore rules: only poster can edit/delete while available
- [ ] Home page: available-donations feed
- [ ] Loading/empty/success/error states

## Phase 3 — Organizations
- [ ] Org application form → organizationApplications
- [ ] Applicant status view (pending/approved/rejected)
- [ ] Admin approvals dashboard (list pending, approve/reject)
- [ ] On approve: create organizations doc, set ownerUserId, set organizationId on applicant's user
- [ ] Firestore rules: only admin approves; only linked user acts as org
- [ ] Home page: shelters/orgs section
- [ ] Notification on application status change
- [ ] Loading/empty/success/error states

## Phase 4 — Orders & Sponsorships
- [ ] Org requests a donation → Firestore transaction reserves it (available → requested), prevents double-claim
- [ ] Generate pickup code on order creation
- [ ] Donor marks handoff complete; org confirms receipt; order closes (pickup → received)
- [ ] Org posts a sponsorship need; users pledge; track fulfillment status
- [ ] Notifications for order and sponsorship events
- [ ] Firestore rules + required indexes for orders/sponsorships, deploy
- [ ] Loading/empty/success/error states

## Phase 5 — Polish (no new features)
- [ ] Home page impact totals (simple aggregate reads/counters — no stats pipeline)
- [ ] Notifications center UI: bell, list, mark-read
- [ ] Light/dark audit across every screen, Tailwind.
- [ ] Motion pass: page transitions + interactive feedback only (no decorative animation)
- [ ] State audit: confirm loading/empty/success/error exist in every feature
- [ ] Minimal README per feature folder
- [ ] Final format / lint / typecheck / build clean run
