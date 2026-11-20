import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { DatabaseConnection } from "../../database/DatabaseConnection.js";
import { BOOK_STATUSES, type BookStatus } from "../books/book.types.js";
import type { UserModel } from "../users/User.js";

export class NotificationModel extends Model<
  InferAttributes<NotificationModel>,
  InferCreationAttributes<NotificationModel>
> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<UserModel["id"]>;
  // Si el libro se borra, la notificación queda con el título guardado.
  declare bookId: string | null;
  declare bookTitle: string;
  declare previousStatus: BookStatus;
  declare newStatus: BookStatus;
  declare message: string;
  declare read: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
}

NotificationModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookId: { type: DataTypes.UUID, allowNull: true },
    bookTitle: { type: DataTypes.STRING(200), allowNull: false },
    previousStatus: { type: DataTypes.ENUM(...BOOK_STATUSES), allowNull: false },
    newStatus: { type: DataTypes.ENUM(...BOOK_STATUSES), allowNull: false },
    message: { type: DataTypes.STRING(300), allowNull: false },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: DataTypes.DATE,
  },
  { sequelize: DatabaseConnection.getInstance().sequelize, tableName: "notifications", updatedAt: false },
);
