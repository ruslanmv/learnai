# 🚀 Vercel Deployment Guide

Step-by-step guide to deploy **LearnAI** on Vercel with enterprise-grade configuration.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ [Vercel Account](https://vercel.com/signup) (free tier works)
- ✅ GitHub/GitLab/Bitbucket repository with your code
- ✅ PostgreSQL database (Supabase, Neon, Railway, or Vercel Postgres)
- ✅ All required API keys (OpenAI, PayPal, Google OAuth)
- ✅ Domain name (optional, but recommended for production)

---

## 🎯 Deployment Methods

### Method 1: Git Integration (Recommended) ⭐

This method provides automatic deployments on every push.

#### Step 1: Push Code to Git Repository

```bash
# Initialize git (if not already done)
git init

# Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/learnai.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Production-ready setup"

# Push to main branch
git push -u origin main
```

#### Step 2: Import to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with your GitHub/GitLab/Bitbucket account

2. **Import Repository**
   - Click **"Add New... → Project"**
   - Select your repository (`learnai`)
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables** (see below)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-5 minutes for first deployment
   - Vercel will provide a preview URL: `your-project.vercel.app`

---

### Method 2: Vercel CLI

Perfect for advanced users and CI/CD pipelines.

#### Step 1: Install Vercel CLI

```bash
# Install globally
npm install -g vercel

# Or use npx (no installation required)
npx vercel
```

#### Step 2: Login

```bash
vercel login

# Follow the prompts to authenticate
```

#### Step 3: Link Project (First Time Only)

```bash
# Navigate to your project directory
cd learnai

# Link to Vercel
vercel link

# Answer the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your team/account
# - Link to existing project? No
# - What's your project's name? learnai
# - In which directory is your code located? ./
```

#### Step 4: Add Environment Variables

```bash
# Option 1: Add via CLI
vercel env add DATABASE_URL production
# Paste your database URL when prompted

# Option 2: Add via dashboard (easier)
# Visit: https://vercel.com/your-username/learnai/settings/environment-variables
```

#### Step 5: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

### Method 3: Using Makefile

If you prefer using make commands:

```bash
# Deploy to production
make deploy-vercel

# Deploy preview
make deploy-vercel-preview
```

---

## 🔐 Environment Variables Configuration

### Required Variables

Add these in Vercel Dashboard → **Settings → Environment Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your production domain | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | Random secret (32+ chars) | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | `GOCSPX-xxx` |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-proj-xxx` |
| `PAYPAL_CLIENT_ID` | PayPal Client ID (LIVE) | `xxx` |
| `PAYPAL_CLIENT_SECRET` | PayPal Secret (LIVE) | `xxx` |
| `PAYPAL_ENVIRONMENT` | PayPal mode | `live` |

### How to Add Variables

#### Via Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Navigate to your project
3. Click **Settings → Environment Variables**
4. For each variable:
   - Enter **Key** (e.g., `DATABASE_URL`)
   - Enter **Value**
   - Select environments:
     - ✅ **Production** (always)
     - ✅ **Preview** (recommended)
     - ⬜ **Development** (optional - use `.env.local` instead)
   - Click **"Save"**

#### Via CLI

```bash
# Add a variable
vercel env add VARIABLE_NAME production

# List all variables
vercel env ls

# Remove a variable
vercel env rm VARIABLE_NAME production
```

#### Bulk Import (Fast Method)

1. Create a file `.env.production` with all variables
2. Go to Vercel Dashboard → Environment Variables
3. Click **"Add Another" → "Import from .env"**
4. Paste contents of `.env.production`
5. Select **Production** environment
6. Click **"Save"**

**⚠️ IMPORTANT**: Never commit `.env.production` to git!

---

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Easiest)

**Pros**: Seamless integration, automatic connection pooling
**Cons**: More expensive than alternatives

```bash
# Install Vercel Postgres
vercel integration add postgres

# Follow prompts to create database
# Environment variable DATABASE_URL is automatically added
```

### Option 2: Supabase (Recommended)

**Pros**: Generous free tier, additional features (auth, storage, real-time)
**Cons**: Requires separate service

1. **Create Database**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Create new project
   - Wait 2-3 minutes for provisioning

2. **Get Connection String**
   - Go to **Settings → Database**
   - Copy **Connection string** (URI mode)
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Add to Vercel**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

4. **Run Migrations**
   ```bash
   # Set DATABASE_URL locally (temporarily)
   export DATABASE_URL="your-supabase-url"

   # Push schema
   npx prisma db push
   ```

### Option 3: Neon (Best for Serverless)

**Pros**: Auto-scaling, generous free tier, serverless
**Cons**: Newer service

1. Create account at [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string
4. Enable connection pooling
5. Add to Vercel as `DATABASE_URL`

### Option 4: Railway

**Pros**: Simple, affordable, includes Redis
**Cons**: Smaller free tier

1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection URL
4. Add to Vercel as `DATABASE_URL`

---

## 🌍 Custom Domain Setup

### Step 1: Add Domain to Vercel

1. Go to **Project → Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain: `yourdomain.com`
4. Vercel will check domain availability

### Step 2: Configure DNS

Vercel will provide DNS records. Add these to your domain registrar:

#### For Root Domain (yourdomain.com)

**Option A: A Record (Most Compatible)**
```
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   3600
```

**Option B: ANAME/ALIAS (Better Performance)**
```
Type:  ANAME or ALIAS
Name:  @
Value: cname.vercel-dns.com
TTL:   3600
```

#### For www Subdomain

```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   3600
```

### Step 3: Wait for Propagation

- DNS changes can take 5 minutes to 48 hours
- Check status: `dig yourdomain.com` or use [whatsmydns.net](https://www.whatsmydns.net/)

### Step 4: SSL Certificate

- Vercel automatically provisions SSL certificate
- Usually ready within 5-10 minutes after DNS propagation
- Certificate auto-renews every 90 days

### Step 5: Update Environment Variables

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Then redeploy:
```bash
vercel --prod
```

---

## 🔧 Vercel Configuration

### vercel.json

The project includes an optimized `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "headers": [
    // Security headers configured
  ],
  "crons": []
}
```

#### Key Configuration Options

- **regions**: Deployment region (`iad1` = US East)
- **functions.maxDuration**: API timeout (30s, max for Hobby plan)
- **functions.memory**: RAM per function (1024MB)

### Region Selection

Choose region closest to your users:

| Region Code | Location | Best For |
|-------------|----------|----------|
| `iad1` | Washington, D.C., USA | North America |
| `sfo1` | San Francisco, USA | West Coast USA |
| `pdx1` | Portland, USA | Pacific Northwest |
| `lhr1` | London, UK | Europe |
| `fra1` | Frankfurt, Germany | Central Europe |
| `sin1` | Singapore | Southeast Asia |
| `syd1` | Sydney, Australia | Oceania |
| `hnd1` | Tokyo, Japan | East Asia |

Update `vercel.json` to change region:
```json
{
  "regions": ["lhr1"]
}
```

---

## 🚀 Deployment Workflow

### Automatic Deployments

Once connected to Git:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

### Manual Deployments

```bash
# Deploy specific branch to production
vercel --prod --branch main

# Deploy with custom domain
vercel --prod --target production

# Skip build cache
vercel --prod --force
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

**Available on all plans:**
- Real User Metrics (RUM)
- Web Vitals tracking
- Top pages report
- Visitors count

**Access**: Project → **Analytics** tab

### Vercel Speed Insights (Pro+)

Real-time performance monitoring:
```bash
# Install
npm install @vercel/speed-insights

# Add to app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Vercel Web Analytics (Pro+)

Privacy-friendly analytics:
```bash
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

---

## 🔍 Debugging Production Issues

### View Logs

```bash
# Real-time logs
vercel logs

# Logs for specific deployment
vercel logs [DEPLOYMENT_URL]

# Follow logs (like tail -f)
vercel logs --follow
```

### Via Dashboard

1. Go to **Project → Deployments**
2. Click on a deployment
3. Click **"View Function Logs"**
4. Filter by timeframe, function, or log level

### Common Issues

#### Build Fails

```bash
# Check build logs
vercel logs --build

# Common fixes:
# 1. Clear cache
vercel --force

# 2. Check TypeScript errors locally
npm run type-check

# 3. Ensure dependencies are in package.json
npm install
```

#### Runtime Errors

```bash
# Check function logs
vercel logs --prod

# Common causes:
# - Missing environment variables
# - Database connection issues
# - API timeouts
```

#### Environment Variables Not Working

```bash
# Verify variables are set
vercel env ls

# Pull variables locally to test
vercel env pull .env.local

# Redeploy to apply changes
vercel --prod
```

---

## 🎛️ Advanced Configuration

### Function Configuration

Customize per-route:

```typescript
// app/api/ai/recommend-professors/route.ts
export const runtime = 'edge'; // or 'nodejs'
export const maxDuration = 30;
export const dynamic = 'force-dynamic';
```

### Edge Runtime

For ultra-low latency:

```typescript
export const runtime = 'edge';
```

**Benefits:**
- Global distribution
- < 50ms cold starts
- Lower costs

**Limitations:**
- No Node.js APIs
- No native modules
- Smaller memory limits

### Middleware

Optimize middleware for performance:

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
```

---

## 💰 Cost Optimization

### Hobby Plan (Free)
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ 100 hours function execution
- ✅ Automatic SSL
- ❌ No team features
- ❌ No analytics

### Pro Plan ($20/month)
- ✅ 1TB bandwidth/month
- ✅ 1000 hours function execution
- ✅ Advanced analytics
- ✅ Password protection
- ✅ Team collaboration

### Cost Reduction Tips

1. **Optimize Images**: Use Next.js Image component
2. **Enable Caching**: Static assets cached at edge
3. **Use Edge Runtime**: Cheaper than Node.js runtime
4. **Reduce Bundle Size**: Remove unused dependencies
5. **Implement ISR**: Incremental Static Regeneration

---

## 🔄 Rollback & Versioning

### Rollback to Previous Deployment

#### Via Dashboard
1. Go to **Deployments**
2. Find working deployment
3. Click **"︙"** (three dots)
4. Click **"Promote to Production"**

#### Via CLI
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel alias set [DEPLOYMENT_URL] your-domain.com
```

### Version Aliases

```bash
# Create version alias
vercel alias set deployment-abc123.vercel.app v2.yourdomain.com

# Test before promoting
curl https://v2.yourdomain.com/health
```

---

## 🛡️ Security Best Practices

### Environment Variables
- ✅ Never commit secrets to git
- ✅ Use different secrets for production vs preview
- ✅ Rotate secrets periodically
- ✅ Use Vercel's encrypted environment variables

### Authentication
- ✅ Use NEXTAUTH_SECRET unique to production
- ✅ Enable HTTPS only in production
- ✅ Set secure cookie settings

### API Security
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use CORS restrictions
- ✅ Enable CSRF protection

---

## 📞 Support & Resources

### Official Resources
- 📖 [Vercel Documentation](https://vercel.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 📺 [Vercel YouTube](https://www.youtube.com/c/VercelHQ)

### LearnAI Resources
- 📖 [Main README](./README.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- ✅ [Production Checklist](./PRODUCTION_CHECKLIST.md)
- 🐛 [Report Issues](https://github.com/ruslanmv/learnai/issues)

### Get Help
- 🎫 [Vercel Support](https://vercel.com/support)
- 💬 [Vercel Discord](https://vercel.com/discord)
- 📧 Email: support@ruslanmv.com

---

## 🎉 Success!

You've successfully deployed LearnAI to Vercel! 🚀

**Next Steps:**
1. ✅ Verify health endpoint: `https://yourdomain.com/health`
2. ✅ Test all critical features
3. ✅ Set up monitoring (Sentry, etc.)
4. ✅ Configure uptime monitoring
5. ✅ Share with users!

---

**Made with ❤️ by [Ruslan Magana](https://ruslanmv.com)**
