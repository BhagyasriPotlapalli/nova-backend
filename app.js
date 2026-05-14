import express from "express";
import userRoutes from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import studentRouter from "./routes/studentRoutes.js";


const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRouter);
app.use("/api/student", studentRouter);

export default app;