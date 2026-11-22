
import { useState, useEffect } from "react";
import "./students.css";

function Students() {

    // Store student records
    const [students, setStudents] = useState([]);

    // Control student form visibility
    const [showForm, setShowForm] = useState(false);

    // Store the ID of the student being edited
    const [editingId, setEditingId] = useState(null);

    // Manage loading and error messages
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Store student form input values
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: ""
    });

    // Store search keyword
    const [search, setSearch] = useState("");

    // Store selected department
    const [department, setDepartment] = useState("");

    // Store selected academic year
    const [year, setYear] = useState("");

    // Store current page number
    const [page, setPage] = useState(1);

    // Records displayed per page
    const limit = 5;

    // Store total matching records
    const [totalStudents, setTotalStudents] = useState(0);

    // Store total available pages
    const [totalPages, setTotalPages] = useState(1);

    // Backend API URL
    const API_URL = "http://localhost:5000/api/students";

    // Fetch students using search, filters and pagination
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError("");

            // Get JWT token
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login again.");
            }

            // Create query parameters
            const params = new URLSearchParams({
                search,
                department,
                year,
                page: String(page),
                limit: String(limit)
            });

            // Send request to backend
            const response = await fetch(`${API_URL}?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch students");
            }

            // Update students and pagination information
            setStudents(data.students || []);
            setTotalStudents(data.totalStudents || 0);
            setTotalPages(data.totalPages || 1);

        } catch (error) {
            setError(error.message);
            console.log("Fetch Error:", error.message);

        } finally {
            setLoading(false);
        }
    };

    // Fetch students whenever filters or page changes
    useEffect(() => {
        fetchStudents();
    }, [search, department, year, page]);

    // Reset student form
    function resetForm() {
        setFormData({
            name: "",
            email: "",
            phone: "",
            department: "",
            year: ""
        });

        setEditingId(null);
        setShowForm(false);
    }

    // Open Add Student form
    function handleAddClick() {
        resetForm();
        setShowForm(true);
    }

    // Handle form input changes
    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    // Add or Update Student
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            let url = API_URL;
            let method = "POST";

            // Use PUT when editing
            if (editingId !== null) {
                url = `${API_URL}/${editingId}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed");
            }

            alert(data.message || "Student saved successfully");

            // Close form and refresh the list
            resetForm();

            // Go to first page to show updated records
            setPage(1);

            // Fetch latest records
            await fetchStudents();

        } catch (error) {
            alert(error.message);
            console.log("Submit Error:", error.message);
        }
    }

    // Edit Student
    function handleEdit(student) {
        setFormData({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            department: student.department || "",
            year: student.year || ""
        });

        setEditingId(student._id);
        setShowForm(true);
    }

    // Delete Student
    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            alert(data.message || "Student deleted successfully");

            // Refresh list after deletion
            await fetchStudents();

        } catch (error) {
            alert(error.message);
            console.log("Delete Error:", error.message);
        }
    }

    return (

        <div className="students-page">

            {/* Student Heading */}
            <div className="student-heading">

                <div>
                    <h1>Student Management</h1>
                    <p>Manage KCT Engineering College students.</p>
                </div>

                <button
                    className="add-student-btn"
                    onClick={handleAddClick}
                >
                    + Add Student
                </button>

            </div>

            {/* Search and Filter Section */}
            <div className="student-filters">

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <select
                    value={department}
                    onChange={(e) => {
                        setDepartment(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ISE">ISE</option>
                    <option value="EEE">EEE</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                </select>

                <select
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>

                <button
                    type="button"
                    onClick={() => {
                        setSearch("");
                        setDepartment("");
                        setYear("");
                        setPage(1);
                    }}
                >
                    Clear Filters
                </button>

            </div>

            {/* Student Form */}
            {showForm && (

                <form
                    className="student-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        {editingId !== null
                            ? "Edit Student"
                            : "Add New Student"}
                    </h2>

                    <div className="form-grid">

                        <input
                            type="text"
                            name="name"
                            placeholder="Student Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            title="Enter a 10-digit phone number"
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
                            <option value="ME">Mechanical</option>
                            <option value="CE">Civil</option>
                        </select>

                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>

                    </div>

                    {/* Form Buttons */}
                    <div className="form-actions">

                        <button type="submit">
                            {editingId !== null
                                ? "Update Student"
                                : "Save Student"}
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

            {/* Students Table */}
            <div className="students-section">

                <h2>All Students ({totalStudents})</h2>

                <p className="student-count">
                    Showing {students.length} of {totalStudents} students
                </p>

                {loading ? (

                    <p>Loading students...</p>

                ) : error ? (

                    <p className="error-message">{error}</p>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {students.map((student, index) => (

                                    <tr key={student._id}>

                                        <td>
                                            {student.serialNo ?? (
                                                (page - 1) * limit + index + 1
                                            )}
                                        </td>

                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.phone}</td>
                                        <td>{student.department}</td>
                                        <td>{student.year}</td>

                                        <td>

                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() => handleEdit(student)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() => handleDelete(student._id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                                {students.length === 0 && (

                                    <tr>
                                        <td colSpan="7">
                                            No students found.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

                {/* Pagination */}
                {!loading && !error && (

                    <div className="pagination">

                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((previous) => previous - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((previous) => previous + 1)}
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Students;
