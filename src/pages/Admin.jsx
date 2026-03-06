import { useAuth } from '../context/AuthContext'
import LoginScreen from '../components/admin/LoginScreen'
import AdminDashboard from '../components/admin/AdminDashboard'
import Loader from '../components/common/Loader'
import '../styles/admin.css'

const Admin = () => {
  const { authenticated, loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  return authenticated ? <AdminDashboard /> : <LoginScreen />
}

export default Admin
