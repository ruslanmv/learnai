# 🚀 Production Deployment Guide

Complete guide for deploying **LearnAI** to production on Vercel and other platforms.

---

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deploy to Vercel](#deploy-to-vercel)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Domain Configuration](#domain-configuration)
- [Post-Deployment](#post-deployment)
- [Monitoring & Observability](#monitoring--observability)
- [Troubleshooting](#troubleshooting)
- [Alternative Platforms](#alternative-platforms)

---

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure you have completed the following:

### 1. Code Quality
- [ ] All tests pass locally
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] Code is properly formatted: `npm run format:check`
- [ ] Build succeeds: `npm run build`

### 2. Environment Setup
- [ ] Production database is provisioned (PostgreSQL)
- [ ] All required API keys are obtained:
  - [ ] OpenAI API key
  - [ ] PayPal Client ID & Secret (Live credentials)
  - [ ] Google OAuth credentials (Production)
  - [ ] NextAuth secret generated
- [ ] Email service configured (optional but recommended)
- [ ] Error tracking service setup (Sentry recommended)

### 3. Security
- [ ] `NEXTAUTH_SECRET` is a strong random value (min 32 characters)
- [ ] All sensitive environment variables are secure
- [ ] `.env.local` is in `.gitignore` (never commit secrets!)
- [ ] OAuth redirect URIs include production domain
- [ ] CORS policies are configured correctly

### 4. Database
- [ ] Database migrations are up to date
- [ ] Database backup strategy is in place
- [ ] Connection pooling is configured
- [ ] Database credentials are secure

---

## 🌐 Deploy to Vercel

### Method 1: Deploy via Git Integration (Recommended)

This method provides automatic deployments on every push.

#### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/learnai.git

# Push to main branch
git add .
git commit -m "Initial production setup"
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration
5. Configure environment variables (see below)
6. Click **"Deploy"**

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Method 3: Using Makefile

```bash
# Deploy to production
make deploy-vercel

# Deploy preview
make deploy-vercel-preview
```

---

## 🔐 Environment Variables

### Required Variables

Add these in Vercel Dashboard → **Settings → Environment Variables**:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/learnai_production

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-min-32-characters-random

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# OpenAI
OPENAI_API_KEY=sk-your-production-openai-key

# PayPal (LIVE - not sandbox!)
PAYPAL_CLIENT_ID=your-production-paypal-client-id
PAYPAL_CLIENT_SECRET=your-production-paypal-client-secret
PAYPAL_ENVIRONMENT=live
```

### Optional but Recommended

```bash
# Public variables
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=LearnAI

# Error tracking (Sentry)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Analytics (Google Analytics)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email service (SendGrid example)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### How to Add Variables on Vercel

1. Go to **Project Settings → Environment Variables**
2. Add each variable with:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Variable value
   - **Environment**: Select `Production`, `Preview`, and/or `Development`
3. Click **"Save"**
4. Redeploy to apply changes

---

## 🗄️ Database Setup

### Recommended Providers

For production, use a managed PostgreSQL service:

| Provider | Best For | Free Tier | Pricing |
|----------|----------|-----------|---------|
| **[Supabase](https://supabase.com)** | Full-stack apps | ✅ 500MB | From $25/mo |
| **[Neon](https://neon.tech)** | Serverless, auto-scaling | ✅ 1GB | From $19/mo |
| **[Railway](https://railway.app)** | Easy deployment | ✅ 512MB | From $5/mo |
| **[Vercel Postgres](https://vercel.com/storage/postgres)** | Vercel integration | ✅ 256MB | From $20/mo |
| **[AWS RDS](https://aws.amazon.com/rds/)** | Enterprise | ❌ | From $15/mo |

### Setup Example: Supabase

1. **Create Project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click **"New Project"**
   - Choose region (same as Vercel for low latency)
   - Set strong database password

2. **Get Connection String**
   - Go to **Project Settings → Database**
   - Copy **Connection string** (URI mode)
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

3. **Run Migrations**
   ```bash
   # Set DATABASE_URL temporarily
   export DATABASE_URL="your-supabase-connection-string"

   # Run migrations
   npx prisma db push

   # Or create migration
   npx prisma migrate deploy
   ```

4. **Add to Vercel**
   - Add `DATABASE_URL` to Vercel environment variables
   - Redeploy

### Database Security Checklist

- [ ] Use connection pooling (PgBouncer recommended)
- [ ] Enable SSL/TLS for connections
- [ ] Restrict database access by IP (if possible)
- [ ] Use strong passwords (min 16 characters)
- [ ] Enable automated backups
- [ ] Set up monitoring and alerts

---

## 🌍 Domain Configuration

### 1. Add Custom Domain on Vercel

1. Go to **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain: `yourdomain.com`
4. Vercel will provide DNS records

### 2. Configure DNS

Add these records to your domain registrar:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Update Environment Variables

After domain is active, update:

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Update OAuth Redirect URIs

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services → Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   - `https://yourdomain.com/api/auth/callback/google`
5. Save

**PayPal:**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Update your Live app settings
3. Add return URL: `https://yourdomain.com`

---

## 📊 Post-Deployment

### 1. Verify Deployment

Check the following after deployment:

```bash
# Health check
curl https://yourdomain.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-12-13T...",
  "uptime": 12.345,
  "environment": "production",
  "checks": {
    "database": { "status": "up", "responseTime": 45 },
    "api": { "status": "up", "responseTime": 12 }
  }
}
```

### 2. Test Critical Flows

- [ ] User registration works
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] AI professor recommendations work
- [ ] Booking creation works
- [ ] PayPal payment flow works
- [ ] Dashboard loads correctly
- [ ] Classroom/whiteboard loads

### 3. Performance Testing

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run performance audit
lighthouse https://yourdomain.com --view

# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 90+
```

### 4. Security Audit

```bash
# Check security headers
curl -I https://yourdomain.com

# Verify:
# - Strict-Transport-Security
# - X-Content-Type-Options
# - X-Frame-Options
# - Referrer-Policy
```

---

## 📈 Monitoring & Observability

### 1. Vercel Analytics (Built-in)

Vercel provides basic analytics:
- Page views
- Unique visitors
- Top pages
- Web Vitals (Core Web Vitals)

Access at: **Project → Analytics**

### 2. Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

Add to environment variables:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 3. Uptime Monitoring

Use services like:
- **[UptimeRobot](https://uptimerobot.com)** - Free, checks every 5 minutes
- **[Better Uptime](https://betteruptime.com)** - Free tier, beautiful status pages
- **[Pingdom](https://www.pingdom.com)** - Enterprise-grade

Monitor endpoint: `https://yourdomain.com/health`

### 4. Application Performance Monitoring (APM)

For advanced monitoring:
- **[New Relic](https://newrelic.com)** - Full-stack observability
- **[Datadog](https://www.datadoghq.com)** - Infrastructure & APM
- **[Vercel Pro](https://vercel.com/pricing)** - Advanced analytics

### 5. Database Monitoring

- Enable query logging in Prisma (development only)
- Use Supabase/Neon built-in monitoring
- Set up alerts for slow queries (>1s)
- Monitor connection pool usage

---

## 🔧 Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Solution: Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Error: "Type error: ..."**
```bash
# Solution: Run type checking locally
npm run type-check

# Fix errors, then commit and push
```

### Runtime Errors

**Error: "Database connection failed"**
- Check `DATABASE_URL` in Vercel environment variables
- Verify database is accessible from Vercel (check firewall/IP whitelist)
- Test connection: `npx prisma db push`

**Error: "NextAuth configuration error"**
- Verify `NEXTAUTH_URL` matches your production domain
- Check `NEXTAUTH_SECRET` is set and is at least 32 characters
- Verify OAuth redirect URIs include production domain

**Error: "OpenAI API error"**
- Check `OPENAI_API_KEY` is valid and not expired
- Verify API key has credits/billing enabled
- Check API rate limits

### Performance Issues

**Slow page loads**
- Enable caching headers (already configured)
- Use Vercel Image Optimization
- Implement React lazy loading
- Check database query performance

**High database latency**
- Use connection pooling (PgBouncer)
- Place database in same region as Vercel functions
- Add database indexes
- Optimize Prisma queries

---

## 🐳 Alternative Platforms

### Docker Deployment

The project includes a production-ready Dockerfile:

```bash
# Build Docker image
docker build -t learnai:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  learnai:latest
```

### Deploy to AWS (EC2 + RDS)

1. **Setup RDS PostgreSQL** database
2. **Launch EC2 instance** (t3.medium or larger)
3. **Install Docker** on EC2
4. **Pull and run** your Docker image
5. **Setup NGINX** reverse proxy
6. **Configure SSL** with Let's Encrypt

### Deploy to Google Cloud Run

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Build and deploy
gcloud run deploy learnai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Choose your repository
5. Add environment variables
6. Railway auto-deploys on every push

---

## 📞 Support

If you encounter issues during deployment:

- 📖 **Documentation**: [Vercel Docs](https://vercel.com/docs)
- 💬 **Community**: [GitHub Discussions](https://github.com/ruslanmv/learnai/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/ruslanmv/learnai/issues)
- 📧 **Email**: support@ruslanmv.com

---

## 🎉 Post-Launch

After successful deployment:

1. **Announce Launch**
   - Share on social media
   - Submit to product directories (Product Hunt, Indie Hackers)
   - Write launch blog post

2. **Monitor Closely**
   - Watch error rates in Sentry
   - Monitor performance metrics
   - Check user feedback

3. **Iterate**
   - Fix bugs quickly
   - Gather user feedback
   - Plan next features

4. **Scale**
   - Upgrade database as needed
   - Optimize slow queries
   - Add CDN for static assets

---

**Made with ❤️ by [Ruslan Magana](https://ruslanmv.com)**

Good luck with your deployment! 🚀
