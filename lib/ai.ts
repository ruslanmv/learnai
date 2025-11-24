import OpenAI from "openai";
import { prisma } from "./prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function recommendProfessors(query: string) {
  const teachers = await prisma.teacherProfile.findMany({
    where: {
      AND: [
        { isActive: true },
        {
          OR: [
            { bio: { contains: query, mode: "insensitive" } },
            { subjects: { has: query.toLowerCase() } },
          ],
        },
      ],
    },
    include: { user: true },
    take: 5,
  });

  if (!process.env.OPENAI_API_KEY) {
    return {
      teachers,
      explanation:
        "OpenAI API key is not configured. Showing matching professors from database only.",
    };
  }

  const namesWithSubjects = teachers
    .map(
      (t) =>
        `${t.user.name ?? "Unknown"} – subjects: ${t.subjects.join(
          ", "
        )} – rating: ${t.rating}`
    )
    .join("\n");

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that matches students with professors for 1:1 online lessons.",
      },
      {
        role: "user",
        content: `Student request: ${query}\nAvailable teachers:\n${namesWithSubjects}\nExplain which 2–3 teachers are best and why.`,
      },
    ],
  });

  const explanation = chat.choices[0]?.message?.content ?? "";

  return { teachers, explanation };
}
