# Deployment Guide

This guide covers deploying the frontend and backend of your portfolio application, along with securing environment variables.

---

## Project Structure

```
portfolio-react/
├── src/              # React frontend source
├── dist/             # Built frontend (after build)
├── server/           # Node.js backend
│   ├── .env          # Backend environment variables ⚠️ SENSITIVE
│   ├── server.js     # Express server
│   └── uploads/      # Uploaded images
└── package.json      # Frontend dependencies
```

---

## Part 1: Secure Your Environment Variables

### Environment File Location

Your server reads from: `portfolio-react/server/.env`

### Important Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `NODE_ENV` | Set to `production` for deployment |
| `CLIENT_URL` | Your frontend URL |
| `SESSION_SECRET` | Random 64+ character string |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `ADMIN_EMAIL` | Only this email can access admin |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL |

### Generate New Session Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Part 2: Deploy Backend (Node.js/Express)

### Option A: Deploy to Render.com (Recommended - Free)

1. **Push your code to GitHub** (`.env` is already in `.gitignore`)

2. **Create a Web Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create New → Web Service
   - Connect your GitHub repository
   - Settings:
     - Build Command: `cd portfolio-react/server && npm install`
     - Start Command: `cd portfolio-react/server && node server.js`
     - Environment: `Node`

3. **Set Environment Variables in Render**:
   - Add all variables from your `.env` file
   - Set `NODE_ENV=production`
   - Update `CLIENT_URL` to your frontend URL

### Option B: Deploy to Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**:
   ```bash
   cd portfolio-react/server
   railway up
   ```

3. **Set environment variables** in Railway dashboard

### Option C: Deploy to VPS (DigitalOcean/Railway/Linode)

1. **Install Node.js and PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install nodejs
   sudo npm install -g pm2
   ```

2. **Clone and setup**:
   ```bash
   git clone your-repo.git
   cd your-repo/portfolio-react/server
   npm install --production
   ```

3. **Create production `.env` file** and run with PM2:
   ```bash
   pm2 start server.js --name portfolio-backend
   pm2 save
   ```

---

## Part 3: Deploy Frontend (React + Vite)

### Option A: Deploy to Vercel (Recommended)

1. **Deploy**:
   ```bash
   cd portfolio-react
   vercel
   ```

2. **Or connect GitHub**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Add New Project → Import from GitHub
   - Settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`

### Option B: Deploy to Netlify

1. **Deploy**:
   ```bash
   cd portfolio-react
   netlify deploy --prod --dir=dist
   ```

2. **Or connect GitHub**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Add New Site → Import from GitHub
   - Build Command: `npm run build`
   - Publish directory: `dist`

---

## Part 4: Update Google OAuth for Production

After deploying, update your Google OAuth redirect URLs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client
3. Under "Authorized redirect URIs", add:
   - `https://your-backend-domain.com/auth/google/callback`
4. Under "Authorized JavaScript origins", add:
   - `https://your-frontend-domain.com`

---

## Part 5: Production Checklist

- [ ] Set `NODE_ENV=production` in backend
- [ ] Update CLIENT_URL to production domain
- [ ] Update GOOGLE_CALLBACK_URL to production domain
- [ ] Enable HTTPS on your domain
- [ ] Test authentication flow
- [ ] Test file uploads

---

## Quick Start Commands

```bash
# Development
cd portfolio-react
npm install:all
npm run dev

# Production Build
cd portfolio-react
npm run build

# Backend only
cd portfolio-react/server
npm start
```

---

## Security Best Practices

1. **Never commit `.env` files** - Already handled by `.gitignore`
2. **Use HTTPS in production** - Free with Vercel/Render
3. **Keep dependencies updated**

---

For additional help, refer to the main README.md file.
