# Maid Center Zambia Firebase production setup

This project uses Firebase Authentication, Cloud Firestore, Cloud Storage and Analytics.

The browser configuration is provided through `NEXT_PUBLIC_FIREBASE_*` variables. Those values identify the Firebase project; they are **not** the authorization boundary. Production access is enforced by Firebase Authentication plus the committed `firestore.rules` and `storage.rules` files.

## Production data model

The platform deliberately separates private verification records from employer-visible profiles:

- `users/{uid}` — account identity, role and basic account details.
- `maids/{uid}` — **private** worker application and verification record. Only the worker and administrators may read it.
- `maidPublicProfiles/{uid}` — sanitized employer-visible profile created only when an administrator approves a worker.
- `employers/{uid}` — private employer request.
- `applications/{employerUid}_{maidUid}` — interview/placement request shared only with the two participants and administrators.
- Cloud Storage `users/{uid}/verification/*` — private verification files, readable only by the owner and administrators.

Never add NRC numbers, reference contacts, emergency contacts, direct phone numbers or verification-document URLs to `maidPublicProfiles`.

## Required deployment order

The production frontend depends on the new Firebase rules. Deploy the rules immediately before promoting the matching frontend release:

```bash
firebase login
firebase deploy --project maid-center-zambia --only firestore:rules,storage
```

Cloud Storage rules now call Firestore to verify the administrator role. The first rules deployment may prompt Firebase/Google Cloud to enable the permission that lets Storage Rules read the default Firestore database. Accept that prompt for this project.

After the rules are deployed, merge/deploy the `production-platform-upgrade` frontend branch to Vercel.

## Administrator bootstrap

There is intentionally no client-side "make me admin" feature.

1. Create/sign in to the administrator Firebase Authentication account.
2. In Firestore, open `users/{administratorUid}`.
3. Set `role` to `admin` from the Firebase Console (or another trusted administrative environment).
4. Open `/admin` and sign in with that account.

The security rules prevent normal worker/employer accounts from changing their own role to `admin`.

## Existing approved workers

The upgraded employer directory reads only `maidPublicProfiles`. Existing worker records that were approved before this architecture change need to be republished once:

1. Sign in to `/admin`.
2. Open **Workers**.
3. For each verified worker, select **Approve & publish**.

That operation atomically keeps the private verification record in `maids/{uid}` and writes only approved professional fields to `maidPublicProfiles/{uid}`.

If an approved worker later edits their registration, the public copy is withdrawn and the private profile returns to `pending` until an administrator approves it again.

## Security checks

Before production use, confirm these behaviors in the Firebase Rules Playground or Emulator Suite:

- Worker cannot read another worker's `maids/{uid}` document.
- Employer cannot read any `maids/{uid}` private document.
- Employer can query approved `maidPublicProfiles` only.
- Worker/employer cannot change their `users/{uid}.role`.
- Worker/employer cannot set their own verification status to `approved`.
- Employer can create an interview request only for an approved public worker profile.
- Only administrators can move an application through `shortlisted`, `interview`, `placed` or `declined`.
- Verification files are owner/admin-only.

## Build checks

The repository's `Production build check` GitHub Actions workflow runs lint and a Next.js production build. If GitHub reports a failure with no runner, no steps and no logs, the workflow did not execute application code; use the Vercel preview build as the compile gate and restore the GitHub Actions runner separately.
