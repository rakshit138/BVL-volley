# BVL Center Registration (React + Firebase)

Exact conversion of the BVL Season 7 Center Registration HTML app to React, with Firebase for storing registrations and admin auth.

## Features

- **Center registration** – Same form and fields as the original HTML; data is saved to Firebase (Firestore + Storage for photos).
- **Admin login** – Admins sign in with **email and password** (Firebase Authentication).
- **Create admins** – Logged-in admins can create new admins by email + password (via Cloud Function).
- **Admin dashboard** – View all registered centers, search, approve/reject/cancel, view photos.

---

## Firebase setup (do this first)

### 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the steps (enable Google Analytics if you want).
3. After creation, open your project.

### 2. Register a web app

1. In Project Overview, click the **Web** icon (`</>`).
2. Register the app with a nickname (e.g. "BVL Registration").
3. Copy the `firebaseConfig` object; you will use it in step 5.

### 3. Enable Authentication

1. In the left sidebar go to **Build → Authentication**.
2. Click **Get started**.
3. Open the **Sign-in method** tab.
4. Enable **Email/Password** (first provider in the list).

### 4. Create Firestore and Storage

1. **Firestore**: **Build → Firestore Database → Create database** → Start in **production mode** (we’ll use rules below).
2. **Storage**: **Build → Storage → Get started** → use default bucket.

### 5. Add environment variables in the React app

1. In the app root (same folder as `package.json`), create a file named **`.env`** (do not commit this file).
2. Copy from **`.env.example`** and fill in your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get these from: **Firebase Console → Project settings (gear) → General → Your apps → SDK setup and configuration**.

### 6. Deploy Firestore and Storage rules

From the **app root** (where `firebase.json` is):

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

If Firebase CLI is not installed:

```bash
npm install -g firebase-tools
firebase login
firebase use your_project_id
```

Then run the deploy commands again.

### 7. Create the first admin user

1. In Firebase Console go to **Authentication → Users**.
2. Click **Add user**.
3. Enter an **email** and **password** (e.g. `admin@yourdomain.com` and a strong password). Remember these for admin login.
4. Copy the new user’s **User UID** (click the user in the list to see it).
5. Go to **Firestore Database**.
6. Start a **collection** named `admins`.
7. Click **Add document**.
   - **Document ID**: paste the **User UID** from step 4.
   - Add a field: `role` (string) = `admin`.
   - Optionally: `email` (string) = that admin’s email, `createdAt` (string) = any timestamp.
8. Save.

That user can now log in in the app on the **Admin** tab with their email and password.

### 8. (Optional) Deploy Cloud Function so admins can create more admins

To use “Create New Admin” from the dashboard:

1. Install Firebase CLI and log in (if not done): `npm install -g firebase-tools` and `firebase login`.
2. From the **app root** (where `firebase.json` is):  
   `cd functions`  
   `npm install`  
   `cd ..`
3. Deploy functions:  
   `firebase deploy --only functions`
4. In Firebase Console, enable **Blaze (pay-as-you-go)** for the project if prompted (required for Cloud Functions).

After this, any logged-in admin can create new admins from the dashboard (email + password). The new user is created in Authentication and a document is added in `admins/{newUserUid}`.

---

## Run the React app locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`).

- **Register** tab: fill and submit the center registration form; data and photos go to Firebase.
- **Admin** tab: log in with the first admin email/password; view centers, approve/reject/cancel, and (if the function is deployed) create new admins.

---

## Build for production

```bash
npm run build
```

Output is in the `dist` folder. Host `dist` on any static host (Firebase Hosting, Vercel, Netlify, etc.).  
Optional: copy `BVL_LOGO.png` from the original HTML package into `public/` so the header logo appears.

---

## Summary of what you did

| Step | Action |
|------|--------|
| 1 | Create Firebase project |
| 2 | Add web app and copy config |
| 3 | Enable Email/Password in Authentication |
| 4 | Create Firestore and Storage |
| 5 | Create `.env` with `VITE_FIREBASE_*` variables |
| 6 | Deploy Firestore and Storage rules |
| 7 | Create first admin in Auth and add their UID to `admins` in Firestore |
| 8 | (Optional) Deploy `functions` so admins can create more admins |

After this, the React app matches the original HTML behavior and saves all center registration data to Firebase, with admin login and dashboard as described.
