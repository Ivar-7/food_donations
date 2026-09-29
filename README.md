# Okoa Food

Okoa Food is a React app for sharing surplus food and essential supplies with local communities. Donors can post and manage listings, approved organizations can request them and track pickup, and neighbors can pledge toward organization needs.

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

To prepare a presentation, sign in with `npx firebase login` and run `npm run seed`. The command uses the project in `.firebaserc`, creates five sign-in accounts, six available donations, three partner organizations, four pledgeable needs, and three connected requests at different handoff stages. The descriptions include quantities and collection details, with matching hotlinked Unsplash photos. These are fictional presentation records; the accounts use `example.test` addresses. Requests and pledges use the same workflows as other listings.

Generated passwords are saved only in the Git-ignored `seed-credentials-react-abcederian.local` file. Use the **donor** account to post and confirm handoffs, **kitchen**, **shelter**, or **pantry** to request donations and post needs, and **supporter** to pledge and send feedback. No demo account is an administrator. The seed command upgrades the previous inert seed records and preserves existing request/pledge progress. Rerunning it skips initialized records and keeps passwords. `npm run seed -- --dry-run` previews changes; `--emulator` targets local emulators and writes a separate credentials file. `--reset-passwords` generates new passwords for these five accounts only.

For local emulators, set `VITE_USE_FIREBASE_EMULATORS=true` in `.env`, run `npm run dev:emulators` in one terminal, and `npm run dev` in another. The emulator UI uses port 4000. Run `node scripts/verify-workflows.mjs` while the emulators are running to check the donation, approval, order, pledge, notification, and authorization workflows. After `npm run seed -- --emulator`, run `node scripts/verify-presentation.mjs` to exercise the application APIs for sign-in, donation handoff, pledges, feedback validation and feedback privacy. This verification script always uses emulators.

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
| `src/features/feedback`      | Ratings, feedback submission and private history |
| `src/features/home`          | Landing and information pages                    |
| `src/shared`                 | Firebase setup, errors and reusable UI           |
| `firestore.rules`            | Server-side access controls                      |

## Access and current scope

New accounts receive the `user` role. To bootstrap the **first admin**, sign up normally, find that account's UID under **Firebase Console → Authentication → Users**, then open **Firestore Database → users → {UID}** and change only `role` from `user` to `admin`. Firebase Console or the Admin SDK performs this privileged edit; the client and Firestore rules do not allow a user to grant themselves admin access. Do not put service account credentials in the app.

Administrators review applications at `/admin/applications`. Approval links the applicant's account to a new organization in a single Firestore transaction. The community needs page explains registration and links to signup/application; approved owners can post needs immediately. Donation cards and details offer a request action for approved organizations. Donors and organizations confirm each step of a request; the six-digit pickup reference identifies that request. Pledges are commitments of items, with no payment or delivery processing. The dashboard includes live totals, actionable requests, recent activity and community listings. `/feedback` accepts ratings and messages, visible only to their author and administrators. The home page shows live database counts, including presentation records. All pages support light/dark pink themes. See [TODO.md](TODO.md) for the completed project checklist and [image provenance](src/assets/README.md) for the generated hero.

The Firebase web API key identifies the Firebase project and is not a server secret. Access to data is enforced by `firestore.rules`. Do not put service account credentials in Vite environment variables.
