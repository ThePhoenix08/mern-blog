import winston from "winston";
import ENV_VARIABLES from "../constants";
import { Request, Response, NextFunction } from "express";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: ENV_VARIABLES.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "blog-api" },
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/%DATE%.error.log",
      level: "error",
    }),
    new winston.transports.DailyRotateFile({
      filename: "logs/%DATE%.combined.log",
    }),
  ],
});

if (ENV_VARIABLES.nodeEnv !== "production") {
  logger.add(
    new winston.transports.DailyRotateFile({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`, {
    headers: req.headers,
    query: req.query,
    body: req.body,
  });
  next();
};

export { requestLogger, logger };
