
import { useState, useEffect } from "react";
import "./attendance.css";

function Attendance() {

    // Store all students fetched from MongoDB
    const [students, setStudents] = useState([]);

    // Store attendance selected by Admin
    const [attendance, setAttendance] = useState({});

    // Store attendance records saved in MongoDB
    const [savedAttendance, setSavedAttendance] = useState({});

    // Store MongoDB attendance IDs for updating records
    const [attendanceIds, setAttendanceIds] = useState({});

    // Store selected attendance date
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    // Manage loading state
    const [loading, setLoading] = useState(true);

    // Manage error messages
    const [error, setError] = useState("");

    // Track students whose attendance is being saved
    const [savingStudents, setSavingStudents] = useState({});

    // Backend API URLs
    
const STUDENT_API = "http://localhost:5000/api/students?page=1&limit=100";

    const ATTENDANCE_API = "http://localhost:5000/api/attendance";

    // Get JWT token from localStorage
    const getToken = () => localStorage.getItem("token");


    // 1. FETCH STUDENTS AND EXISTING ATTENDANCE
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            // Get Admin JWT token
            const token = getToken();

            if (!token) {
                throw new Error("Please login again. Token not found.");
            }

            // Fetch all students from backend
            const studentResponse = await fetch(STUDENT_API, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const studentData = await studentResponse.json();

            if (!studentResponse.ok) {
                throw new Error(
                    studentData.message || "Failed to fetch students"
                );
            }

            // Store students in React state
            setStudents(studentData.students || []);

            // Fetch attendance records for selected date
            const attendanceResponse = await fetch(
                `${ATTENDANCE_API}?date=${selectedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const attendanceData = await attendanceResponse.json();

            if (!attendanceResponse.ok) {
                throw new Error(
                    attendanceData.message || "Failed to fetch attendance"
                );
            }

            // Create objects for saved attendance and MongoDB IDs
            const databaseAttendance = {};
            const databaseIds = {};

            // Convert MongoDB records into student-wise attendance
            (attendanceData.attendance || []).forEach((record) => {

                // Get the referenced student's MongoDB ID
                const studentId = record.student?._id || record.student;

                if (studentId) {
                    databaseAttendance[studentId] = record.status;
                    databaseIds[studentId] = record._id;
                }
            });

            // Store actual saved attendance separately
            setSavedAttendance(databaseAttendance);

            // Store attendance record IDs for PUT requests
            setAttendanceIds(databaseIds);

            // Initialize editable attendance from saved records
            setAttendance(databaseAttendance);

        } catch (error) {
            setError(error.message);
            console.log("Attendance Error:", error.message);

        } finally {
            setLoading(false);
        }
    };

    // Fetch data whenever selected date changes
    useEffect(() => {
        fetchData();
    }, [selectedDate]);


    // 2. CHANGE ATTENDANCE STATUS
    function handleStatusChange(studentId, status) {

        // Update attendance status in React state
        setAttendance((previous) => ({
            ...previous,
            [studentId]: status
        }));
    }


    // 3. SAVE NEW OR UPDATE EXISTING ATTENDANCE
    async function handleSave(studentId) {
        try {
            // Get selected attendance status
            const status = attendance[studentId];

            if (!status) {
                alert("Please select Present or Absent");
                return;
            }

            // Prevent duplicate requests while saving
            if (savingStudents[studentId]) {
                return;
            }

            // Get JWT token
            const token = getToken();

            if (!token) {
                throw new Error("Please login again. Token not found.");
            }

            // Check whether attendance already exists
            const alreadyMarked = Boolean(attendanceIds[studentId]);

            // Use PUT for existing records and POST for new records
            const url = alreadyMarked
                ? `${ATTENDANCE_API}/${attendanceIds[studentId]}`
                : ATTENDANCE_API;

            const method = alreadyMarked ? "PUT" : "POST";

            // Show saving state
            setSavingStudents((previous) => ({
                ...previous,
                [studentId]: true
            }));

            // Send attendance data to backend
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(
                    alreadyMarked
                        ? { status: status }
                        : {
                            student: studentId,
                            date: selectedDate,
                            status: status
                        }
                )
            });

            // Get backend response
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Attendance operation failed"
                );
            }

            // Get MongoDB attendance ID from response
            const recordId = data.attendance?._id || attendanceIds[studentId];

            // Update saved attendance after successful API response
            setSavedAttendance((previous) => ({
                ...previous,
                [studentId]: status
            }));

            // Store the attendance ID for future updates
            if (recordId) {
                setAttendanceIds((previous) => ({
                    ...previous,
                    [studentId]: recordId
                }));
            }

            // Show success message
            alert(data.message || "Attendance saved successfully");

        } catch (error) {
            alert(error.message);
            console.log("Attendance Error:", error.message);

        } finally {
            // Remove saving state
            setSavingStudents((previous) => ({
                ...previous,
                [studentId]: false
            }));
        }
    }


    // 4. ATTENDANCE SUMMARY

   
 // 4. ATTENDANCE SUMMARY

 // Count only students currently available in the student list
 const presentCount = students.filter(
     (student) => savedAttendance[student._id] === "Present"
 ).length;

 const absentCount = students.filter(
     (student) => savedAttendance[student._id] === "Absent"
 ).length;

 const totalStudents = students.length;

 const notMarkedCount = totalStudents - presentCount - absentCount;


    // 5. FRONTEND UI
    return (
        <div className="attendance-page">

            {/* Attendance page heading */}
            <div className="student-heading">
                <div>
                    <h1>Attendance Management</h1>
                    <p>
                        Manage KCT Engineering College student attendance.
                    </p>
                </div>
            </div>

            {/* Select attendance date */}
            <div className="students-section">
                <label>Select Date</label>

                <input
                    type="date"
                    value={selectedDate}
                    max={new Date().toLocaleDateString("en-CA")}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {/* Attendance summary */}
            <div className="stats-container">

                <div className="stat-card">
                    <h3>Total Students</h3>
                    <h2>{students.length}</h2>
                </div>

                <div className="stat-card">
                    <h3>Present</h3>
                    <h2>{presentCount}</h2>
                </div>

                <div className="stat-card">
                    <h3>Absent</h3>
                    <h2>{absentCount}</h2>
                </div>

            </div>

            {/* Student attendance section */}
            <div className="students-section">

                <h2>Student Attendance</h2>

                {loading ? (
                    <p>Loading attendance...</p>

                ) : error ? (
                    <p>{error}</p>

                ) : (
                    <div className="table-wrapper">

                        <table>

                            {/* Table headings */}
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            {/* Student attendance records */}
                            <tbody>

                                {students.map((student, index) => {

                                    // Check whether attendance exists in MongoDB
                                    const alreadyMarked = Boolean(
                                        savedAttendance[student._id]
                                    );

                                    // Check whether this student is saving
                                    const isSaving = Boolean(
                                        savingStudents[student._id]
                                    );

                                    return (
                                        <tr key={student._id}>

                                            <td>{index + 1}</td>

                                            <td>{student.name}</td>

                                            <td>{student.department}</td>

                                            <td>{student.year}</td>

                                            {/* Allow Admin to select or change status */}
                                            <td>
                                                <select
                                                    value={
                                                        attendance[student._id] || ""
                                                    }
                                                    disabled={isSaving}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            student._id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Status
                                                    </option>

                                                    <option value="Present">
                                                        Present
                                                    </option>

                                                    <option value="Absent">
                                                        Absent
                                                    </option>
                                                </select>
                                            </td>

                                            {/* Save or update attendance */}
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSave(student._id)
                                                    }
                                                    disabled={
                                                        !attendance[student._id] ||
                                                        isSaving ||
                                                        attendance[student._id] === savedAttendance[student._id]
                                                    }
                                                >
                                                    {isSaving
                                                        ? "Saving..."
                                                        : alreadyMarked
                                                            ? "Update"
                                                            : "Save"}
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })}

                                {/* Display message if no students exist */}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="6">
                                            No students found.
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

export default Attendance;
