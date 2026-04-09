/* =============================================
   ADMIN SCRIPT — Supabase Auth + CRUD
   ============================================= */

const configUrl = window.SUPABASE_URL || (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '');
const configAnonKey = window.SUPABASE_ANON_KEY || (typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '');

if (!window.supabase?.createClient || !configUrl || !configAnonKey) {
  alert('Supabase is not initialized. Check internet and supabase-config.js.');
  throw new Error('Supabase init failed: missing SDK or config values.');
}

const supabaseClient = window.supabase.createClient(configUrl, configAnonKey);

const adminEmailAllowlist = Array.isArray(window.ADMIN_EMAIL_ALLOWLIST)
  ? window.ADMIN_EMAIL_ALLOWLIST.map(email => String(email).trim().toLowerCase()).filter(Boolean)
  : [];

function isAuthorizedAdmin(user) {
  if (!user?.email) return false;
  if (!adminEmailAllowlist.length) return false;
  return adminEmailAllowlist.includes(String(user.email).toLowerCase());
}

// ============ AUTH ============
async function initAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session && isAuthorizedAdmin(session.user)) {
    showDashboard(session.user);
    loadProjects();
  } else if (session) {
    await supabaseClient.auth.signOut();
    showToast('Access denied: this account is not allowed.', 'error');
    showLogin();
  } else {
    showLogin();
  }

  // Listen for auth changes
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && isAuthorizedAdmin(session.user)) {
      showDashboard(session.user);
      loadProjects();
    } else if (session) {
      supabaseClient.auth.signOut();
      showToast('Access denied: this account is not allowed.', 'error');
      showLogin();
    } else {
      showLogin();
    }
  });
}

function showLogin()    { document.getElementById('loginScreen').style.display = 'flex'; document.getElementById('adminDashboard').style.display = 'none'; }
function showDashboard(user) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'grid';

  const name  = user.user_metadata?.full_name || user.email;
  const photo = user.user_metadata?.avatar_url || '';
  document.getElementById('adminName').textContent  = name;
  document.getElementById('adminEmail').textContent = user.email;
  document.getElementById('adminAvatar').src = photo;
}

document.getElementById('googleLoginBtn')?.addEventListener('click', async () => {
  const loginBtn = document.getElementById('googleLoginBtn');
  if (window.location.protocol === 'file:') {
    showToast('Open this project with a local server (http://localhost) to use Google login.', 'error');
    alert('Open this project with a local server (http://localhost) to use Google login.');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.style.opacity = '0.7';

  const redirectTo = new URL('admin.html', window.location.href).toString();
  let { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo }
  });

  // Fallback for redirect URL mismatch: retry with Supabase default redirect flow.
  if (error && /redirect|redirect_to|callback/i.test(error.message || '')) {
    ({ error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google' }));
  }

  if (error) {
    const msg = 'Login failed: ' + error.message;
    showToast(msg, 'error');
    alert(msg);
    loginBtn.disabled = false;
    loginBtn.style.opacity = '';
  }
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

// ============ PROJECTS ============
let projects = [];
let deleteTargetId = null;
const projectsSyncChannel = 'projects-updated';

function notifyProjectsChanged() {
  let channel = null;

  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(projectsSyncChannel);
      channel.postMessage({ type: 'projects-changed', at: Date.now() });
    }
  } catch (error) {
    console.warn('Project sync broadcast failed:', error);
  } finally {
    if (channel) {
      channel.close();
    }
  }

  try {
    localStorage.setItem(projectsSyncChannel, String(Date.now()));
  } catch (error) {
    console.warn('Project sync storage event failed:', error);
  }
}

async function loadProjects() {
  const tbody = document.getElementById('projectsTableBody');
  tbody.innerHTML = `<tr><td colspan="6" class="tbl-loading"><div class="spinner"></div><br/>Loading projects…</td></tr>`;

  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="tbl-loading" style="color:#ef4444">Failed to load projects: ${error.message}</td></tr>`;
    return;
  }

  projects = data || [];
  renderTable();
  updateStats();
  return projects;
}

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${configUrl}/storage/v1/object/public/project-images/${path}`;
}

function renderTable() {
  const tbody = document.getElementById('projectsTableBody');
  if (!projects.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="tbl-loading">No projects yet. Click "New Project" to add one.</td></tr>`;
    return;
  }
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>
        <img class="tbl-thumb" src="${getImageUrl(p.image) || 'https://placehold.co/56x44/1a1a1a/777?text=?'}" alt="${p.title}" />
      </td>
      <td class="tbl-title">${p.title}</td>
      <td><span class="tbl-cat">${p.category}</span></td>
      <td>
        <div class="tbl-tools">
          ${(p.tools || '').split(',').map(t => `<span class="tbl-tool">${t.trim()}</span>`).join('')}
        </div>
      </td>
      <td>${p.display_order}</td>
      <td>
        <div class="action-btns">
          <button class="act-btn act-edit" onclick="editProject('${p.id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="act-btn act-delete" onclick="promptDelete('${p.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateStats() {
  document.getElementById('totalCount').textContent = projects.length;
  document.getElementById('uiCount').textContent    = projects.filter(p => p.category === 'UI/UX Design').length;
  document.getElementById('gfxCount').textContent   = projects.filter(p => p.category === 'Graphic Design').length;
  document.getElementById('brandCount').textContent = projects.filter(p => p.category === 'Branding').length;
}

// ============ MODAL ============
let selectedFile = null;

function openModal(project = null) {
  selectedFile = null;
  const form = document.getElementById('projectForm');
  form.reset();
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('imgDrop').style.display = 'flex';

  if (project) {
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('fTitle').value        = project.title || '';
    document.getElementById('fCategory').value     = project.category || '';
    document.getElementById('fOrder').value        = project.display_order || 0;
    document.getElementById('fTools').value        = project.tools || '';
    document.getElementById('fImageUrl').value     = project.image?.startsWith('http') ? project.image : '';
    document.getElementById('fDescription').value  = project.description || '';
    document.getElementById('fProblem').value       = project.problem || '';
    document.getElementById('fSolution').value      = project.solution || '';
    document.getElementById('fConcept').value       = project.concept || '';
    document.getElementById('fFeatures').value      = project.features || '';
    document.getElementById('fScope').value         = project.scope || '';
    document.getElementById('fBrandElements').value = project.brand_elements || '';
    document.getElementById('fBrandMessage').value  = project.brand_message || '';

    if (project.image) {
      showImgPreview(getImageUrl(project.image));
    }
  } else {
    document.getElementById('modalTitle').textContent = 'New Project';
    document.getElementById('projectId').value = '';
  }

  document.getElementById('projectModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('projectModal').classList.remove('active');
  document.body.style.overflow = '';
  selectedFile = null;
}

function showImgPreview(src) {
  document.getElementById('imgPreviewEl').src = src;
  document.getElementById('imgPreview').style.display = 'block';
}

// File drop / pick
document.getElementById('fImageFile')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile = file;
  showImgPreview(URL.createObjectURL(file));
  document.getElementById('fImageUrl').value = '';
});

document.getElementById('fImageUrl')?.addEventListener('input', e => {
  const url = e.target.value.trim();
  if (url) {
    showImgPreview(url);
    selectedFile = null;
    document.getElementById('fImageFile').value = '';
  }
});

document.getElementById('removeImg')?.addEventListener('click', () => {
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('fImageFile').value = '';
  document.getElementById('fImageUrl').value  = '';
  selectedFile = null;
});

document.getElementById('addProjectBtn')?.addEventListener('click', () => openModal());
document.getElementById('closeModal')?.addEventListener('click', closeModal);
document.getElementById('cancelBtn')?.addEventListener('click', closeModal);
document.getElementById('projectModal')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

function editProject(id) {
  const p = projects.find(x => x.id === id);
  if (p) openModal(p);
}

// ============ SAVE ============
document.getElementById('projectForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';

  try {
    let imagePath = document.getElementById('fImageUrl').value.trim();
    const existingId = document.getElementById('projectId').value;

    // Upload file to Supabase Storage if one is selected
    if (selectedFile) {
      const ext  = selectedFile.name.split('.').pop();
      const fname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadErr } = await supabaseClient
        .storage
        .from('project-images')
        .upload(fname, selectedFile, { contentType: selectedFile.type, upsert: false });

      if (uploadErr) throw new Error('Image upload failed: ' + uploadErr.message);
      imagePath = fname; // store just the filename; we'll build URL on display
    } else if (!imagePath && existingId) {
      // keep existing image
      const existing = projects.find(p => String(p.id) === String(existingId));
      imagePath = existing?.image || '';
    }

    const payload = {
      title:          document.getElementById('fTitle').value.trim(),
      category:       document.getElementById('fCategory').value,
      display_order:  parseInt(document.getElementById('fOrder').value) || 0,
      tools:          document.getElementById('fTools').value.trim(),
      image:          imagePath,
      description:    document.getElementById('fDescription').value.trim(),
      problem:        document.getElementById('fProblem').value.trim(),
      solution:       document.getElementById('fSolution').value.trim(),
      concept:        document.getElementById('fConcept').value.trim(),
      features:       document.getElementById('fFeatures').value.trim(),
      scope:          document.getElementById('fScope').value.trim(),
      brand_elements: document.getElementById('fBrandElements').value.trim(),
      brand_message:  document.getElementById('fBrandMessage').value.trim(),
      updated_at:     new Date().toISOString(),
    };

    let error;
    if (existingId) {
      ({ error } = await supabaseClient.from('projects').update(payload).eq('id', existingId));
    } else {
      ({ error } = await supabaseClient.from('projects').insert([payload]));
    }

    if (error) throw new Error(error.message);

    showToast('Project saved successfully!', 'success');
    closeModal();
    await loadProjects();
    notifyProjectsChanged();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Project';
  }
});

// ============ DELETE ============
function promptDelete(id) {
  deleteTargetId = id;
  document.getElementById('deleteConfirm').classList.add('active');
}

document.getElementById('cancelDelete')?.addEventListener('click', () => {
  deleteTargetId = null;
  document.getElementById('deleteConfirm').classList.remove('active');
});

document.getElementById('confirmDelete')?.addEventListener('click', async () => {
  if (!deleteTargetId) return;
  const targetId = String(deleteTargetId);
  const { error } = await supabaseClient
    .from('projects')
    .delete()
    .eq('id', targetId)
    ;

  document.getElementById('deleteConfirm').classList.remove('active');

  if (error) {
    showToast('Delete failed: ' + error.message, 'error');
    return;
  }

  projects = projects.filter(p => String(p.id) !== targetId);
  renderTable();
  updateStats();
  showToast('Project deleted.', 'success');
  deleteTargetId = null;
  await loadProjects();
  notifyProjectsChanged();
});

// ============ TOAST ============
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ============ INIT ============
initAuth();
