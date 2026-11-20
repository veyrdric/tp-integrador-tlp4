import { AppError } from "../../shared/AppError.js";
import type { IRoleRepository } from "../roles/IRoleRepository.js";
import type { Role, RoleName } from "../roles/role.types.js";
import type { IUserRepository } from "./IUserRepository.js";
import type { User } from "./user.types.js";

export class UserService {
  constructor(
    private readonly users: IUserRepository,
    private readonly roles: IRoleRepository,
  ) {}

  findAll(): Promise<User[]> {
    return this.users.findAll();
  }

  findRoles(): Promise<Role[]> {
    return this.roles.findAll();
  }

  async assignRole(userId: string, role: RoleName): Promise<User> {
    const user = await this.users.updateRole(userId, role);
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "El usuario no existe");
    return user;
  }
}
