# Donations

Visitors can browse available food and essentials, filter by category, and view each listing. Signed-in donors can publish a validated listing, then edit or remove it while it is available. The dashboard shows all of the donor's listings, including those in handoff.

`donations.api.ts` validates writes at the API boundary and restricts edits/deletion to available listings. Firestore rules enforce account ownership and organization authorization. Request and handoff status changes belong to the orders feature; the donation form never writes those fields.

Listings may include a direct http or https image URL from any host. The form and API validate it; absent images use a text/icon fallback. Cards and details both include the request action, login return link or organization registration guidance. `npm run seed` creates six requestable presentation donations with subject-matched hotlinked Unsplash images and a real demo donor account, plus three donations in handoff history. It upgrades old seed records and preserves initialized listings on reruns. See the root README for presentation sign-in details and emulator verification.
