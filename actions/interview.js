"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";


// Check if API key exists and log status (without exposing the key)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz(){
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: {
                industry: true,
                skills: true,
            },
        });

        if (!user) throw new Error("User not found");

        const prompt = `
        Generate 10 technical interview questions for a ${
            user.industry
        } professional${
            user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
        }.
        
        Each question should be multiple choice with 4 options.
        
        Return the response in this JSON format only, no additional text:
        {
            "questions": [
                {
                    "question": "string",
                    "options": ["string", "string", "string", "string"],
                    "correctAnswer": "string",
                    "explanation": "string"
                }
            ]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        try {
            const quiz = JSON.parse(cleanedText);
            if (!quiz.questions || !Array.isArray(quiz.questions)) {
                console.error("Invalid quiz format returned:", cleanedText);
                throw new Error("Received invalid quiz format");
            }
            return quiz.questions;
        } catch (jsonError) {
            console.error("JSON parsing error:", jsonError);
            console.error("Raw text received:", cleanedText);
            throw new Error("Failed to parse quiz questions");
        }
    } catch(error){
        console.error("Error generating quiz - Full error:", error);
        if (error.digest) {
            console.error("Error digest:", error.digest);
        }
        throw error; // Rethrow to preserve the original error
    }
}

export async function saveQuizResult(questions, answers, score) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");
        
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        
        if (!user) throw new Error("User not found");

        const questionResults = questions.map((q, index) => ({
            question: q.question,
            answer: q.correctAnswer,
            userAnswer: answers[index],
            isCorrect: q.correctAnswer === answers[index],
            explanation: q.explanation,
        }));
        
        const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
        let improvementTip = null;

        if (wrongAnswers.length > 0) {
            const wrongQuestionsText = wrongAnswers
                .map(
                    (q) =>
                    `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
                )
                .join("\n\n");
            
            const improvementPrompt = `
            The user got the following ${user.industry} technical interview questions wrong:

            ${wrongQuestionsText}

            Based on these mistakes, provide a concise, specific improvement tip.
            Focus on the knowledge gaps revealed by these wrong answers.
            Keep the response under 2 sentences and make it encouraging.
            Don't explicitly mention the mistakes, instead focus on what to learn/practice.
            `;
            try {
                const result = await model.generateContent(improvementPrompt);
                const response = result.response;
                improvementTip = response.text().trim();
            } catch (tipError) {
                console.error("Error generating improvement tip:", tipError);
                // Continue without improvement tip if generation fails
            }
        }
        
        const assessment = await db.assessment.create({
            data: {
                userId: user.id,
                quizScore: score,
                questions: questionResults,
                category: "Technical",
                improvementTip,
            },
        });
        console.log("Successfully created assessment:", assessment.id);

        return assessment;
    } catch (error) {
        console.error("Error saving quiz result - Full error:", error);
        if (error.digest) {
            console.error("Error digest:", error.digest);
        }
        throw error; // Rethrow to preserve the original error
    }
}
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export async function getAssessments(){
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const assessments = await db.assessment.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return assessments;
    } catch(error){
        console.error("Error fetching assessments - Full error:", error);
        if (error.digest) {
            console.error("Error digest:", error.digest);
        }
        throw error; // Rethrow to preserve the original error
    }
}
