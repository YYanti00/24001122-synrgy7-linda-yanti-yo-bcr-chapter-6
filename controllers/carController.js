import carService from "../services/carService.js";
import fs from "fs";
import path from "path";

export const createCars = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "File upload failed" });
    }
    const { name, size, rentPerDay } = req.body;

    const createdBy = req.user.id;
    const image = req.file.filename;

    const data = {
      name,
      size,
      rentPerDay,
      image,
      createdBy,
    };
    const newCars = await carService.createCar(data);
    if (newCars) {
      await newCars.save();
      console.log("Data saved..");
    } else {
      console.log("Data not saved!...");
    }
    return res
      .status(201)
      .json({ status: true, message: "Cars successfully create" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await carService.getAllCars();

    res.status(200).json({ message: "Successfully get cars", data: cars });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car_id = parseInt(req.params.id);
    const car = await carService.getCarById(car_id);
    return res.status(200).json({
      status: true,
      message: "Success fetch car by id",
      data: car,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBy = req.user.id;

    const check = await carService.getCarById(id);

    if (!check || check.isDelete == true) {
      return res.status(404).json({ status: false, message: "Car not found" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "File upload failed" });
    }
    const { name, size, rentPerDay, status = check.status, image } = req.body;

    if (req.file) {
      const imagePath = path.join("./public/upload", check.image);
      try {
        fs.unlinkSync(imagePath);
        console.log("Previous image deleted successfully.");
      } catch (err) {
        console.error("Failed to delete previous image:", err);
      }
    }

    const data = {
      name,
      size,
      rentPerDay,
      status,
      image: req.file.filename,
      updatedBy,
    };
    await carService.updateCar(id, data);

    return res
      .status(200)
      .json({ status: true, message: "Car updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await carService.getCarById(id);
    const deletedBy = req.user.id;
    const isDelete = true;

    if (!car) {
      return res.status(404).json({ status: false, message: "Car not found" });
    }

    const imagePath = path.join("./public/upload", car.image);
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

    const carDelete = await car.update(
      { deletedBy, isDelete },
      { where: { id } }
    );
    // const carDelete = await car.destroy(id);
    if (carDelete) {
      return res
        .status(200)
        .json({ status: true, message: "Car deleted successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
