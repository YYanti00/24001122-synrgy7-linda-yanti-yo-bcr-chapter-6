import express from "express";
import db from "./config/database.js";
import "./models/index.js";
import carRoutes from "./routes/carRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import CookieParser from "cookie-parser";
import env from "dotenv";
env.config();

try {
  await db.authenticate();
  await db.sync();
} catch (error) {
  console.log(error.message);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(CookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api_v1/cars", carRoutes);
app.use("/api_v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server jalan diport ${port}`);
});
