# Step-by-Step: Deploy the BVL Registration App

You can deploy to **Firebase Hosting** (recommended, same project as your Firebase app) or **Vercel** (also free). Follow one option below.

---

## Option A: Firebase Hosting (recommended)

Your app already uses Firebase. Hosting on Firebase gives you one project and a URL like `https://bvl-registration.web.app`.

### Step 1: Install Firebase CLI (one-time)

1. Open **PowerShell** or **Command Prompt**.
2. Run:
   ```bash
   npm install -g firebase-tools
   ```
3. Log in to your Google account:
   ```bash
   firebase login
   ```
   A browser window opens; sign in and allow access.

### Step 2: Go to the app folder and select the project

1. Go to your app folder:
   ```bash
   cd "C:\Users\raksh\Downloads\Archive\BVL_CENTER_REGISTRATION\BVL_CENTER_REGISTRATION_2\BVL_HTML_Package\bvl-registration-app"
   ```

2. Tell Firebase which project to use (your project ID is `bvl-registration`):
   ```bash
   firebase use bvl-registration
   ```
   If you see a list of projects, choose the one that matches your Firebase project.

### Step 3: Build the app

1. Create the production build:
   ```bash
   npm run build
   ```
2. Wait until it finishes. A **`dist`** folder will appear with the built files.

### Step 4: Deploy to Firebase Hosting

1. Deploy only hosting (Firestore/Storage/Functions stay as they are):
   ```bash
   firebase deploy --only hosting
   ```

2. When it finishes, you’ll see something like:
   ```text
   Hosting URL: https://bvl-registration.web.app
   ```
   (or `https://bvl-registration.firebaseapp.com`)

3. Open that URL in your browser. Your app should be live.

### Step 5: Later updates

After you change the app and want to redeploy:

```bash
cd "C:\Users\raksh\Downloads\Archive\BVL_CENTER_REGISTRATION\BVL_CENTER_REGISTRATION_2\BVL_HTML_Package\bvl-registration-app"
npm run build
firebase deploy --only hosting
```

---

## Option B: Vercel (free, connects to GitHub)

Good if you prefer Git-based deploys or want a different URL.

### Step 1: Push your app to GitHub

Follow **GITHUB_PUSH_GUIDE.md** so your code is on GitHub.

### Step 2: Sign up and import on Vercel

1. Go to **https://vercel.com** and sign up (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. **Import** the GitHub repo that contains `bvl-registration-app`.

   - If the repo is the app itself (only the React app): import that repo.
   - If the repo contains the app inside a folder (e.g. `bvl-registration-app`): after importing, set **Root Directory** to `bvl-registration-app`.

4. **Build settings** (Vercel usually detects them):
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`

5. Click **Deploy**. Wait a few minutes.

6. Vercel gives you a URL like `https://your-app-name.vercel.app`. Open it to see your app.

### Step 3: Add Firebase auth domain (if needed)

If you use Firebase Auth and see auth errors in production:

1. In **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**.
2. Add your Vercel domain, e.g. `your-app-name.vercel.app`.

---

## Quick reference

| Step              | Firebase Hosting              | Vercel                          |
|------------------|-------------------------------|----------------------------------|
| Build            | `npm run build`               | Automatic on push                |
| Deploy command   | `firebase deploy --only hosting` | Deploy from dashboard or CLI |
| URL              | `https://bvl-registration.web.app` | `https://xxx.vercel.app`    |

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| **Firebase: "No project active"** | Run `firebase use bvl-registration` (or your project ID). |
| **Build fails** | Run `npm install` then `npm run build` in the app folder. Fix any errors shown. |
| **Blank page after deploy** | Confirm **Build Command** is `npm run build` and **Output Directory** is `dist`. For Firebase, confirm `firebase.json` has `"public": "dist"`. |
| **Auth doesn’t work on live site** | In Firebase Console → Authentication → Authorized domains, add your deploy URL (e.g. `bvl-registration.web.app` or `xxx.vercel.app`). |
