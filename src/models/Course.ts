import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";

interface CourseAttributes {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  categoryId: number;
  rating?: number;
  ratingCount?: number;
  price?: number;
  durationInHours: number;
  enrolledStudents?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CourseCreationAttributes
  extends Optional<
    CourseAttributes,
    "id" | "rating" | "ratingCount" | "price" | "enrolledStudents"
  > {}

class Course
  extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public teacherId!: number;
  public categoryId!: number;
  public rating!: number;
  public ratingCount!: number;
  public price!: number;
  public durationInHours!: number;
  public enrolledStudents!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    durationInHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "courses",
    modelName: "Course",
  }
);

export default Course;