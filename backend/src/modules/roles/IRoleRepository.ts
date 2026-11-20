import type { Role } from "./role.types.js";

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
}
