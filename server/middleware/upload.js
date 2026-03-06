const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        console.log('Uploads directory ready');
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
};

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
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

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
};

module.exports = {
    upload,
    ensureUploadsDir,
    getImageUrl
};
