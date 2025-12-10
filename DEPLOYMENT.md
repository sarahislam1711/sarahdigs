# SarahDigs - Railway Deployment Guide

This guide walks you through deploying the SarahDigs website to Railway using GitHub.

---

## Prerequisites

Before starting, make sure you have:

- [ ] A [GitHub](https://github.com) account
- [ ] A [Railway](https://railway.app) account (free tier available)
- [ ] Your Neon PostgreSQL database credentials (you already have this)
- [ ] Git installed on your computer
- [ ] The SarahDigs2 project folder on your computer

---

## Step 1: Prepare Your Local Project

### 1.1 Open Terminal and Navigate to Project

```bash
cd ~/Downloads/SarahDigs2
```

### 1.2 Verify All Files Are Present

Run this command to check the deployment files exist:

```bash
ls -la railway.json nixpacks.toml .env.example README.md server/auth.ts
```

You should see all 5 files listed.

### 1.3 Create Your .env File (for local testing only)

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```bash
nano .env
```

Or open it in any text editor and fill in:

```
DATABASE_URL=your-neon-connection-string
SESSION_SECRET=generate-a-random-32-character-string
ADMIN_PASSWORD=your-chosen-admin-password
NODE_ENV=production
PORT=3000
```

> **Tip**: Generate a session secret with: `openssl rand -base64 32`

---

## Step 2: Create GitHub Repository

### 2.1 Go to GitHub

1. Open [github.com](https://github.com)
2. Click the **+** icon in the top right
3. Select **New repository**

### 2.2 Configure the Repository

Fill in the details:

| Field | Value |
|-------|-------|
| Repository name | `sarahdigs` (or your preferred name) |
| Description | `Digital marketing agency website` |
| Visibility | **Private** (recommended) or Public |
| Initialize with README | **Leave unchecked** (we have our own) |
| Add .gitignore | **Leave as None** (we have our own) |
| Choose a license | **Leave as None** |

### 2.3 Click "Create repository"

GitHub will show you the quick setup page. Keep this page open - you'll need the commands.

---

## Step 3: Push Code to GitHub

### 3.1 Initialize Git (if not already done)

In your terminal, inside the SarahDigs2 folder:

```bash
cd ~/Downloads/SarahDigs2
```

Check if git is already initialized:

```bash
ls -la .git
```

If you see a `.git` folder, skip to step 3.2. If not, initialize:

```bash
git init
```

### 3.2 Add All Files

```bash
git add .
```

### 3.3 Create Initial Commit

```bash
git commit -m "Initial commit - ready for Railway deployment"
```

### 3.4 Add GitHub as Remote

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sarahdigs.git
```

If you get an error that remote already exists:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/sarahdigs.git
```

### 3.5 Push to GitHub

```bash
git branch -M main
git push -u origin main
```

You may be prompted to log in to GitHub. Enter your credentials or use a Personal Access Token.

### 3.6 Verify Upload

Go to your GitHub repository page and refresh. You should see all your files.

---

## Step 4: Create Railway Project

### 4.1 Go to Railway

1. Open [railway.app](https://railway.app)
2. Click **Login** (use GitHub login for easiest setup)
3. Authorize Railway to access your GitHub

### 4.2 Create New Project

1. Click **New Project** button (top right)
2. Select **Deploy from GitHub repo**
3. If prompted, click **Configure GitHub App** to give Railway access to your repositories
4. Select your `sarahdigs` repository from the list

### 4.3 Railway Will Start Building

Railway will automatically:
- Detect it's a Node.js project
- Start the build process

**⚠️ The first build will FAIL** - this is expected because we haven't set environment variables yet.

---

## Step 5: Configure Environment Variables

### 5.1 Open Project Settings

1. In your Railway project, click on the **service** (the box showing your app)
2. Go to the **Variables** tab

### 5.2 Add Required Variables

Click **+ New Variable** for each of these:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host.neon.tech/db?sslmode=require` | Your Neon connection string |
| `SESSION_SECRET` | `your-random-32-char-string` | Generate with `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | `your-secure-password` | Choose a strong password |
| `NODE_ENV` | `production` | Exactly as shown |

### 5.3 Get Your Neon DATABASE_URL

If you need to find your Neon connection string:

1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click **Connection Details**
4. Copy the **Connection string** (starts with `postgresql://`)

Make sure it includes `?sslmode=require` at the end.

### 5.4 Generate SESSION_SECRET

On Mac/Linux terminal:

```bash
openssl rand -base64 32
```

Copy the output and use it as your SESSION_SECRET.

---

## Step 6: Trigger Redeploy

### 6.1 Redeploy with Variables

After adding all environment variables:

1. Go to the **Deployments** tab
2. Click the **⋮** menu on the failed deployment
3. Select **Redeploy**

Or push a small change to GitHub to trigger automatic redeploy.

### 6.2 Watch the Build

Click on the deployment to see build logs. You should see:

```
Installing dependencies...
npm ci
Building...
npm run build
Starting...
npm run start
```

The build typically takes 2-3 minutes.

### 6.3 Verify Deployment Success

When complete, you'll see:
- ✅ Green checkmark
- "Deployed" status
- A generated URL like `sarahdigs-production.up.railway.app`

---

## Step 7: Access Your Site

### 7.1 Get Your URL

1. In Railway, go to **Settings** tab
2. Under **Domains**, you'll see your Railway URL
3. Click it to open your site

### 7.2 Test the Public Site

Visit your Railway URL. You should see the SarahDigs homepage.

### 7.3 Test Admin Login

1. Go to `https://your-railway-url.up.railway.app/admin/login`
2. Enter your `ADMIN_PASSWORD`
3. Click **Sign In**
4. You should be redirected to the admin dashboard

---

## Step 8: Add Custom Domain (Optional)

### 8.1 In Railway

1. Go to **Settings** → **Domains**
2. Click **+ Custom Domain**
3. Enter your domain (e.g., `sarahdigs.com` or `www.sarahdigs.com`)
4. Railway will show you DNS records to add

### 8.2 Configure DNS

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add:

**For root domain (sarahdigs.com):**
- Type: `CNAME`
- Name: `@`
- Value: `your-railway-url.up.railway.app`

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `your-railway-url.up.railway.app`

### 8.3 Wait for DNS Propagation

DNS changes can take up to 48 hours, but usually complete within 1-2 hours.

### 8.4 Enable HTTPS

Railway automatically provisions SSL certificates once DNS is configured.

---

## Troubleshooting

### Build Fails with "Cannot find module"

**Cause**: Missing dependency or wrong import path.

**Solution**: Check build logs for the specific module name, then:
```bash
npm install missing-module-name
git add .
git commit -m "Add missing dependency"
git push
```

### "Database connection refused"

**Cause**: Wrong DATABASE_URL or missing SSL.

**Solution**: 
1. Verify your Neon connection string is correct
2. Make sure it ends with `?sslmode=require`
3. Check that the database is active in Neon dashboard

### Admin Login Not Working

**Cause**: SESSION_SECRET or ADMIN_PASSWORD not set correctly.

**Solution**:
1. Go to Railway Variables tab
2. Verify both variables are set
3. Make sure there are no extra spaces
4. Redeploy after changes

### Site Shows "Application Error"

**Cause**: Server crashed on startup.

**Solution**:
1. Go to Deployments tab
2. Click on the deployment
3. Check **Logs** for error messages
4. Common issues:
   - Missing environment variables
   - Database connection failed
   - Port binding issues (Railway sets PORT automatically)

### Uploaded Images Not Showing After Redeploy

**Cause**: Railway has ephemeral storage - files are lost on redeploy.

**Solution**: For production, use cloud storage:
1. Set up Cloudflare R2 or AWS S3
2. Update the upload code to use cloud storage
3. Store only the URLs in the database

---

## Maintenance

### Updating the Site

1. Make changes locally
2. Test with `npm run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Railway automatically redeploys

### Viewing Logs

1. In Railway, click your service
2. Go to **Deployments** tab
3. Click on active deployment
4. View real-time logs

### Database Migrations

If you change the database schema:

1. Update `shared/schema.ts`
2. Run locally: `npm run db:push`
3. Commit and push changes

---

## Cost Estimate

Railway Pricing (as of 2024):

| Plan | Cost | Includes |
|------|------|----------|
| Hobby | $5/month | 512MB RAM, 1 vCPU, $5 credit |
| Pro | $20/month | More resources, team features |

Your Neon database (free tier) includes:
- 0.5 GB storage
- 1 project
- Unlimited databases

---

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Local dev | `npm run dev` |
| Build | `npm run build` |
| Push updates | `git add . && git commit -m "msg" && git push` |
| View logs | Railway → Deployments → Click deployment |
| Add env var | Railway → Service → Variables → New Variable |
| Redeploy | Railway → Deployments → Redeploy |

---

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)

---

## Checklist

Before going live, verify:

- [ ] Site loads correctly
- [ ] Admin login works
- [ ] Can create/edit blog posts
- [ ] Images upload successfully
- [ ] Contact form works
- [ ] All pages render correctly
- [ ] Mobile responsive design works
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (green padlock)
