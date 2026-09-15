require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);

let feedbackCollection;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);
        feedbackCollection = db.collection("feedback");

        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.log("MongoDB connection failed:", err);
    }
}

connectDB();

// Feedback submit route
app.post("/feedback", async (req, res) => {

    const { name, email, feedback } = req.body;

    try {
        await feedbackCollection.insertOne({
            name: name,
            email: email,
            feedback: feedback,
            createdAt: new Date()
        });

        res.json({
            message: "Feedback submitted successfully!"
        });

    } catch (err) {
        console.log("Database error:", err);

        res.status(500).json({
            message: "Failed to save feedback"
        });
    }
});

// Get all feedback
app.get("/feedbacks", async (req, res) => {

    try {
        const feedbacks = await feedbackCollection
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.json(feedbacks);

    } catch (err) {
        console.log("Database error:", err);

        res.status(500).json({
            message: "Failed to fetch feedback"
        });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});