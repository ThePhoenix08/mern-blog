import rateLimit from "express-rate-limit";
import ENV_VARIABLES from "../constants";

export const apiLimiter = rateLimit({
  windowMs: ENV_VARIABLES.rateLimitDuration || 15 * 60 * 1000,
  max: ENV_VARIABLES.rateLimit || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

export const loginLimiter = rateLimit({
  windowMs: ENV_VARIABLES.loginLimitDuration || 60 * 60 * 1000,
  max: ENV_VARIABLES.loginLimit || 5,
  message: "Too many login attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});
