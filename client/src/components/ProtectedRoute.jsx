
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    // Redirect to login if token is missing
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Allow access to protected pages
    return children;
}

export default ProtectedRoute;
