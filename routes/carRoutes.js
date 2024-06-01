import e from "express";
import { verifyToken, onlyAdmin } from "../middlewares/verifyToken.js";
import upload from "../middlewares/upload.js";
import {
  createCars,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";

const carRoutes = e.Router();

carRoutes.post("/", verifyToken, onlyAdmin, upload.single("image"), createCars);
carRoutes.get("/", verifyToken, getCars);
carRoutes.get("/:id", verifyToken, getCarById);
carRoutes.put(
  "/:id",
  verifyToken,
  onlyAdmin,
  upload.single("image"),
  updateCar
);
carRoutes.delete("/:id", verifyToken, onlyAdmin, deleteCar);

export default carRoutes;
