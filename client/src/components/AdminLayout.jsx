
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout() {
    return (
        <div className="dashboard">

            {/* Sidebar navigation */}
            <Sidebar />

            <main className="main-content">

                {/* Top navigation bar */}
                <Navbar />

                {/* Render selected admin page */}
                <Outlet />

            </main>
        </div>
    );
}

export default AdminLayout;
