import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { AppError } from "../../shared/AppError.js";
import type { IUserRepository } from "../users/IUserRepository.js";
import type { SessionUser, User } from "../users/user.types.js";

export interface AuthResult {
  token: string;
  user: SessionUser;
}

const INVALID = () => new AppError(401, "INVALID_CREDENTIALS", "Email o contraseña incorrectos");

export class AuthService {
  constructor(
    private readonly users: IUserRepository,
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string,
  ) {}

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const normalized = email.trim().toLowerCase();
    if (await this.users.findByEmailWithPassword(normalized)) {
      throw new AppError(409, "EMAIL_IN_USE", "Ya existe una cuenta con ese email");
    }
    // Todo usuario nuevo se registra con el rol "usuario".
    const user = await this.users.create({
      name: name.trim(),
      email: normalized,
      passwordHash: await bcrypt.hash(password, 10),
      role: "usuario",
    });
    return this.session(user);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByEmailWithPassword(email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw INVALID();
    return this.session(user);
  }

  // Lee el usuario y sus permisos actuales a partir del token.
  async verify(token: string): Promise<SessionUser> {
    let userId: string;
    try {
      const payload = jwt.verify(token, this.jwtSecret);
      if (typeof payload === "string" || typeof payload.sub !== "string") throw new Error("sin sub");
      userId = payload.sub;
    } catch {
      throw new AppError(401, "INVALID_TOKEN", "La sesión no es válida o venció");
    }
    const user = await this.users.findSessionUser(userId);
    if (!user) throw new AppError(401, "INVALID_TOKEN", "La sesión no es válida o venció");
    return user;
  }

  private async session(user: User): Promise<AuthResult> {
    const sessionUser = await this.users.findSessionUser(user.id);
    if (!sessionUser) throw INVALID();
    const options: SignOptions = { subject: user.id, expiresIn: this.jwtExpiresIn as SignOptions["expiresIn"] & string };
    const token = jwt.sign({ email: user.email, role: user.role }, this.jwtSecret, options);
    return { token, user: sessionUser };
  }
}
