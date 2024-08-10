import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "CORS_ORIGIN",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`⚠️ Environment variable ${varName} is missing.`);
  }
});

const ENV_VARIABLES = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mern-blog", // fallback
  localUri: "mongodb://localhost:27017/mern-blog",
  corsOrigin: process.env.CORS_ORIGIN,
  nodeEnv: process.env.NODE_ENV || "development",

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
  rateLimit: 100, // Limit each IP to 100 requests per windowMs
  rateLimitDuration: 15 * 60 * 1000, // 15 minutes
  loginLimit: 5, // Limit each IP to 5 login requests per hour
  loginLimitDuration: 60 * 60 * 1000, // 1 hour
  blogImagesLimit: 5, // multer

  cronJobsInterval: "0 0 * * *", // Every day at midnight
  expireAfterOrphandedBlogs: 86400 * 7, // 7 days
  expireAfterOrphandedOthers: 86400, // 1 day
};

export default ENV_VARIABLES;
