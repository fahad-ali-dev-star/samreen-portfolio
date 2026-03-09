// Admin single project API - Vercel Serverless Function
// Handles PUT and DELETE for individual projects

import fs from 'fs';
import path from 'path';

const DB_FILE = process.env.VERCEL 
  ? '/tmp/projects.json' 
  : path.join(process.cwd(), 'data', 'projects.json');

// Helper to read projects
async function readProjects() {
  try {
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

// Get project ID from the URL
function getProjectId(url) {
  // Match /api/admin/projects/{id}
  const match = url?.match(/\/api\/admin\/projects\/([^/?]+)/);
  return match ? match[1] : null;
}

// Single project handler
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

  // All admin routes require authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const projectId = getProjectId(url);
  
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  // PUT /api/admin/projects/:id - Admin: Update project
  if (method === 'PUT') {
    try {
      const data = await readProjects();
      const projectIndex = data.projects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const updatedProject = {
        ...data.projects[projectIndex],
        ...req.body,
        id: projectId // Ensure ID doesn't change
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

  // DELETE /api/admin/projects/:id - Admin: Delete project
  if (method === 'DELETE') {
    try {
      const data = await readProjects();
      const projectIndex = data.projects.findIndex(p => p.id === projectId);
      
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

