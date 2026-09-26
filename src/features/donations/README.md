# Donations

Visitors can browse available food and essentials, filter by category, and view each listing. Signed-in donors can publish a validated listing, then edit or remove it while it is available. The dashboard shows all of the donor's listings, including those in handoff.

`donations.api.ts` validates writes at the API boundary. Firestore rules enforce ownership and available-only editing and deletion. Request and handoff status changes belong to the orders feature; the donation form never writes those fields.

Listings may include a direct http or https image URL from any host. The form and API validate it, while cards and detail pages fall back to their existing text or icon treatment when no image is supplied. `npm run seed` creates six clearly marked sample donations with subject-matched Unsplash images in the configured Firebase project, along with sample organizations and needs. It skips existing sample IDs, so rerunning it is safe. Use `npm run seed -- --dry-run` to preview or `npm run seed -- --emulator` for the local Firestore emulator. Sample listings cannot be requested. The sample image IDs come from free [Unsplash photos](https://unsplash.com/) and remain hotlinked to `images.unsplash.com`.
