import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // ✅ Redirect to signin if not logged in
  if (!currentUser) return <Navigate to="/signin" />;

  return children;
};

export default ProtectedRoute;
