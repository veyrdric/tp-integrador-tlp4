import dotenv from "dotenv";

// En Docker las variables llegan por env_file. Corriendo local, se buscan en
// backend/.env o en el .env de la raíz del repositorio.
dotenv.config({ path: [".env", "../.env"], quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Revisá el archivo .env`);
  }
  return value;
}

export const env = {
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 5432),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    name: required("DB_NAME"),
  },
  apiPort: Number(process.env.API_PORT ?? 3000),
  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  },
};
