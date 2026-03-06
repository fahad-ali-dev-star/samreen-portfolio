import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSpinner, FaFolderOpen } from 'react-icons/fa'
import useProjects, { getCategoryFilter } from '../../hooks/useProjects'
import Modal from '../common/Modal'
import ProjectCard from './ProjectCard'
import ProjectDetail from './ProjectDetail'

const Projects = () => {
  const { projects, loading, error } = useProjects()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'ui-ux', label: 'UI/UX Design' },
    { value: 'graphic', label: 'Graphic Design' },
    { value: 'branding', label: 'Branding' }
  ]

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects
    return projects.filter(project => 
      getCategoryFilter(project.category) === activeFilter
    )
  }, [projects, activeFilter])

  const handleFilterClick = useCallback((filter) => {
    setActiveFilter(filter)
  }, [])

  const openProjectModal = useCallback((project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }, [])

  const closeProjectModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }, [])

  if (loading) {
    return (
      <section className="projects" id="projects">
        <div className="container">
          <div className="section-title">
            <h2>My Projects</h2>
          </div>
          <div className="loading-projects">
            <FaSpinner className="spin" />
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="projects" id="projects">
      <div className="container">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>My Projects</h2>
        </motion.div>

        <motion.div 
          className="projects-filter"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        <div className="projects-grid" id="projectsGrid">
          {filteredProjects.length === 0 ? (
            <div className="loading-projects">
              <FaFolderOpen />
              <p>No projects found.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => openProjectModal(project)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeProjectModal}>
        {selectedProject && <ProjectDetail project={selectedProject} />}
      </Modal>
    </section>
  )
}

export default Projects
