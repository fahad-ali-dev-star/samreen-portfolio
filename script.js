// API Configuration
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://samreen-portfolio.onrender.com';

// Project Modal Elements
const projectModal = document.getElementById('projectDetailModal');
const modalClose = projectModal ? projectModal.querySelector('.modal-close') : null;
const modalContent = document.getElementById('modalContent');

// Store projects data
let projectsData = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Load projects from API
    await loadProjects();
    
    // Initialize typewriter effect
    initTypewriter();
});

// Load projects from API
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/api/projects`);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        projectsData = await response.json();
        renderProjects(projectsData);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to hardcoded projects if API is not available
        console.log('Using fallback hardcoded projects');
        projectsData = getFallbackProjects();
        renderProjects(projectsData);
    }
}

// Fallback hardcoded projects
function getFallbackProjects() {
    return [
        {
            id: "1",
            title: "Pixibot AI Assistant",
            category: "UI/UX Design",
            image: "images/Portfolio-compressed-1_25-012.jpg",
            description: "Pixibot is a smart and friendly mini AI assistant designed to help users with conversations, productivity tools, and creative ideas.",
            problem: "Users had trouble finding a quick, friendly, and easy-to-use AI assistant.",
            solution: "Pixibot offers a smart, voice-based AI with a simple design and daily planning tools.",
            tools: "Figma, Photoshop, After Effects"
        },
        {
            id: "2",
            title: "Sunehri Saaye",
            category: "Graphic Design",
            image: "images/Gemini_Generated_Image_3q9lcl3q9lcl3q9l.png",
            description: "A visual storytelling project exploring three faces and their hidden secrets through shadow and light.",
            concept: "Three faces, three secrets. The project visualizes the hidden stories behind personas.",
            tools: "Photoshop, Illustrator, After Effects"
        },
        {
            id: "3",
            title: "Tiki Emotional Bot",
            category: "UI/UX Design",
            image: "images/Portfolio-compressed-1_25-021.jpg",
            description: "Tiki is a smart robot that reflects human emotions through its eyes.",
            features: "Emotion recognition, responsive expressions, interactive interface",
            tools: "Figma, Illustrator, Principle"
        },
        {
            id: "4",
            title: "TASY Movie Promotion",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-024.jpg",
            description: "Graphic design for a zombie horror movie, including posters and promotional materials.",
            scope: "Movie posters, social media graphics, landing page design",
            tools: "Photoshop, Illustrator, InDesign"
        },
        {
            id: "5",
            title: "NatureVe Skincare Brand",
            category: "Branding",
            image: "images/Portfolio-compressed-1_25-043.jpg",
            description: "Complete branding for an organic skincare line with prickly pear cactus as key ingredient.",
            brandElements: "Logo design, color palette, typography, packaging",
            tools: "Illustrator, Photoshop, InDesign"
        },
        {
            id: "6",
            title: "Terra Jewel Hub",
            category: "Branding",
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            description: "Branding and visual identity for a handmade jewelry brand.",
            brandMessage: "You are unique, you are timeless.",
            tools: "Illustrator, Photoshop, After Effects"
        },
        {
            id: "7",
            title: "A Smart Way to Park",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-014.jpg",
            description: "Graphic design for a parking app that simplifies finding and reserving parking spots.",
            tools: "Illustrator, Photoshop, After Effects"
        },
        {
            id: "8",
            title: "Healthy eat app",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-016.jpg",
            description: "Your one stop app for fresh fruit, vegetables and spices.",
            tools: "Illustrator, Photoshop, After Effects"
        },
        {
            id: "9",
            title: "Ashes Never Die",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-025.jpg",
            description: "A visual storytelling project about resilience and hidden secrets.",
            tools: "Illustrator, Photoshop, After Effects"
        }
    ];
}

// Render projects to the grid
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    if (!projects || projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="loading-projects">
                <i class="fas fa-folder-open"></i>
                <p>No projects found.</p>
            </div>
        `;
        return;
    }
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${getCategoryFilter(project.category)}">
            <div class="project-img">
                <img src="${getImageUrl(project.image)}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 100)}...</p>
                <div class="project-tags">
                    ${project.tools.split(',').slice(0, 3).map(tool => `<span>${tool.trim()}</span>`).join('')}
                </div>
                <a href="#" class="btn view-project-btn" data-project="${project.id}">View Details</a>
            </div>
        </div>
    `).join('');
    
    // Re-attach event listeners to new buttons
    attachProjectButtonListeners();
}

// Helper function to get correct image URL
function getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
        return `${API_URL}${imagePath}`;
    }
    // For relative paths like images/xxx.jpg
    return imagePath;
}

// Get category filter value from category name
function getCategoryFilter(category) {
    const mapping = {
        'UI/UX Design': 'ui-ux',
        'Graphic Design': 'graphic',
        'Branding': 'branding'
    };
    return mapping[category] || 'graphic';
}

// Attach event listeners to project view buttons
function attachProjectButtonListeners() {
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const project = projectsData.find(p => p.id === projectId);
            if (project) {
                openProjectModal(project);
            }
        });
    });
}

// Open project modal with details
function openProjectModal(project) {
    if (!modalContent || !projectModal) return;
    
    // Determine which field to show based on available data
    const detail1Title = project.problem ? 'Problem' : project.concept ? 'Concept' : project.features ? 'Features' : 'Brand Elements';
    const detail1Content = project.problem || project.concept || project.features || project.brandElements || '';
    const detail2Title = project.solution ? 'Solution' : 'Scope';
    const detail2Content = project.solution || project.scope || project.brandMessage || 'Complete design and development';
    
    modalContent.innerHTML = `
        <div class="modal-img">
            <img src="${getImageUrl(project.image)}" alt="${project.title}">
        </div>
        <div class="modal-info">
            <h3>${project.title}</h3>
            <p><strong>Category:</strong> ${project.category}</p>
            <p>${project.description}</p>
            
            <div class="modal-details">
                ${detail1Content ? `<div><h4>${detail1Title}</h4><p>${detail1Content}</p></div>` : ''}
                ${detail2Content ? `<div><h4>${detail2Title}</h4><p>${detail2Content}</p></div>` : ''}
            </div>
            
            <div class="project-tags" style="margin-top: 20px;">
                ${project.tools.split(',').map(tool => `<span>${tool.trim()}</span>`).join('')}
            </div>
        </div>
    `;
    
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal function
function closeProjectModal() {
    if (projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking close button
if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
}

// Close modal when clicking outside
if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});

// Typewriter effect initialization
function initTypewriter() {
    const nameElement = document.getElementById('typewriter-name');
    if (nameElement) {
        typeWriter(nameElement, 'Samreen Shafqat');
    }
}

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Mobile Navigation Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    const icon = mobileMenuBtn.querySelector('i');
    mobileMenuBtn.setAttribute('role', 'button');
    mobileMenuBtn.setAttribute('aria-controls', 'primary-navigation');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        mobileMenuBtn.classList.toggle('open', isOpen);
        navLinks.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            mobileMenuBtn.classList.remove('open');
            navLinks.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        });
    });
}

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        }
    }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                contactForm.reset();
            } else {
                alert(data.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Failed to send message. Please try again.');
        }
    });
}
