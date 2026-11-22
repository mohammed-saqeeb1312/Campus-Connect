
import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    // Handle admin logout
    function handleLogout() {

        // Remove JWT token from browser storage
        localStorage.removeItem("token");

        // Remove admin details from browser storage
        localStorage.removeItem("admin");

        // Redirect to login page
        navigate("/login", { replace: true });
    }

    return (
        <header className="navbar">

            <div>
                <h2>Admin Dashboard</h2>
                <p>Welcome back, Admin!</p>
            </div>

            <div className="admin-info">
                <span>Administrator</span>
                <div className="avatar">A</div>

                {/* Logout button */}
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

        </header>
    );
}

export default Navbar;
