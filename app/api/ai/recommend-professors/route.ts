import { NextResponse } from "next/server";
import { recommendProfessors } from "@/lib/ai";

export async function POST(req: Request) {
  const { query } = await req.json();
  if (!query) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  const { teachers, explanation } = await recommendProfessors(query);

  return NextResponse.json({
    teachers: teachers.map((t) => ({
      id: t.userId,
      name: t.user.name,
      title: t.title,
      bio: t.bio,
      subjects: t.subjects,
      rating: t.rating,
      hourlyRate: t.hourlyRate,
    })),
    explanation,
  });
}
