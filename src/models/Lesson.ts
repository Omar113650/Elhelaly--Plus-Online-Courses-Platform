import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";

interface LessonAttributes {
  id: number;
  title: string;
  content: string;
  courseId: number;
  order: number;
  video_url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LessonCreationAttributes extends Optional<LessonAttributes, "id"> {}

class Lesson
  extends Model<LessonAttributes, LessonCreationAttributes>
  implements LessonAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public courseId!: number;
  public order!: number;
  public video_url!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lesson.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
   
    },
  },
  {
    sequelize,
    tableName: "lessons",
    modelName: "Lesson",
  }
);

export default Lesson;
