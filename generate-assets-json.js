const fs = require("fs");

const manifest = JSON.parse(fs.readFileSync("./manifest.json", "utf-8"));
const icons = manifest.icons.map((icon) => icon.src);

const assetsToCache = [
  "/", // always include root
  "/index.html",
  "/manifest.json",
  "/style.css",
  "/main.js",
  ...icons, // pull icons from manifest automatically
];

fs.writeFileSync("./assets-to-cache.json", JSON.stringify(assetsToCache, null, 2));
console.log("✅ Generated assets-to-cache.json with", assetsToCache.length, "items.");
