import {
  DataTypes,
  type BelongsToManySetAssociationsMixin,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "sequelize";
import { DatabaseConnection } from "../../database/DatabaseConnection.js";
import type { PermissionModel } from "./Permission.js";

export class RoleModel extends Model<InferAttributes<RoleModel>, InferCreationAttributes<RoleModel>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare permissions?: NonAttribute<PermissionModel[]>;
  declare setPermissions: BelongsToManySetAssociationsMixin<PermissionModel, number>;
}

RoleModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  },
  { sequelize: DatabaseConnection.getInstance().sequelize, tableName: "roles", timestamps: false },
);
