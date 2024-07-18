import { Request, Response } from "express";
import connectDB from "./db/connectDB";
import ENV_VARIABLES from "./constants";
import app from "./app";

// connecting server - database
connectDB();
const PORT: string | number = ENV_VARIABLES.port || 4000;

// health route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

// server start
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
