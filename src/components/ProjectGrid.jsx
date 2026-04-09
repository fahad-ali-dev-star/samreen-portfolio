import React from 'react';

export function ProjectGrid({ projects, onOpen, getImageUrl }) {
  if (!projects.length) {
    return <p className="projects-empty">No projects found.</p>;
  }

  return (
    <div className="projects-grid">
      {projects.map(project => (
        <article className="project-card" key={project.id} onClick={() => onOpen(project)}>
          <img className="project-thumb" src={getImageUrl(project.image)} alt={project.title} loading="lazy" />
          <div className="project-meta">
            <p className="project-category">{project.category}</p>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{(project.description || '').slice(0, 110)}{project.description?.length > 110 ? '…' : ''}</p>
            <div className="chip-row">
              {(project.tools || '')
                .split(',')
                .map(tool => tool.trim())
                .filter(Boolean)
                .slice(0, 3)
                .map(tool => (
                  <span className="tool-chip" key={tool}>
                    {tool}
                  </span>
                ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
