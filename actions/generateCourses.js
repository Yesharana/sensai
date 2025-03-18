"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function generateCourses() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userData = await db.user.findUnique({
    where: { clerkUserId: user.id },
    select: { industry: true, skills: true },
  });

  if (!userData) throw new Error("User not found");

  const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `
      You are a course recommendation system. Generate a list of 10 online courses for a ${userData.industry} professional${
      userData.skills?.length ? ` with expertise in ${userData.skills.join(", ")}` : ""
    }.

      The courses **must** be from one of these platforms: Coursera, Udemy, edX, or LinkedIn Learning. Do **not** include courses from other platforms.

      For each course, provide:
      1. An accurate course title
      2. The platform name (only Coursera, Udemy, edX, or LinkedIn Learning)
      3. A brief description

      Format the response as **valid JSON only**, with no extra text or explanation:
      \`\`\`json
      {
        "courses": [
          {
            "title": "example title",
            "platform": "Coursera/Udemy/edX/LinkedIn Learning",
            "description": "A brief description of the course."
          }
        ]
      }
      \`\`\`
    `;

    const response = await model.generateContent(prompt);
    let text = response.response.text();

    // Remove code block markers if present
    text = text.replace(/```json\n?|```/g, "").trim();

    // Extract only the JSON part
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");

    const cleanedText = jsonMatch[0];
    const parsedData = JSON.parse(cleanedText);

    if (!parsedData || !Array.isArray(parsedData.courses)) {
      throw new Error("Invalid response structure");
    }

    // Allowed platforms
    const allowedPlatforms = ["Coursera", "Udemy", "edX", "LinkedIn Learning"];

    // Filter out courses that are not from the allowed platforms
    const filteredCourses = parsedData.courses
      .filter((course) => allowedPlatforms.includes(course.platform))
      .map((course) => ({
        ...course,
        link: generateCourseLink(course),
      }));

    return filteredCourses;
  } catch (error) {
    console.error("JSON parsing error:", error);
    throw new Error(`Failed to generate courses: ${error.message}`);
  }
}

// Function to generate course URLs based on the platform
function generateCourseLink(course) {
  switch (course.platform) {
    case "Coursera":
      return `https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`;
    case "Udemy":
      return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(course.title)}`;
    case "edX":
      return `https://www.edx.org/search?q=${encodeURIComponent(course.title)}`;
    case "LinkedIn Learning":
      return `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(course.title)}`;
    default:
      return "#"; // Fallback for safety
  }
}
