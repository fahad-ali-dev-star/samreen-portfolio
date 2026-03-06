const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { upload, getImageUrl } = require('../middleware/upload');
const { readProjects, writeProjects, generateId } = require('../utils/db');

const router = express.Router();

const parseDetailImageUrls = (rawValue) => {
    if (!rawValue) return [];
    if (Array.isArray(rawValue)) {
        return rawValue.map((v) => String(v).trim()).filter(Boolean);
    }
    return String(rawValue)
        .split(/\r?\n|,/)
        .map((v) => v.trim())
        .filter(Boolean);
};

const buildDetailImages = (bodyValue, uploadedFiles = []) => {
    const urlImages = parseDetailImageUrls(bodyValue);
    const fileImages = uploadedFiles.map((file) => `/uploads/${file.filename}`);
    return [...urlImages, ...fileImages];
};

// Public route - Get all projects
router.get('/projects', async (req, res) => {
    try {
        const data = await readProjects();
        res.set('Cache-Control', 'no-store');
        res.json(data.projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Admin routes - Protected
router.get('/admin/projects', isAuthenticated, async (req, res) => {
    try {
        const data = await readProjects();
        res.set('Cache-Control', 'no-store');
        res.json(data.projects);
    } catch (error) {
        console.error('Error fetching admin projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.post('/admin/projects', isAuthenticated, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'detailImages', maxCount: 20 }
]), async (req, res) => {
    try {
        const data = await readProjects();
        const newId = generateId(data.projects);
        const thumbnailFile = req.files && req.files.image ? req.files.image[0] : null;
        const detailImageFiles = req.files && req.files.detailImages ? req.files.detailImages : [];
        const detailImages = buildDetailImages(req.body.detailImageUrls, detailImageFiles);
        
        const newProject = {
            id: newId.toString(),
            title: req.body.title || '',
            category: req.body.category || '',
            image: thumbnailFile ? `/uploads/${thumbnailFile.filename}` : (req.body.imageUrl || ''),
            detailImages,
            description: req.body.description || '',
            problem: req.body.problem || '',
            solution: req.body.solution || '',
            concept: req.body.concept || '',
            features: req.body.features || '',
            scope: req.body.scope || '',
            brandElements: req.body.brandElements || '',
            brandMessage: req.body.brandMessage || '',
            tools: req.body.tools || ''
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

router.put('/admin/projects/:id', isAuthenticated, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'detailImages', maxCount: 20 }
]), async (req, res) => {
    try {
        const data = await readProjects();
        const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
        
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const existingProject = data.projects[projectIndex];
        const thumbnailFile = req.files && req.files.image ? req.files.image[0] : null;
        const detailImageFiles = req.files && req.files.detailImages ? req.files.detailImages : [];
        const nextDetailImages = buildDetailImages(req.body.detailImageUrls, detailImageFiles);
        
        const updatedProject = {
            ...existingProject,
            title: req.body.title || existingProject.title,
            category: req.body.category || existingProject.category,
            image: thumbnailFile
                ? `/uploads/${thumbnailFile.filename}`
                : (req.body.imageUrl || existingProject.image),
            detailImages: nextDetailImages.length > 0
                ? nextDetailImages
                : (Array.isArray(existingProject.detailImages) ? existingProject.detailImages : []),
            description: req.body.description || existingProject.description,
            problem: req.body.problem !== undefined ? req.body.problem : existingProject.problem,
            solution: req.body.solution !== undefined ? req.body.solution : existingProject.solution,
            concept: req.body.concept !== undefined ? req.body.concept : existingProject.concept,
            features: req.body.features !== undefined ? req.body.features : existingProject.features,
            scope: req.body.scope !== undefined ? req.body.scope : existingProject.scope,
            brandElements: req.body.brandElements !== undefined ? req.body.brandElements : existingProject.brandElements,
            brandMessage: req.body.brandMessage !== undefined ? req.body.brandMessage : existingProject.brandMessage,
            tools: req.body.tools || existingProject.tools
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

router.delete('/admin/projects/:id', isAuthenticated, async (req, res) => {
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

module.exports = router;
