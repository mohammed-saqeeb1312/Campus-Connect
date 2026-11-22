
import { useState, useEffect } from "react";
import "./courses.css";
function Courses() {

    // 1. Store all course records
    const [courses, setCourses] = useState([]);

    // 2. Control form visibility
    const [showForm, setShowForm] = useState(false);

    // 3. Store ID of course being edited
    const [editingId, setEditingId] = useState(null);

    // 4. Manage loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 5. Store course form data
    const [formData, setFormData] = useState({
        courseName: "",
        courseCode: "",
        department: "",
        duration: "",
        semester: ""
    });

    const API_URL = "https://campus-connect-0hr7.onrender.com/api/courses";

    // 6. Fetch courses from MongoDB
    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError("");

            // Get JWT token from localStorage
            const token = localStorage.getItem("token");

            // Fetch courses with authentication
            const response = await fetch(API_URL, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch courses");
            }

            // Store fetched courses in state
            setCourses(data.courses);

        } catch (error) {
            setError(error.message);
            console.log("Fetch Error:", error.message);

        } finally {
            setLoading(false);
        }
    };

    // Load courses when page opens
    useEffect(() => {
        fetchCourses();
    }, []);

    // 7. Reset course form
    function resetForm() {
        setFormData({
            courseName: "",
            courseCode: "",
            department: "",
            duration: "",
            semester: ""
        });

        setEditingId(null);
        setShowForm(false);
    }

    // 8. Open Add Course form
    function handleAddClick() {
        resetForm();
        setShowForm(true);
    }

    // 9. Handle input changes
    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    // 10. Add or Update Course
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem("token");

            let url = API_URL;
            let method = "POST";

            // Use PUT when editing an existing course
            if (editingId !== null) {
                url = `${API_URL}/${editingId}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    semester: Number(formData.semester)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed");
            }

            alert(data.message);

            // Refresh course list after saving
            await fetchCourses();

            resetForm();

        } catch (error) {
            alert(error.message);
            console.log("Submit Error:", error.message);
        }
    }

    // 11. Edit Course
    function handleEdit(course) {
        setFormData({
            courseName: course.courseName,
            courseCode: course.courseCode,
            department: course.department,
            duration: course.duration,
            semester: String(course.semester)
        });

        // Store MongoDB course ID
        setEditingId(course._id);

        setShowForm(true);
    }

    // 12. Delete Course
    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) return;

        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            alert(data.message);

            // Remove deleted course from UI
            setCourses((previousCourses) =>
                previousCourses.filter(
                    (course) => course._id !== id
                )
            );

        } catch (error) {
            alert(error.message);
            console.log("Delete Error:", error.message);
        }
    }

    return (
        <div className="courses-page">

            {/* Course heading */}
            <div className="student-heading">
                <div>
                    <h1>Course Management</h1>
                    <p>Manage KCT Engineering College courses.</p>
                </div>

                <button
                    className="add-student-btn"
                    onClick={handleAddClick}
                >
                    + Add Course
                </button>
            </div>

            {/* Add or Edit Course form */}
            {showForm && (
                <form
                    className="student-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingId !== null
                            ? "Edit Course"
                            : "Add New Course"}
                    </h2>

                    <div className="form-grid">

                        <input
                            type="text"
                            name="courseName"
                            placeholder="Course Name"
                            value={formData.courseName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="courseCode"
                            placeholder="Course Code"
                            value={formData.courseCode}
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="ISE">ISE</option>
                            <option value="EEE">EEE</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                        </select>

                        <select
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Duration</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            <option value="4 Years">4 Years</option>
                        </select>

                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                                <option key={number} value={number}>
                                    Semester {number}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* Form buttons */}
                    <div className="form-actions">

                        <button type="submit">
                            {editingId !== null
                                ? "Update Course"
                                : "Save Course"}
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    </div>
                </form>
            )}

            {/* Courses table */}
            <div className="students-section">

                <h2>All Courses ({courses.length})</h2>

                {loading ? (
                    <p>Loading courses...</p>

                ) : error ? (
                    <p className="error-message">{error}</p>

                ) : (
                    <div className="table-wrapper">

                        <table>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Course Name</th>
                                    <th>Course Code</th>
                                    <th>Department</th>
                                    <th>Duration</th>
                                    <th>Semester</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {courses.map((course, index) => (
                                    <tr key={course._id}>
                                        <td>{index + 1}</td>
                                        <td>{course.courseName}</td>
                                        <td>{course.courseCode}</td>
                                        <td>{course.department}</td>
                                        <td>{course.duration}</td>
                                        <td>{course.semester}</td>

                                        <td>
                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() => handleEdit(course)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() => handleDelete(course._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan="7">
                                            No courses found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Courses;
