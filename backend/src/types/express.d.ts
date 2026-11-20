import type { SessionUser } from "../modules/users/user.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export {};
