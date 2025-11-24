import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayPalClient } from "@/lib/paypal";

export async function POST(req: Request) {
  const { bookingId } = await req.json();

  if (!bookingId) {
    return NextResponse.json(
      { error: "bookingId is required" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { transaction: true },
  });

  if (!booking || !booking.transaction) {
    return NextResponse.json(
      { error: "Booking or transaction not found" },
      { status: 404 }
    );
  }

  try {
    const client = getPayPalClient();
    const sdk = await import("@paypal/checkout-server-sdk");
    const request = new sdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: booking.transaction.currency,
            value: booking.transaction.amountTotal.toString(),
          },
        },
      ],
    });

    const order = await client.execute(request);

    await prisma.transaction.update({
      where: { bookingId: booking.id },
      data: { paypalOrderId: order.result.id },
    });

    return NextResponse.json({
      orderId: order.result.id,
      links: order.result.links,
    });
  } catch (error: any) {
    console.error("PayPal create order error", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
