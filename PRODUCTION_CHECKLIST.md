# ✅ Production Deployment Checklist

Use this comprehensive checklist to ensure your **LearnAI** deployment is production-ready, secure, and optimized for performance.

---

## 🔐 Security

### Authentication & Authorization
- [ ] `NEXTAUTH_SECRET` is a strong random value (minimum 32 characters)
- [ ] `NEXTAUTH_SECRET` is different from development
- [ ] `NEXTAUTH_URL` matches your production domain exactly
- [ ] OAuth redirect URIs include production domain
- [ ] OAuth credentials are for production apps (not development)
- [ ] Password hashing uses bcrypt with sufficient salt rounds (12+)
- [ ] Session expiry is configured appropriately (30 days default)
- [ ] JWT tokens are properly signed and validated

### Environment Variables
- [ ] No secrets are committed to version control
- [ ] `.env.local` and `.env.production` are in `.gitignore`
- [ ] All environment variables are set on Vercel/hosting platform
- [ ] Production variables are different from development
- [ ] API keys have billing limits configured
- [ ] Sensitive variables are encrypted at rest

### Security Headers
- [ ] `Strict-Transport-Security` (HSTS) is enabled
- [ ] `X-Content-Type-Options: nosniff` is set
- [ ] `X-Frame-Options: DENY` is set
- [ ] `X-XSS-Protection` is enabled
- [ ] `Referrer-Policy` is configured
- [ ] `Permissions-Policy` restricts camera/microphone/geolocation
- [ ] Content Security Policy (CSP) is configured

### API Security
- [ ] Rate limiting is implemented on API routes
- [ ] CORS is configured correctly
- [ ] API routes validate input data (Zod schemas)
- [ ] SQL injection protection (using Prisma ORM)
- [ ] XSS protection (React automatic escaping + headers)
- [ ] CSRF protection is enabled
- [ ] API authentication is required where needed

### Database Security
- [ ] Database uses SSL/TLS connections (`sslmode=require`)
- [ ] Database password is strong (16+ characters)
- [ ] Database access is restricted by IP (if possible)
- [ ] Connection pooling is enabled (PgBouncer)
- [ ] Database user has minimal required permissions
- [ ] Sensitive data is encrypted at rest

---

## 🗄️ Database

### Configuration
- [ ] Production database is provisioned (PostgreSQL)
- [ ] Database is in the same region as application (low latency)
- [ ] Database connection string is correct
- [ ] Connection pooling is configured
- [ ] SSL/TLS is enabled
- [ ] Maximum connections are configured appropriately

### Migrations
- [ ] All Prisma migrations are applied
- [ ] Database schema matches Prisma schema
- [ ] Test data is removed (no development data in production)
- [ ] Indexes are created for frequently queried fields
- [ ] Foreign key constraints are in place

### Backups
- [ ] Automated daily backups are configured
- [ ] Backup retention policy is set (30 days recommended)
- [ ] Backup restoration process is tested
- [ ] Point-in-time recovery is enabled (if available)
- [ ] Backups are stored in a different region

### Performance
- [ ] Slow query logging is enabled
- [ ] Query performance is monitored
- [ ] Database indexes are optimized
- [ ] Connection pool size is appropriate for traffic
- [ ] Database monitoring and alerts are configured

---

## 🌐 Deployment

### Code Quality
- [ ] All tests pass: `npm test` (if tests exist)
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] Code is formatted: `npm run format:check`
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors or warnings in production build

### Vercel Configuration
- [ ] Project is connected to Git repository
- [ ] Auto-deploy on push is configured
- [ ] Preview deployments work correctly
- [ ] Build command is correct: `npm run build`
- [ ] Install command is correct: `npm install`
- [ ] Node.js version is specified: `18.x` or higher
- [ ] Environment variables are set for production

### Performance
- [ ] Lighthouse Performance score is 90+ (run `lighthouse https://yourdomain.com`)
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Total Blocking Time (TBT) < 200ms

### Caching
- [ ] Static assets have long cache headers (1 year)
- [ ] API routes have appropriate cache headers
- [ ] CDN is configured (Vercel Edge Network)
- [ ] Image optimization is enabled
- [ ] Font optimization is configured

---

## 🔑 Third-Party Services

### OpenAI
- [ ] Production API key is set
- [ ] Billing is configured with limits
- [ ] API key has necessary permissions
- [ ] Usage monitoring is enabled
- [ ] Error handling for API failures is implemented

### PayPal
- [ ] Live (not sandbox) credentials are used
- [ ] `PAYPAL_ENVIRONMENT=live` is set
- [ ] PayPal app has been reviewed and approved
- [ ] Webhooks are configured for payment notifications
- [ ] Payment flow is tested end-to-end
- [ ] Revenue split (90/10) is configured correctly

### Google OAuth
- [ ] Production OAuth client is created
- [ ] Authorized redirect URIs include production domain
- [ ] OAuth consent screen is configured
- [ ] App is verified (if required for your use case)
- [ ] Scopes are minimal (only request what you need)

### Email Service (if configured)
- [ ] Email service API key is set
- [ ] SMTP credentials are correct
- [ ] From address is verified
- [ ] Email templates are tested
- [ ] Unsubscribe links are included
- [ ] SPF, DKIM, DMARC records are configured

---

## 📊 Monitoring & Observability

### Error Tracking
- [ ] Sentry (or alternative) is configured
- [ ] Error notifications are set up
- [ ] Error sampling rate is appropriate
- [ ] Source maps are uploaded for better debugging
- [ ] PII scrubbing is configured

### Analytics
- [ ] Google Analytics (or alternative) is configured
- [ ] Measurement ID is set
- [ ] Cookie consent is implemented (GDPR/CCPA)
- [ ] Custom events are tracked
- [ ] Conversion tracking is set up

### Uptime Monitoring
- [ ] Uptime monitoring service is configured (UptimeRobot, Better Uptime)
- [ ] Health check endpoint (`/health`) is monitored
- [ ] Alerts are set up for downtime
- [ ] Multiple check locations are configured
- [ ] Status page is created (optional)

### Application Performance Monitoring (APM)
- [ ] APM tool is configured (New Relic, Datadog, Vercel Analytics)
- [ ] Performance metrics are tracked
- [ ] Slow queries are monitored
- [ ] API response times are tracked
- [ ] Error rates are monitored

### Logging
- [ ] Production logs are structured (JSON format)
- [ ] Log aggregation is set up (Vercel logs, CloudWatch, etc.)
- [ ] Log retention policy is configured
- [ ] Sensitive data is not logged
- [ ] Log levels are appropriate (INFO in production)

---

## 🌍 Domain & SSL

### Domain Configuration
- [ ] Custom domain is added to Vercel
- [ ] DNS records are configured correctly (A/CNAME)
- [ ] Domain propagation is complete (check with `dig` or `nslookup`)
- [ ] www redirect is configured (or vice versa)
- [ ] SSL certificate is issued and valid

### SSL/TLS
- [ ] HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate is valid and not expired
- [ ] Certificate includes all subdomains (if needed)
- [ ] SSL Labs test shows A or A+ rating (https://www.ssllabs.com/ssltest/)
- [ ] HSTS is enabled with proper max-age

---

## 🚀 Performance Optimization

### Images
- [ ] Images are optimized (WebP/AVIF format)
- [ ] Next.js Image component is used
- [ ] Lazy loading is enabled for below-fold images
- [ ] Image sizes are responsive
- [ ] Alt text is provided for accessibility

### JavaScript
- [ ] Code splitting is configured
- [ ] Unused code is removed (tree-shaking)
- [ ] Third-party scripts are loaded asynchronously
- [ ] Bundle size is monitored
- [ ] Source maps are generated for production debugging

### CSS
- [ ] Tailwind CSS is purged of unused styles
- [ ] Critical CSS is inlined
- [ ] CSS is minified
- [ ] Unused CSS frameworks are removed

### Fonts
- [ ] Fonts are self-hosted or use `next/font`
- [ ] Font preloading is configured
- [ ] Font display is set to `swap` or `optional`
- [ ] Subsetting is used (only include needed characters)

---

## 📱 Accessibility & SEO

### Accessibility (WCAG 2.1 AA)
- [ ] Color contrast meets WCAG standards (4.5:1)
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels are used where needed
- [ ] Screen reader testing is done
- [ ] Lighthouse Accessibility score is 95+

### SEO
- [ ] Meta tags are configured (title, description)
- [ ] Open Graph tags are set
- [ ] Twitter Card tags are set
- [ ] Robots.txt is configured
- [ ] Sitemap.xml is generated and submitted
- [ ] Structured data (JSON-LD) is implemented
- [ ] Canonical URLs are set
- [ ] 404 page is customized

---

## 🧪 Testing

### Functional Testing
- [ ] All critical user flows are tested:
  - [ ] User registration
  - [ ] Login (email + Google OAuth)
  - [ ] AI professor recommendations
  - [ ] Booking creation
  - [ ] Payment flow (end-to-end)
  - [ ] Dashboard access
  - [ ] Classroom/whiteboard
- [ ] Error states are tested
- [ ] Edge cases are handled

### Cross-Browser Testing
- [ ] Chrome/Edge (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Performance Testing
- [ ] Load testing is performed
- [ ] Database queries are optimized
- [ ] API response times are acceptable
- [ ] No memory leaks detected
- [ ] Server can handle expected traffic

---

## 📄 Legal & Compliance

### Privacy & Legal
- [ ] Privacy Policy is created and linked
- [ ] Terms of Service are created and linked
- [ ] Cookie consent is implemented (if required)
- [ ] GDPR compliance (if serving EU users)
- [ ] CCPA compliance (if serving California users)
- [ ] Data retention policy is defined
- [ ] User data deletion process is implemented

### Payment Compliance
- [ ] PCI DSS compliance (handled by PayPal)
- [ ] Refund policy is clearly stated
- [ ] Transaction records are stored securely
- [ ] Tax calculation (if required in your jurisdiction)

---

## 📚 Documentation

### User Documentation
- [ ] README.md is complete and accurate
- [ ] Setup instructions are clear
- [ ] Environment variables are documented
- [ ] API endpoints are documented

### Developer Documentation
- [ ] Code is well-commented
- [ ] Architecture is documented
- [ ] Database schema is documented
- [ ] Deployment process is documented
- [ ] Troubleshooting guide is available

### Operations Documentation
- [ ] Runbook is created
- [ ] Incident response plan is defined
- [ ] Rollback procedure is documented
- [ ] Monitoring dashboard is set up

---

## 🔄 Post-Deployment

### Verification
- [ ] Health check endpoint returns 200: `curl https://yourdomain.com/health`
- [ ] Database connectivity is verified
- [ ] All environment variables are loaded correctly
- [ ] OAuth flows work end-to-end
- [ ] Payment processing works
- [ ] Email sending works (if configured)

### Monitoring Setup
- [ ] Uptime monitoring is active
- [ ] Error tracking is receiving events
- [ ] Analytics is collecting data
- [ ] Performance metrics are being tracked
- [ ] Database monitoring is active

### Communication
- [ ] Team is notified of deployment
- [ ] Users are notified (if breaking changes)
- [ ] Status page is updated
- [ ] Social media announcement (if applicable)

---

## 🎯 Final Checks

Before going live:

- [ ] All items in this checklist are complete
- [ ] Production environment is tested thoroughly
- [ ] Rollback plan is ready
- [ ] Team is available for monitoring
- [ ] Support channels are ready
- [ ] Launch checklist is completed

---

## 📞 Emergency Contacts

Document your emergency contacts:

- **Technical Lead**: [Name, Phone, Email]
- **Database Admin**: [Name, Phone, Email]
- **DevOps**: [Name, Phone, Email]
- **Hosting Support**: [Vercel Support Link]
- **Database Support**: [Provider Support Link]

---

## 🔄 Regular Maintenance

After deployment, schedule regular maintenance:

### Daily
- [ ] Monitor error rates
- [ ] Check uptime status
- [ ] Review performance metrics

### Weekly
- [ ] Review slow queries
- [ ] Check database backups
- [ ] Update dependencies (security patches)

### Monthly
- [ ] Review analytics
- [ ] Audit user feedback
- [ ] Security audit
- [ ] Performance optimization

### Quarterly
- [ ] Disaster recovery test
- [ ] Security penetration testing
- [ ] Capacity planning
- [ ] Cost optimization review

---

**Congratulations on your production deployment! 🎉**

If you've completed all items in this checklist, your LearnAI platform is production-ready, secure, and optimized for success.

---

**Need Help?**
- 📖 [Deployment Guide](./DEPLOYMENT.md)
- 📚 [README](./README.md)
- 🐛 [Report Issues](https://github.com/ruslanmv/learnai/issues)
