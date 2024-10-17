import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""; 
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 15000,
    responseMimeType: "text/plain",
  };
  
  export async function generateResponse(prompt: string): Promise<string> {
    try {
      // Create a chat session
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });
  
      // Generate a response
      const result = await chatSession.sendMessage([prompt]);
      const response = result.response;
  
      // Return the output text
      return response.text() || "Failed to generate response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "Error generating response.";
  }
}
  