import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaPen, FaTrash, FaFolderOpen, FaExclamationTriangle } from 'react-icons/fa'

const ProjectsTable = memo(({ projects, loading, onEdit, onDelete }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/60x60?text=No+Image'
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads/')) return imagePath
    return imagePath
  }

  if (loading) {
    return (
      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Tools</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="table-empty">
                <div className="loading-spinner"></div>
                <p>Loading projects...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Tools</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="table-empty">
                <FaFolderOpen className="empty-icon" />
                <p>No projects yet. Click "Add New Project" to get started!</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="projects-table-container">
      <table className="projects-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Tools</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <motion.tr
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <td className="project-id">#{project.id}</td>
              <td>
                <img 
                  src={getImageUrl(project.image)} 
                  alt={project.title}
                  className="project-thumbnail"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60?text=Error'
                  }}
                />
              </td>
              <td className="project-title">{project.title}</td>
              <td>
                <span className="category-badge">{project.category}</span>
              </td>
              <td>
                <div className="tools-list">
                  {project.tools && project.tools.split(',').map((tool, idx) => (
                    <span key={idx} className="tool-tag">{tool.trim()}</span>
                  ))}
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <motion.button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(project)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit project"
                  >
                    <FaPen />
                  </motion.button>
                  <motion.button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(project.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete project"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

ProjectsTable.displayName = 'ProjectsTable'

export default ProjectsTable
