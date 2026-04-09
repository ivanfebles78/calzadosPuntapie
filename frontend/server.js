import express from "express";
import path from "path";

const app = express();
const distPath = path.resolve("dist");

app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`Frontend running on port ${port}`);
  console.log(`Serving files from: ${distPath}`);
});