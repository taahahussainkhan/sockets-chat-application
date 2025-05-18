import express from "express";
import authRoute from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);


const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());


app.use(express.urlencoded({ extended: true }));

app.use(cors());



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
