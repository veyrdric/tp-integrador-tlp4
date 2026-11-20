import type { IRoleRepository } from "./IRoleRepository.js";
import { PermissionModel } from "./Permission.js";
import { RoleModel } from "./Role.js";
import { isRoleName, type PermissionCode, type Role } from "./role.types.js";

export class RoleRepository implements IRoleRepository {
  async findAll(): Promise<Role[]> {
    const roles = await RoleModel.findAll({
      include: [{ model: PermissionModel, as: "permissions" }],
      order: [["id", "ASC"]],
    });
    return roles
      .filter((role) => isRoleName(role.name))
      .map((role) => ({
        name: role.name as Role["name"],
        permissions: (role.permissions ?? []).map((p) => p.code as PermissionCode),
      }));
  }
}
