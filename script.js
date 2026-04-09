/* =============================================
   PORTFOLIO MAIN SCRIPT
   Uses Supabase for projects data
   ============================================= */

const configUrl = window.SUPABASE_URL || (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '');
const configAnonKey = window.SUPABASE_ANON_KEY || (typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '');

if (!window.supabase?.createClient || !configUrl || !configAnonKey) {
  console.error('Supabase init failed on portfolio page. Check supabase-config.js and SDK loading.');
}

const supabaseClient = window.supabase.createClient(configUrl, configAnonKey);

// ---------- NAV ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// close on nav link click
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// close on outside click
document.addEventListener('click', e => {
  if (!navLinks?.contains(e.target) && !hamburger?.contains(e.target)) {
    navLinks?.classList.remove('open');
    hamburger?.classList.remove('open');
  }
});

// sticky header shadow
window.addEventListener('scroll', () => {
  document.getElementById('site-header')
    ?.classList.toggle('scrolled', window.scrollY > 60);
});

// ---------- PROJECTS ----------
let allProjects = [];

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    grid.innerHTML = `<p class="projects-loading" style="color:#888">Failed to load projects. Please try again later.</p>`;
    return;
  }

  allProjects = data || [];
  renderProjects(allProjects);
  setupFilters();
}

function getImageUrl(path) {
  if (!path) return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80';
  if (path.startsWith('http')) return path;
  // Supabase storage URL
  return `${configUrl}/storage/v1/object/public/project-images/${path}`;
}

function renderProjects(list) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<div class="projects-loading"><p>No projects found.</p></div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="project-card" data-id="${p.id}" data-category="${p.category}">
      <img class="project-thumb" src="${getImageUrl(p.image)}" alt="${p.title}" loading="lazy" />
      <div class="project-meta">
        <p class="project-category">${p.category}</p>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${(p.description || '').slice(0, 110)}…</p>
        <div class="project-tools">
          ${(p.tools || '').split(',').map(t => `<span class="tool-chip">${t.trim()}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });
}

// ---------- FILTERS ----------
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      const filtered = f === 'all' ? allProjects : allProjects.filter(p => p.category === f);
      renderProjects(filtered);
    });
  });
}

// ---------- MODAL ----------
function openModal(id) {
  const p = allProjects.find(x => x.id === id);
  if (!p) return;

  const details = [
    { label: 'Problem',        value: p.problem },
    { label: 'Solution',       value: p.solution },
    { label: 'Concept',        value: p.concept },
    { label: 'Features',       value: p.features },
    { label: 'Scope',          value: p.scope },
    { label: 'Brand Elements', value: p.brand_elements },
    { label: 'Brand Message',  value: p.brand_message },
  ].filter(d => d.value && d.value.trim());

  const detailsHtml = details.length ? `
    <div class="modal-details-grid">
      ${details.map(d => `
        <div class="modal-detail-block">
          <h4>${d.label}</h4>
          <p>${d.value}</p>
        </div>
      `).join('')}
    </div>` : '';

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-img"><img src="${getImageUrl(p.image)}" alt="${p.title}" /></div>
    <div class="modal-info">
      <p class="modal-cat">${p.category}</p>
      <h3>${p.title}</h3>
      <p class="modal-desc">${p.description || ''}</p>
      ${detailsHtml}
      <div class="modal-tools">
        ${(p.tools || '').split(',').map(t => `<span class="tool-chip">${t.trim()}</span>`).join('')}
      </div>
    </div>
  `;

  const overlay = document.getElementById('projectModal');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('projectModal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  document.getElementById('projectModal')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ---------- CONTACT FORM ----------
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Message sent! I\'ll get back to you soon.', 'success');
  e.target.reset();
});

// ---------- TOAST ----------
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ---------- INIT ----------
loadProjects();
