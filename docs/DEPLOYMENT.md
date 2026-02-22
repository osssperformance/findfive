# Find Five Deployment Guide

## Architecture Overview

- **Mobile PWA**: Main app with auth server, database, and PWA features
- **Desktop App**: Companion client that connects to the mobile PWA's auth server

## Deployment Order

**IMPORTANT**: Deploy in this exact order:

1. **Mobile PWA first** - This contains the auth server
2. **Desktop App second** - This connects to the mobile PWA's auth server

## 1. Mobile PWA Deployment

### Vercel Project: `findfive`
- Project ID: `prj_wUvP3JUl9v0mos1DTb61Tq7CjOb9`
- Directory: `mobile-pwa/`

### Environment Variables Required:
```bash
# Database
DATABASE_URL=your-supabase-connection-string
SUPABASE_DATABASE_URL=your-supabase-connection-string
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Better Auth
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=https://your-mobile-pwa-domain.vercel.app

# OpenAI
OPENAI_API_KEY=your-openai-key

# PWA Push Notifications
WEB_PUSH_PUBLIC_KEY=your-vapid-public-key
WEB_PUSH_PRIVATE_KEY=your-vapid-private-key
```

### Deploy Command:
```bash
cd mobile-pwa
vercel --prod
```

## 2. Desktop App Deployment

### Vercel Project: `findfivedsktp`
- Project ID: `prj_GsPo9nspuM3Oej9XZB7xBUk6fL55`
- Directory: `desktop-app/`

### Environment Variables Required:
```bash
# Auth Connection (points to mobile PWA)
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-mobile-pwa-domain.vercel.app

# Optional: If desktop needs direct DB access
DATABASE_URL=your-supabase-connection-string
```

### Deploy Command:
```bash
cd desktop-app
vercel --prod
```

## 3. Post-Deployment Configuration

### Update Trusted Origins
After deploying, update the mobile PWA's trusted origins:

1. Go to mobile PWA Vercel environment variables
2. Add desktop app URL to `BETTER_AUTH_TRUSTED_ORIGINS` or update the auth config:

```javascript
// In mobile-pwa/src/lib/auth.ts
trustedOrigins: [
  process.env.BETTER_AUTH_URL || "http://localhost:3002",
  "http://localhost:3003", // Desktop app local
  "https://your-desktop-app-domain.vercel.app", // Add this line
  // ... other origins
]
```

### CORS Configuration
Ensure your database and APIs allow requests from both domains.

## 4. Testing Deployment

### Mobile PWA Tests:
- [ ] Auth flows work (signup/signin/signout)
- [ ] PWA installs correctly
- [ ] Offline functionality works
- [ ] Voice recording and AI categorization work

### Desktop App Tests:
- [ ] Can connect to mobile PWA auth server
- [ ] Login redirects work properly
- [ ] Shared session between mobile and desktop
- [ ] Desktop-specific features work

### Cross-Platform Tests:
- [ ] Login on mobile, access desktop (session sharing)
- [ ] Data sync between platforms
- [ ] Logout on one platform affects the other

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Update trusted origins in auth config
2. **Session Not Shared**: Verify `BETTER_AUTH_URL` points to mobile PWA
3. **Build Failures**: Check environment variables are set
4. **Database Connection**: Verify connection strings in both apps

### Debug Steps:

1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Test API endpoints directly
4. Check browser developer tools for client-side errors

## Environment Variable Management

### Required for Mobile PWA:
- Database connection
- Better Auth configuration
- OpenAI API key
- PWA notification keys

### Required for Desktop App:
- Better Auth URL (pointing to mobile PWA)

### Optional for Both:
- Analytics keys
- Error reporting keys

## Security Considerations

- Never expose database credentials to client-side code
- Use proper CORS configuration
- Keep auth secrets secure
- Regular security audits of dependencies