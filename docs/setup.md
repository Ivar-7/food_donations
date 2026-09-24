# Local development setup

## Requirements

- Node.js 24 (matching the local Functions runtime).
- npm 11 or newer.
- Firebase CLI authentication with access to the development Firebase project.

## First-time setup

1. Run `npm ci` in the repository root.
2. Copy `.env.example` to `.env.local` and fill in the Firebase web-app configuration for the environment you are using. `.env.local` must never be committed.
3. Run `npm run dev` to start the web client against the configured Firebase project.
4. Run `npm run dev:emulators` to start the web client against Auth, Firestore, Storage, Functions, Hosting, and the Emulator UI. The command sets `VITE_USE_FIREBASE_EMULATORS=true` for that session.

## Quality checks

Run these before opening a pull request:

```sh
npm run format:check
npm run typecheck
npm run lint
npm run test:rules
npm run test:coverage
npm run build
```

## Firebase environments

The current Firebase project is configured as the local CLI default. Before staging or production work, create separate Firebase projects, add the correct aliases to `.firebaserc`, and use separate environment files for each web build. Do not deploy to the shared default project until its existing Cloud Functions and secrets have been reviewed.

## Security

- Keep service-account files and all `.env*` files except `.env.example` out of version control.
- Use Firebase/Google Cloud secret management for server-side credentials.
- The Phase 0 Firestore and Storage rules deny all client access. Phase 2 replaces them only with tested, narrowly scoped rules.
