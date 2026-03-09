// Projects API - Vercel Serverless Function
// Uses file-based storage in /tmp directory

import fs from 'fs';
import path from 'path';

const DB_FILE = process.env.VERCEL 
  ? '/tmp/projects.json' 
  : path.join(process.cwd(), 'data', 'projects.json');

// Helper to read projects
async function readProjects() {
  try {
    // Ensure directory exists
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ projects: [] }, null, 2));
    }
    
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return { projects: [] };
  }
}

// Helper to write projects
async function writeProjects(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing projects:', error);
    return false;
  }
}

// Helper to check authentication
function isAuthenticated(req) {
  const authToken = req.cookies?.admin_token;
  const expectedToken = process.env.ADMIN_TOKEN || 'dev_token';
  return authToken === expectedToken;
}

// Main projects handler
export default async function handler(req, res) {
  const { method, url } = req;
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if it's the public route (exactly /api/projects)
  const isPublicRoute = url === '/api/projects' || url === '/api/projects/';
  const isAdminRoute = url && url.includes('/admin');
  
  // GET /api/projects - Public route (no auth needed)
  if (method === 'GET' && isPublicRoute) {
    try {
      const data = await readProjects();
      return res.json(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  // All other routes require authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/projects/admin - Admin: Get all projects
  if (method === 'GET') {
    try {
      const data = await readProjects();
      return res.json(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  // POST /api/projects - Admin: Create project
  if (method === 'POST') {
    try {
      const data = await readProjects();
      const { projects } = data;
      
      const newId = projects.length > 0 
        ? Math.max(...projects.map(p => parseInt(p.id))) + 1 
        : 1;
      
      const newProject = {
        id: newId.toString(),
        title: req.body.title || '',
        category: req.body.category || '',
        image: req.body.image || '',
        detailImages: req.body.detailImages || [],
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
      
      projects.push(newProject);
      const success = await writeProjects(data);
      
      if (success) {
        return res.json({ message: 'Project added successfully', project: newProject });
      } else {
        return res.status(500).json({ error: 'Failed to save project' });
      }
    } catch (error) {
      console.error('Error adding project:', error);
      return res.status(500).json({ error: 'Failed to add project' });
    }
  }

  // PUT /api/projects/:id - Admin: Update project
  if (method === 'PUT') {
    try {
      const id = req.query.id || req.url?.split('/').pop();
      const data = await readProjects();
      const projectIndex = data.projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const updatedProject = {
        ...data.projects[projectIndex],
        ...req.body,
        id // Ensure ID doesn't change
      };
      
      data.projects[projectIndex] = updatedProject;
      const success = await writeProjects(data);
      
      if (success) {
        return res.json({ message: 'Project updated successfully', project: updatedProject });
      } else {
        return res.status(500).json({ error: 'Failed to update project' });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Failed to update project' });
    }
  }

  // DELETE /api/projects/:id - Admin: Delete project
  if (method === 'DELETE') {
    try {
      const id = req.query.id || req.url?.split('/').pop();
      const data = await readProjects();
      const projectIndex = data.projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      data.projects.splice(projectIndex, 1);
      const success = await writeProjects(data);
      
      if (success) {
        return res.json({ message: 'Project deleted successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to delete project' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

