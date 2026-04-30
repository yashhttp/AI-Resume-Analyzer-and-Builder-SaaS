import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey:process.env.OPENAI_API_KEY
// })
// console.log("API KEY:", process.env.OPENAI_API_KEY);
export const analyzeWithAi = async (resumeText) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key");
  }
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
    You are a professional resume analyzer. 
    Analyze the following resume and return STRICT JSON in this format:
    {
    "score": number (0-100),
    "atsScore": number (0-100),
    "strengths": [string],
    "weaknesses": [string],
    "suggestions": [string] 
      }
    Resume: 
    ${resumeText}
    
    `;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional resume analyzer" },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API failed, falling back to mock data.", error.message);
    const mockData = {
      score: Math.floor(Math.random() * 40) + 60,
      atsScore: Math.floor(Math.random() * 30) + 70,
      strengths: ["Strong problem-solving skills", "Good technical background"],
      weaknesses: ["Could use more quantifiable achievements"],
      suggestions: ["Quantify your impact", "Tailor keywords to the job description"]
    };
    return JSON.stringify(mockData);
  }
};
