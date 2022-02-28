import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApiToken from "App/Models/ApiToken";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";

export default class AuthController {
  public async login(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;
    const email = request.input("email");
    const username = request.input("username");
    const password = request.input("password");

    try {
      let user: User | null;

      if (username) {
        user = await User.findBy("username", username);
      } else {
        user = await User.findBy("email", email);
      }
      if (user) {
        if (!(await Hash.verify(user.password, password))) {
          return response.badRequest("Invalid credentials");
        }

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
      return response.badRequest("Invalid credentials");
    } catch {
      return response.badRequest("Invalid credentials");
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
