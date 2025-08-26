// models/VerificationCode.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";

interface VerificationCodeAttributes {
  id: number;
  userId: number;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VerificationCodeCreationAttributes
  extends Optional<VerificationCodeAttributes, "id"> {}

class VerificationCode
  extends Model<VerificationCodeAttributes, VerificationCodeCreationAttributes>
  implements VerificationCodeAttributes
{
  public id!: number;
  public userId!: number;
  public code!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VerificationCode.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "verification_codes",
    modelName: "VerificationCode",
  }
);

export default VerificationCode;
