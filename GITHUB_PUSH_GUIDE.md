# Step-by-Step: Push This App to GitHub

Follow these steps to put your BVL registration app on GitHub.

---

## Step 1: Install Git (if needed)

1. Check if Git is installed: open **Command Prompt** or **PowerShell** and run:
   ```bash
   git --version
   ```
2. If you see a version number (e.g. `git version 2.x.x`), skip to Step 2.
3. If not, download and install from: **https://git-scm.com/download/win**  
   Then close and reopen the terminal.

---

## Step 2: Open the app folder in terminal

1. Open **Command Prompt** or **PowerShell**.
2. Go to the app folder (replace the path if yours is different):
   ```bash
   cd "C:\Users\raksh\Downloads\Archive\BVL_CENTER_REGISTRATION\BVL_CENTER_REGISTRATION_2\BVL_HTML_Package\bvl-registration-app"
   ```
3. Confirm you’re in the right place (you should see `package.json`):
   ```bash
   dir
   ```

---

## Step 3: Initialize Git and add files

1. **Initialize a new Git repo** (only if this folder is not already a Git repo):
   ```bash
   git init
   ```

2. **Add all files** (`.gitignore` will exclude `node_modules`, `dist`, `.env`):
   ```bash
   git add .
   ```

3. **Check what will be committed** (optional):
   ```bash
   git status
   ```
   You should see your source files listed, and **not** `node_modules` or `dist`.

4. **Create the first commit**:
   ```bash
   git commit -m "Initial commit: BVL Center Registration app with Firebase"
   ```

---

## Step 4: Create a new repository on GitHub

1. Open **https://github.com** in your browser and **log in** (or create an account).
2. Click the **+** icon (top right) → **New repository**.
3. Fill in:
   - **Repository name:** e.g. `bvl-center-registration` (or any name you like).
   - **Description (optional):** e.g. `BVL Season 7 Center Registration – React + Firebase`.
   - **Public** or **Private** – your choice.
   - **Do not** check “Add a README” or “Add .gitignore” (you already have files).
4. Click **Create repository**.

---

## Step 5: Connect your folder to GitHub and push

1. On the new repo page, GitHub shows **“…or push an existing repository from the command line.”**

2. Copy the **first command** (add remote). It looks like:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and the repo name you chose.

3. In your terminal (in the **bvl-registration-app** folder), run that command, for example:
   ```bash
   git remote add origin https://github.com/raksh/bvl-center-registration.git
   ```

4. **Set the main branch name** (GitHub’s default is `main`):
   ```bash
   git branch -M main
   ```

5. **Push your code**:
   ```bash
   git push -u origin main
   ```

6. If GitHub asks to **sign in**, use your GitHub username and either:
   - Your **password** (if you have a personal access token, use that instead of password), or  
   - **GitHub CLI** / browser login if you have that set up.

---

## Step 6: Confirm on GitHub

1. Refresh your repository page on GitHub.
2. You should see all your project files (e.g. `src/`, `package.json`, `index.html`, etc.).
3. You should **not** see `node_modules` or `dist` (they’re in `.gitignore`).

---

## Quick command summary (from app folder)

```bash
git init
git add .
git commit -m "Initial commit: BVL Center Registration app with Firebase"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Later: push updates

After you change code and want to update GitHub:

```bash
cd "C:\Users\raksh\Downloads\Archive\BVL_CENTER_REGISTRATION\BVL_CENTER_REGISTRATION_2\BVL_HTML_Package\bvl-registration-app"
git add .
git commit -m "Describe your change here"
git push
```

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| `git: command not found` | Install Git from https://git-scm.com and restart the terminal. |
| `remote origin already exists` | You already added the remote. Use `git push -u origin main` (or `git push`). |
| **Authentication failed** | Use a **Personal Access Token** instead of password: GitHub → Settings → Developer settings → Personal access tokens → Generate new token. Use the token when Git asks for password. |
| **Wrong folder** | Make sure you run all commands inside **bvl-registration-app** (where `package.json` is). |
