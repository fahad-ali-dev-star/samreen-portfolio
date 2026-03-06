const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/projects.json');
const DATA_DIR = path.join(__dirname, '../../data');

// Initialize database if it doesn't exist
const initDB = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        try {
            await fs.access(DB_FILE);
        } catch {
            // File doesn't exist, create it with empty projects array
            await fs.writeFile(DB_FILE, JSON.stringify({ projects: [] }, null, 2));
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Initialize on module load
initDB();

// Read projects from database
const readProjects = async () => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading projects:', error);
        return { projects: [] };
    }
};

// Write projects to database
const writeProjects = async (data) => {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing projects:', error);
        return false;
    }
};

// Generate new project ID
const generateId = (projects) => {
    if (!projects || projects.length === 0) return 1;
    return Math.max(...projects.map(p => parseInt(p.id) || 0)) + 1;
};

module.exports = {
    readProjects,
    writeProjects,
    generateId
};
