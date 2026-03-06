require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_CALLBACK_URL =
    process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5500',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Ensure uploads directory exists before starting server
async function ensureUploadsDir() {
    try {
        await fs.mkdir('uploads', { recursive: true });
        console.log('Uploads directory ready');
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
}
ensureUploadsDir();

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Normalize emails so Gmail aliases map to a single comparable identity.
const normalizeEmail = (email) => {
    const raw = String(email || '').trim().toLowerCase();
    if (!raw || !raw.includes('@')) return '';

    let [localPart, domain] = raw.split('@');
    if (!localPart || !domain) return '';

    if (domain === 'googlemail.com') domain = 'gmail.com';

    if (domain === 'gmail.com') {
        const plusIndex = localPart.indexOf('+');
        if (plusIndex !== -1) localPart = localPart.slice(0, plusIndex);
        localPart = localPart.replace(/\./g, '');
    }

    return `${localPart}@${domain}`;
};

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // Check if user email matches admin email
    const userEmail = normalizeEmail(profile.emails?.[0]?.value);
    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
    if (userEmail && adminEmail && userEmail === adminEmail) {
      return done(null, profile);
    } else {
      console.warn('Admin login denied:', {
          googleEmail: profile.emails?.[0]?.value || '',
          configuredAdmin: process.env.ADMIN_EMAIL || ''
      });
      return done(null, false, { message: 'Unauthorized' });
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Database file path
const DB_FILE = path.join(__dirname, 'projects.json');

// Initialize database if it doesn't exist
const initDB = async () => {
    try {
        await fs.access(DB_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty projects array
        await fs.writeFile(DB_FILE, JSON.stringify({ projects: [] }, null, 2));
    }
};
initDB();

// Helper function to read projects from database
const readProjects = async () => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading projects:', error);
        return { projects: [] };
    }
};

// Helper function to write projects to database
const writeProjects = async (data) => {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing projects:', error);
        return false;
    }
};

// Auth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
        res.redirect(process.env.CLIENT_URL + '/admin.html');
    }
);

app.get('/login-failed', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Failed | Admin Panel</title>
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
            .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: 500; transition: transform 0.2s, box-shadow 0.2s; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4); }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
            <h1>Login Failed</h1>
            <p>You are not authorized to access this admin panel.</p>
            <a href="/" class="btn"><i class="fas fa-home"></i> Back to Home</a>
        </div>
    </body>
    </html>
    `;
    res.send(html);
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                name: req.user.displayName,
                email: req.user.emails[0].value,
                photo: req.user.photos[0].value
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Public route to get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const data = await readProjects();
        res.json(data.projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Protected admin routes
app.get('/api/admin/projects', isAuthenticated, async (req, res) => {
    try {
        const data = await readProjects();
        res.json(data.projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/admin/projects', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const data = await readProjects();
        
        // Generate new project ID
        const newId = data.projects.length > 0 
            ? Math.max(...data.projects.map(p => parseInt(p.id))) + 1 
            : 1;
        
        const newProject = {
            id: newId.toString(),
            title: req.body.title,
            category: req.body.category,
            image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
            description: req.body.description,
            problem: req.body.problem || '',
            solution: req.body.solution || '',
            concept: req.body.concept || '',
            features: req.body.features || '',
            scope: req.body.scope || '',
            brandElements: req.body.brandElements || '',
            brandMessage: req.body.brandMessage || '',
            tools: req.body.tools
        };
        
        data.projects.push(newProject);
        const success = await writeProjects(data);
        
        if (success) {
            res.json({ message: 'Project added successfully', project: newProject });
        } else {
            res.status(500).json({ error: 'Failed to save project' });
        }
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Failed to add project' });
    }
});

app.put('/api/admin/projects/:id', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const data = await readProjects();
        const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
        
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const updatedProject = {
            ...data.projects[projectIndex],
            title: req.body.title,
            category: req.body.category,
            image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || data.projects[projectIndex].image),
            description: req.body.description,
            problem: req.body.problem || '',
            solution: req.body.solution || '',
            concept: req.body.concept || '',
            features: req.body.features || '',
            scope: req.body.scope || '',
            brandElements: req.body.brandElements || '',
            brandMessage: req.body.brandMessage || '',
            tools: req.body.tools
        };
        
        data.projects[projectIndex] = updatedProject;
        const success = await writeProjects(data);
        
        if (success) {
            res.json({ message: 'Project updated successfully', project: updatedProject });
        } else {
            res.status(500).json({ error: 'Failed to update project' });
        }
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/admin/projects/:id', isAuthenticated, async (req, res) => {
    try {
        const data = await readProjects();
        const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
        
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        data.projects.splice(projectIndex, 1);
        const success = await writeProjects(data);
        
        if (success) {
            res.json({ message: 'Project deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete project' });
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Start server
ensureUploadsDir().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Google OAuth callback URL: ${GOOGLE_CALLBACK_URL}`);
        console.log(`Make sure to set up your .env file with Google OAuth credentials`);
    });
});
