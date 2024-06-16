// imports packages
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// file imports
import connectDB from "./config/db.js";

//routes import
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";

// dotenv config
dotenv.config();

// mongoDB connection
connectDB();

// Rest Object
const app = express(); // All features of express are in app variable

// middlewares
// The express. json() function is a middleware function used in Express. js applications to parse incoming JSON data from HTTP requests, a standard format for data transmission in web servers.
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

// validation middleware
app.use(errorMiddleware);

// PORT
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.DEV_MODE} Mode On Port No. ${PORT}`
  );
});
