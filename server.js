import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

const app = express();
app.use(express.json({ limit: "200mb" }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("AI Video Builder is running 🚀");
});

app.post("/render", async (req, res) => {
  try {
    const { scenes } = req.body;

    if (!scenes || !Array.isArray(scenes)) {
      return res.status(400).json({ error: "Scenes array required" });
    }

    const outputDir = "./output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Save images
    scenes.forEach((scene, index) => {
      const imageBase64 = scene.image;
      const audioBase64 = scene.audio;

      if (imageBase64) {
        fs.writeFileSync(
          `${outputDir}/image${index}.png`,
          Buffer.from(imageBase64, "base64")
        );
      }

      if (audioBase64) {
        fs.writeFileSync(
          `${outputDir}/audio${index}.mp3`,
          Buffer.from(audioBase64, "base64")
        );
      }
    });

    // Example FFmpeg command placeholder
    exec(
      `ffmpeg -y -framerate 1 -i ${outputDir}/image%d.png -c:v libx264 -pix_fmt yuv420p ${outputDir}/final.mp4`,
      (error) => {
        if (error) {
          return res.status(500).json({ error: "FFmpeg failed" });
        }

        res.json({ message: "Video created", path: "/output/final.mp4" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
