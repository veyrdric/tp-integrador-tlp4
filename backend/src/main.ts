import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DatabaseConnection } from "./config/databaseConnection.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const dataBase = DatabaseConnection.obtenerInstancia()
const connectDB = dataBase.syncDB();
connectDB

app.listen(PORT, () => {
  console.log(`El servidor se esta ejecutando en localhost:${PORT}`);
})
