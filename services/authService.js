import jwt from "jsonwebtoken";
class authService {
  async decodedToken(token, secretToken) {
    return await jwt.verify(token, secretToken);
  }

  async signToken(id, email, role, secretToken, expired) {
    return await jwt.sign({ id: id, email: email, role: role }, secretToken, {
      expiresIn: expired,
    });
  }
}

const AuthService = new authService();
export default AuthService;
