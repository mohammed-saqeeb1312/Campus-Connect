require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Import student routes
const studentRoutes = require("./routes/studentRoutes");

const authRoutes = require("./routes/authRoutes");

// Import faculty routes
const facultyRoutes = require("./routes/facultyRoutes");

// Import course routes
const courseRoutes = require("./routes/courseRoutes");

// Import attendance routes
const attendanceRoutes = require("./routes/attendanceRoutes");

// Import notice routes
const noticeRoutes = require("./routes/noticeRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Home API
app.get("/", (req, res) => {
    res.send("KCT CampusConnect Backend Running");
});

// Student API
app.use("/api/students",studentRoutes);

// Connect faculty API routes
app.use("/api/faculty", facultyRoutes);

// Connect course APIs
app.use("/api/courses", courseRoutes);

// Connect attendance APIs
app.use("/api/attendance", attendanceRoutes);

// Connect notice APIs
app.use("/api/notices", noticeRoutes);

app.use("/api/dashboard", dashboardRoutes);

// Centralized error handling middleware
app.use(errorMiddleware);



// Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();