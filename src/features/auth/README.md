# Auth

Email/password sign-up, sign-in, sign-out, and password reset. Sessions persist through Firebase Auth. New accounts create a `users/{uid}` profile with the `user` role; if profile creation fails, sign-up removes the new Auth account. The protected profile page shows account details, updates the display name, and can complete an older account missing its profile. The Firebase Console or Admin SDK must assign the first admin role.
