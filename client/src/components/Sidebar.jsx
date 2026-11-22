import {NavLink} from "react-router-dom";

function sidebar(){
    return(
        <aside className="sidebar">
            <h2 className="logo">Campus Connect</h2>
            <p className="college-name">
                KCT Engineering College
            </p>

            <nav>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/students"className={({ isActive }) => isActive ? "active" : ""}>Students</NavLink>
                <NavLink to="/faculty"className={({ isActive }) => isActive ? "active" : ""}>Faculty</NavLink>
                <NavLink to="/courses"className={({ isActive }) => isActive ? "active" : ""}>Courses</NavLink>
                <NavLink to="/attendance"> Attendance</NavLink>
                <NavLink to="/notices"> Notices</NavLink>
            </nav>


            


        </aside>
    );
}
export default sidebar;