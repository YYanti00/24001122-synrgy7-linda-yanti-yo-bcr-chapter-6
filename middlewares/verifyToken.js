import AuthService from "../services/authService.js";
import "dotenv/config";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login, there's no token" });
    }
    const decoded = await AuthService.decodedToken(
      token,
      process.env.SECRET_ACCESS_TOKEN
    );
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized. Please login" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const onlyAdmin = async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res
      .status(401)
      .json({ message: "Unauthorized. Not admin or superadmin" });
  }
  next();
};
