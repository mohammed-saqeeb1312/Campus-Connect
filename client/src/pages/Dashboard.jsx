
import { useState, useEffect } from "react";
import "./dashboard.css";

function Dashboard() {

    // Store dashboard statistics
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        totalCourses: 0,
        totalNotices: 0,
        todayAttendance: 0,
        presentToday: 0,
        absentToday: 0
    });

    // Manage loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get today's local date in YYYY-MM-DD format
    function getTodayDate() {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Fetch dashboard statistics from backend
    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            // Get JWT token from localStorage
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login again.");
            }

            // Call dashboard statistics API
            const response = await fetch(
                `http://localhost:5000/api/dashboard/stats?date=${getTodayDate()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            // Handle API errors
            if (!response.ok) {
                throw new Error(data.message || "Failed to load dashboard");
            }

            // Store received statistics
            setStats(data);

        } catch (error) {
            setError(error.message);
            console.log("Dashboard Error:", error.message);

        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics when dashboard loads
    useEffect(() => {
        fetchDashboardStats();
    }, []);

    // Calculate today's attendance percentage
    const attendancePercentage = stats.todayAttendance > 0
        ? Math.round((stats.presentToday / stats.todayAttendance) * 100)
        : 0;

    return (
        <div className="content">

            {/* Dashboard Heading */}
            <div className="page-heading">
                <h1>Dashboard Overview</h1>
                <p>Manage your college from one place.</p>
            </div>

            {/* Loading Message */}
            {loading && (
                <p>Loading dashboard statistics...</p>
            )}

            {/* Error Message */}
            {error && (
                <p className="error-message">{error}</p>
            )}

            {/* Statistics Cards */}
            {!loading && !error && (

                <div className="stats-grid">

                    {/* Total Students */}
                    <div className="stat-card">
                        <div>
                            <p>Total Students</p>
                            <h2>{stats.totalStudents}</h2>
                        </div>
                        🎓
                    </div>

                    {/* Total Faculty */}
                    <div className="stat-card">
                        <div>
                            <p>Total Faculty</p>
                            <h2>{stats.totalFaculty}</h2>
                        </div>
                        👨‍🏫
                    </div>

                    {/* Total Courses */}
                    <div className="stat-card">
                        <div>
                            <p>Total Courses</p>
                            <h2>{stats.totalCourses}</h2>
                        </div>
                        📚
                    </div>

                    {/* Today's Attendance Percentage */}
                    <div className="stat-card">
                        <div>
                            <p>Today's Attendance</p>
                            <h2>{attendancePercentage}%</h2>
                        </div>
                        📊
                    </div>

                    {/* Published Notices */}
                    <div className="stat-card">
                        <div>
                            <p>Published Notices</p>
                            <h2>{stats.totalNotices}</h2>
                        </div>
                        📢
                    </div>

                </div>
            )}

            {/* Today's Attendance Summary */}
            {!loading && !error && (
                <div className="students-section">

                    <h2>Today's Attendance Summary</h2>

                    <div className="stats-grid">

                        <div className="stat-card">
                            <div>
                                <p>Present</p>
                                <h2>{stats.presentToday}</h2>
                            </div>
                            ✅
                        </div>

                        <div className="stat-card">
                            <div>
                                <p>Absent</p>
                                <h2>{stats.absentToday}</h2>
                            </div>
                            ❌
                        </div>

                        <div className="stat-card">
                            <div>
                                <p>Total Marked</p>
                                <h2>{stats.todayAttendance}</h2>
                            </div>
                            📝
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Dashboard;
