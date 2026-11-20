import { PermissionModel } from "../roles/Permission.js";
import { RoleModel } from "../roles/Role.js";
import { isRoleName, type PermissionCode, type RoleName } from "../roles/role.types.js";
import type { IUserRepository } from "./IUserRepository.js";
import { UserModel } from "./User.js";
import type { NewUser, SessionUser, User, UserWithPassword } from "./user.types.js";

function toUser(model: UserModel): User {
  const role = model.role?.name;
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    role: isRoleName(role) ? role : "usuario",
    createdAt: model.createdAt.toISOString(),
  };
}

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const users = await UserModel.findAll({ include: [{ model: RoleModel, as: "role" }], order: [["createdAt", "ASC"]] });
    return users.map(toUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id, { include: [{ model: RoleModel, as: "role" }] });
    return user ? toUser(user) : null;
  }

  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    const user = await UserModel.findOne({ where: { email }, include: [{ model: RoleModel, as: "role" }] });
    return user ? { ...toUser(user), passwordHash: user.passwordHash } : null;
  }

  async findSessionUser(id: string): Promise<SessionUser | null> {
    const user = await UserModel.findByPk(id, {
      include: [{ model: RoleModel, as: "role", include: [{ model: PermissionModel, as: "permissions" }] }],
    });
    if (!user) return null;
    const permissions = (user.role?.permissions ?? []).map((p) => p.code as PermissionCode);
    return { ...toUser(user), permissions };
  }

  async create(newUser: NewUser): Promise<User> {
    const role = await RoleModel.findOne({ where: { name: newUser.role } });
    if (!role) throw new Error(`No existe el rol ${newUser.role}. ¿Se corrió el seed?`);
    const user = await UserModel.create({
      name: newUser.name,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      roleId: role.id,
    });
    user.role = role;
    return toUser(user);
  }

  async updateRole(id: string, roleName: RoleName): Promise<User | null> {
    const role = await RoleModel.findOne({ where: { name: roleName } });
    const user = await UserModel.findByPk(id);
    if (!role || !user) return null;
    user.roleId = role.id;
    await user.save();
    user.role = role;
    return toUser(user);
  }
}
