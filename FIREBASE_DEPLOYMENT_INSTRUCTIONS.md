# Firebase Deployment Instructions

## Deploy Firestore Rules and Indexes

Since Firebase CLI requires interactive authentication, please run these commands manually in your terminal:

### Step 1: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication. Login with your Google account that has access to the `privacyhub-60bd3` project.

### Step 2: Verify Project Configuration

```bash
firebase projects:list
```

You should see `privacyhub-60bd3` in the list. The project is already configured in `.firebaserc`.

### Step 3: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

Expected output:
```
=== Deploying to 'privacyhub-60bd3'...

i  deploying firestore
i  firestore: reading indexes from firestore.indexes.json...
i  cloud.firestore: checking firestore.rules for compilation errors...
✔  cloud.firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
✔  firestore: released rules firestore.rules to cloud.firestore

✔  Deploy complete!
```

### Step 4: Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

Expected output:
```
=== Deploying to 'privacyhub-60bd3'...

i  deploying firestore
i  firestore: reading indexes from firestore.indexes.json...
✔  firestore: deployed indexes in firestore.indexes.json successfully

✔  Deploy complete!
```

### Step 5: Verify Deployment

Go to Firebase Console: https://console.firebase.google.com/project/privacyhub-60bd3/firestore

1. **Check Rules:**
   - Click "Rules" tab
   - Verify the rules are active:
     - Public read access to `analyses` collection
     - No client-side write access

2. **Check Indexes:**
   - Click "Indexes" tab
   - You should see 4 indexes:
     - `updated_at DESC`
     - `last_checked_at DESC`
     - `privacy_grade ASC, updated_at DESC`
     - `overall_score DESC, updated_at DESC`

---

## Troubleshooting

### Error: "Failed to authenticate"
Run: `firebase login` again and ensure you're logged in with the correct Google account.

### Error: "Permission denied"
Make sure your Google account has Owner or Editor role on the `privacyhub-60bd3` project.

### Error: "Project not found"
Verify the project ID in `.firebaserc` matches your Firebase project ID.

---

## Files Created

All necessary Firebase configuration files have been created:

- ✅ `firebase.json` - Firebase configuration
- ✅ `.firebaserc` - Project configuration
- ✅ `firestore.rules` - Security rules
- ✅ `firestore.indexes.json` - Database indexes

You're ready to deploy! Just run the commands above in your terminal.
