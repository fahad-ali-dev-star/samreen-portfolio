import React, { useState } from 'react';

function renderDetails(project) {
  const details = [
    ['Problem', project.problem],
    ['Solution', project.solution],
    ['Concept', project.concept],
    ['Features', project.features],
    ['Scope', project.scope],
    ['Brand Elements', project.brand_elements],
    ['Brand Message', project.brand_message],
  ].filter(([, value]) => value && value.trim());

  if (!details.length) return null;

  return (
    <div className="details-grid">
      {details.map(([label, value]) => (
        <article className="detail-card" key={label}>
          <h4>{label}</h4>
          <p>{value}</p>
        </article>
      ))}
    </div>
  );
}

export function ProjectModal({ project, onClose, getImageUrl }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!project) return null;

  const galleryImages = Array.isArray(project.gallery_images) && project.gallery_images.length > 0 
    ? project.gallery_images 
    : [];
  const allImages = galleryImages.length > 0 ? galleryImages : (project.image ? [project.image] : []);
  const hasGallery = allImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const currentImage = allImages[currentImageIndex];

  return (
    <div className="modal-overlay is-open" onClick={onClose} role="presentation">
      <div className="modal-box modal-project" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close project details">
          ×
        </button>
        <div className="modal-layout">
          <div className="modal-img">
            {currentImage && <img src={getImageUrl(currentImage)} alt={project.title} loading="lazy" />}
            {hasGallery && (
              <>
                <button className="gallery-nav gallery-prev" onClick={prevImage} aria-label="Previous image">‹</button>
                <button className="gallery-nav gallery-next" onClick={nextImage} aria-label="Next image">›</button>
                <div className="gallery-dots">
                  {allImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="modal-info">
            <p className="modal-cat">{project.category}</p>
            <h3>{project.title}</h3>
            <p className="modal-desc">{project.description || ''}</p>
            {renderDetails(project)}
            <div className="chip-row">
              {(project.tools || '')
                .split(',')
                .map(tool => tool.trim())
                .filter(Boolean)
                .map(tool => (
                  <span className="tool-chip" key={tool}>
                    {tool}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
