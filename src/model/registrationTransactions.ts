import { DataTypes, Model } from "sequelize";
import { towerDatabase } from "../database/databaseConnection";

export type REGISTRATION = {
  id: string;
  title: string;
  fullName: string;
  email: string;
  paymentReference: string;
  paymentStatus: string;
  paymentAmount: number;
  paidAt: string;
};

class RegistrationPayments extends Model<REGISTRATION> {}

RegistrationPayments.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "REGISTRATION FEE",
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },

    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PENDING",
    },

    paymentAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    paidAt: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    sequelize: towerDatabase,
    tableName: "RegistrationPayments",
    modelName: "RegistrationPayments",
    timestamps: true,
  },
);

export default RegistrationPayments;