
import { useState, useEffect } from "react";
import "./notices.css";

function Notices() {

    // Store all notices fetched from MongoDB
    const [notices, setNotices] = useState([]);

    // Control notice form visibility
    const [showForm, setShowForm] = useState(false);

    // Store the ID of the notice being edited
    const [editingId, setEditingId] = useState(null);

    // Manage loading and error messages
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Store notice form values
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "General",
        expiryDate: "",
        status: "Published"
    });

    const API_URL = "http://localhost:5000/api/notices";

    // Get Admin JWT token
    const getToken = () => localStorage.getItem("token");


    // 1. FETCH ALL NOTICES
    const fetchNotices = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            // Request notices from backend
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch notices");
            }

            // Store notices in React state
            setNotices(data.notices || []);

        } catch (error) {
            setError(error.message);
            console.log("Notice Error:", error.message);

        } finally {
            setLoading(false);
        }
    };

    // Load notices when the page opens
    useEffect(() => {
        fetchNotices();
    }, []);


    // 2. HANDLE INPUT CHANGES
    function handleChange(e) {
        const { name, value } = e.target;

        // Update the selected form field
        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }


    // 3. RESET FORM
    function resetForm() {
        setFormData({
            title: "",
            description: "",
            category: "General",
            expiryDate: "",
            status: "Published"
        });

        setEditingId(null);
        setShowForm(false);
    }


    // 4. OPEN ADD NOTICE FORM
    function handleAddClick() {
        resetForm();
        setShowForm(true);
    }


    // 5. OPEN EDIT NOTICE FORM
    function handleEdit(notice) {
        setFormData({
            title: notice.title,
            description: notice.description,
            category: notice.category,
            expiryDate: notice.expiryDate
                ? notice.expiryDate.slice(0, 10)
                : "",
            status: notice.status
        });

        setEditingId(notice._id);
        setShowForm(true);
    }


    // 6. ADD OR UPDATE NOTICE
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const token = getToken();

            // Choose POST for new notice or PUT for existing notice
            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            // Send notice details to backend
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    expiryDate: formData.expiryDate || undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Notice operation failed");
            }

            alert(data.message);

            resetForm();
            await fetchNotices();

        } catch (error) {
            alert(error.message);
            console.log("Notice Submit Error:", error.message);
        }
    }


    // 7. DELETE NOTICE
    async function handleDelete(noticeId) {
        // Ask Admin before deleting a notice
        if (!window.confirm("Are you sure you want to delete this notice?")) {
            return;
        }

        try {
            const token = getToken();

            // Delete notice using its MongoDB ID
            const response = await fetch(`${API_URL}/${noticeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete notice");
            }

            alert(data.message);

            await fetchNotices();

        } catch (error) {
            alert(error.message);
            console.log("Notice Delete Error:", error.message);
        }
    }


    // 8. DISPLAY NOTICES
    return (
        <div className="notices-page">

            {/* Page heading */}
            <div className="student-heading">
                <div>
                    <h1>Notice Management</h1>
                    <p>Manage KCT Engineering College announcements.</p>
                </div>

                <button onClick={handleAddClick}>
                    + Add Notice
                </button>
            </div>


            {/* Add or edit notice form */}
            {showForm && (
                <div className="students-section">

                    <h2>
                        {editingId ? "Edit Notice" : "Add New Notice"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <input
                                type="text"
                                name="title"
                                placeholder="Notice Title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="General">General</option>
                                <option value="Academic">Academic</option>
                                <option value="Examination">Examination</option>
                                <option value="Event">Event</option>
                            </select>

                            <textarea
                                name="description"
                                placeholder="Notice Description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                            <label>Expiry Date</label>

                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                            />

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>

                        </div>

                        <button type="submit">
                            {editingId ? "Update Notice" : "Publish Notice"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            )}


            {/* Display notice records */}
            <div className="students-section">

                <h2>All Notices ({notices.length})</h2>

                {loading ? (
                    <p>Loading notices...</p>

                ) : error ? (
                    <p>{error}</p>

                ) : notices.length === 0 ? (
                    <p>No notices available.</p>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Publish Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {notices.map((notice, index) => (
                                    <tr key={notice._id}>

                                        <td>{index + 1}</td>

                                        <td>{notice.title}</td>

                                        <td>{notice.category}</td>

                                        <td>
                                            {new Date(
                                                notice.publishDate
                                            ).toLocaleDateString("en-IN")}
                                        </td>

                                        <td>{notice.status}</td>

                                        <td>
                                            <button
                                                onClick={() => handleEdit(notice)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(notice._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Notices;
