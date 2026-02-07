/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const teachers = [
    {
      email: "ada.teacher@demo.local",
      name: "Ada Lovelace",
      subjects: ["Math", "Physics"],
    },
    {
      email: "alan.teacher@demo.local",
      name: "Alan Turing",
      subjects: ["Computer Science", "Algorithms"],
    },
    {
      email: "grace.teacher@demo.local",
      name: "Grace Hopper",
      subjects: ["Programming", "Databases"],
    },
  ];

  for (const t of teachers) {
    await prisma.user.upsert({
      where: { email: t.email },
      update: {
        name: t.name,
        role: "TEACHER",
        password: passwordHash,
      },
      create: {
        email: t.email,
        name: t.name,
        role: "TEACHER",
        password: passwordHash,
        teacherProfile: {
          create: {
            title: "Professor",
            bio: "Demo teacher profile created by seed script.",
            subjects: t.subjects,
            languages: ["English"],
            hourlyRate: "50.00",
            isActive: true,
            rating: 4.8,
            totalReviews: 12,
            paypalEmail: null,
          },
        },
      },
    });
  }

  await prisma.user.upsert({
    where: { email: "student@demo.local" },
    update: {
      name: "Demo Student",
      role: "STUDENT",
      password: passwordHash,
    },
    create: {
      email: "student@demo.local",
      name: "Demo Student",
      role: "STUDENT",
      password: passwordHash,
      studentProfile: { create: { country: "IT", timezone: "Europe/Rome" } },
    },
  });

  console.log("✓ Seed complete");
  console.log(
    "  Teachers: ada.teacher@demo.local / alan.teacher@demo.local / grace.teacher@demo.local"
  );
  console.log("  Student:  student@demo.local");
  console.log("  Password for all demo accounts: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
