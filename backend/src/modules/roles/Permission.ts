import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { DatabaseConnection } from "../../database/DatabaseConnection.js";

export class PermissionModel extends Model<
  InferAttributes<PermissionModel>,
  InferCreationAttributes<PermissionModel>
> {
  declare id: CreationOptional<number>;
  declare code: string;
}

PermissionModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  },
  { sequelize: DatabaseConnection.getInstance().sequelize, tableName: "permissions", timestamps: false },
);
