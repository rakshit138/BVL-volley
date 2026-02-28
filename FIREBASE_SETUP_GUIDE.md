# Step-by-Step: Add Firebase Config So the App Can Start

Follow these steps in order. After Step 4, you can run the app with `npm run dev`.

---

## Step 1: Create a Firebase project

1. Open **[Firebase Console](https://console.firebase.google.com/)** in your browser.
2. Click **“Add project”** (or “Create a project”).
3. Enter a project name (e.g. `BVL-Registration`) and click **Continue**.
4. Turn Google Analytics **On** or **Off** (your choice), then **Continue**.
5. Click **“Create project”** and wait until it’s ready, then **Continue**.

---

## Step 2: Register the app and get config values

1. On the project **Overview** page, click the **Web** icon: `</>` ( “Add app” ).
2. Enter an **App nickname** (e.g. `BVL Web`) and leave “Firebase Hosting” unchecked for now.
3. Click **“Register app”**.
4. You’ll see a code snippet with `firebaseConfig` like:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc..."
   };
   ```

5. **Copy these 6 values** — you’ll paste them into `.env` in Step 4.  
   You can also get them later from: **Project settings (gear icon) → General → Your apps → SDK setup and configuration**.

---

## Step 3: Enable Auth, Firestore, and Storage (required for the app)

### 3a) Authentication (Email/Password)

1. In the left sidebar: **Build → Authentication**.
2. Click **“Get started”**.
3. Open the **“Sign-in method”** tab.
4. Click **“Email/Password”**, turn **Enable** ON, then **Save**.

### 3b) Firestore Database

1. Left sidebar: **Build → Firestore Database**.
2. Click **“Create database”**.
3. Choose **“Start in production mode”** → **Next**.
4. Pick a location (e.g. your region) → **Enable**.

### 3c) Storage

1. Left sidebar: **Build → Storage**.
2. Click **“Get started”**.
3. Accept default rules → **Next** → **Done**.

---

## Step 4: Create the `.env` file in the React app

1. Open the app folder in File Explorer:
   - `BVL_HTML_Package\bvl-registration-app`
2. In that folder, create a new file named **`.env`** (exactly, with the dot at the start).
3. Open `.env` in a text editor and paste the following, then **replace the placeholder values** with the ones from Step 2:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   Example (with fake values):

   ```env
   VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_FIREBASE_AUTH_DOMAIN=my-bvl-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=my-bvl-app
   VITE_FIREBASE_STORAGE_BUCKET=my-bvl-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

4. **Save** the file.

Important:

- No spaces around `=`.
- No quotes around values (unless Firebase gives you a value that contains spaces).
- The names must start with `VITE_` so Vite exposes them to the app.

---

## Step 5: Run the app

1. Open a terminal in the app folder:
   - `BVL_HTML_Package\bvl-registration-app`
2. Install dependencies (once):

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the URL shown (e.g. `http://localhost:5173`) in your browser.  
   The app should load. You can use **Register** to submit a center form (data will go to Firestore/Storage).  
   To use **Admin**, you still need to create the first admin user and add their UID to Firestore (see the main **README.md** in the same folder).

---

## Quick checklist

| Step | What you did |
|------|------------------|
| 1 | Created a Firebase project |
| 2 | Registered a web app and copied the 6 config values |
| 3 | Enabled Email/Password Auth, Firestore, and Storage |
| 4 | Created `.env` in `bvl-registration-app` with the 6 `VITE_FIREBASE_*` variables |
| 5 | Ran `npm install` and `npm run dev` and opened the app in the browser |

---

## Create your first admin (to see all registered centers)

To log in as admin and see the list of centers, you need **one admin user** in Firebase.

### Step A: Create a user in Firebase Authentication

1. In **Firebase Console**, open your project **bvl-registration**.
2. Go to **Build → Authentication**.
3. Open the **Users** tab.
4. Click **“Add user”**.
5. Enter an **email** (e.g. `admin@yourdomain.com`) and a **password** (at least 6 characters). Remember these — you’ll use them to log in in the app.
6. Click **“Add user”**.
7. In the users table, click the **new user** you just created.
8. **Copy the User UID** (long string like `xYz123AbC...`). You need it for the next step.

### Step B: Add that user as admin in Firestore

1. In the left sidebar go to **Build → Firestore Database**.
2. Click **“Start collection”** (or use the **+ Start collection** button).
3. **Collection ID:** type `admins` → **Next**.
4. **Document ID:** choose **“Custom”** and **paste the User UID** you copied (the same UID as the new auth user).
5. Add a field:
   - **Field:** `role`
   - **Type:** string
   - **Value:** `admin`
6. (Optional) Add another field: `email` (string) = the admin’s email.
7. Click **“Save”**.

### Step C: Deploy Firestore rules (required for admin check to work)

The app must be allowed to **read** your document in the `admins` collection. If you never deployed rules, Firestore blocks the read and you stay “not an admin.”

**Option 1 – Deploy from your project (recommended)**  
In a terminal, from the folder **`bvl-registration-app`** (where `firebase.json` and `firestore.rules` are):

```bash
firebase deploy --only firestore:rules
```

(If you haven’t linked the project: `firebase use bvl-registration` then run the deploy again.)

**Option 2 – Edit rules in Firebase Console**  
1. Firebase Console → **Build → Firestore Database** → **Rules** tab.  
2. Ensure there is a rule that lets a signed-in user read their own `admins` doc, for example:

```
match /admins/{adminId} {
  allow read: if request.auth != null && request.auth.uid == adminId;
  allow create, update, delete: if false;
}
```

3. Click **Publish**.

### Step D: Log in in the app

1. Open your app (e.g. **http://localhost:5173**).
2. Go to the **Admin** tab.
3. Log in with the **email** and **password** you used when creating the user in Step A.
4. If you still see “not an admin,” click **Check again** (the app will re-read the `admins` collection). You should then see the admin dashboard and the list of all registered centers.

---

If the app still doesn’t start, check:

- `.env` is in **`bvl-registration-app`** (same folder as `package.json`).
- Variable names are exactly: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.
- You restarted the dev server after creating or editing `.env` (run `npm run dev` again).
