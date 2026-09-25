# Donations

Visitors can browse available food and essentials, filter by category, and view each listing. Signed-in donors can publish a validated listing, then edit or remove it while it is available. The dashboard shows all of the donor's listings, including those in handoff.

`donations.api.ts` validates writes at the API boundary. Firestore rules enforce ownership and available-only editing and deletion. Request and handoff status changes belong to the orders feature; the donation form never writes those fields.
