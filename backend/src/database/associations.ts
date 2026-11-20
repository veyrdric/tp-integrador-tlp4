import { BookModel } from "../modules/books/Book.js";
import { NotificationModel } from "../modules/notifications/Notification.js";
import { PermissionModel } from "../modules/roles/Permission.js";
import { RoleModel } from "../modules/roles/Role.js";
import { SubscriptionModel } from "../modules/subscriptions/Subscription.js";
import { UserModel } from "../modules/users/User.js";

export function defineAssociations(): void {
  RoleModel.belongsToMany(PermissionModel, { through: "role_permissions", as: "permissions", timestamps: false });
  PermissionModel.belongsToMany(RoleModel, { through: "role_permissions", as: "roles", timestamps: false });

  RoleModel.hasMany(UserModel, { foreignKey: { name: "roleId", allowNull: false } });
  UserModel.belongsTo(RoleModel, { foreignKey: { name: "roleId", allowNull: false }, as: "role" });

  UserModel.hasMany(SubscriptionModel, { foreignKey: { name: "userId", allowNull: false }, onDelete: "CASCADE" });
  SubscriptionModel.belongsTo(UserModel, { foreignKey: { name: "userId", allowNull: false }, as: "user" });
  BookModel.hasMany(SubscriptionModel, { foreignKey: { name: "bookId", allowNull: false }, onDelete: "CASCADE" });
  SubscriptionModel.belongsTo(BookModel, { foreignKey: { name: "bookId", allowNull: false } });

  UserModel.hasMany(NotificationModel, { foreignKey: { name: "userId", allowNull: false }, onDelete: "CASCADE" });
  NotificationModel.belongsTo(UserModel, { foreignKey: { name: "userId", allowNull: false } });
  BookModel.hasMany(NotificationModel, { foreignKey: { name: "bookId", allowNull: true }, onDelete: "SET NULL" });
  NotificationModel.belongsTo(BookModel, { foreignKey: { name: "bookId", allowNull: true } });
}
