# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables (Vercel)

Configure these in Vercel Dashboard → Settings → Environment Variables:

#### Firebase Configuration (Public - Safe)
- `NEXT_PUBLIC_FIREBASE_API_KEY` - ✅ Public
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - ✅ Public
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - ✅ Public
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - ✅ Public
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - ✅ Public
- `NEXT_PUBLIC_FIREBASE_APP_ID` - ✅ Public

#### Firebase Admin SDK (Sensitive - Mark as Secret)
- `FIREBASE_PROJECT_ID` - 🔒 Sensitive
- `FIREBASE_CLIENT_EMAIL` - 🔒 Sensitive
- `FIREBASE_PRIVATE_KEY` - 🔒 **HIGHLY SENSITIVE** (toggle "Sensitive" in Vercel)

#### API Keys (Sensitive - Mark as Secret)
- `OPENROUTER_API` - 🔒 **HIGHLY SENSITIVE**
- `FIRECRAWL_API_KEY` - 🔒 **HIGHLY SENSITIVE**

### 2. Firebase Firestore Setup

#### Deploy Firestore Security Rules
```bash
firebase deploy --only firestore:rules
```

Security rules location: `firestore.rules`
- Public read access to analyses collection
- Server-only write access (Admin SDK)

#### Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

Indexes location: `firestore.indexes.json`
- `updated_at DESC` (for recent analyses)
- `last_checked_at DESC` (for sorting)
- Composite indexes for filtering + sorting

### 3. Security Headers

Security headers are configured in `src/middleware.ts`:
- ✅ HSTS (Strict-Transport-Security)
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Content-Security-Policy
- ✅ Permissions-Policy

### 4. Rate Limiting Configuration

Current limits (configured in `src/lib/rate-limiter.ts`):
- **Analysis API**: 5 requests per 15 minutes per IP
- **History API**: 30 requests per 5 minutes per IP
- **General**: 100 requests per 15 minutes per IP

To adjust limits, edit `src/lib/rate-limiter.ts`:
```typescript
export const analysisRateLimiter = new RateLimiter(5, 15); // requests, minutes
```

### 5. Input Validation

All user inputs are validated and sanitized:
- ✅ URL validation (prevents SSRF attacks)
- ✅ Private IP blocking (10.x.x.x, 192.168.x.x, 127.x.x.x)
- ✅ Localhost/metadata endpoint blocking
- ✅ Protocol restriction (HTTP/HTTPS only)
- ✅ Pagination parameter validation (max 100 limit)
- ✅ SQL injection prevention
- ✅ XSS prevention

### 6. Performance Optimizations

#### Caching Strategy
- **In-memory cache**: 60 seconds for history API
- **Firestore cache**: 30 days for analysis results
- **Image cache**: 60 seconds minimum TTL
- **Static assets**: 1 year max-age

#### Image Optimization
- AVIF and WebP format support
- Responsive image sizes
- Lazy loading enabled
- Remote image optimization via Next.js

#### Next.js Optimizations
- Compression enabled
- `poweredByHeader` disabled
- Package import optimization (lucide-react, shadcn/ui)
- Static asset caching (1 year)

### 7. Error Handling

Production-grade error handling:
- ✅ Retry logic with exponential backoff
- ✅ Graceful degradation (Firecrawl → Puppeteer fallback)
- ✅ Error severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- ✅ Safe error messages (no sensitive data exposure)
- ✅ Comprehensive logging

### 8. Monitoring Setup

Add these monitoring services (recommended):
- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Traffic and performance metrics
- **Firebase Console**: Firestore usage and costs
- **OpenRouter Dashboard**: API usage and costs

## Deployment Steps

### 1. Build and Test Locally
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm start
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel --prod
```

Or use GitHub integration:
- Push to `main` branch
- Vercel auto-deploys

### 3. Post-Deployment Verification

#### Test Analysis Flow
1. Visit homepage
2. Submit a privacy policy URL
3. Verify analysis completes
4. Check Firestore for saved data
5. Verify logo displays correctly
6. Test caching (re-analyze same URL)

#### Test Rate Limiting
1. Make 6 requests quickly
2. Verify 6th request is rate-limited (429 status)
3. Check rate limit headers in response

#### Test Security Headers
```bash
curl -I https://your-domain.vercel.app
```

Verify headers:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `Content-Security-Policy`

#### Test Error Handling
1. Submit invalid URL
2. Submit localhost URL (should be blocked)
3. Submit non-privacy-policy URL
4. Verify user-friendly error messages

### 4. Firebase Console Setup

1. Go to Firebase Console → Firestore
2. Verify security rules are active
3. Check indexes are deployed
4. Set up backups (recommended)
5. Monitor usage and set budget alerts

## Performance Benchmarks

Target metrics:
- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

Monitor with:
- Vercel Analytics
- Google PageSpeed Insights
- Chrome DevTools Lighthouse

## Cost Optimization

### Firestore
- Free tier: 50K reads/day, 20K writes/day
- Enable caching to reduce reads
- Use 30-day re-analysis window to minimize writes

### Firecrawl
- Monitor API usage in Firecrawl dashboard
- Use Puppeteer fallback when API limit reached
- Consider caching scraped content

### OpenRouter
- Monitor token usage
- Optimize prompt length (16K character limit)
- Use cheaper models if quality is acceptable

## Security Best Practices

### Regular Updates
```bash
# Check for security vulnerabilities
npm audit

# Update dependencies
npm update

# Update Next.js
npm install next@latest
```

### API Key Rotation
- Rotate Firebase private key every 90 days
- Rotate OpenRouter API key every 90 days
- Rotate Firecrawl API key every 90 days

### Backup Strategy
- Firestore automatic backups (enable in console)
- Export SQLite database weekly
- Store backups in secure location (Google Cloud Storage)

## Rollback Plan

If deployment fails:
1. Revert to previous Vercel deployment:
   ```bash
   vercel rollback
   ```

2. Or use Vercel Dashboard:
   - Deployments → Select previous deployment → Promote to Production

3. Check Firestore state:
   - Verify no corrupt data
   - Restore from backup if needed

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Firebase Support**: https://firebase.google.com/support
- **OpenRouter Support**: https://openrouter.ai/
- **Firecrawl Support**: https://www.firecrawl.dev/

## Additional Resources

- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [OWASP Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
