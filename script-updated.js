// API Configuration
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/projects'
    : 'https://samreen-portfolio.onrender.com/api/projects';

// Mobile Navigation Toggle (robust)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinkAnchors = document.querySelectorAll('.nav-links a');

    if (!mobileMenuBtn || !navLinks) return;

    const icon = mobileMenuBtn.querySelector('i');

    // Set accessible attributes
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
        // Toggle 'open' class for smooth icon color/transform
        mobileMenuBtn.classList.toggle('open', isOpen);

        navLinks.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        // Prevent body scroll when nav is open on small screens
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking a link
    navLinkAnchors.forEach(link => {
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

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            mobileMenuBtn.classList.remove('open');
            navLinks.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    });

    // Close when clicking outside the nav (on small screens)
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            mobileMenuBtn.classList.remove('open');
            navLinks.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    });
});

// Global projects storage
let projects = {};

// Load projects from API
async function loadProjectsFromAPI() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const projectsArray = await response.json();
        
        // Convert array to object with id as key for easy access
        projects = {};
        projectsArray.forEach(project => {
            projects[project.id] = project;
        });

        // Render projects
        renderProjects(projectsArray);
        
        console.log('Projects loaded successfully from API');
    } catch (error) {
        console.error('Error loading projects from API:', error);
        console.log('Falling back to default projects');
        loadDefaultProjects();
    }
}

// Fallback to default projects if API is not available
function loadDefaultProjects() {
    projects = {
        1: {
            title: "Pixibot AI Assistant",
            category: "UI/UX Design",
            image: "images/Portfolio-compressed-1_25-012.jpg",
            description: "Pixibot is a smart and friendly mini AI assistant designed to help users with conversations, productivity tools, and creative ideas. Its goal is to make digital experiences smoother, more efficient, and more fun through an easy-to-use and engaging interface.",
            problem: "Users had trouble finding a quick, friendly, and easy-to-use AI assistant for planning and creative help. Complex interfaces made the experience frustrating.",
            solution: "Pixibot offers a smart, voice-based AI with a simple design, daily planning tools, and creative suggestions, making tasks faster and more fun.",
            tools: "Figma, Photoshop, After Effects"
        },
        2: {
            title: "Sunehri Saaye",
            category: "Graphic Design",
            image: "images/Gemini_Generated_Image_3q9lcl3q9lcl3q9l.png",
            description: "A visual storytelling project exploring three faces and their hidden secrets through shadow and light. Each shadow hides a tale laced with poison.",
            concept: "Three faces, three secrets. The project visualizes the hidden stories behind personas we present to the world.",
            tools: "Photoshop, Illustrator, After Effects"
        },
        3: {
            title: "Tiki Emotional Bot",
            category: "UI/UX Design",
            image: "images/Portfolio-compressed-1_25-021.jpg",
            description: "Tiki is a smart robot that reflects human emotions through its eyes. Whether you're happy or sad, Tiki responds with the perfect expression — making tech feel a little more human.",
            features: "Emotion recognition, responsive expressions, interactive interface",
            tools: "Figma, Illustrator, Principle"
        },
        4: {
            title: "TASY Movie Promotion",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-024.jpg",
            description: "Graphic design for a zombie horror movie, including posters, landing page, and promotional materials. The project captures the terrifying atmosphere of a world where the dead don't sleep and the living don't last.",
            scope: "Movie posters, social media graphics, landing page design, promotional materials",
            tools: "Photoshop, Illustrator, InDesign"
        },
        5: {
            title: "NatureVe Skincare Brand",
            category: "Branding",
            image: "images/Gemini_Generated_Image_pwswi8pwswi8pwsw.png",
            description: "Complete branding for an organic skincare line that uses prickly pear cactus as its key ingredient. The brand represents clean, kind, and nature-inspired skincare crafted for everyday radiance.",
            brandElements: "Logo design, color palette, typography, packaging, brand guidelines",
            tools: "Illustrator, Photoshop, InDesign"
        },
        6: {
            title: "Terra Jewel Hub",
            category: "Branding",
            image: "images/Portfolio-compressed-1_25-034.jpg",
            description: "Branding and visual identity for a handmade jewelry brand that celebrates individuality and elegance. Every piece is crafted with passion and tells a unique story.",
            brandMessage: "You are unique, you are timeless. Jewelry that speaks louder than words.",
            tools: "Illustrator, Photoshop, After Effects"
        },
        7: {
            title: "A Smart Way to Park",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-014.jpg",
            description: "Graphic design for a parking app that simplifies finding and reserving parking spots in busy urban areas. The design focuses on user-friendliness and clear visual cues to enhance the parking experience.",
            brandMessage: "A smart way to park in a busy city.",
            tools: "Illustrator, Photoshop, After Effects"
        },
        8: {
            title: "Healthy eat app",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-016.jpg",
            description: "Your one stop app for fresh fruit,vegitable and spices.Order healthy eat fresh,and save time delivered straight to the door.",
            brandMessage: "Fresh food delivered to your door.",
            tools: "Illustrator, Photoshop, After Effects"
        },
        9: {
            title: "Ashes Never Die",
            category: "Graphic Design",
            image: "images/Portfolio-compressed-1_25-025.jpg",
            description: "They thought the flame end her story.But some soul does not rest-they wait.In the silence of night,in the shadow of forgotton places...she stairs.And this time she not alone.",
            brandMessage: "",
            tools: "Illustrator, Photoshop, After Effects"
        }
    };

    renderProjects(Object.values(projects));
}

// Render projects to the page
function renderProjects(projectsArray) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projectsArray.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-img">
                <img src="${getImageUrl(project.image)}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 120)}...</p>
                <div class="project-tags">
                    ${project.tools.split(',').map(tool => 
                        `<span>${tool.trim()}</span>`
                    ).join('')}
                </div>
                <a href="#" class="btn view-project-btn" data-project="${project.id}">
                    View Project
                </a>
            </div>
        </div>
    `).join('');

    // Re-attach event listeners for view project buttons
    attachProjectModalListeners();
}

// Helper function to get image URL
function getImageUrl(imagePath) {
    if (imagePath.startsWith('http')) {
        return imagePath;
    } else if (imagePath.startsWith('/uploads/')) {
        const backendBase = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://samreen-portfolio.onrender.com';
        return `${backendBase}${imagePath}`;
    }
    return imagePath;
}

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        const allProjectCards = document.querySelectorAll('.project-card');

        allProjectCards.forEach(card => {
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

// Project Modal
const projectModal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const modalContent = document.querySelector('.modal-content');

// Attach event listeners for view project buttons
function attachProjectModalListeners() {
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');

    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const project = projects[projectId];

            if (!project) {
                console.error('Project not found:', projectId);
                return;
            }

            // Populate modal with project data
            modalContent.innerHTML = `
                <div class="modal-img">
                    <img src="${getImageUrl(project.image)}" alt="${project.title}">
                </div>
                <div class="modal-info">
                    <h3>${project.title}</h3>
                    <p><strong>Category:</strong> ${project.category}</p>
                    <p>${project.description}</p>

                    <div class="modal-details">
                        <div>
                            <h4>${project.problem ? 'Problem' : project.concept ? 'Concept' : project.features ? 'Features' : 'Brand Elements'}</h4>
                            <p>${project.problem || project.concept || project.features || project.brandElements || 'N/A'}</p>
                        </div>
                        <div>
                            <h4>${project.solution ? 'Solution' : 'Scope'}</h4>
                            <p>${project.solution || project.scope || project.brandMessage || 'Complete design and development'}</p>
                        </div>
                    </div>

                    <div class="project-tags" style="margin-top: 20px;">
                        ${project.tools.split(',').map(tool => `<span>${tool.trim()}</span>`).join('')}
                    </div>
                </div>
            `;

            // Show modal
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

// Close modal
if (modalClose) {
    modalClose.addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelector('input[type="text"]:nth-child(3)').value;
        const message = contactForm.querySelector('textarea').value;

        // In a real implementation, you would send this data to a server
        // For now, we'll just show an alert
        alert(`Thank you, ${name}! Your message has been sent. I'll get back to you soon.`);

        // Reset form
        contactForm.reset();
    });
}

// Typewriter effect for name
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

// Initialize typewriter effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.getElementById('typewriter-name');
    if (nameElement) {
        typeWriter(nameElement, 'Samreen Shafqat');
    }

    // Load projects from API
    loadProjectsFromAPI();
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
