
import{Navigate,Outlet} from "react-router-dom"
import { useAuth } from "../../context/AuthContext";
function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page text-muted">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;