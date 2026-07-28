import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const { DATABASE_URL } = process.env

export const towerDatabase = new Sequelize(
  DATABASE_URL!,
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);
