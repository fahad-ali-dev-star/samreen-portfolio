import { memo } from 'react'
import { motion } from 'framer-motion'
import { getCategoryFilter } from '../../hooks/useProjects'

const ProjectCard = memo(({ project, index, onClick }) => {
  const categoryFilter = getCategoryFilter(project.category)
  
  // Get first 3 tools
  const tools = project.tools ? project.tools.split(',').slice(0, 3) : []
  
  // Truncate description
  const truncatedDescription = project.description 
    ? project.description.substring(0, 100) + '...'
    : ''

  return (
    <motion.div
      className="project-card"
      data-category={categoryFilter}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      layout
    >
      <div className="project-img">
        <img 
          src={project.image} 
          alt={project.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
          }}
        />
      </div>
      <div className="project-info">
        <h3>{project.title}</h3>
        <p>{truncatedDescription}</p>
        <div className="project-tags">
          {tools.map((tool, idx) => (
            <span key={idx}>{tool.trim()}</span>
          ))}
        </div>
        <motion.button
          className="btn view-project-btn"
          onClick={onClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

export default ProjectCard
