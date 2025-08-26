import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";

interface PasswordResetTokenAttributes {
  id: number;
  userId: number;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PasswordResetTokenCreationAttributes
  extends Optional<PasswordResetTokenAttributes, "id"> {}

class PasswordResetToken extends Model<
  PasswordResetTokenAttributes,
  PasswordResetTokenCreationAttributes
> {
  public id!: number;
  public userId!: number;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordResetToken.init(
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "password_reset_tokens",
    modelName: "PasswordResetToken",
  }
);

export default PasswordResetToken;
