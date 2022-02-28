import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public userId: number;

  @belongsTo(() => User, { foreignKey: "userId" })
  public user: BelongsTo<typeof User>;

  @column()
  public token: string;

  @column()
  public type: string;

  @column()
  public name: string;
}
