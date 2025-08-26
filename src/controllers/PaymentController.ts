import { Request, Response } from "express";
import Course from "../models/Course";
import Payment from "../models/Payment.model";
import Enrollment from "../models/Enrollment";
import {
  getAuthToken,
  createOrder,
  generatePaymentKey,
  getIframeUrl,
} from "../services/paymobService";

interface AuthRequest extends Request {
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

// @desc    Initiate Paymob payment for a course
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "غير مصرح لك" });

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "الكورس غير موجود" });

    const token = await getAuthToken();
    const orderId = await createOrder(token, course.price);

    const billingData = {
      first_name: req.user?.firstName || "User",
      last_name: req.user?.lastName || "Name",
      email: req.user?.email || "test@example.com",
      phone_number: req.user?.phone || "01000000000",
      city: "Cairo",
      country: "EG",
      street: "NA",
      building: "NA",
      floor: "NA",
      apartment: "NA",
      state: "Cairo",
    };

    const paymentKey = await generatePaymentKey(
      token,
      orderId,
      course.price,
      billingData
    );
    const iframeUrl = getIframeUrl(paymentKey);

    await Payment.create({
      userId,
      courseId,
      amount: course.price,
      status: "pending",
      orderId,
    });

    return res.status(200).json({ iframeUrl });
  } catch (error: any) {
    console.error("initiatePayment error:", error.message);
    return res.status(500).json({ message: "حدث خطأ أثناء بدء عملية الدفع" });
  }
};

// @desc    Webhook from Paymob to confirm payment
// @route   POST /api/payments/webhook
// @access  Public
export const handlePaymobWebhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const data = req.body;
    const transactionId = data.id;
    const orderId = data.order?.id;

    const payment = await Payment.findOne({
      where: {
        orderId,
        transactionId: null,
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "لم يتم العثور على عملية الدفع" });
    }

    payment.status = data.success ? "success" : "failed";
    payment.transactionId = transactionId;
    await payment.save();

    if (data.success) {
      await Enrollment.findOrCreate({
        where: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
        defaults: {
          userId: payment.userId,
          courseId: payment.courseId,
          progress: 0,
          isCompleted: false,
        },
      });
    }

    return res.status(200).json({ message: "تم استقبال الدفع بنجاح" });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return res.status(500).json({ message: "حدث خطأ أثناء استقبال الدفع" });
  }
};
