import AuthService from "../services/authService.js";
import userServices from "../services/userServices.js";
import bcrypt from "bcrypt";
import "dotenv/config";

export const createUser = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    let decoded = undefined;
    if (token) {
      decoded = await AuthService.decodedToken(
        token,
        process.env.SECRET_ACCESS_TOKEN
      );
    }
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password must be same" });
    }

    const checkEmail = await userServices.getUserbyEmail(email);
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (
      (!decoded && (role === "superadmin" || role === "admin")) ||
      (decoded &&
        decoded.role === "user" &&
        (role === "superadmin" || role === "admin"))
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized. Not admin or superadmin" });
    }
    if (
      !decoded ||
      (decoded && decoded.role === "user" && role === "user") ||
      decoded.role === "superadmin"
    ) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const data = {
        name,
        email,
        password: hashPassword,
        role,
      };
      await userServices.createUser(data);
      res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.getUserbyEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const accesstoken = await AuthService.signToken(
      user.id,
      user.email,
      user.role,
      process.env.SECRET_ACCESS_TOKEN,
      "1d"
    );
    const refreshToken = await AuthService.signToken(
      user.id,
      user.email,
      user.role,
      process.env.SECRET_REFRESH_TOKEN,
      "3d"
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const data = { refreshToken };
    await userServices.updateUser(user.id, data);

    return res
      .status(200)
      .json({ message: "Login success", token: accesstoken });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await userServices.getAllUsers();

    return res
      .status(200)
      .json({ message: "Successfully get users", data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await userServices.getUserById(req.user.id);
    res.status(200).json({ message: "Successfully get user", data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(204).json({
        status: false,
        message: "No Token",
      });
    }

    const user = await userServices.getUserRefreshToken(refreshToken);

    if (!user[0]) {
      return res.status(204).json({
        status: false,
        message: "No Token",
      });
    }

    await userServices.updateUser(user[0].id, { refreshToken: null });

    res.clearCookie("refreshToken");
    return res.status(200).json({
      status: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401);

    const user = await userServices.getUserRefreshToken(refreshToken);

    if (!user[0]) {
      return res.status(403).json({
        status: false,
        message: "No Refresh Token",
      });
    }

    const verifyToken = await AuthService.decodedToken(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN
    );
    if (!verifyToken) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized. Please login" });
    }
    const accessToken = await AuthService.signToken(
      user[0].id,
      user[0].name,
      user[0].role,
      process.env.SECRET_ACCESS_TOKEN,
      "1d"
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
