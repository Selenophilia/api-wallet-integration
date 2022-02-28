import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  beforeSave,
} from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import Encryption from "@ioc:Adonis/Core/Encryption";

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, { foreignKey: "userId" })
  public user: BelongsTo<typeof User>;

  @column()
  public userId: number;

  @column()
  public privateKey: string;

  @column()
  public publicKey: string;

  @beforeSave()
  public static async EncryptPrivateKey(wallet: Wallet) {
    if (wallet.$dirty.privateKey) {
      wallet.privateKey = Encryption.encrypt(wallet.privateKey);
    }
  }
}
