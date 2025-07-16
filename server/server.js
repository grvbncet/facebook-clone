import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import db from "./models/index.js";
import dotenv from "dotenv";
import cors from "cors";
import cleanupExpiredTokens from "./utils/tokenCleanup.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import likeRoutes from "./routes/like.routes.js";
import friendRequestRoutes from "./routes/friendrequest.routes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
// Serve uploads folder statically
app.use("/uploads", express.static(path.resolve("uploads"))); // Now, uploaded files will be available at http://localhost:PORT/uploads/filename.jpg

const allowedOrigins = [process.env.FRONT_END_URL]; // your frontend URL

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you want to allow cookies
  })
);

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/friends", friendRequestRoutes);

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("Database Connection has been established successfully.");
    await db.sequelize.sync({ alter: true });
    console.log("The all models are synchecd now");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Unable to connect to the database:", error);
    process.exit(1); // exit with failure code
  }
}

cleanupExpiredTokens();

startServer();
