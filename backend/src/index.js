import express from "express";
import authRoute from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 3000;


const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());



app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
