require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const { ensureUploadsDir } = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const RENDER_URL = process.env.RENDER_URL || `https://samreen-portfolio.onrender.com`;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 
    (isProduction ? `${RENDER_URL}/auth/google/callback` : `http://localhost:${PORT}/auth/google/callback`);

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.CLIENT_URL || 'https://samreen-portfolio.vercel.app')
        : true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy — only register if real credentials are provided
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret &&
    googleClientId !== 'placeholder' && googleClientSecret !== 'placeholder') {
    passport.use(new GoogleStrategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: GOOGLE_CALLBACK_URL
      },
      (accessToken, refreshToken, profile, done) => {
          const userEmail = profile.emails && profile.emails[0] ? String(profile.emails[0].value || '').trim().toLowerCase() : '';
          const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
          if (userEmail && adminEmail && userEmail === adminEmail) {
              return done(null, profile);
          } else {
              console.warn(`Unauthorized login attempt from: ${userEmail || 'unknown-email'}`);
              return done(null, false, { message: 'Unauthorized' });
          }
      }
    ));
    console.log('Google OAuth strategy registered');
    console.log(`Google OAuth callback URL: ${GOOGLE_CALLBACK_URL}`);
} else {
    console.warn('Google OAuth credentials not configured. Admin login will be unavailable.');
    console.warn('Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and ADMIN_EMAIL in server/.env');
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Ensure uploads directory exists
ensureUploadsDir();

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/api', projectRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Make sure to set up your .env file with Google OAuth credentials`);
});

module.exports = app;
