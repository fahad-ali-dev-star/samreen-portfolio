import { useState, useEffect, useCallback } from 'react'
import { projectsApi } from '../services/api'
const enableFallbackProjects = import.meta.env.VITE_ENABLE_FALLBACK_PROJECTS === 'true'

// Fallback projects data
const fallbackProjects = [
  {
    id: "1",
    title: "Pixibot AI Assistant",
    category: "UI/UX Design",
    image: "/images/Portfolio-compressed-1_25-012.jpg",
    description: "Pixibot is a smart and friendly mini AI assistant designed to help users with conversations, productivity tools, and creative ideas.",
    problem: "Users had trouble finding a quick, friendly, and easy-to-use AI assistant.",
    solution: "Pixibot offers a smart, voice-based AI with a simple design and daily planning tools.",
    tools: "Figma, Photoshop, After Effects"
  },
  {
    id: "2",
    title: "Sunehri Saaye",
    category: "Graphic Design",
    image: "/images/Gemini_Generated_Image_3q9lcl3q9lcl3q9l.png",
    description: "A visual storytelling project exploring three faces and their hidden secrets through shadow and light.",
    concept: "Three faces, three secrets. The project visualizes the hidden stories behind personas.",
    tools: "Photoshop, Illustrator, After Effects"
  },
  {
    id: "3",
    title: "Tiki Emotional Bot",
    category: "UI/UX Design",
    image: "/images/Portfolio-compressed-1_25-021.jpg",
    description: "Tiki is a smart robot that reflects human emotions through its eyes.",
    features: "Emotion recognition, responsive expressions, interactive interface",
    tools: "Figma, Illustrator, Principle"
  },
  {
    id: "4",
    title: "TASY Movie Promotion",
    category: "Graphic Design",
    image: "/images/Portfolio-compressed-1_25-024.jpg",
    description: "Graphic design for a zombie horror movie, including posters and promotional materials.",
    scope: "Movie posters, social media graphics, landing page design",
    tools: "Photoshop, Illustrator, InDesign"
  },
  {
    id: "5",
    title: "NatureVe Skincare Brand",
    category: "Branding",
    image: "/images/Portfolio-compressed-1_25-043.jpg",
    description: "Complete branding for an organic skincare line with prickly pear cactus as key ingredient.",
    brandElements: "Logo design, color palette, typography, packaging",
    tools: "Illustrator, Photoshop, InDesign"
  },
  {
    id: "6",
    title: "Terra Jewel Hub",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Branding and visual identity for a handmade jewelry brand.",
    brandMessage: "You are unique, you are timeless.",
    tools: "Illustrator, Photoshop, After Effects"
  },
  {
    id: "7",
    title: "A Smart Way to Park",
    category: "Graphic Design",
    image: "/images/Portfolio-compressed-1_25-014.jpg",
    description: "Graphic design for a parking app that simplifies finding and reserving parking spots.",
    tools: "Illustrator, Photoshop, After Effects"
  },
  {
    id: "8",
    title: "Healthy eat app",
    category: "Graphic Design",
    image: "/images/Portfolio-compressed-1_25-016.jpg",
    description: "Your one stop app for fresh fruit, vegetables and spices.",
    tools: "Illustrator, Photoshop, After Effects"
  },
  {
    id: "9",
    title: "Ashes Never Die",
    category: "Graphic Design",
    image: "/images/Portfolio-compressed-1_25-025.jpg",
    description: "A visual storytelling project about resilience and hidden secrets.",
    tools: "Illustrator, Photoshop, After Effects"
  }
]

export const useProjects = (isAdmin = false) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = isAdmin 
        ? await projectsApi.getAllAdmin()
        : await projectsApi.getAll()
      setProjects(response.data)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.message)
      if (!isAdmin && enableFallbackProjects) {
        setProjects(fallbackProjects)
      } else {
        setProjects([])
      }
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = async (formData) => {
    try {
      const response = await projectsApi.create(formData)
      await fetchProjects()
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateProject = async (id, formData) => {
    try {
      const response = await projectsApi.update(id, formData)
      await fetchProjects()
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteProject = async (id) => {
    try {
      await projectsApi.delete(id)
      await fetchProjects()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject
  }
}

// Get category filter value
export const getCategoryFilter = (category) => {
  const mapping = {
    'UI/UX Design': 'ui-ux',
    'Graphic Design': 'graphic',
    'Branding': 'branding'
  }
  return mapping[category] || 'graphic'
}

export default useProjects
