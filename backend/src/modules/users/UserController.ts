import type { Request, Response } from "express";
import { AppError } from "../../shared/AppError.js";
import { asBody, param } from "../../shared/validation.js";
import { isRoleName } from "../roles/role.types.js";
import type { UserService } from "./UserService.js";

export class UserController {
  constructor(private readonly users: UserService) {}

  findAll = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.users.findAll());
  };

  findRoles = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.users.findRoles());
  };

  assignRole = async (req: Request, res: Response): Promise<void> => {
    const { role } = asBody(req.body);
    if (!isRoleName(role)) throw new AppError(400, "INVALID_ROLE", "El rol tiene que ser admin, operador o usuario");
    res.json(await this.users.assignRole(param(req.params.id, "id"), role));
  };
}
