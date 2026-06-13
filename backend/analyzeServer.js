import "dotenv/config";
import express from "express";
import cors from "cors";
import { startSuspiciousMode } from "./suspicious_mode/suspiciousController.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "200mb" }));

app.post("/analyze", async (req, res) => {
  const { videoBase64, mimeType } = req.body;
  try {
    const result = await startSuspiciousMode({ videoBase64, mimeType });
    res.json(result);
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Analyze server running on http://localhost:3001"));
