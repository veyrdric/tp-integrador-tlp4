import { AppError } from "./AppError.js";

type Body = Record<string, unknown>;

export function asBody(value: unknown): Body {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AppError(400, "INVALID_BODY", "El body tiene que ser un objeto JSON");
  }
  return value as Body;
}

export function requiredString(body: Body, field: string): string {
  const value = body[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(400, "INVALID_DATA", `El campo ${field} es obligatorio`);
  }
  return value.trim();
}

export function optionalString(body: Body, field: string): string | undefined {
  const value = body[field];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    throw new AppError(400, "INVALID_DATA", `El campo ${field} tiene que ser texto`);
  }
  return value.trim();
}

export function param(value: string | string[] | undefined, name: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new AppError(400, "INVALID_PARAM", `El parámetro ${name} no es válido`);
  }
  return value;
}

export function currentUserId(user: { id: string } | undefined): string {
  if (!user) throw new AppError(401, "UNAUTHENTICATED", "Tenés que iniciar sesión");
  return user.id;
}
