import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { DatabaseConnection } from "../../database/DatabaseConnection.js";
import { BOOK_STATUSES, type BookStatus } from "./book.types.js";

export class BookModel extends Model<InferAttributes<BookModel>, InferCreationAttributes<BookModel>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare author: string;
  declare isbn: string | null;
  declare status: CreationOptional<BookStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BookModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    author: { type: DataTypes.STRING(150), allowNull: false },
    isbn: { type: DataTypes.STRING(20), allowNull: true },
    status: { type: DataTypes.ENUM(...BOOK_STATUSES), allowNull: false, defaultValue: "DISPONIBLE" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: DatabaseConnection.getInstance().sequelize, tableName: "books" },
);
