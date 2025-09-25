
const express=require('express');
const axios=require('axios');
const cors=require('cors');

require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

app.post("/generate", async (req, res) => {
  try {
    const {prompt} = req.body; // coming from frontend
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const output = response.data.candidates[0].content.parts[0].text;
    res.json({ output });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
