# Portfolio Admin Panel Setup Guide

## Overview
This admin panel allows you to manage your portfolio projects through a secure interface with Google authentication. Only your specified Google account can access the admin panel.

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A Google account
- Google Cloud Console access

## Step 1: Google OAuth Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "NEW PROJECT"
3. Enter project name (e.g., "Portfolio Admin")
4. Click "CREATE"

### 1.2 Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "ENABLE"

### 1.3 Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Portfolio Admin
   - User support email: Your email
   - Developer contact: Your email
   - Click "SAVE AND CONTINUE" through the steps
4. Back to Create OAuth client ID:
   - Application type: "Web application"
   - Name: "Portfolio Admin"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
   - Click "CREATE"
5. Copy your **Client ID** and **Client Secret** (you'll need these)

## Step 2: Project Setup

### 2.1 Install Dependencies
```bash
cd portfolio-admin
npm install
```

### 2.2 Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and add your credentials:
   ```env
   # Google OAuth Credentials (from Step 1.3)
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here

   # Session Secret (generate a random string)
   SESSION_SECRET=your_very_random_and_secure_secret_key_here

   # Your Google Email (ONLY this email can access admin)
   ADMIN_EMAIL=youremail@gmail.com

   # Server Configuration
   PORT=3000
   CLIENT_URL=http://localhost:5500
   ```

### 2.3 Important Security Notes
- **ADMIN_EMAIL**: Only the Google account with this exact email can access the admin panel
- **SESSION_SECRET**: Use a long, random string (minimum 32 characters)
- **Never commit .env file to git** - it's already in .gitignore

## Step 3: Running the Application

### 3.1 Start the Backend Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on http://localhost:3000

### 3.2 Start the Frontend
You can use any local server. For example:

**Using Live Server (VS Code extension):**
- Right-click on `index.html` or `admin.html`
- Select "Open with Live Server"

**Using Python:**
```bash
python -m http.server 5500
```

**Using Node.js http-server:**
```bash
npx http-server -p 5500
```

## Step 4: Access Admin Panel

1. Open your browser
2. Navigate to: `http://localhost:5500/admin.html`
3. Click "Continue with Google"
4. Sign in with the Google account matching ADMIN_EMAIL
5. You'll be redirected to the admin dashboard

## Step 5: Managing Projects

### Adding a New Project
1. Click "Add New Project" button
2. Fill in the required fields:
   - **Title**: Project name
   - **Category**: UI/UX Design, Graphic Design, Branding, etc.
   - **Tools**: Comma-separated list (e.g., "Figma, Photoshop, Illustrator")
   - **Image**: Upload a file or provide a URL
   - **Description**: Main project description
   - Optional fields: Problem, Solution, Concept, Features, etc.
3. Click "Save Project"

### Editing a Project
1. Click the edit icon (pencil) on any project row
2. Modify the fields
3. Click "Save Project"

### Deleting a Project
1. Click the delete icon (trash) on any project row
2. Confirm the deletion
3. Project will be permanently removed

## File Structure

```
portfolio-admin/
├── server.js              # Express server with authentication
├── package.json           # Node.js dependencies
├── .env                   # Environment variables (create this)
├── .env.example          # Environment template
├── projects.json         # Project database (auto-created)
├── uploads/              # Uploaded images (auto-created)
├── admin.html            # Admin panel interface
├── admin-style.css       # Admin panel styles
├── admin-script.js       # Admin panel logic
├── index.html            # Your portfolio (existing)
├── style.css             # Portfolio styles (existing)
└── script.js             # Portfolio logic (updated to fetch from API)
```

## Updating Your Portfolio to Use the API

The portfolio (`index.html`) will automatically fetch projects from the backend API. Make sure to:

1. Update the API endpoint in `script.js` if your backend runs on a different port
2. Keep the backend server running when viewing the portfolio

## Troubleshooting

### Issue: "Unauthorized" message after Google login
**Solution**: Make sure the ADMIN_EMAIL in `.env` exactly matches your Google account email

### Issue: "Failed to fetch projects"
**Solution**: 
- Check if the backend server is running
- Verify the API_URL in admin-script.js matches your server address
- Check browser console for CORS errors

### Issue: Images not showing
**Solution**:
- If using uploaded images, make sure the server is running
- Check that the `uploads/` directory exists and has proper permissions
- Verify image URLs are correct

### Issue: CORS errors in browser console
**Solution**:
- Make sure CLIENT_URL in `.env` matches your frontend URL
- Restart the server after changing `.env`

## Production Deployment

For production deployment:

1. **Update OAuth URLs**:
   - Add your production domain to Google Console
   - Update redirect URIs

2. **Update Environment Variables**:
   ```env
   NODE_ENV=production
   CLIENT_URL=https://yourdomain.com
   SESSION_SECRET=new_production_secret
   ```

3. **Use HTTPS**:
   - Set `cookie.secure: true` in session config
   - Use SSL certificates

4. **Database**:
   - Consider using a proper database (PostgreSQL, MongoDB)
   - The current JSON file works fine for small portfolios

5. **Image Storage**:
   - Consider using cloud storage (AWS S3, Cloudinary)
   - Current local storage works for simple deployments

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server terminal for error messages
3. Verify all environment variables are set correctly
4. Ensure your Google OAuth credentials are correct

## Security Best Practices

1. **Never share your .env file**
2. **Use strong SESSION_SECRET**
3. **Keep dependencies updated**: `npm update`
4. **Only share admin access with trusted email addresses**
5. **Use HTTPS in production**
6. **Regularly backup your projects.json file**

---

## Quick Start Checklist

- [ ] Google Cloud project created
- [ ] OAuth credentials obtained
- [ ] Dependencies installed (`npm install`)
- [ ] .env file configured
- [ ] ADMIN_EMAIL set to your Google account
- [ ] Backend server started (`npm start`)
- [ ] Frontend server started
- [ ] Successfully logged in to admin panel
- [ ] Test: Add/Edit/Delete a project

Congratulations! Your portfolio admin panel is now ready to use! 🎉
