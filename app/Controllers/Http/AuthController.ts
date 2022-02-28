import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApiToken from "App/Models/ApiToken";
import User from "App/Models/User";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";

export default class AuthController {
  public async login(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;
    const { username, email, password } = request.body();
    try {
      let user: User | null;
      if (username) {
        user = await User.findBy("username", username);
      } else {
        user = await User.findBy("email", email);
      }
      if (user) {
        const isRevoked = await ApiToken.query().where("user_id", "=", user.id);
        if (isRevoked.length !== 0) {
          return response.json("user is already logged in");
        } else {
          let token: OpaqueTokenContract<User>;
          if (username) {
            token = await auth.use("api").attempt(username, password);
          } else {
            token = await auth.use("api").attempt(email, password);
          }
          return token.toJSON();
        }
      }
      return response.status(422).json({ error: "Invalid credentials" });
    } catch {
      return response
        .status(422)
        .json({ error: "An error occured please try again" });
    }
  }
  public async logout(ctx: HttpContextContract) {
    const { response, auth } = ctx;
    try {
      await auth.use("api").revoke();
      return response.json({ message: "User Log out!" });
    } catch (e) {
      return response.badRequest("Invalid credentials");
    }
  }
}
