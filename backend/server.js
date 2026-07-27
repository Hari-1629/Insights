import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load .env located next to this file (works even if cwd is different)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");
console.log("🔍 Loading .env from:", envPath);
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.warn("⚠️  dotenv error:", dotenvResult.error.message);
}

// Diagnostic: print what was loaded
console.log("📋 Loaded env vars:");
const keys = ["PORT", "MONGO_URI", "GEMINI_API_KEY", "PINECONE_API_KEY", "PINECONE_INDEX"];
keys.forEach(k => {
  const val = process.env[k];
  if (val) {
    const display = val.includes("://") ? val.substring(0, 50) + "..." : val;
    console.log(`  ✓ ${k}: ${display}`);
  } else {
    console.log(`  ✗ ${k}: MISSING`);
  }
});

const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
