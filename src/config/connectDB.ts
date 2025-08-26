import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: (process.env.DIALECT as any) || "mssql",
    port: 1433,
    dialectOptions: {
      options: {
        encrypt: false,
      },
    },
  }
);

export default sequelize;
