# Security Policy

## Supported Versions

We take security seriously at LearnAI. The following versions are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by email to:

📧 **security@ruslanmv.com**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include as much of the following information as possible:

- Type of issue (e.g., SQL injection, XSS, authentication bypass)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Process

1. **Acknowledgment**: We'll acknowledge your email within 48 hours
2. **Investigation**: We'll investigate and validate the report
3. **Fix**: We'll work on a fix for confirmed vulnerabilities
4. **Disclosure**: We'll coordinate disclosure timing with you
5. **Credit**: We'll credit you in the security advisory (unless you prefer to remain anonymous)

## Security Measures in Place

### Authentication & Authorization
- NextAuth.js for secure authentication
- JWT tokens with secure httpOnly cookies
- Password hashing with bcryptjs (12 rounds)
- Google OAuth 2.0 integration
- Role-based access control (Student, Teacher, Admin)

### Data Protection
- Environment variables for sensitive data
- No hardcoded credentials
- Prisma ORM for SQL injection prevention
- Input validation and sanitization
- HTTPS enforced in production

### API Security
- CORS configuration
- Rate limiting (recommended for production)
- Request validation
- Error handling without information disclosure
- Secure headers (X-Frame-Options, X-Content-Type-Options, etc.)

### Infrastructure Security
- Secure session management
- CSRF protection via NextAuth
- XSS protection
- Content Security Policy headers
- Database connection encryption

## Best Practices for Deployment

### Environment Variables
- Never commit `.env.local` or `.env.production`
- Use strong random secrets (minimum 32 characters)
- Rotate secrets regularly
- Use environment-specific configurations

### Database
- Use SSL/TLS for database connections
- Implement database backups
- Use read replicas for sensitive operations
- Regularly update PostgreSQL version

### Monitoring
- Implement logging for security events
- Monitor for unusual activity
- Set up alerts for failed authentication attempts
- Track API rate limits

### Dependencies
- Regularly update npm packages
- Use `npm audit` to check for vulnerabilities
- Review dependency licenses
- Remove unused dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Production Checklist

- [ ] All environment variables are set in Vercel
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] Database URL uses SSL
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Logging is configured
- [ ] Error tracking is set up (e.g., Sentry)
- [ ] Database backups are scheduled
- [ ] Dependencies are up to date

## Known Security Considerations

### Microsoft Teams Integration
The current Teams integration is a placeholder. Implement proper Microsoft Graph API authentication before production use.

### PayPal Webhooks
Implement PayPal webhook verification for production to ensure payment integrity.

### Rate Limiting
Implement rate limiting on API routes to prevent abuse:
- Login attempts
- Registration
- API calls

Example using middleware:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

### Input Validation
All user inputs should be validated. Consider using:
- Zod for runtime validation
- Type guards for TypeScript
- Prisma for database queries

## Security Updates

We'll announce security updates through:
- GitHub Security Advisories
- Release notes
- CHANGELOG.md

Subscribe to repository notifications to stay informed.

## Responsible Disclosure

We follow responsible disclosure practices:
- We'll work with you to understand and fix the issue
- We'll credit you in the security advisory
- We'll coordinate public disclosure timing
- We won't take legal action against researchers who follow this policy

## Contact

For security concerns:
- 📧 Email: security@ruslanmv.com
- 🔒 PGP Key: Available on request

For general inquiries:
- 📧 Email: support@ruslanmv.com
- 🐛 Issues: [GitHub Issues](https://github.com/ruslanmv/learnai/issues)

Thank you for helping keep LearnAI and our users safe!
