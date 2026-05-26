import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import chatRoutes from "./routes/chatRoute.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

/* =========================
   MIDDLEWARE
========================= */

// CORS (local + production safe)
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true // same origin on Render
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

/*
   SERVE FRONTEND (PROD)
 */

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  //  FIX: use regex instead of "*"
  app.get(/.*/, (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}

/* 
   START SERVER
 */
 connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 
});
