# How to Connect Vercel to Render - Step by Step Guide

## Step 1: Set Environment Variables on Render

1. Go to **https://dashboard.render.com**
2. Click on your **web service** (the backend for your portfolio)
3. Click **Environment** tab on the left sidebar
4. Scroll down to **Environment Variables** section
5. Add these variables:

| Key | Value |
|-----|-------|
| `CLIENT_URL` | `https://samreen-portfolio.vercel.app` |
| `NODE_ENV` | `production` |
| `RENDER_URL` | `https://samreen-portfolio.onrender.com` |

6. Click **Save Changes**
7. Go to **Deployments** tab and click **Deploy** (or wait for auto-deploy)

## Step 2: Verify Backend is Working

After Render deploys, test your backend:
- Visit: `https://samreen-portfolio.onrender.com/health`
- You should see: `{"status":"ok","timestamp":"..."}`

## Step 3: Deploy Frontend on Vercel

1. Go to **https://vercel.com**
2. Click **Add New...** → **Project**
3. Import your GitHub repository: `fahad-ali-dev-star/samreen-portfolio`
4. In **Configure Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://samreen-portfolio.onrender.com` |

6. Click **Deploy**

## Step 4: Test the Connection

Once both deploy:
- Frontend: `https://samreen-portfolio.vercel.app`
- Backend: `https://samreen-portfolio.onrender.com`

The portfolio projects should load from the backend automatically!

## Troubleshooting

- If projects don't load, check browser console (F12) for errors
- Make sure Render deployed successfully (green checkmark)
- Verify the environment variables are set correctly on both platforms

