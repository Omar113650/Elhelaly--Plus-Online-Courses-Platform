import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";

interface PerformanceEvaluationAttributes {
  id: number;
  studentId: number;
  courseId: number;
  score: number;
  feedback: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PerformanceEvaluationCreationAttributes extends Optional<PerformanceEvaluationAttributes, "id"> {}

class PerformanceEvaluation
  extends Model<PerformanceEvaluationAttributes, PerformanceEvaluationCreationAttributes>
  implements PerformanceEvaluationAttributes
{
  public id!: number;
  public studentId!: number;
  public courseId!: number;
  public score!: number;
  public feedback!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
value: number = 0;

}

PerformanceEvaluation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "performance_evaluations",
    modelName: "PerformanceEvaluation",
  }
);

export default PerformanceEvaluation;
