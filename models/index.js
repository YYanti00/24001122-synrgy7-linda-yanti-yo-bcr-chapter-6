import carModel from "./carModel.js";
import userModel from "./userModel.js";

userModel.hasMany(carModel, { foreignKey: "id" });

carModel.belongsTo(userModel, { foreignKey: "createdBy", as: "createdByUser" });
carModel.belongsTo(userModel, { foreignKey: "updatedBy", as: "updatedByUser" });
carModel.belongsTo(userModel, { foreignKey: "deletedBy", as: "deletedByUser" });
