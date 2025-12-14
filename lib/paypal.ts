import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

const PLATFORM_FEE = 0.1; // 10%

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const isLive = process.env.PAYPAL_ENVIRONMENT === "live";

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  return isLive
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

export function getPayPalClient() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

export function splitAmounts(amountTotal: number) {
  const platformFee = Math.round(amountTotal * PLATFORM_FEE * 100) / 100;
  const amountTeacher = Math.round((amountTotal - platformFee) * 100) / 100;
  return { amountTeacher, platformFee };
}
