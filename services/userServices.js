import userModel from "../models/userModel.js";

class userService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async createUser(data) {
    await this.userModel.create(data);
  }

  async getAllUsers() {
    return await this.userModel.findAll({
      attributes: ["id", "name", "email", "role"],
    });
  }

  async getUserById(id) {
    return await this.userModel.findByPk(id, {
      attributes: ["id", "name", "email", "role"],
    });
  }

  async getUserbyEmail(email) {
    return await this.userModel.findOne({ where: { email } });
  }

  async getUserRefreshToken(refreshToken) {
    return await userModel.findAll({
      where: {
        refreshToken: refreshToken,
      },
    });
  }

  async updateUser(id, data) {
    await this.userModel.update(data, { where: { id } });
  }

  async deleteUser(id) {
    await this.userModel.destroy({ where: { id } });
  }
}

const userServices = new userService(userModel);

export default userServices;
