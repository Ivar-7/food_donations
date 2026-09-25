# FoodBridge

FoodBridge is a React app for sharing surplus food and essential supplies with local communities. Donors can post and manage listings, approved organizations can request them and track pickup, and neighbors can pledge toward organization needs.

## Stack

- React 19, TypeScript, Vite, React Router, TanStack Query
- Tailwind CSS 4 with light and dark themes, and Motion for route and button feedback
- Firebase Authentication, Cloud Firestore, and optional browser Analytics

## Run locally

1. Run `npm install`.
2. Copy `.env.example` to `.env`. The example contains the supplied **public Firebase web configuration** for `react-abcederian`.
3. The configured `react-abcederian` Firebase project has Email/Password sign-in enabled and a Cloud Firestore database. For another project, set its public web config in `.env` and select its project in `.firebaserc`.
4. If you change Firestore rules or indexes, deploy with `npx firebase deploy --only firestore --project react-abcederian` (requires project access).
5. Run `npm run dev`.

For local emulators, set `VITE_USE_FIREBASE_EMULATORS=true` in `.env`, run `npm run dev:emulators` in one terminal, and `npm run dev` in another. The emulator UI uses port 4000. Run `node scripts/verify-workflows.mjs` while the emulators are running to check the donation, approval, order, pledge, notification, and authorization workflows.

## Project structure

| Path                         | Purpose                                          |
| ---------------------------- | ------------------------------------------------ |
| `src/main.tsx`               | Browser entry point; mounts `App`                |
| `src/App.tsx`                | Root component with providers and router         |
| `src/app`                    | Router, layout, auth and theme providers         |
| `src/features/*/pages`       | Lazy-loaded route pages                          |
| `src/features/*/components`  | Feature UI components                            |
| `src/features/*/state`       | Query hooks and keys                             |
| `src/features/*/api`         | Firebase calls and data validation               |
| `src/features/auth`          | Account forms and Firebase Auth calls            |
| `src/features/donations`     | Donation listing, details, creation and editing  |
| `src/features/organizations` | Partner directory, applications and admin review |
| `src/features/orders`        | Donation reservation and handoff                 |
| `src/features/sponsorships`  | Organization needs and in-kind pledges           |
| `src/features/notifications` | Activity center and read state                   |
| `src/features/dashboard`     | Personal donations and activity                  |
| `src/features/home`          | Landing and information pages                    |
| `src/shared`                 | Firebase setup, errors and reusable UI           |
| `firestore.rules`            | Server-side access controls                      |

## Access and current scope

New accounts receive the `user` role. To bootstrap the **first admin**, sign up normally, find that account's UID under **Firebase Console → Authentication → Users**, then open **Firestore Database → users → {UID}** and change only `role` from `user` to `admin`. Firebase Console or the Admin SDK performs this privileged edit; the client and Firestore rules do not allow a user to grant themselves admin access. Do not put service account credentials in the app.

Administrators review applications at `/admin/applications`. Approval links the applicant's account to a new organization in a single Firestore transaction. Approved organization owners can request available donations and post in-kind needs. Donors and organizations confirm each step of a request; the six-digit pickup reference identifies that request. Pledges are commitments of items, with no payment or delivery processing. The home page shows live counts for available donations, completed handoffs, and approved partners. See [TODO.md](TODO.md) for the completed project checklist.

The Firebase web API key identifies the Firebase project and is not a server secret. Access to data is enforced by `firestore.rules`. Do not put service account credentials in Vite environment variables.
