import { Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../hooks/auth';

export const ProtectRoute = () => {
    const { data } = useAuth()

    return (
        data?.accessToken ? <Outlet /> : <Navigate to={'/login'} />
    )
}
