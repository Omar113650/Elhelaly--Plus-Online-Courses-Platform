import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";

interface EnrollmentAttributes {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EnrollmentCreationAttributes
  extends Optional<EnrollmentAttributes, "id" | "progress" | "isCompleted"> {}

class Enrollment
  extends Model<EnrollmentAttributes, EnrollmentCreationAttributes>
  implements EnrollmentAttributes
{
  public id!: number;
  public userId!: number;
  public courseId!: number;
  public progress!: number;
  public isCompleted!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  user: any;
  student: any;
}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    courseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    progress: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "enrollments",
    modelName: "Enrollment",
  }
);

export default Enrollment;
