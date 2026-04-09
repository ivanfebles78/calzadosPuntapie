import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const port = process.env.PORT || 8080;

const candidates = [
  path.resolve("dist"),
  path.resolve("frontend/dist"),
  path.join(process.cwd(), "dist"),
  path.join(process.cwd(), "frontend", "dist"),
];

const distPath = candidates.find((candidate) =>
  fs.existsSync(path.join(candidate, "index.html"))
);

console.log("Checked paths:", candidates);

if (!distPath) {
  console.error("Could not find dist/index.html");
  process.exit(1);
}

console.log("Serving files from:", distPath);

app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Frontend running on port ${port}`);
});