import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// ✅ Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Root route (visible on Render homepage)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Learning Platform Backend</title>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            background: #0f172a; 
            color: #f8fafc; 
            text-align: center; 
            padding: 50px; 
          }
          h1 { color: #38bdf8; }
          p { color: #94a3b8; }
        </style>
      </head>
      <body>
        <h1>🚀 Learning Platform Backend</h1>
        <p>Status: <strong>✅ Running Successfully</strong></p>
        <p>Environment: ${process.env.NODE_ENV || "development"}</p>
        <p>Version: 1.0.0</p>
      </body>
    </html>
  `);
});

// ✅ Fetch all courses
app.get("/courses", async (req, res) => {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching courses:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add progress for a user
app.post("/progress", async (req, res) => {
  try {
    const { user_id, course_id, progress } = req.body;

    if (!user_id || !course_id || progress == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("progress")
      .insert([{ user_id, course_id, progress }]);

    if (error) throw error;

    res.json({ message: "Progress saved successfully", data });
  } catch (error) {
    console.error("❌ Error saving progress:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Run the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
