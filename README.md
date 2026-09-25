# FoodBridge

FoodBridge is a React app for sharing surplus food and essential supplies with local communities. Phases 0 and 1 are complete: the app foundation, Firebase connection, email/password accounts, protected routes, and editable user profiles. Donation listings and organization applications are present as early later-phase flows.

## Stack

- React 19, TypeScript, Vite, React Router, TanStack Query
- Tailwind CSS 4 with light and dark themes
- Firebase Authentication, Cloud Firestore, and optional browser Analytics

## Run locally

1. Run `npm install`.
2. Copy `.env.example` to `.env`. The example contains the supplied **public Firebase web configuration** for `react-abcederian`.
3. The configured `react-abcederian` Firebase project has Email/Password sign-in enabled and a Cloud Firestore database. For another project, set its public web config in `.env` and select its project in `.firebaserc`.
4. If you change Firebase configuration or rules, deploy with `npx firebase login` and `npx firebase deploy --only auth,firestore` (requires project access).
5. Run `npm run dev`.

For local emulators, set `VITE_USE_FIREBASE_EMULATORS=true` in `.env`, run `npm run dev:emulators` in one terminal, and `npm run dev` in another. The emulator UI uses port 4000.

## Project structure

| Path                         | Purpose                                              |
| ---------------------------- | ---------------------------------------------------- |
| `src/main.tsx`               | Browser entry point; mounts `App`                    |
| `src/App.tsx`                | Root component with providers and router             |
| `src/app`                    | Router, layout, auth and theme providers             |
| `src/features/*/pages`       | Lazy-loaded route pages                              |
| `src/features/*/components`  | Feature UI components                                |
| `src/features/*/state`       | Query hooks and keys                                 |
| `src/features/*/api`         | Firebase calls and data validation                   |
| `src/features/auth`          | Account forms and Firebase Auth calls                |
| `src/features/donations`     | Donation feed and creation form                      |
| `src/features/organizations` | Approved organization directory and application form |
| `src/features/dashboard`     | Personal donations and application status            |
| `src/features/home`          | Landing and information pages                        |
| `src/shared`                 | Firebase setup, errors and reusable UI               |
| `firestore.rules`            | Server-side access controls                          |

## Access and current scope

New accounts receive the `user` role. To bootstrap the **first admin**, sign up normally, find that account's UID under **Firebase Console → Authentication → Users**, then open **Firestore Database → users → {UID}** and change only `role` from `user` to `admin`. Firebase Console or the Admin SDK performs this privileged edit; the client and Firestore rules do not allow a user to grant themselves admin access. Do not put service account credentials in the app.

Organization approval requires a privileged operation that creates an `organizations` document and links its ID in the applicant's `users` document. The approval interface, donation requests, pickup workflow, sponsorships, and notifications are planned but are not active in this version. See [TODO.md](TODO.md) for the roadmap.

The Firebase web API key identifies the Firebase project and is not a server secret. Access to data is enforced by `firestore.rules`. Do not put service account credentials in Vite environment variables.

## Checks

Run `npm run format`, `npm run lint`, `npm run typecheck`, and `npm run build`.
The latter two run `check:architecture`, which verifies the required `App.tsx` entry structure. Repository instructions live at the root `AGENTS.md` so Codex can discover them automatically.
