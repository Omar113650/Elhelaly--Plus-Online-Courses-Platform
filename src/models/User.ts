import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string ;
  isActive: boolean;
  role: "admin" | "teacher" | "student";



  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role" | "isActive"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string ;
  public isActive!: boolean;
  public role!: "admin" | "teacher" | "student";
  

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "teacher", "student"),
      allowNull: false,
      defaultValue: "student",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",

  
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

export default User;
