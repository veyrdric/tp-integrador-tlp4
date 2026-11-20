import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "sequelize";
import { DatabaseConnection } from "../../database/DatabaseConnection.js";
import type { BookModel } from "../books/Book.js";
import type { UserModel } from "../users/User.js";

export class SubscriptionModel extends Model<
  InferAttributes<SubscriptionModel>,
  InferCreationAttributes<SubscriptionModel>
> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<UserModel["id"]>;
  declare bookId: ForeignKey<BookModel["id"]>;
  declare user?: NonAttribute<UserModel>;
  declare createdAt: CreationOptional<Date>;
}

SubscriptionModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize: DatabaseConnection.getInstance().sequelize,
    tableName: "subscriptions",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["userId", "bookId"] }],
  },
);
