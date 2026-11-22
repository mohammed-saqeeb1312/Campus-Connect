
import { useState, useEffect } from "react";
import "./faculty.css";

function Faculty() {

    // 1. Store all faculty records
    const [faculty, setFaculty] = useState([]);

    // 2. Control form visibility
    const [showForm, setShowForm] = useState(false);

    // 3. Store ID of faculty being edited
    const [editingId, setEditingId] = useState(null);

    // 4. Manage loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 5. Store faculty form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: ""
    });

    const API_URL = "http://localhost:5000/api/faculty";

    // 6. Fetch faculty records from MongoDB
    const fetchFaculty = async () => {
        try {
            setLoading(true);
            setError("");

            // Get JWT token from localStorage
            const token = localStorage.getItem("token");

            // Fetch faculty records with authentication
            const response = await fetch(API_URL, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch faculty");
            }

            // Store faculty records in state
            setFaculty(data.faculty);

        } catch (error) {
            setError(error.message);
            console.log("Fetch Error:", error.message);

        } finally {
            setLoading(false);
        }
    };

    // Load faculty when page opens
    useEffect(() => {
        fetchFaculty();
    }, []);

    // 7. Reset form
    function resetForm() {
        setFormData({
            name: "",
            email: "",
            phone: "",
            department: "",
            destination: ""
        });

        setEditingId(null);
        setShowForm(false);
    }

    // 8. Open Add Faculty form
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

    // 10. Add or Update Faculty
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem("token");

            let url = API_URL;
            let method = "POST";

            // Use PUT when editing faculty
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
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed");
            }

            alert(data.message);

            // Refresh faculty list after saving
            await fetchFaculty();

            resetForm();

        } catch (error) {
            alert(error.message);
            console.log("Submit Error:", error.message);
        }
    }

    // 11. Edit Faculty
    function handleEdit(member) {
        setFormData({
            name: member.name,
            email: member.email,
            phone: member.phone,
            department: member.department,
            destination: member.destination || member.designation || ""
        });

        // Store MongoDB faculty ID
        setEditingId(member._id);

        setShowForm(true);
    }

    // 12. Delete Faculty
    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this faculty?"
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

            // Remove deleted faculty from UI
            setFaculty((previousFaculty) =>
                previousFaculty.filter(
                    (member) => member._id !== id
                )
            );

        } catch (error) {
            alert(error.message);
            console.log("Delete Error:", error.message);
        }
    }

    return (
        <div className="faculty-page">

            {/* Faculty heading */}
            <div className="student-heading">
                <div>
                    <h1>Faculty Management</h1>
                    <p>Manage KCT Engineering College faculty members.</p>
                </div>

                <button
                    className="add-student-btn"
                    onClick={handleAddClick}
                >
                    + Add Faculty
                </button>
            </div>

            {/* Add or Edit Faculty form */}
            {showForm && (
                <form
                    className="student-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingId !== null
                            ? "Edit Faculty"
                            : "Add New Faculty"}
                    </h2>

                    <div className="form-grid">

                        <input
                            type="text"
                            name="name"
                            placeholder="Faculty Name"
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
                            required>
                            {/* Available departments */}
{/* Available departments */}
<option value="">Select Department</option>

<option value="CSE">Computer Science Department</option>
<option value="ISE">Information Science Department</option>
<option value="ECE">Electronics and Communication Department</option>
<option value="EEE">Electrical and Electronics Department</option>
<option value="ME">Mechanical Engineering Department</option>
<option value="CE">Civil Engineering Department</option>
<option value="AIML">AI and ML Department</option>
<option value="DS">Data Science Department</option>
                        </select>

                        <select
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Designation</option>
    <option value="Professor">Professor</option>
    <option value="Associate Professor">Associate Professor</option>
    <option value="Assistant Professor">Assistant Professor</option>
    <option value="Senior Lecturer">Senior Lecturer</option>
    <option value="Lecturer">Lecturer</option>
    <option value="Head of Department">Head of Department (HOD)</option>
    <option value="Visiting Faculty">Visiting Faculty</option>
    <option value="Guest Faculty">Guest Faculty</option>
                        </select>

                    </div>

                    {/* Form buttons */}
                    <div className="form-actions">

                        <button type="submit">
                            {editingId !== null
                                ? "Update Faculty"
                                : "Save Faculty"}
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

            {/* Faculty records table */}
            <div className="students-section">

                <h2>All Faculty ({faculty.length})</h2>

                {loading ? (
                    <p>Loading faculty...</p>

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
                                    <th>Designation</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {faculty.map((member, index) => (
                                    <tr key={member._id}>

                                        <td>{index + 1}</td>
                                        <td>{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>{member.phone}</td>
                                        <td>{member.department}</td>
                                        <td>{member.designation || member.destination}</td>

                                        <td>
                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() => handleEdit(member)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() => handleDelete(member._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))}

                                {faculty.length === 0 && (
                                    <tr>
                                        <td colSpan="7">
                                            No faculty found.
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

export default Faculty;
