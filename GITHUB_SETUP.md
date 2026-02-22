# GitHub Setup & Neon.tech Database Connection Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `burton-latimer-community`
   - **Description**: "A social platform for the Burton Latimer community"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create burton-latimer-community --public --source=. --remote=origin
```

## Step 2: Push Your Code to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/burton-latimer-community.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin master
```

**Alternative if you prefer SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/burton-latimer-community.git
git push -u origin master
```

## Step 3: Set Up Neon.tech Database

### 3.1 Create Neon Account & Project

1. Go to [Neon.tech](https://neon.tech)
2. Sign up or log in (you can use GitHub to sign in)
3. Click **"Create a project"**
4. Choose:
   - **Project name**: `burton-latimer-community`
   - **Region**: Choose closest to your users (e.g., EU for UK)
   - **PostgreSQL version**: Latest (16+)
5. Click **"Create project"**

### 3.2 Get Your Database Connection String

1. After creating the project, you'll see a connection string
2. It will look like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Copy this connection string** - you'll need it next

### 3.3 Connect Neon to GitHub (Optional but Recommended)

1. In your Neon project dashboard, go to **"Integrations"**
2. Click **"GitHub"**
3. Authorize Neon to access your GitHub account
4. Select your `burton-latimer-community` repository
5. This enables:
   - Automatic database branches for pull requests
   - Database connection info in GitHub Actions
   - Better collaboration features

## Step 4: Configure Your Local Environment

### 4.1 Create .env File

In your project root, create a `.env` file:

```bash
# Windows
notepad .env

# Or just create it in your IDE
```

### 4.2 Add Your Database Connection

Paste this into your `.env` file (replace with your actual Neon connection string):

```env
# Database - Replace with your Neon.tech connection string
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Authentication - Generate a secure secret
NEXTAUTH_SECRET="your-secret-key-here"

# Application URL
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### 4.3 Generate Secure Secret

Generate a secure `NEXTAUTH_SECRET`:

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Or use an online generator:**
- https://generate-secret.vercel.app/32

Copy the generated string and replace `your-secret-key-here` in your `.env` file.

## Step 5: Initialize Your Database

Now that you have your database connection, run these commands:

```bash
# Generate Prisma Client
npx prisma generate

# Push the schema to your database (creates all tables)
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

## Step 6: Start Your Application

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 7: Deploy to Production (Optional)

### Deploy to Vercel (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` - Your Neon connection string
   - `NEXTAUTH_SECRET` - Your generated secret
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://burton-latimer.vercel.app`)
5. Click **"Deploy"**

Vercel will automatically:
- Build your Next.js application
- Deploy to a global CDN
- Provide a production URL
- Auto-deploy on every push to master

### Update Neon for Production

In your Neon dashboard:
1. Go to **"Settings"** → **"Connection pooling"**
2. Enable connection pooling for better performance
3. Use the pooled connection string for production

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server":
1. Check your connection string is correct
2. Ensure your IP is whitelisted in Neon (usually automatic)
3. Verify SSL mode is included: `?sslmode=require`

### Prisma Client Errors

If you see "Cannot find module '@prisma/client'":
```bash
npx prisma generate
```

### Git Push Errors

If you see "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/burton-latimer-community.git
```

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Set up Neon.tech database
3. ✅ Configure local environment
4. ✅ Initialize database schema
5. ✅ Start development server
6. 🎉 Register your first user!

## Security Notes

- **Never commit your `.env` file** (it's already in `.gitignore`)
- **Rotate your `NEXTAUTH_SECRET`** if it's ever exposed
- **Use different secrets** for development and production
- **Enable 2FA** on your GitHub and Neon accounts

## Support

- **Neon Documentation**: https://neon.tech/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs

---

Need help? Open an issue on GitHub or check the [SETUP.md](./SETUP.md) file.
