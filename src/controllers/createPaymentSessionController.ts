import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import Payment from "../models/Payment.model";
import { getAuthToken, createOrder, generatePaymentKey, getIframeUrl } from "../services/paymobService";

// @desc    Create Paymob Payment Session
// @route   POST /api/payments/session/:courseId
// @access  Private
export const createPaymentSession = asyncHandler(async (req: Request, res: Response) => {
 const user = {
  id: 1, 
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "+201000000000",
};

  const courseId = req.params.courseId;

  const course = await Course.findByPk(courseId);
  if (!course) {
    res.status(404).json({ message: "الكورس غير موجود" });
    return;
  }

  const token = await getAuthToken();
  const orderId = await createOrder(token, course.price);

  const billingData = {
    first_name: user.firstName || "User",
    last_name: user.lastName || "Name",
    email: user.email || "test@example.com",
    phone_number: user.phone || "+201000000000",
    apartment: "NA",
    floor: "NA",
    street: "NA",
    building: "NA",
    city: "NA",
    country: "NA",
    state: "NA",
  };

  const paymentToken = await generatePaymentKey(token, orderId, course.price, billingData);

  const iframeUrl = getIframeUrl(paymentToken);

await Payment.create({
  userId: user.id,
  courseId: course.id,
  amount: course.price,
  transactionId: orderId?.toString() || null,
  orderId: orderId, 
  status: "pending",
});


  res.status(200).json({ iframeUrl });
});
