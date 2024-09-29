import express, { Express, RequestHandler } from "express";
import ENV_VARIABLES from "./constants";

// middleware imports
import {
  errorHandler,
  notFoundHandler,
} from "@middlewares/errorHandler.middleware";
import {
  requestLogger,
  requestRecievedLogger,
} from "@middlewares/logger.middleware";
import { apiLimiter } from "@middlewares/rateLimiter.middleware";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";

// server instance
const app: Express = express();

// applying middlewares
const combinedMiddlewares: RequestHandler[] = [
  requestRecievedLogger, // middleware to console log requests recieved: DEBUG only

  cors({ credentials: true, origin: ENV_VARIABLES.corsOrigin }), // middleware to allow frontend origin
  express.json({ limit: ENV_VARIABLES.jsonLimit }), // middleware to handle json request payload
  express.urlencoded({ extended: true }), // middleware to handle url request payload
  cookieParser(), // middleware to handle cookies
  compression(), // middleware to compress objects - improves performance
  express.static("public"), // middleware to serve few static files
  apiLimiter, // middleware to limit API calls
  requestLogger, // middleware to log requests
];
app.use(combinedMiddlewares);

// router imports
import { publicRouter, authRouter } from "@routes/main.routes";
import { printRoutes } from "@utils/debug.util";

// applying routers
const baseEndpoint = "/api/v1";
app.use(baseEndpoint + "/public", publicRouter);
app.use(baseEndpoint + "/auth", authRouter);
app.all("*", notFoundHandler); // middleware to handle 404 errors

printRoutes(app._router); // DEBUG only
// error handlers
app.use(errorHandler); // middleware to handle errors

export default app;
