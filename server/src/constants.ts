import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const requiredEnvVars = ["PORT", "MONGO_URI", "CORS_ORIGIN"];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`⚠️ Environment variable ${varName} is missing.`);
  }
});

const ENV_VARIABLES = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/your-app",
  corsOrigin: process.env.CORS_ORIGIN,

  // jwt
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,

  // cloudinary service
  cloudinaryKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryName: process.env.CLOUD_NAME,

  jsonLimit: "16kb", // express.json
  saltRounds: 10, // bcrypt
  fileUploadSizeLimit: 1 * 1024 * 1024,
};

export default ENV_VARIABLES;
