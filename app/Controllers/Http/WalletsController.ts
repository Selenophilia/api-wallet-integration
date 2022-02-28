import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ethers as EtherWallet } from "ethers";
import Env from "@ioc:Adonis/Core/Env";
import Wallet from "App/Models/Wallet";
import Encryption from "@ioc:Adonis/Core/Encryption";

export default class WalletsController {
  public async store(ctx: HttpContextContract) {
    const { auth, request } = ctx;
    const { id } = request.body();
    const abi = [
      {
        inputs: [],
        name: "retrieve",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "num",
            type: "uint256",
          },
        ],
        name: "store",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const user = await auth.use("api").authenticate();
    const wallet = await Wallet.findBy("user_id", user.id);
    if (wallet) {
      const decryptKey: string | null = Encryption.decrypt(wallet.privateKey);
      const provider = new EtherWallet.providers.JsonRpcProvider(
        "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
      );

      if (decryptKey) {
        const newWallet = new EtherWallet.Wallet(decryptKey, provider);
        const contract = new EtherWallet.Contract(
          Env.get("store_address"),
          abi,
          newWallet
        );

        const convertRes = EtherWallet.BigNumber.from(
          await provider.getBalance(newWallet.address)
        );

        if (EtherWallet.utils.formatUnits(convertRes)) {
          const transction = await contract.store(
            EtherWallet.utils.parseEther(id)
          );
          await transction.wait();
          return { transction };
        }
      }
    }
  }

  public async retrieve(ctx: HttpContextContract) {
    const { auth } = ctx;
    const abi = [
      {
        inputs: [],
        name: "retrieve",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "num",
            type: "uint256",
          },
        ],
        name: "store",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const user = await auth.use("api").authenticate();
    const wallet = await Wallet.findBy("user_id", user.id);
    if (wallet) {
      const decryptKey: string | null = Encryption.decrypt(wallet.privateKey);
      const provider = new EtherWallet.providers.JsonRpcProvider(
        "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
      );

      if (decryptKey) {
        const newWallet = new EtherWallet.Wallet(decryptKey, provider);
        const contract = new EtherWallet.Contract(
          Env.get("store_address"),
          abi,
          newWallet
        );

        const res = await contract.retrieve();
        const bigNum = EtherWallet.BigNumber.from(res);

        return { data: EtherWallet.utils.formatUnits(bigNum, "ether") };
      }
    }
  }
}
