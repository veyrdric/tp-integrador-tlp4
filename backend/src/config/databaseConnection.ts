import { Sequelize } from "sequelize";


export class DatabaseConnection {
    private static instancia: DatabaseConnection;
    private name: string = process.env.DB_NAME!;
    private user: string = process.env.DB_USER!;
    private password: string = process.env.DB_PASSWORD!;
    private host: string = process.env.DB_HOST!;
    
    private constructor() {}

    public static obtenerInstancia() {
        if (!DatabaseConnection.instancia) {
            DatabaseConnection.instancia = new DatabaseConnection;
        }
        return DatabaseConnection.instancia;
    }

    private connectDB(): Sequelize {
        const sequelize = new Sequelize(
            this.name,
            this.user,
            this.password, {
                host: this.host,
                dialect: "postgres"
            }
        )

        return sequelize;
    }

    public async syncDB(): Promise<void> {
        try {
            const database = this.connectDB();

            await database.authenticate();
            await database.sync({alter:true})
            console.log("Base de datos conectada con exito")
        } catch (error) {
            console.log("Erro al conectar la base de datos ", error);
            process.exit(1);
        }
    }
    
}


