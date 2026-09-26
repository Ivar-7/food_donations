# Auth

Email/password sign-up, sign-in, sign-out, and password reset. Sessions persist through Firebase Auth. New accounts create a `users/{uid}` profile with the `user` role; if profile creation fails, sign-up removes the new Auth account. The protected profile page shows account details, updates the display name, and can complete an older account missing its profile. The Firebase Console or Admin SDK must assign the first admin role.

The configured Firebase project also contains legacy profiles from another app. The profile parser accepts their `full_name` and Firestore `created_at` timestamp without rewriting those documents. Legacy roles other than `admin` are treated as ordinary FoodBridge users.
