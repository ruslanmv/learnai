/**
 * OpenAI Integration for AI-Powered Professor Recommendations
 *
 * This module handles AI-based professor matching using OpenAI's GPT models.
 * It searches the database for relevant teachers and uses AI to provide
 * intelligent recommendations with explanations.
 *
 * @module lib/ai
 * @author Ruslan Magana (ruslanmv.com)
 * @license MIT
 */

import OpenAI from "openai";
import { prisma } from "./prisma";
import type { TeacherProfileWithUser, ProfessorRecommendationResponse } from "@/types";

/**
 * Initialize OpenAI client with API key from environment
 * If no API key is provided, the application will work with degraded functionality
 */
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * Recommend professors based on student query using AI
 *
 * This function performs the following steps:
 * 1. Searches database for relevant teachers based on query
 * 2. If OpenAI is configured, generates AI explanation
 * 3. Returns teachers with AI-generated recommendations
 *
 * @param {string} query - Student's learning request (e.g., "I need help with calculus")
 * @param {number} limit - Maximum number of teachers to return (default: 5)
 * @returns {Promise<ProfessorRecommendationResponse>} Teachers with AI explanation
 * @throws {Error} If database query fails
 *
 * @example
 * ```typescript
 * const result = await recommendProfessors("I need help with calculus");
 * console.log(result.teachers); // Array of recommended teachers
 * console.log(result.explanation); // AI-generated explanation
 * ```
 */
export async function recommendProfessors(
  query: string,
  limit: number = 5
): Promise<ProfessorRecommendationResponse> {
  try {
    // Validate input
    if (!query || query.trim().length === 0) {
      throw new Error("Query cannot be empty");
    }

    const normalizedQuery = query.trim().toLowerCase();

    // Search database for matching teachers
    const teachers = await prisma.teacherProfile.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { bio: { contains: normalizedQuery, mode: "insensitive" } },
              { subjects: { hasSome: [normalizedQuery] } },
              {
                user: {
                  name: { contains: normalizedQuery, mode: "insensitive" },
                },
              },
            ],
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [{ rating: "desc" }, { totalReviews: "desc" }],
      take: limit,
    });

    // If OpenAI is not configured, return database results only
    if (!openai || !process.env.OPENAI_API_KEY) {
      return {
        teachers: teachers.map(formatTeacherForResponse),
        explanation:
          "OpenAI API key is not configured. Showing matching professors from database based on your search criteria.",
      };
    }

    // Generate AI explanation if teachers found
    if (teachers.length === 0) {
      return {
        teachers: [],
        explanation:
          "No professors found matching your query. Try broadening your search or contact support for personalized recommendations.",
      };
    }

    // Prepare teacher data for AI
    const teacherSummaries = teachers
      .map(
        (t, idx) =>
          `${idx + 1}. ${t.user.name ?? "Professor"} (Rating: ${t.rating.toFixed(1)}/5.0, Reviews: ${t.totalReviews})
   - Subjects: ${t.subjects.join(", ")}
   - Languages: ${t.languages.join(", ")}
   - Rate: $${t.hourlyRate}/hour
   - Bio: ${t.bio?.substring(0, 200) ?? "Experienced educator"}`
      )
      .join("\n\n");

    // Generate AI explanation
    const explanation = await generateAIExplanation(query, teacherSummaries);

    return {
      teachers: teachers.map(formatTeacherForResponse),
      explanation,
    };
  } catch (error) {
    console.error("Error in recommendProfessors:", error);
    throw new Error(
      `Failed to generate professor recommendations: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Generate AI explanation for professor recommendations
 *
 * @param {string} query - Student's original query
 * @param {string} teacherSummaries - Formatted teacher data
 * @returns {Promise<string>} AI-generated explanation
 * @private
 */
async function generateAIExplanation(
  query: string,
  teacherSummaries: string
): Promise<string> {
  if (!openai) {
    return "AI recommendations unavailable.";
  }

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `You are a helpful educational advisor that matches students with professors for 1-on-1 online lessons.
Your task is to analyze the student's request and recommend 2-3 professors from the available list, explaining why they're a good match.
Be friendly, concise, and focus on how each professor's expertise aligns with the student's needs.`,
        },
        {
          role: "user",
          content: `Student request: "${query}"

Available professors:
${teacherSummaries}

Please recommend the 2-3 best professors for this student and explain why they're a great match. Keep your response under 150 words.`,
        },
      ],
    });

    return (
      chat.choices[0]?.message?.content ??
      "I've found several great professors who can help you. Please review their profiles above."
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I've found professors matching your request. Please review their profiles above to find the best fit for your learning goals.";
  }
}

/**
 * Format teacher profile for API response
 *
 * @param {TeacherProfile} teacher - Teacher profile from database
 * @returns {Object} Formatted teacher data
 * @private
 */
function formatTeacherForResponse(teacher: any) {
  return {
    id: teacher.userId,
    name: teacher.user.name,
    title: teacher.title,
    bio: teacher.bio,
    subjects: teacher.subjects,
    languages: teacher.languages,
    rating: teacher.rating,
    hourlyRate: teacher.hourlyRate.toString(),
    image: teacher.user.image,
  };
}

/**
 * Check if OpenAI is properly configured
 *
 * @returns {boolean} True if OpenAI is available
 */
export function isAIEnabled(): boolean {
  return openai !== null && !!process.env.OPENAI_API_KEY;
}
