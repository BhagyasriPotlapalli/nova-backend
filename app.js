import express from "express";


//import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { execSync } from "child_process";

import userRoutes from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";
import xRobotsAllApi from "./utils/xRobotFun.js";



//console.log("checking app.js before");
const app = express();
app.use(express.json());
app.use(xRobotsAllApi);
//app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// app.use(express.json({ limit: "200mb" }));

// // Parse URL-encoded bodies (max 200MB, extended for nested objects, large params)
// app.use(express.urlencoded({ 
//   limit: "200mb", 
//   extended: true, 
//   parameterLimit: 50000 
// }));
//console.log("checking app.js after")
app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the backend, now cached by data!' });
});
// app.get('/api/data', (req, res) => {
//   res.json({ message: 'Hello from the backend, now cached by BunnyCDN!' });
// });


////////////////////////////// user paths ///////////////////////////////////////////
app.use("/api", express.static(path.join(__dirname)));
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRouter);
app.use("/api/student", studentRouter);
app.use("/api/subscription", subscriptionRouter);


export default app;