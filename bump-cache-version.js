const fs = require("fs");

const swPath = "./service-worker.js"; // Adjust if needed
let content = fs.readFileSync(swPath, "utf8");

const cacheRegex = /const CACHE_NAME = "(my-pwa-cache-v)(\d+)"/;

if (cacheRegex.test(content)) {
  content = content.replace(cacheRegex, (match, prefix, version) => {
    const newVersion = parseInt(version, 10) + 1;
    console.log(`🔁 Bumping cache version: ${prefix}${version} → ${prefix}${newVersion}`);
    return `const CACHE_NAME = "${prefix}${newVersion}"`;
  });

  fs.writeFileSync(swPath, content, "utf8");
  console.log("✅ service-worker.js updated successfully.");
} else {
  console.error("❌ CACHE_NAME pattern not found. Make sure it matches the expected format.");
}
