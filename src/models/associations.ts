import User from "./User";
import Category from "./Category";
import Course from "./Course";
import Lesson from "./Lesson";
import Enrollment from "./Enrollment";
import Comment from "./Comment";
import PerformanceEvaluation from "./Evaluation";


User.hasMany(Course, {
  foreignKey: "teacherId",
  as: "courses",
});
Course.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher",
});


Category.hasMany(Course, {
  foreignKey: "categoryId",
  as: "courses",
});
Course.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});


User.hasMany(Enrollment, {
  foreignKey: "userId",
  as: "enrollments",
});
Enrollment.belongsTo(User, {
  foreignKey: "userId",
  as: "student",
});

Course.hasMany(Enrollment, {
  foreignKey: "courseId",
  as: "enrollments",
});
Enrollment.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});


Course.hasMany(Lesson, {
  foreignKey: "courseId",
  as: "lessons",
});
Lesson.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});


Lesson.hasMany(Comment, {
  foreignKey: "lessonId",
  as: "comments",
});
Comment.belongsTo(Lesson, {
  foreignKey: "lessonId",
  as: "lesson",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
});
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(PerformanceEvaluation, {
  foreignKey: "studentId",
  as: "evaluations",
});
PerformanceEvaluation.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
});

Course.hasMany(PerformanceEvaluation, {
  foreignKey: "courseId",
  as: "evaluations",
});
PerformanceEvaluation.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});
