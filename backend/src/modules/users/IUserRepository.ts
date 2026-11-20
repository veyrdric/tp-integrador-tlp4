import type { RoleName } from "../roles/role.types.js";
import type { NewUser, SessionUser, User, UserWithPassword } from "./user.types.js";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
  findSessionUser(id: string): Promise<SessionUser | null>;
  create(user: NewUser): Promise<User>;
  updateRole(id: string, role: RoleName): Promise<User | null>;
}
