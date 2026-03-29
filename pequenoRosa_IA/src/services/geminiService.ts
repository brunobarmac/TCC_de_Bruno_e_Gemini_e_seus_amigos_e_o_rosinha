import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function askSchoolQuestion(prompt: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao falar com o servidor.");
    }

    const data = await response.json();
    return { text: data.text };
  } catch (error: any) {
    console.error("Erro no serviço de chat:", error);
    throw error;
  }
}

