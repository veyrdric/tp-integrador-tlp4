import { Sequelize } from "sequelize";
import { env } from "../config/env.js";

// Singleton: toda la aplicación comparte una única conexión a PostgreSQL.
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  readonly sequelize: Sequelize;

  // Privado: la única forma de obtener la conexión es getInstance().
  private constructor() {
    this.sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
      host: env.db.host,
      port: env.db.port,
      dialect: "postgres",
      logging: false,
    });
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(): Promise<void> {
    await this.sequelize.authenticate();
    await this.sequelize.sync();
  }

  async close(): Promise<void> {
    await this.sequelize.close();
  }
}
