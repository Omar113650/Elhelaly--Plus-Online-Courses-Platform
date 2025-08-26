import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

if (!PAYMOB_API_KEY || !PAYMOB_INTEGRATION_ID || !PAYMOB_IFRAME_ID) {
  throw new Error("Paymob environment variables are missing");
}

const PAYMOB_API_KEY_STR = PAYMOB_API_KEY as string;
const PAYMOB_INTEGRATION_ID_STR = PAYMOB_INTEGRATION_ID as string;
const PAYMOB_IFRAME_ID_STR = PAYMOB_IFRAME_ID as string;

const PAYMOB_BASE_URL = "https://accept.paymob.com/api";


// /**
//  * Get Paymob Authentication Token
//  */
let cachedToken: string | null = null;
let tokenTimestamp: number = 0;

export const getAuthToken = async (): Promise<string> => {
  const now = Date.now();
  const validFor = 15 * 60 * 1000; 
  if (cachedToken && now - tokenTimestamp < validFor) {
    return cachedToken;
  }

  const res = await axios.post("https://accept.paymob.com/api/auth/tokens", {
    api_key: process.env.PAYMOB_API_KEY,
  });

  cachedToken = res.data.token;
  tokenTimestamp = now;

  return cachedToken as string;
};

/**
 * Create a Paymob order
 */
export const createOrder = async (
  token: string,
  amountCents: number
): Promise<number> => {
  const res = await axios.post(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
    auth_token: token,
    delivery_needed: false,
    amount_cents: amountCents * 100, // EG: 500 EGP => 50000
    currency: "EGP",
    items: [],
  });

  return res.data.id;
};

/**
 * Generate Payment Key
 */
export const generatePaymentKey = async (
  token: string,
  orderId: number,
  amountCents: number,
  billingData: any
): Promise<string> => {
  const res = await axios.post(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
    auth_token: token,
    amount_cents: amountCents * 100,
    expiration: 3600,
    order_id: orderId,
    billing_data: billingData,
    currency: "EGP",
    integration_id: Number(PAYMOB_INTEGRATION_ID_STR),
  });

  return res.data.token;
};

/**
 * Get iframe URL
 */
export const getIframeUrl = (paymentToken: string): string => {
  return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID_STR}?payment_token=${paymentToken}`;
};
