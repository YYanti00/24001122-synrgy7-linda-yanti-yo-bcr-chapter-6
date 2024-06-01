import e from "express";
import {
  createUser,
  loginUser,
  getUsers,
  logout,
  me,
  refreshToken,
} from "../controllers/userController.js";
import { verifyToken, onlyAdmin } from "../middlewares/verifyToken.js";

const userRoutes = e.Router();

userRoutes.post("/register", createUser);
userRoutes.post("/register/admin", verifyToken, onlyAdmin, createUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/", verifyToken, onlyAdmin, getUsers);
userRoutes.get("/me", verifyToken, me);
userRoutes.get("/token", refreshToken);
userRoutes.delete("/logout", verifyToken, logout);

export default userRoutes;
