import { useEffect, useMemo, useState } from 'react'

const ProjectDetail = ({ project }) => {
  // Determine which field to show based on available data
  const detail1Title = project.problem 
    ? 'Problem' 
    : project.concept 
      ? 'Concept' 
      : project.features 
        ? 'Features' 
        : 'Brand Elements'
  
  const detail1Content = project.problem || project.concept || project.features || project.brandElements || ''
  
  const detail2Title = project.solution ? 'Solution' : 'Scope'
  const detail2Content = project.solution || project.scope || project.brandMessage || 'Complete design and development'
  
  const tools = project.tools ? project.tools.split(',') : []
  const galleryImages = useMemo(() => {
    const detailImages = Array.isArray(project.detailImages) ? project.detailImages : []
    const images = [...detailImages]
    if (project.image && !images.includes(project.image)) {
      images.unshift(project.image)
    }
    return images.filter(Boolean)
  }, [project])

  const [activeImage, setActiveImage] = useState(galleryImages[0] || project.image)

  useEffect(() => {
    setActiveImage(galleryImages[0] || project.image)
  }, [galleryImages, project.image])

  return (
    <div className="modal-content">
      <div className="modal-img">
        <img 
          src={activeImage || project.image}
          alt={project.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'
          }}
        />
        {galleryImages.length > 1 && (
          <div className="modal-thumbnails">
            {galleryImages.map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                className={`modal-thumb ${img === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`${project.title} detail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="modal-info">
        <h3>{project.title}</h3>
        <p><strong>Category:</strong> {project.category}</p>
        <p>{project.description}</p>

        <div className="modal-details">
          {detail1Content && (
            <div>
              <h4>{detail1Title}</h4>
              <p>{detail1Content}</p>
            </div>
          )}
          {detail2Content && (
            <div>
              <h4>{detail2Title}</h4>
              <p>{detail2Content}</p>
            </div>
          )}
        </div>

        <div className="project-tags" style={{ marginTop: '20px' }}>
          {tools.map((tool, index) => (
            <span key={index}>{tool.trim()}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
