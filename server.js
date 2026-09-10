const express = require("express");
const mysql = require("mysql2");

const app = express();

// JSON data receive ചെയ്യാൻ
app.use(express.json());

// Frontend files serve ചെയ്യാൻ
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2333",
    database: "feedback_db"
});

// Database connect ചെയ്യുന്നു
db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully!");
});

// Feedback submit route
app.post("/feedback", (req, res) => {

    const { name, email, feedback } = req.body;

    const sql = `
        INSERT INTO feedback (name, email, feedback)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, feedback], (err, result) => {

        if (err) {
            console.log("Database error:", err);
            return res.status(500).json({
                message: "Failed to save feedback"
            });
        }

        res.json({
            message: "Feedback submitted successfully!"
        });
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});