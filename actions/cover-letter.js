"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("[GEMINI] GEMINI_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

export async function generateCoverLetter(data) {
  const user = await getAuthUser();

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    About the candidate:
    - Industry: ${user.industry ?? "N/A"}
    - Years of Experience: ${user.experience ?? "N/A"}
    - Skills: ${Array.isArray(user.skills) ? user.skills.join(", ") : user.skills ?? "N/A"}
    - Professional Background: ${user.bio ?? "N/A"}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  if (!apiKey) {
    console.error("[generateCoverLetter] Missing GEMINI_API_KEY; cannot call model.");
    throw new Error("AI key not configured");
  }

  try {
    const result = await model.generateContent(prompt);

    console.debug("[generateCoverLetter] raw model result:", result);

    let content = "";
    try {
      if (result?.response?.text && typeof result.response.text === "function") {
        content = (await result.response.text()).trim();
      } else if (typeof result?.outputText === "string") {
        content = result.outputText.trim();
      } else if (typeof result?.text === "string") {
        content = result.text.trim();
      } else if (result?.response?.output?.[0]?.content?.[0]?.text) {
        content = result.response.output[0].content[0].text.trim();
      } else {
        console.debug("[generateCoverLetter] Unrecognized model result shape:", result);
        throw new Error("Unrecognized model response shape");
      }
    } catch (parseErr) {
      console.error("[generateCoverLetter] Error parsing model response:", parseErr);
      throw parseErr;
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const user = await getAuthUser();

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const user = await getAuthUser();


  const cover = await db.coverLetter.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!cover) throw new Error("Cover letter not found");
  return cover;
}

export async function deleteCoverLetter(id) {
  const user = await getAuthUser();

  const cover = await db.coverLetter.findFirst({
    where: { id, userId: user.id },
  });
  if (!cover) throw new Error("Cover letter not found or unauthorized");

  return await db.coverLetter.delete({
    where: { id }, 
  });
}
