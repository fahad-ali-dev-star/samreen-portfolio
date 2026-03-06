const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth routes
router.get('/google', (req, res, next) => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!googleClientId || !googleClientSecret ||
        googleClientId === 'placeholder' || googleClientSecret === 'placeholder') {
        return res.redirect('/auth/login-failed?reason=not-configured');
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login-failed' }),
    (req, res) => {
        res.redirect((process.env.CLIENT_URL || 'https://samreen-portfolio.vercel.app') + '/admin');
    }
);

// Login failed page
router.get('/login-failed', (req, res) => {
    const reason = req.query.reason;
    const isNotConfigured = reason === 'not-configured';
    const title = isNotConfigured ? 'OAuth Not Configured' : 'Login Failed';
    const message = isNotConfigured
        ? 'Google OAuth credentials are not set up yet. Edit <code>server/.env</code> with your GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and ADMIN_EMAIL to enable admin login.'
        : 'You are not authorized to access this admin panel. Only the designated admin email can access this area.';
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} | Admin Panel</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .error-container { background: white; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); padding: 60px 40px; text-align: center; max-width: 500px; width: 100%; }
            .error-icon { width: 100px; height: 100px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; }
            .error-icon i { font-size: 50px; color: #dc2626; }
            h1 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
            p { color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
            code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px; color: #374151; }
            .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: 500; transition: transform 0.2s, box-shadow 0.2s; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4); }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
            <h1>${title}</h1>
            <p>${message}</p>
            <a href="${process.env.CLIENT_URL || 'https://samreen-portfolio.vercel.app' || '/'}" class="btn"><i class="fas fa-home"></i> Back to Home</a>
        </div>
    </body>
    </html>
    `;
    res.send(html);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Auth status
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                name: req.user.displayName,
                email: req.user.emails && req.user.emails[0] ? req.user.emails[0].value : '',
                photo: req.user.photos && req.user.photos[0] ? req.user.photos[0].value : ''
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
