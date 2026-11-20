import type { Request, Response } from "express";
import { AppError } from "../../shared/AppError.js";
import { asBody, requiredString } from "../../shared/validation.js";
import type { AuthService } from "./AuthService.js";

export class AuthController {
  constructor(private readonly auth: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const body = asBody(req.body);
    const name = requiredString(body, "name");
    const email = requiredString(body, "email");
    const password = requiredString(body, "password");
    if (!email.includes("@")) throw new AppError(400, "INVALID_DATA", "El email no es válido");
    if (password.length < 6) throw new AppError(400, "INVALID_DATA", "La contraseña debe tener al menos 6 caracteres");
    res.status(201).json(await this.auth.register(name, email, password));
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const body = asBody(req.body);
    res.json(await this.auth.login(requiredString(body, "email"), requiredString(body, "password")));
  };

  me = (req: Request, res: Response): void => {
    res.json(req.user);
  };
}
