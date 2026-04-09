import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAllowedAdminEmail, supabase } from '../lib/supabaseClient';
import { notifyProjectsChanged, subscribeToProjectsChanges } from '../lib/projectsSync';
import { useProjectsRealtime } from '../lib/useProjectsRealtime';
import { getImageUrl } from '../lib/projects';

const emptyForm = {
  title: '',
  category: '',
  display_order: 0,
  tools: '',
  image: '',
  description: '',
  problem: '',
  solution: '',
  concept: '',
  features: '',
  scope: '',
  brand_elements: '',
  brand_message: '',
  gallery_images: [],
};

function isAuthorizedAdmin(user) {
  return Boolean(user?.email && isAllowedAdminEmail(user.email));
}

export function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [isAuthCallbackInProgress, setIsAuthCallbackInProgress] = useState(() => typeof window !== 'undefined'
    && (window.location.search.includes('code=') || window.location.hash.includes('access_token=')));

  const loadProjects = useCallback(async () => {
    setLoading(true);
    console.log('[DEBUG] Loading projects from Supabase...');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[DEBUG] Load projects error:', error);
      setMessage(`Failed to load projects: ${error.message}`);
      setLoading(false);
      return;
    }

    console.log('[DEBUG] Projects loaded:', data?.length || 0);
    setProjects(data || []);
    setLoading(false);
    return data || [];
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentSession = data.session;
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setAuthLoading(false);
      setIsAuthCallbackInProgress(false);

      if (currentSession?.user && isAuthorizedAdmin(currentSession.user)) {
        loadProjects();
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user || null);
      setAuthLoading(false);
      setIsAuthCallbackInProgress(false);
      if (nextSession?.user && isAuthorizedAdmin(nextSession.user)) {
        loadProjects();
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    return subscribeToProjectsChanges(loadProjects);
  }, []);

  useProjectsRealtime(loadProjects);

  useEffect(() => {
    if (!isAuthCallbackInProgress) return;

    const timeoutId = window.setTimeout(() => {
      setIsAuthCallbackInProgress(false);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAuthCallbackInProgress]);

  const authorized = isAuthorizedAdmin(user);

  const stats = useMemo(() => ({
    total: projects.length,
    uiux: projects.filter(project => project.category === 'UI/UX Design').length,
    graphic: projects.filter(project => project.category === 'Graphic Design').length,
    branding: projects.filter(project => project.category === 'Branding').length,
  }), [projects]);

  const updateForm = (field, value) => setForm(previous => ({ ...previous, [field]: value }));

  const resetForm = () => {
    setEditingId('');
    setForm(emptyForm);
    setSelectedFile(null);
    setImagePreview('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const openNewProject = () => resetForm();

  const openEditProject = project => {
    setEditingId(project.id);
    setForm({
      title: project.title || '',
      category: project.category || '',
      display_order: project.display_order || 0,
      tools: project.tools || '',
      image: project.image?.startsWith('http') ? project.image : '',
      description: project.description || '',
      problem: project.problem || '',
      solution: project.solution || '',
      concept: project.concept || '',
      features: project.features || '',
      scope: project.scope || '',
      brand_elements: project.brand_elements || '',
      brand_message: project.brand_message || '',
      gallery_images: Array.isArray(project.gallery_images) ? project.gallery_images : [],
    });
    setSelectedFile(null);
    setImagePreview(project.image ? getImageUrl(project.image) : '');
    setGalleryFiles([]);
    const existingGallery = (Array.isArray(project.gallery_images) ? project.gallery_images : []).map(img => getImageUrl(img));
    setGalleryPreviews(existingGallery);
  };

  const handleFile = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setForm(previous => ({ ...previous, image: '' }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryFiles = event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setGalleryFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  const removeGalleryImage = index => {
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
    setForm(prev => ({
      ...prev,
      gallery_images: Array.isArray(prev.gallery_images) ? prev.gallery_images.filter((_, i) => i !== index) : []
    }));
  };

  const handleLogin = async () => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const redirectTo = new URL(normalizedBase, window.location.origin).toString().replace(/\/$/, '') + '/#/admin';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const handleSave = async event => {
    event.preventDefault();
    setMessage('');

    if (!form.title.trim()) {
      setMessage('Project title is required');
      return;
    }
    if (!form.category) {
      setMessage('Please select a category');
      return;
    }
    if (!form.tools.trim()) {
      setMessage('Tools are required');
      return;
    }
    if (!form.description.trim()) {
      setMessage('Description is required');
      return;
    }

    try {
      console.log('[DEBUG] Save operation started, editingId:', editingId);
      let imagePath = form.image.trim();

      if (selectedFile) {
        const extension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        console.log('[DEBUG] Uploading image:', fileName);
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, selectedFile, { contentType: selectedFile.type, upsert: false });

        if (uploadError) {
          console.error('[DEBUG] Image upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        imagePath = fileName;
      } else if (!imagePath && editingId) {
        const existing = projects.find(project => String(project.id) === String(editingId));
        imagePath = existing?.image || '';
      }

      let galleryImages = Array.isArray(form.gallery_images) ? [...form.gallery_images] : [];
      
      if (galleryFiles.length > 0) {
        const uploadedGalleryPaths = [];
        for (const file of galleryFiles) {
          const extension = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
          console.log('[DEBUG] Uploading gallery image:', fileName);
          const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(fileName, file, { contentType: file.type, upsert: false });

          if (uploadError) {
            console.error('[DEBUG] Gallery upload error:', uploadError);
            throw new Error(`Gallery image upload failed: ${uploadError.message}`);
          }
          uploadedGalleryPaths.push(fileName);
        }
        galleryImages = uploadedGalleryPaths;
      }

      const payload = {
        title: form.title.trim(),
        category: form.category,
        display_order: Number(form.display_order) || 0,
        tools: form.tools.trim(),
        image: imagePath,
        gallery_images: galleryImages.length > 0 ? galleryImages : null,
        description: form.description.trim(),
        problem: form.problem.trim(),
        solution: form.solution.trim(),
        concept: form.concept.trim(),
        features: form.features.trim(),
        scope: form.scope.trim(),
        brand_elements: form.brand_elements.trim(),
        brand_message: form.brand_message.trim(),
        updated_at: new Date().toISOString(),
      };

      console.log('[DEBUG] Payload:', payload);
      console.log('[DEBUG] Current session:', session?.access_token ? 'valid' : 'invalid');
      
      let error;
      if (editingId) {
        console.log('[DEBUG] Performing UPDATE for id:', editingId);
        const result = await supabase.from('projects').update(payload).eq('id', editingId);
        console.log('[DEBUG] UPDATE result:', result);
        error = result.error;
      } else {
        console.log('[DEBUG] Performing INSERT');
        const result = await supabase.from('projects').insert([payload]);
        console.log('[DEBUG] INSERT result:', result);
        error = result.error;
      }

      if (error) {
        console.error('[DEBUG] Save error:', error);
        throw new Error(error.message);
      }

      console.log('[DEBUG] Save successful');
      setMessage('Project saved successfully.');
      resetForm();
      await loadProjects();
      notifyProjectsChanged();
    } catch (saveError) {
      console.error('[DEBUG] Save exception:', saveError);
      setMessage(saveError.message);
    }
  };

  const handleDelete = async () => {
    try {
      const deleteId = confirmDeleteId;
      console.log('[DEBUG] Delete operation started for id:', deleteId);
      const result = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId);
      
      console.log('[DEBUG] Delete raw result:', result);
      
      const { data, error } = result;

      if (error) {
        console.error('[DEBUG] Delete error:', error);
        throw new Error(error.message);
      }

      console.log('[DEBUG] Delete result data:', data);

      if (!data || data.length === 0) {
        throw new Error('Delete was blocked. Check Supabase RLS policy for DELETE on projects.');
      }

      setProjects(previous => previous.filter(project => String(project.id) !== String(confirmDeleteId)));
      if (String(editingId) === String(confirmDeleteId)) {
        resetForm();
      }
      setMessage('Project deleted.');
      setConfirmDeleteId('');
      await loadProjects();
      notifyProjectsChanged();
    } catch (deleteError) {
      console.error('[DEBUG] Delete exception:', deleteError);
      setMessage(`Delete failed: ${deleteError.message}`);
      setConfirmDeleteId('');
    }
  };

  if (authLoading) {
    return <div className="admin-shell loading-shell">Checking session…</div>;
  }

  if (!session || !authorized) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <p className="eyebrow">Portfolio Admin</p>
          <h1>Welcome back</h1>
          <p>
            {session && !authorized
              ? `Signed in as ${user?.email || 'unknown user'}, but this account is not allowed.`
              : 'Sign in with your Google account to manage your portfolio projects.'}
          </p>
          {session && !authorized ? (
            <button className="btn btn-ghost" onClick={handleLogout}>Sign out</button>
          ) : (
          <button className="btn btn-primary" onClick={handleLogin}>Continue with Google</button>
          )}
          {message ? <p className="admin-message error">{message}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button className="brand admin-brand" onClick={() => navigate('/')}>
          S<span>.</span>
        </button>
        <div className="sidebar-links">
          <button className="active">Projects</button>
          <button onClick={() => navigate('/')}>View Site</button>
        </div>
        <div className="admin-user-card">
          <img src={user.user_metadata?.avatar_url || ''} alt="Avatar" />
          <div>
            <strong>{user.user_metadata?.full_name || user.email}</strong>
            <span>{user.email}</span>
          </div>
          <button className="admin-ghost-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Projects</p>
            <h1>Manage your portfolio showcase</h1>
          </div>
          <button className="btn btn-primary" onClick={openNewProject}>New Project</button>
        </div>

        <div className="stats-row stats-row-admin">
          <div className="stat-pill"><strong>{stats.total}</strong><span>Total</span></div>
          <div className="stat-pill"><strong>{stats.uiux}</strong><span>UI/UX</span></div>
          <div className="stat-pill"><strong>{stats.graphic}</strong><span>Graphic</span></div>
          <div className="stat-pill"><strong>{stats.branding}</strong><span>Branding</span></div>
        </div>

        {message ? <p className="admin-message">{message}</p> : null}

        <div className="admin-grid">
          <section className="panel">
            <h2>{editingId ? 'Edit Project' : 'Add Project'}</h2>
            <form className="admin-form" onSubmit={handleSave}>
              <input value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="Project title" required />
              <select value={form.category} onChange={e => updateForm('category', e.target.value)} required>
                <option value="">Select category</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Branding">Branding</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
              </select>
              <input type="number" min="0" value={form.display_order} onChange={e => updateForm('display_order', e.target.value)} placeholder="Display order" />
              <input value={form.tools} onChange={e => updateForm('tools', e.target.value)} placeholder="Tools, comma separated" required />
              <input value={form.image} onChange={e => updateForm('image', e.target.value)} placeholder="Image URL (optional)" />
              <input type="file" accept="image/*" onChange={handleFile} />
              {imagePreview ? <img className="preview-image" src={imagePreview} alt="Preview" /> : null}
              <label style={{ marginTop: '12px', fontWeight: 500 }}>Gallery Images (multiple)</label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryFiles} />
              {galleryPreviews.length > 0 && (
                <div className="gallery-previews">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="gallery-preview-item">
                      <img src={preview} alt={`Gallery ${index + 1}`} />
                      <button type="button" className="remove-img-btn" onClick={() => removeGalleryImage(index)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {galleryFiles.length > 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 0' }}>{galleryFiles.length} image(s) selected</p>}
              <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Description" required />
              <textarea value={form.problem} onChange={e => updateForm('problem', e.target.value)} placeholder="Problem" />
              <textarea value={form.solution} onChange={e => updateForm('solution', e.target.value)} placeholder="Solution" />
              <textarea value={form.concept} onChange={e => updateForm('concept', e.target.value)} placeholder="Concept" />
              <textarea value={form.features} onChange={e => updateForm('features', e.target.value)} placeholder="Features" />
              <textarea value={form.scope} onChange={e => updateForm('scope', e.target.value)} placeholder="Scope" />
              <textarea value={form.brand_elements} onChange={e => updateForm('brand_elements', e.target.value)} placeholder="Brand elements" />
              <textarea value={form.brand_message} onChange={e => updateForm('brand_message', e.target.value)} placeholder="Brand message" />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Project</button>
                {editingId ? <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button> : null}
              </div>
            </form>
          </section>

          <section className="panel table-panel">
            <h2>Projects</h2>
            {loading ? <p className="projects-empty">Loading projects…</p> : null}
            {!loading && projects.length === 0 ? <p className="projects-empty">No projects yet.</p> : null}
            <div className="admin-table">
              {projects.map(project => (
                <article className="admin-row" key={project.id}>
                  <img src={getImageUrl(project.image)} alt={project.title} />
                  <div className="admin-row-content">
                    <p>{project.category}</p>
                    <strong>{project.title}</strong>
                    <span>{project.display_order}</span>
                  </div>
                  <div className="row-actions">
                    <button className="btn btn-ghost" onClick={() => openEditProject(project)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => setConfirmDeleteId(project.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {confirmDeleteId ? (
        <div className="modal-overlay is-open">
          <div className="confirm-box">
            <h3>Delete project?</h3>
            <p>This will remove the project from Supabase and the portfolio.</p>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmDeleteId('')}>Cancel</button>
              <button className="btn btn-danger " onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
