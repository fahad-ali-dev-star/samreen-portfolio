import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile } from '../data/profile';
import { supabase } from '../lib/supabaseClient';
import { subscribeToProjectsChanges } from '../lib/projectsSync';
import { getImageUrl } from '../lib/projects';
import { useProjectsRealtime } from '../lib/useProjectsRealtime';
import { Navbar } from '../components/Navbar';
import { ProjectFilters } from '../components/ProjectFilters';
import { ProjectGrid } from '../components/ProjectGrid';
import { ProjectModal } from '../components/ProjectModal';

export function PortfolioPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectsNotice, setProjectsNotice] = useState('');
  const [contactNotice, setContactNotice] = useState('');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      setProjectsNotice(`Failed to load projects: ${error.message}`);
      setProjects([]);
      setLoading(false);
      return;
    }

    setProjectsNotice('');
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
    return subscribeToProjectsChanges(loadProjects);
  }, [loadProjects]);

  useProjectsRealtime(loadProjects);

  useEffect(() => {
    if (!selectedProject) return;

    const latestProject = projects.find(project => String(project.id) === String(selectedProject.id));

    if (!latestProject) {
      setSelectedProject(null);
      return;
    }

    if (latestProject !== selectedProject) {
      setSelectedProject(latestProject);
    }
  }, [projects, selectedProject]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(project => project.category === activeFilter);
  }, [activeFilter, projects]);

  const scrollTo = sectionId => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openProject = project => setSelectedProject(project);
  const closeProject = () => setSelectedProject(null);

  return (
    <>
      <Navbar onNavigate={target => {
        if (target === 'admin') {
          navigate('/admin');
          return;
        }
        scrollTo(target);
      }} />

      <main>
        <section className="hero section-pad" id="home">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <p className="eyebrow">UI/UX &amp; Graphic Designer</p>
              <h1>
                Hi, I&apos;m <span>{profile.name}</span>.
              </h1>
              <p className="hero-text">{profile.intro}</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => scrollTo('projects')}>View Work</button>
                <button className="btn btn-ghost" onClick={() => scrollTo('contact')}>Let&apos;s Talk</button>
              </div>
              <div className="hero-stats">
                {profile.stats.map(stat => (
                  <div className="stat-pill" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual reveal delay-1">
              <div className="hero-card">
                <img
                  src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80"
                  alt="Design workspace"
                />
                <div className="hero-card-badge badge-top">Figma Pro</div>
                <div className="hero-card-badge badge-bottom">1.5+ Years XP</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad soft-section" id="about">
          <div className="container about-grid">
            <div className="section-heading reveal">
              <p className="eyebrow">About</p>
              <h2>Designing with purpose and clarity.</h2>
              <p>{profile.about}</p>
              <p>{profile.education}</p>
            </div>
            <div className="about-panel reveal delay-1">
              <h3>Core skills</h3>
              <div className="chip-row">
                {profile.skills.map(skill => <span className="tool-chip" key={skill}>{skill}</span>)}
              </div>
              <ul className="check-list">
                {profile.highlights.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-pad" id="projects">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Work</p>
              <h2>Selected Projects</h2>
              <p>Filtered portfolio work pulled directly from Supabase.</p>
            </div>
            <ProjectFilters activeFilter={activeFilter} onChange={setActiveFilter} />
            {loading ? <p className="projects-empty">Loading projects…</p> : <ProjectGrid projects={filteredProjects} onOpen={openProject} getImageUrl={getImageUrl} />}
            {projectsNotice ? <p className="projects-empty error">{projectsNotice}</p> : null}
          </div>
        </section>

        <section className="section-pad soft-section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="section-heading reveal">
              <p className="eyebrow">Contact</p>
              <h2>Let&apos;s create something great together.</h2>
              <ul className="contact-list">
                <li><i className="fas fa-envelope" /> {profile.email}</li>
                <li><i className="fas fa-map-marker-alt" /> {profile.location}</li>
                <li><i className="fas fa-briefcase" /> {profile.availability}</li>
              </ul>
            </div>
            <form className="contact-form reveal delay-1" data-access-key={import.meta.env.VITE_FORM_ACCESS_KEY} onSubmit={event => {
              event.preventDefault();
              setContactNotice('Message sent! I will get back to you soon.');
              event.currentTarget.reset();
            }}>
              <input type="hidden" name="access_key" value={import.meta.env.VITE_FORM_ACCESS_KEY} />
              <div className="form-row">
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
              </div>
              <input type="text" placeholder="Subject" required />
              <textarea placeholder="Your Message" rows="5" required />
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
            <button type="button" className="btn btn-instagram" onClick={() => window.open('https://www.instagram.com/samreenshafqat.ss?utm_source=qr&igsh=MXE3ZWplMm43a2UybQ==', '_blank')}>
              Instagram
            </button>
            {contactNotice ? <p className="contact-message">{contactNotice}</p> : null}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>© 2026 {profile.name}. All rights reserved.</p>
          <button className="footer-link" onClick={() => navigate('/admin')}>Admin</button>
        </div>
      </footer>

      <ProjectModal project={selectedProject} onClose={closeProject} getImageUrl={getImageUrl} />
    </>
  );
}
