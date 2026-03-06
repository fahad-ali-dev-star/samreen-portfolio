import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaLayerGroup, FaSignOutAlt, FaPlus } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../hooks/useProjects'
import ProjectsTable from './ProjectsTable'
import ProjectModal from './ProjectModal'
import Notification from '../common/Notification'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { projects, loading, createProject, updateProject, deleteProject, refetch } = useProjects(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type })
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }))
  }, [])

  const handleAddProject = useCallback(() => {
    setEditingProject(null)
    setIsModalOpen(true)
  }, [])

  const handleEditProject = useCallback((project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }, [])

  const handleDeleteProject = useCallback(async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }
    
    const result = await deleteProject(projectId)
    if (result.success) {
      showNotification('Project deleted successfully!', 'success')
    } else {
      showNotification('Failed to delete project. Please try again.', 'error')
    }
  }, [deleteProject, showNotification])

  const handleSaveProject = useCallback(async (formData) => {
    const result = editingProject
      ? await updateProject(editingProject.id, formData)
      : await createProject(formData)
    
    if (result.success) {
      showNotification('Project saved successfully!', 'success')
      setIsModalOpen(false)
      setEditingProject(null)
    } else {
      showNotification('Failed to save project. Please try again.', 'error')
    }
  }, [editingProject, createProject, updateProject, showNotification])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingProject(null)
  }, [])

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h1>
            <FaLayerGroup />
            Portfolio Manager
          </h1>
        </div>
        <div className="header-right">
          {user && (
            <div className="user-info">
              <img src={user.photo} alt={user.name} />
              <span>{user.name}</span>
            </div>
          )}
          <motion.button 
            className="logout-btn"
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSignOutAlt />
            Logout
          </motion.button>
        </div>
      </header>

      <main className="admin-main">
        <div className="dashboard-controls">
          <h2>Projects</h2>
          <motion.button 
            className="btn-primary"
            onClick={handleAddProject}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus />
            Add New Project
          </motion.button>
        </div>

        <ProjectsTable
          projects={projects}
          loading={loading}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      </main>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={hideNotification}
      />
    </div>
  )
}

export default AdminDashboard
