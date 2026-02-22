# Deployment Guide - Burton Latimer Community Platform

## 📦 GitHub Repository
✅ **Successfully pushed to:** https://github.com/kevin21quirk/burton-latimer-community

---

## 🗄️ Database Setup (Neon.tech)

### Step 1: Create Neon Database

1. Go to [Neon.tech](https://neon.tech)
2. Sign in or create an account
3. Click **"Create Project"**
4. Name your project: `burton-latimer-community`
5. Select region closest to your users (e.g., `EU West (London)`)
6. Click **"Create Project"**

### Step 2: Get Database Connection String

After creating the project, Neon will provide a connection string like:
```
postgresql://username:password@ep-xxx-xxx.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

**Copy this connection string** - you'll need it for Vercel.

### Step 3: Run Database Migrations

Once you have the connection string:

1. **Locally**, create a temporary `.env` file with:
   ```
   DATABASE_URL="your-neon-connection-string-here"
   ```

2. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

4. **(Optional)** Seed initial data if needed:
   ```bash
   npx prisma db seed
   ```

---

## 🚀 Vercel Deployment

### Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select: `kevin21quirk/burton-latimer-community`
5. Click **"Import"**

### Step 2: Configure Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Variables:

```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.eu-west-2.aws.neon.tech/neondb?sslmode=require

# Authentication Secret (generate a random 32+ character string)
NEXTAUTH_SECRET=your-super-secret-random-string-here-min-32-chars

# Base URL (will be your Vercel URL)
NEXTAUTH_URL=https://your-app-name.vercel.app
```

#### How to Generate NEXTAUTH_SECRET:

Run this in your terminal:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-5 minutes)
3. Your app will be live at: `https://your-app-name.vercel.app`

---

## 🔧 Post-Deployment Setup

### Create Admin Account

After deployment, you need to create an admin user:

**Option 1: Using Neon SQL Editor**

1. Go to your Neon dashboard
2. Click **"SQL Editor"**
3. Run this query (replace with your details):

```sql
-- First, create the user
INSERT INTO "User" (
  id, 
  email, 
  password, 
  "firstName", 
  "lastName", 
  "accountType", 
  city, 
  "isAdmin", 
  "gdprConsent", 
  "marketingConsent",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'admin@burtonlatimer.com',
  '$2a$10$YourHashedPasswordHere',  -- Use bcrypt to hash your password
  'Admin',
  'User',
  'INDIVIDUAL',
  'Burton Latimer',
  true,
  true,
  false,
  NOW(),
  NOW()
);
```

**Option 2: Register normally then update via SQL**

1. Register a normal account on your deployed site
2. Go to Neon SQL Editor
3. Run:
```sql
UPDATE "User" 
SET "isAdmin" = true 
WHERE email = 'your-email@example.com';
```

---

## 📋 Environment Variables Reference

### Complete List for Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption (32+ chars) | `abc123xyz789...` |
| `NEXTAUTH_URL` | Your production URL | `https://your-app.vercel.app` |

### Optional Variables (if needed later):

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | Email server for notifications |
| `SMTP_PORT` | Email server port |
| `SMTP_USER` | Email username |
| `SMTP_PASSWORD` | Email password |

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Database is storing users (check Neon dashboard)
- [ ] Admin account has access to `/admin` page
- [ ] All pages load without errors
- [ ] Messages search works
- [ ] Help requests can be created
- [ ] Local services can be added

---

## 🔄 Future Updates

To deploy updates:

1. Make changes locally
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push origin master`
4. Vercel will **automatically deploy** the changes

---

## 🆘 Troubleshooting

### Build Fails on Vercel

**Error:** "Cannot find module '@prisma/client'"

**Fix:** Vercel should auto-run `prisma generate`. If not, add to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Fails

**Error:** "Can't reach database server"

**Fix:** 
1. Verify `DATABASE_URL` in Vercel environment variables
2. Ensure connection string includes `?sslmode=require`
3. Check Neon project is active (not suspended)

### Authentication Errors

**Error:** "Invalid JWT token"

**Fix:**
1. Verify `NEXTAUTH_SECRET` is set in Vercel
2. Ensure `NEXTAUTH_URL` matches your Vercel domain
3. Redeploy after adding variables

---

## 📞 Support

For issues:
1. Check Vercel deployment logs
2. Check Neon database logs
3. Review browser console for client errors
4. Check server logs in Vercel dashboard

---

**Deployment Date:** February 22, 2026
**Repository:** https://github.com/kevin21quirk/burton-latimer-community
**Framework:** Next.js 16.1.6
**Database:** PostgreSQL (Neon.tech)
**Hosting:** Vercel
