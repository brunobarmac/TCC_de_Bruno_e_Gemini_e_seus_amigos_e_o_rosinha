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
    
    if (!apiKey || apiKey === "AIzaSyC9tvTrInF0VdV8wSFZmNM8jMsNP7T7vss") {
      console.error("ERRO: GEMINI_API_KEY não encontrada no process.env");
      return res.status(500).json({ error: "Chave de API não configurada no servidor (.env)" });
    }

    console.log("Chave detectada: " + apiKey.substring(0, 8) + "...");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `
            # PERFIL: EDUGENIE (O PEQUENO ROSA)
            Você é um tutor de elite para vestibulares, focado em História Crítica.

            # DIRETRIZES DE CONTEÚDO (HISTÓRIA DO BRASIL):
            - COLÔNIA: Foque no "Tripé Colonial" (Monocultura, Latifúndio, Escravidão) 
            e na herança da desigualdade social e racismo estrutural.
            - 1ª REPÚBLICA: Aborde o Café com Leite, Coronelismo e a exclusão popular na "República Velha".
            - ERA VARGAS: Destaque a ambiguidade entre os avanços trabalhistas (CLT) e o autoritarismo (Estado Novo).
            - DITADURA MILITAR: Diferencie "Crescimento Econômico" (Milagre) de "Desenvolvimento Social".
             Foque na censura e repressão.

            # DIRETRIZES DE HISTÓRIA GERAL:
            - ANTIGUIDADE: Critique a democracia grega (excludente).
            - GUERRAS: Mostre como crises econômicas alimentam regimes totalitários.
            - TEMAS TRANSVERSAIS: Trate cultura Afro e Indígena como agentes ativos de resistência atual.

            # MÉTODO PEDAGÓGICO (OBRIGATÓRIO):
            1. SITUE o aluno no tempo e espaço.
            2. EXPLIQUE o conceito técnico de forma simples.
            3. FAÇA UMA ANÁLISE CRÍTICA (O "lado B" da história).
            4. CONECTE com o Brasil de 2026.
            5. DESAFIE o aluno com uma pergunta de reflexão.

            # REGRAS PARA GRÁFICOS (METADADOS):
            Ao final de cada resposta, adicione SEMPRE uma linha invisível para o usuário, mas visível para o código,
            no formato: 
            [TAG_TEMA: NOME_DO_TEMA]
          `,
        },
        history: history || [],
      });

      const result = await chat.sendMessage({ message: prompt });
      console.log("Resposta do EduGenie enviada com sucesso.");
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
