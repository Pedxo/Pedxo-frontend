import Loader from '../components/Loader'
import { useToken } from '../features/useToken'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { data: accessToken, isLoading, error } = useToken()
  const location = useLocation()

  if (isLoading) return <Loader />

  if (error || !accessToken) {
    // Pass the current location to the login page so we can redirect back after login
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
