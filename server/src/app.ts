import express, { Express, NextFunction, Request, Response } from "express";
import ENV_VARIABLES from "./constants";

// middleware imports
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  errorHandler,
  notFoundHandler,
} from "middlewares/errorHandler.middleware";
import { apiLimiter, loginLimiter } from "middlewares/rateLimiter.middleware";

// server instance
const app: Express = express();

// applying middlewares
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

app.use(cors({ credentials: true, origin: ENV_VARIABLES.corsOrigin })); // middleware to allow frontend origin
app.use(express.json({ limit: ENV_VARIABLES.jsonLimit })); // middleware to handle json request payload
app.use(express.urlencoded({ extended: true })); // middleware to handle url request payload
app.use(cookieParser()); // middleware to handle cookies
app.use(compression()); // middleware to compress objects - improves performance
app.use(express.static("public")); // middleware to serve few static files
app.use(apiLimiter); // middleware to limit API calls
app.use(errorHandler); // middleware to handle errors
app.use(notFoundHandler); // middleware to handle 404 errors
app.use(requestLogger); // middleware to log requests

// router imports
import authRouter from "./routes/auth.routes";
import blogRouter from "./routes/blog.routes";
import commentRouter from "./routes/comment.routes";
import reportRouter from "./routes/report.routes";
import userRouter from "./routes/user.routes";
import { requestLogger } from "middlewares/logger.middleware";
import dashboardRouter from "routes/dashboard.routes";

// applying routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/dashboard", dashboardRouter);

export default app;
