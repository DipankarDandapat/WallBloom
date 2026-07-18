# 🚀 WallBloom — Deployment Guide

Deploy the Python backend on **Render.com** (free) and the React frontend on **GitHub Pages** (free).

**Live URLs after deployment:**
- Frontend: `https://<your-github-username>.github.io/WallBloom/`
- Backend: `https://wallbloom.onrender.com`

---

## 📋 Prerequisites

- GitHub account
- Render.com account (free at https://render.com)
- Your project pushed to a GitHub repository named `WallBloom` on the `master` branch

---

## 📁 Required Files (Already in This Repo)

These files were added/modified to make deployment work:

```
WallBloom/
├── render.yaml                          ← Render backend config
├── .github/
│   └── workflows/
│       └── deploy.yml                   ← GitHub Actions auto-deploy
├── frontend/
│   ├── vite.config.ts                   ← base path set for GitHub Pages
│   ├── public/
│   │   └── 404.html                     ← SPA routing fix for GitHub Pages
│   └── index.html                       ← SPA redirect script
```

---

## PART 1 — Deploy Backend on Render.com

### Step 1 — Create a Render account
Go to https://render.com and sign up for free.

### Step 2 — Create a new Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub account if not already connected
3. Select your `WallBloom` repository
4. Click **Connect**

### Step 3 — Configure the service

Render will auto-detect `render.yaml` at the repo root. If it does, just click **Deploy**.

If it does NOT auto-detect, fill in manually:

| Field | Value |
|---|---|
| Name | `wallbloom-backend` |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### Step 4 — Deploy
Click **Create Web Service**. Wait 3–5 minutes for the first deploy.

### Step 5 — Verify backend is live
Visit: `https://wallbloom.onrender.com/health`

Expected response:
```json
{"status": "healthy", "service": "WallBloom Backend"}
```

> ⚠️ **Free tier note:** Render free instances spin down after 15 minutes of inactivity.
> The first request after idle takes ~30 seconds to wake up. This is normal.

---

## PART 2 — Deploy Frontend on GitHub Pages

### Step 1 — Verify these files exist in your repo

**`frontend/vite.config.ts`** — must have the `base` path:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/WallBloom/' : '/',
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',   // ← must be esbuild, NOT terser
  },
})
```

> ⚠️ **Important:** Use `minify: 'esbuild'` not `minify: 'terser'`.
> Terser is not bundled with Vite v3+ and will cause the build to fail on GitHub Actions.

**`frontend/public/404.html`** — handles SPA routing on GitHub Pages:
```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/WallBloom/'" />
  </head>
</html>
```

**`frontend/index.html`** — must have the redirect script in `<head>`:
```html
<script>
  (function(){
    var r = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (r && r !== location.href) history.replaceState(null, null, r);
  })();
</script>
```

**`.github/workflows/deploy.yml`** — GitHub Actions workflow:
```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install
        working-directory: frontend

      - name: Build
        run: npm run build
        working-directory: frontend
        env:
          GITHUB_PAGES: "true"
          VITE_API_URL: "https://wallbloom.onrender.com"

      - name: List dist folder
        run: ls -la frontend/dist

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
          force_orphan: true
          enable_jekyll: false
```

### Step 2 — Push to master branch

```bash
git add .
git commit -m "deploy: GitHub Pages + Render setup"
git push origin master
```

### Step 3 — Wait for GitHub Actions to run

1. Go to your GitHub repo
2. Click the **Actions** tab
3. You should see **"Deploy Frontend to GitHub Pages"** workflow running
4. Wait for it to show a ✅ green checkmark (~2 minutes)

If it shows ❌ red, click on it to read the error log.

### Step 4 — Set GitHub Pages source (CRITICAL)

> ⚠️ This step must be done **AFTER** the workflow runs green for the first time.
> The `gh-pages` branch only exists after a successful workflow run.

1. Go to your GitHub repo → **Settings**
2. Click **Pages** in the left sidebar
3. Under **Build and deployment**:
   - **Source** → `Deploy from a branch`
   - **Branch** → `gh-pages` | `/ (root)`
4. Click **Save**

### Step 5 — Visit your live site

Wait 1–2 minutes after saving, then visit:

```
https://<your-github-username>.github.io/WallBloom/
```

---

## 🐛 Troubleshooting

### ❌ Build fails: "terser not found"
**Cause:** `vite.config.ts` has `minify: 'terser'`
**Fix:** Change to `minify: 'esbuild'` in `frontend/vite.config.ts`

### ❌ GitHub Pages shows README.md instead of the app
**Cause:** GitHub Pages source is set to `master` branch instead of `gh-pages`
**Fix:** Go to Settings → Pages → change Branch to `gh-pages` → Save

### ❌ `gh-pages` branch not visible in Settings → Pages dropdown
**Cause:** The GitHub Actions workflow has not run successfully yet
**Fix:** Go to Actions tab, check if the workflow ran. If not, trigger it manually via **Actions → Run workflow**

### ❌ Workflow not triggering on push
**Cause:** Workflow file has `branches: [main]` but your branch is `master`
**Fix:** Change to `branches: [master]` in `.github/workflows/deploy.yml`

### ❌ Frontend loads but shows no patterns/palettes (blank or error)
**Cause:** Backend URL is wrong or Render instance is sleeping
**Fix:**
1. Visit `https://wallbloom.onrender.com/health` directly — if it times out, wait 30s and retry (free tier cold start)
2. Check `VITE_API_URL` in the workflow file matches your Render URL exactly

### ❌ Page works at `/WallBloom/` but refreshing a sub-route gives 404
**Cause:** Missing `404.html` in `frontend/public/`
**Fix:** Ensure `frontend/public/404.html` exists with the redirect script shown above

---

## 🔄 How Auto-Deploy Works

Every time you push to `master`:

```
git push origin master
       ↓
GitHub Actions triggers deploy.yml
       ↓
Installs Node 20 + npm install
       ↓
npm run build  (with GITHUB_PAGES=true → sets base to /WallBloom/)
       ↓
frontend/dist/ uploaded to gh-pages branch
       ↓
GitHub Pages serves gh-pages branch
       ↓
https://<username>.github.io/WallBloom/ updates live
```

Render backend auto-deploys separately whenever it detects changes in the `backend/` folder.

---

## ✅ Deployment Checklist

### Backend (Render)
- [ ] Render Web Service created and connected to GitHub repo
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] `/health` endpoint returns `{"status": "healthy"}`

### Frontend (GitHub Pages)
- [ ] `vite.config.ts` has `base: '/WallBloom/'` when `GITHUB_PAGES=true`
- [ ] `vite.config.ts` uses `minify: 'esbuild'`
- [ ] `frontend/public/404.html` exists
- [ ] `frontend/index.html` has SPA redirect script
- [ ] `.github/workflows/deploy.yml` triggers on `master` branch
- [ ] GitHub Actions workflow runs ✅ green
- [ ] GitHub Pages source set to `gh-pages` branch
- [ ] Site loads at `https://<username>.github.io/WallBloom/`
- [ ] Patterns and palettes load (backend connected)
- [ ] Preview images generate
- [ ] Desktop and Mobile download works

---

## 📌 Key Facts to Remember

| Item | Value |
|---|---|
| Backend URL | `https://wallbloom.onrender.com` |
| Frontend URL | `https://dipankardandapat.github.io/WallBloom/` |
| Deploy branch | `master` (source code) |
| Pages branch | `gh-pages` (built output, auto-created) |
| Node version | 20 |
| Python version | 3.11 |
| Vite minifier | `esbuild` (not terser) |
| GitHub Pages base path | `/WallBloom/` |
