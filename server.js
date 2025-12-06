const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// Load flags
let flags = JSON.parse(fs.readFileSync("./flags.json", "utf8"));

// GET all feature flags
app.get("/flags", (req, res) => {
res.json(flags);
});

// GET a single feature flag by key
app.get("/flags/:key", (req, res) => {
const flag = flags[req.params.key];
if (!flag) {
return res.status(404).json({ error: "Flag not found" });
}
res.json({ key: req.params.key, enabled: flag });
});

// CREATE or UPDATE a flag
app.post("/flags/:key", (req, res) => {
const { enabled } = req.body;

if (typeof enabled !== "boolean") {
return res.status(400).json({ error: "enabled must be true or false" });
}

flags[req.params.key] = enabled;

fs.writeFileSync("./flags.json", JSON.stringify(flags, null, 2));

res.json({ message: "Flag updated", key: req.params.key, enabled });
});

// DELETE a flag
app.delete("/flags/:key", (req, res) => {
if (!flags[req.params.key]) {
return res.status(404).json({ error: "Flag not found" });
}

delete flags[req.params.key];

fs.writeFileSync("./flags.json", JSON.stringify(flags, null, 2));

res.json({ message: "Flag removed" });
});

app.listen(3000, () => console.log("Feature Flag Service running on port 3000"));
