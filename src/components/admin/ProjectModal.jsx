import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSave } from 'react-icons/fa'

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tools: '',
    imageUrl: '',
    detailImageUrls: '',
    description: '',
    problem: '',
    solution: '',
    concept: '',
    features: '',
    scope: '',
    brandElements: '',
    brandMessage: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [detailImageFiles, setDetailImageFiles] = useState([])
  const [detailImagePreviews, setDetailImagePreviews] = useState([])
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const detailFileInputRef = useRef(null)

  const categories = [
    'UI/UX Design',
    'Graphic Design',
    'Branding',
    'Web Development',
    'Mobile App'
  ]

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        category: project.category || '',
        tools: project.tools || '',
        imageUrl: project.image || '',
        detailImageUrls: Array.isArray(project.detailImages) ? project.detailImages.join('\n') : '',
        description: project.description || '',
        problem: project.problem || '',
        solution: project.solution || '',
        concept: project.concept || '',
        features: project.features || '',
        scope: project.scope || '',
        brandElements: project.brandElements || '',
        brandMessage: project.brandMessage || ''
      })
      setImagePreview(project.image || '')
      setDetailImagePreviews(Array.isArray(project.detailImages) ? project.detailImages : [])
      setDetailImageFiles([])
    } else {
      resetForm()
    }
  }, [project, isOpen])

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      tools: '',
      imageUrl: '',
      detailImageUrls: '',
      description: '',
      problem: '',
      solution: '',
      concept: '',
      features: '',
      scope: '',
      brandElements: '',
      brandMessage: ''
    })
    setImageFile(null)
    setDetailImageFiles([])
    setDetailImagePreviews([])
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (detailFileInputRef.current) {
      detailFileInputRef.current.value = ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'imageUrl' && value) {
      setImagePreview(value)
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    if (name === 'detailImageUrls') {
      const parsed = value
        .split(/\r?\n|,/)
        .map(url => url.trim())
        .filter(Boolean)

      if (parsed.length > 0) {
        setDetailImagePreviews(parsed)
      } else if (detailImageFiles.length === 0) {
        setDetailImagePreviews([])
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      setFormData(prev => ({ ...prev, imageUrl: '' }))
    }
  }

  const handleDetailFilesChange = (e) => {
    const files = Array.from(e.target.files || [])
    setDetailImageFiles(files)

    if (files.length === 0) {
      return
    }

    const readers = files.map((file) => (
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target?.result || '')
        reader.readAsDataURL(file)
      })
    ))

    Promise.all(readers).then((results) => {
      setDetailImagePreviews(results.filter(Boolean))
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key !== 'imageUrl') {
          submitData.append(key, formData[key])
        }
      })

      if (imageFile) {
        submitData.append('image', imageFile)
      } else if (formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl)
      }

      detailImageFiles.forEach((file) => {
        submitData.append('detailImages', file)
      })

      await onSave(submitData)
      resetForm()
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal admin-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="modal-header">
              <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
              <button className="modal-close" onClick={handleClose}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="title">Project Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tools">Tools (comma separated) *</label>
                  <input
                    type="text"
                    id="tools"
                    name="tools"
                    value={formData.tools}
                    onChange={handleChange}
                    placeholder="Figma, Photoshop, Illustrator"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="imageFile">Project Image *</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="imageFile"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Or enter image URL"
                    />
                  </div>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="detailImageFiles">Detail View Images (1 or more)</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="detailImageFiles"
                      ref={detailFileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleDetailFilesChange}
                    />
                    <textarea
                      name="detailImageUrls"
                      value={formData.detailImageUrls}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Or add image URLs (one per line)"
                    />
                  </div>
                  {detailImagePreviews.length > 0 && (
                    <div className="image-preview-grid">
                      {detailImagePreviews.map((src, index) => (
                        <img key={`${src}-${index}`} src={src} alt={`Detail preview ${index + 1}`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="problem">Problem</label>
                  <textarea
                    id="problem"
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="solution">Solution</label>
                  <textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="concept">Concept</label>
                  <textarea
                    id="concept"
                    name="concept"
                    value={formData.concept}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="features">Features</label>
                  <textarea
                    id="features"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="scope">Scope</label>
                  <textarea
                    id="scope"
                    name="scope"
                    value={formData.scope}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="brandElements">Brand Elements</label>
                  <textarea
                    id="brandElements"
                    name="brandElements"
                    value={formData.brandElements}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="brandMessage">Brand Message</label>
                  <textarea
                    id="brandMessage"
                    name="brandMessage"
                    value={formData.brandMessage}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSave />
                  {isSubmitting ? 'Saving...' : 'Save Project'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal
