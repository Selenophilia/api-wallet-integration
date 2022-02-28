import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

export default class UsersController {
  public async getAllUser() {
    const user = await User.all();
    return user;
  }

  public async createUser(ctx: HttpContextContract) {
    const { request, response } = ctx;
    const { username, email, password } = request.body();
    try {
      const validations = schema.create({
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: "users", column: "email" }),
        ]),
      });

      const valid = await request.validate({ schema: validations });
      if (valid) {
        const user = await User.create({
          email,
          password,
          username,
        });
        return user;
      } else {
        return response.status(422).json({ error: "Email is already taken" });
      }
    } catch (error) {
      console.log(error);
      return response.status(422).json({ error: error });
    }
  }
}
