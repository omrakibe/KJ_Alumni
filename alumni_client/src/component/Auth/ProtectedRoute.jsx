import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {
    const location = useLocation();

    const token = localStorage.getItem("token");

    // No token → user is not logged in
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    try {
        const decodedToken = jwtDecode(token);

        // Check token expiration
        if (
            decodedToken.exp &&
            decodedToken.exp * 1000 < Date.now()
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenType");

            return (
                <Navigate
                    to="/login"
                    replace
                    state={{
                        from: location.pathname,
                    }}
                />
            );
        }

        const role = decodedToken.role;

        // User is logged in but doesn't have permission
        if (allowedRole && role !== allowedRole) {
            if (role === "ADMIN") {
                return (
                    <Navigate
                        to="/admin/dashboard"
                        replace
                    />
                );
            }

            if (role === "ALUMNI") {
                return (
                    <Navigate
                        to="/alumni/dashboard"
                        replace
                    />
                );
            }

            return <Navigate to="/login" replace />;
        }

        return children;
    } catch (error) {
        console.error("Invalid authentication token:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("tokenType");

        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;