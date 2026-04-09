import express from "express";
import path from "path";

const app = express();
const port = process.env.PORT || 8080;

const distPath = path.join(process.cwd(), "frontend", "dist");

console.log("Serving files from:", distPath);

app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Frontend running on port ${port}`);
});