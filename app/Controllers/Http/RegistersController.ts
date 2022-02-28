import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ethers as EtherWallet } from "ethers";
import User from "App/Models/User";
import Wallet from "App/Models/Wallet";
import Env from "@ioc:Adonis/Core/Env";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

export default class RegistersController {
  public async register(ctx: HttpContextContract) {
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
        const res = EtherWallet.Wallet.createRandom();
        const provider = new EtherWallet.providers.JsonRpcProvider(
          "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        );

        const wallet = await Wallet.create({
          userId: user.id,
          privateKey: res.privateKey,
          publicKey: res.publicKey,
        });

        let signWallet = new EtherWallet.Wallet(
          Env.get("private_key"),
          provider
        );

        let amountInEther = "0.01";

        let tx = {
          to: res.address,
          value: EtherWallet.utils.parseEther(amountInEther),
        };
        const result = await signWallet.sendTransaction(tx);

        return response.status(200).json({ user, wallet, hash: result });
      } else {
        return;
      }
    } catch (error) {
      return response.status(422).json({ error: error });
    }
  }
}
