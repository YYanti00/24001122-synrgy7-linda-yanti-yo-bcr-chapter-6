import carModel from "../models/carModel.js";

class carService {
  constructor(carModel) {
    this.carModel = carModel;
  }

  async createCar(data) {
    await this.carModel.create(data);
  }

  async getAllCars() {
    return await this.carModel.findAll({
      where: { isDelete: false },
      attributes: { exclude: ["createdBy", "updatedBy", "deletedBy"] },
      include: [
        {
          association: "createdByUser",
          attributes: ["id", "email", "name", "role"],
        },
        {
          association: "updatedByUser",
          attributes: ["id", "email", "name", "role"],
        },
        {
          association: "deletedByUser",
          attributes: ["id", "email", "name", "role"],
        },
      ],
    });
  }

  async getCarById(id) {
    return await this.carModel.findByPk(id, {
      attributes: { exclude: ["createdBy", "updatedBy", "deletedBy"] },
      include: [
        {
          association: "createdByUser",
          attributes: ["id", "email", "name", "role"],
        },
        {
          association: "updatedByUser",
          attributes: ["id", "email", "name", "role"],
        },
        {
          association: "deletedByUser",
          attributes: ["id", "email", "name", "role"],
        },
      ],
    });
  }

  async updateCar(id, data) {
    await this.carModel.update(data, { where: { id } });
  }

  async deleteCar(id) {
    await this.carModel.destroy({ where: { id } });
  }
}

const CarService = new carService(carModel);
export default CarService;
