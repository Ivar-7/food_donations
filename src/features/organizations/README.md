# Organizations

The public directory lists approved shelters and NGOs. Signed-in users can apply at `/organizations/apply` and see their current application status there. An administrator reviews pending applications at `/admin/applications`.

New applications use the applicant's user ID as the document ID. Submission checks older random-ID applications and uses a transaction to prevent another active application under the new ID. Rejected applicants may revise and resubmit. Approval runs in one Firestore transaction: it updates the application, creates `organizations/{applicationId}` with `ownerUserId`, links `users/{applicantUid}.organizationId`, and creates an applicant notification. Rejection updates the application and creates a notification in the same way.

Security rules must allow only admins to review, require the related organization and user changes during approval, and allow an applicant to resubmit only their own rejected document. The admin route must be lazy loaded and role protected by the app router.

The seed command also adds three clearly marked sample partner profiles with Unsplash photos. They have no real owner account or approval and are excluded from the home page impact totals.
