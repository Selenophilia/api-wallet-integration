import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  hasOne,
  HasOne,
  BaseModel,
} from "@ioc:Adonis/Lucid/Orm";
import Wallet from "./Wallet";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column()
  public username: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @hasOne(() => Wallet)
  public wallet: HasOne<typeof Wallet>;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
