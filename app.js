import express from "express";
import userRoutes from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";


const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRouter);

export default app;