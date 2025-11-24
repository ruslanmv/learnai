import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { splitAmounts } from "@/lib/paypal";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teacherId, subject, topic, scheduledFor, durationMinutes, priceTotal } =
    await req.json();

  if (!teacherId || !subject || !scheduledFor || !durationMinutes || !priceTotal) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const student = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
  });

  if (!teacher || teacher.role !== "TEACHER") {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const booking = await prisma.booking.create({
    data: {
      studentId: student.id,
      teacherId: teacher.id,
      subject,
      topic,
      scheduledFor: new Date(scheduledFor),
      durationMinutes,
      priceTotal,
      status: "PENDING",
    },
  });

  const { amountTeacher, platformFee } = splitAmounts(priceTotal);

  await prisma.transaction.create({
    data: {
      bookingId: booking.id,
      studentId: student.id,
      teacherId: teacher.id,
      amountTotal: priceTotal,
      amountTeacher,
      platformFee,
      status: "PENDING",
    },
  });

  return NextResponse.json({ bookingId: booking.id });
}
