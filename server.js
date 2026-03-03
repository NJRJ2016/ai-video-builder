import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("AI Video Builder is running 🚀");
});

app.post("/generate-script", async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a YouTube documentary script writer." },
        { role: "user", content: `Write a compelling documentary script about: ${topic}` }
      ],
    });

    res.json({
      script: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
