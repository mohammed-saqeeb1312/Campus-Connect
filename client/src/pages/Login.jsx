
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));

            navigate("/");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <form className="login-form" onSubmit={handleSubmit}>

                <div className="login-brand">
                    <h1>CampusConnect</h1>
                    <p>College Management System</p>
                </div>

                <div className="login-heading">
                    <h2>Admin Login</h2>
                    <p>Login to access your dashboard.</p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <div className="login-input-group">
                    <label>Email Address</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter admin email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="login-input-group">
                    <label>Password</label>

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="login-footer">
                    © 2026 CampusConnect. All rights reserved.
                </p>

            </form>

        </div>
    );
}

export default Login;
