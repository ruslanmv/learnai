// lib/topProfessors.ts
import { prisma } from "@/lib/prisma";

export type TopProfessor = {
  id: string;
  name: string;
  rating: number;
  subject: string;
  price: number;
  image: string;
};

export async function getTopProfessors(): Promise<TopProfessor[]> {
  try {
    // Fetch top teachers from the database
    const rows = await prisma.user.findMany({
      where: {
        role: "TEACHER",
        teacherProfile: {
          isActive: true,
        },
      },
      take: 3,
      orderBy: [
        { teacherProfile: { rating: "desc" } },
        { teacherProfile: { totalReviews: "desc" } },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        image: true,
        teacherProfile: {
          select: {
            subjects: true,
            hourlyRate: true,
            rating: true,
            totalReviews: true,
            title: true,
          },
        },
      },
    });

    // Map to TopProfessor format
    return rows.map((u) => {
      const p = u.teacherProfile;
      return {
        id: u.id,
        name: u.name || "Professor",
        rating: typeof p?.rating === "number" ? p.rating : 4.8,
        subject:
          Array.isArray(p?.subjects) && p.subjects.length > 0
            ? p.subjects.slice(0, 2).join(" & ")
            : p?.title ?? "Expert Professor",
        price: p?.hourlyRate ? Number(p.hourlyRate) : 45,
        image: u.image || "https://picsum.photos/800/600?random=" + u.id.slice(0, 3),
      };
    });
  } catch (error) {
    console.error("Error fetching top professors:", error);
    // Return fallback data if database query fails
    return [
      {
        id: "1",
        name: "Dr. John Smith",
        rating: 4.9,
        subject: "Mathematics & Physics",
        price: 45,
        image: "https://picsum.photos/800/600?random=1",
      },
      {
        id: "2",
        name: "Prof. Maria Garcia",
        rating: 4.8,
        subject: "Computer Science & AI",
        price: 50,
        image: "https://picsum.photos/800/600?random=2",
      },
      {
        id: "3",
        name: "Dr. David Chen",
        rating: 4.9,
        subject: "Languages & Literature",
        price: 40,
        image: "https://picsum.photos/800/600?random=3",
      },
    ];
  }
}
