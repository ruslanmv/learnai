import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { WhiteboardClient } from "@/components/WhiteboardClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClassroomPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const isParticipant =
    booking.student.email === session.user.email || booking.teacher.email === session.user.email;

  if (!isParticipant) {
    return (
      <div className="p-8 text-center">
        <h1 className="mb-2 text-xl font-semibold">Access denied</h1>
        <p className="text-sm text-gray-600">
          You are not a participant of this classroom session.
        </p>
      </div>
    );
  }

  const meetingUrl =
    booking.teamsMeetingUrl ?? "https://teams.microsoft.com/l/meetup-join/dummy-meeting-url";

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex w-full flex-col gap-4 border-r border-gray-200 bg-white p-4 md:w-1/4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{booking.subject}</h1>
          <p className="mt-1 text-xs text-gray-500">{booking.topic}</p>
        </div>
        <div className="text-xs text-gray-600">
          <p>
            Teacher:{" "}
            <span className="font-semibold">{booking.teacher.name ?? booking.teacher.email}</span>
          </p>
          <p>
            Student:{" "}
            <span className="font-semibold">{booking.student.name ?? booking.student.email}</span>
          </p>
        </div>
        <a
          href={meetingUrl}
          target="_blank"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-secondary"
          rel="noreferrer"
        >
          Join video call (Teams)
        </a>
        <p className="text-[11px] text-gray-500">
          Keep this page open during your session. Everything on the whiteboard stays saved for
          later review.
        </p>
      </div>
      <div className="h-full flex-1 bg-gray-100">
        {/* Client-side whiteboard */}
        <WhiteboardClient roomId={booking.whiteboardId ?? booking.id} />
      </div>
    </div>
  );
}
