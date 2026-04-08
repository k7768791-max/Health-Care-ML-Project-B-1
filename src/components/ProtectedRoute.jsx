import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loadingContext } = useContext(AuthContext);

  // ⏳ Wait for auth to load
  if (loadingContext) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;