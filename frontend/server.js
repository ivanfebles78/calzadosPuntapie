import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(process.cwd(), "dist");

console.log("Serving files from:", distPath);

app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});