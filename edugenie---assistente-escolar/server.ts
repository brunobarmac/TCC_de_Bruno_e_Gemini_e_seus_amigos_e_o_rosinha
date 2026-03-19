import dotenv from "dotenv";
import path from "path";

// Carrega o .env explicitamente do diretório atual
dotenv.config({ path: path.join(process.cwd(), ".env") });

import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Rota da API para o Chat
  app.post("/api/chat", async (req, res) => {
    const { prompt, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("\n--- Nova Requisição de Chat ---");
    
    if (!apiKey || apiKey === "COLE_SUA_CHAVE_AQUI") {
      console.error("ERRO: GEMINI_API_KEY não encontrada no process.env");
      return res.status(500).json({ error: "Chave de API não configurada no servidor (.env)" });
    }

    console.log("Chave detectada: " + apiKey.substring(0, 8) + "...");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "Você é o pequeno rosa, um tutor escolar amigável e inteligente. Sua missão é ajudar estudantes com dúvidas de todas as matérias. Explique os conceitos de forma clara e didática.",
        },
        history: history || [],
      });

      const result = await chat.sendMessage({ message: prompt });
      console.log("Resposta da IA enviada com sucesso.");
      res.json({ text: result.text });
    } catch (error: any) {
      console.error("Erro detalhado no Gemini:", error);
      res.status(500).json({ error: error.message || "Erro ao processar sua pergunta." });
    }
  });

  // Configuração do Vite (Middleware)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduGenie rodando em http://localhost:${PORT}`);
  });
}

startServer();
