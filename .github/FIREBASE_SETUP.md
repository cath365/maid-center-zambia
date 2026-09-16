# Maid Center Zambia Firebase setup

This project uses Firebase Authentication, Cloud Firestore, Cloud Storage and Analytics.

The web configuration is safe to expose in the browser and is provided through `NEXT_PUBLIC_FIREBASE_*` variables with equivalent client-side fallbacks in `lib/firebase.ts`.

Security is enforced by Firebase Authentication plus the committed `firestore.rules` and `storage.rules` files. Deploy those rules to the `maid-center-zambia` Firebase project before relying on them in production.

The `Firebase production check` GitHub Actions workflow keeps `pnpm-lock.yaml` aligned with `package.json`, installs with the frozen lockfile, runs lint, and verifies a production build.
