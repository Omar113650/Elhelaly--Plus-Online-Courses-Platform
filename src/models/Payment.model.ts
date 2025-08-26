import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/connectDB";


interface PaymentAttributes {
  id: number;
  userId: number;
  courseId: number;
  amount: number;
  status: "pending" | "success" | "failed";
  transactionId?: string | null;
  orderId: number;
  createdAt?: Date;
  updatedAt?: Date;
}


type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  "id" | "transactionId" | "status" | "createdAt" | "updatedAt"
>;

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public userId!: number;
  public courseId!: number;
  public amount!: number;
  public status!: "pending" | "success" | "failed";
  public transactionId!: string | null;
  public orderId!: number;

 
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "pending",
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    timestamps: true,
  }
);

export default Payment;
