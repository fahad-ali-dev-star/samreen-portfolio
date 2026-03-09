// Use Render backend for all API calls
// Change this to your Render backend URL
const RENDER_BACKEND_URL = 'https://samreen-portfolio.onrender.com';
const API_URL = RENDER_BACKEND_URL;

// Store the current origin for redirect after login
const CURRENT_ORIGIN = window.location.origin;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const userPhoto = document.getElementById('userPhoto');
const projectsTableBody = document.getElementById('projectsTableBody');
const addProjectBtn = document.getElementById('addProjectBtn');
const projectModal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const projectForm = document.getElementById('projectForm');
const modalTitle = document.getElementById('modalTitle');
const imageFileInput = document.getElementById('imageFile');
const imageUrlInput = document.getElementById('imageUrl');
const imagePreview = document.getElementById('imagePreview');

// Check auth status on page load
checkAuthStatus();

// Event Listeners

// Google login - connects to Render backend
googleLoginBtn.addEventListener('click', () => {
    // Pass the current origin as redirect parameter so server knows where to redirect after login
    window.location.href = `${API_URL}/auth/google?redirect=${encodeURIComponent(CURRENT_ORIGIN)}`;
});

logoutBtn.addEventListener('click', async () => {
    try {
        // Use Render backend for logout
        const response = await fetch(`${API_URL}/auth/logout`, {
            credentials: 'include'
        });
        
        window.location.reload();
    } catch (error) {
        console.error('Logout failed:', error);
        // Force reload anyway
        window.location.reload();
    }
});

addProjectBtn.addEventListener('click', () => {
    openModal();
});

closeModal.addEventListener('click', () => {
    closeModalFunc();
});

cancelBtn.addEventListener('click', () => {
    closeModalFunc();
});

projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeModalFunc();
    }
});

// Image preview functionality
imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
        imageUrlInput.value = ''; // Clear URL input if file is selected
    }
});

imageUrlInput.addEventListener('input', (e) => {
    const url = e.target.value;
    if (url) {
        imagePreview.innerHTML = `<img src="${url}" alt="Preview">`;
        imageFileInput.value = ''; // Clear file input if URL is entered
    }
});

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProject();
});

// Functions
async function checkAuthStatus() {
    try {
        // Use Render backend for auth status
        const response = await fetch(`${API_URL}/auth/status`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.authenticated) {
            showDashboard(data.user);
            loadProjects();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLogin();
    }
}

function showLogin() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
}

function showDashboard(user) {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    userName.textContent = user.name;
    userPhoto.src = user.photo;
}

async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/api/admin/projects`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }

        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Failed to load projects</p>
                </td>
            </tr>
        `;
    }
}

function renderProjects(projects) {
    if (projects.length === 0) {
        projectsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>No projects yet. Click "Add New Project" to get started!</p>
                </td>
            </tr>
        `;
        return;
    }

    projectsTableBody.innerHTML = projects.map(project => `
        <tr>
            <td style="font-weight: 600;">#${project.id}</td>
            <td>
                <img src="${getImageUrl(project.image)}" alt="${project.title}" class="project-thumbnail">
            </td>
            <td style="font-weight: 600; color: var(--dark);">${project.title}</td>
            <td>
                <span class="category-badge">${project.category}</span>
            </td>
            <td>
                <div class="tools-list">
                    ${project.tools.split(',').map(tool => 
                        `<span class="tool-tag">${tool.trim()}</span>`
                    ).join('')}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editProject('${project.id}')">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getImageUrl(imagePath) {
    if (imagePath.startsWith('http') || imagePath.startsWith('/uploads/')) {
        return imagePath.startsWith('/uploads/') ? `${API_URL}${imagePath}` : imagePath;
    }
    return imagePath;
}

function openModal(project = null) {
    if (project) {
        modalTitle.textContent = 'Edit Project';
        document.getElementById('projectId').value = project.id;
        document.getElementById('title').value = project.title;
        document.getElementById('category').value = project.category;
        document.getElementById('tools').value = project.tools;
        document.getElementById('imageUrl').value = project.image;
        document.getElementById('description').value = project.description;
        document.getElementById('problem').value = project.problem || '';
        document.getElementById('solution').value = project.solution || '';
        document.getElementById('concept').value = project.concept || '';
        document.getElementById('features').value = project.features || '';
        document.getElementById('scope').value = project.scope || '';
        document.getElementById('brandElements').value = project.brandElements || '';
        document.getElementById('brandMessage').value = project.brandMessage || '';
        
        if (project.image) {
            imagePreview.innerHTML = `<img src="${getImageUrl(project.image)}" alt="Preview">`;
        }
    } else {
        modalTitle.textContent = 'Add New Project';
        projectForm.reset();
        document.getElementById('projectId').value = '';
        imagePreview.innerHTML = '';
    }
    
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    projectForm.reset();
    imagePreview.innerHTML = '';
}

async function saveProject() {
    const projectId = document.getElementById('projectId').value;
    const formData = new FormData();
    
    // Add form fields
    formData.append('title', document.getElementById('title').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('tools', document.getElementById('tools').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('problem', document.getElementById('problem').value);
    formData.append('solution', document.getElementById('solution').value);
    formData.append('concept', document.getElementById('concept').value);
    formData.append('features', document.getElementById('features').value);
    formData.append('scope', document.getElementById('scope').value);
    formData.append('brandElements', document.getElementById('brandElements').value);
    formData.append('brandMessage', document.getElementById('brandMessage').value);
    
    // Add image (either file or URL)
    const imageFile = document.getElementById('imageFile').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    } else {
        formData.append('imageUrl', document.getElementById('imageUrl').value);
    }
    
    try {
        const url = projectId 
            ? `${API_URL}/api/admin/projects/${projectId}`
            : `${API_URL}/api/admin/projects`;
        
        const method = projectId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to save project');
        }

        const data = await response.json();
        console.log('Project saved:', data);
        
        closeModalFunc();
        loadProjects();
        
        // Show success message
        showNotification('Project saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving project:', error);
        showNotification('Failed to save project. Please try again.', 'error');
    }
}

async function editProject(projectId) {
    try {
        const response = await fetch(`${API_URL}/api/admin/projects`, {
            credentials: 'include'
        });
        const projects = await response.json();
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            openModal(project);
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showNotification('Failed to load project. Please try again.', 'error');
    }
}

async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/admin/projects/${projectId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete project');
        }

        loadProjects();
        showNotification('Project deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting project:', error);
        showNotification('Failed to delete project. Please try again.', 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
