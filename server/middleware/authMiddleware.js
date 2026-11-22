
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check whether token exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. Please login first."
        });
    }

    // Extract token after Bearer
    const token = authHeader.split(" ")[1];

    try {
        // Verify token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach logged-in admin details to request
        req.user = decoded;

        // Allow request to continue
        next();
    } catch (error) {
        // Reject invalid or expired tokens
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;
