
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Notices from "./pages/Notice";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public login page */}
                <Route path="/login" element={<Login />} />

                {/* Protect all admin pages */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/faculty" element={<Faculty />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/notices" element={<Notices />} />
                </Route>

                {/* Redirect unknown URLs */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
