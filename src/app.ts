import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import personRouter from "./routes/persons.routes";
import postRouter from "./routes/post.routes";
import userRouter from "./routes/user.routes";
import { initializeDatabase } from "./db";

const app: Application = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["http://localhost:3010", "http://81.177.217.57:3010"], // Allowed origins
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    exposedHeaders: ["set-cookie"], // Expose headers to the client
  }),
);
app.use(express.json());
app.use("/api", personRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
