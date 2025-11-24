import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { WhiteboardClient } from "@/components/WhiteboardClient";

interface Props {
  params: { id: string };
}

export default async function ClassroomPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (!booking) notFound();

  const isParticipant =
    booking.student.email === session.user.email ||
    booking.teacher.email === session.user.email;

  if (!isParticipant) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Access denied</h1>
        <p className="text-sm text-gray-600">
          You are not a participant of this classroom session.
        </p>
      </div>
    );
  }

  const meetingUrl =
    booking.teamsMeetingUrl ??
    "https://teams.microsoft.com/l/meetup-join/dummy-meeting-url";

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-full md:w-1/4 p-4 border-r border-gray-200 flex flex-col gap-4 bg-white">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {booking.subject}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {booking.topic}
          </p>
        </div>
        <div className="text-xs text-gray-600">
          <p>
            Teacher:{" "}
            <span className="font-semibold">
              {booking.teacher.name ?? booking.teacher.email}
            </span>
          </p>
          <p>
            Student:{" "}
            <span className="font-semibold">
              {booking.student.name ?? booking.student.email}
            </span>
          </p>
        </div>
        <a
          href={meetingUrl}
          target="_blank"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-secondary"
        >
          Join video call (Teams)
        </a>
        <p className="text-[11px] text-gray-500">
          Keep this page open during your session. Everything on the whiteboard
          stays saved for later review.
        </p>
      </div>
      <div className="flex-1 h-full bg-gray-100">
        {/* Client-side whiteboard */}
        <WhiteboardClient roomId={booking.whiteboardId ?? booking.id} />
      </div>
    </div>
  );
}
