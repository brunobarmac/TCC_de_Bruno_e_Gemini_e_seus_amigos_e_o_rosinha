import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
// Importação da biblioteca oficial
import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env") });

// ==========================================
// 🛡️ 1. FUNÇÕES DE APOIO E BLINDAGEM
// ==========================================

const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Função adaptada para aceitar Texto + Imagem opcional
 */
async function enviarMensagemComTentativas(
  model: any, 
  prompt: string, 
  history: any[], 
  imagePart: Part | null = null,
  tentativas = 3
) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const chat = model.startChat({ history });
      
      // Se houver imagem, o conteúdo vira um array [prompt, imagem]
      const conteudo = imagePart ? [prompt, imagePart] : prompt;
      
      const result = await chat.sendMessage(conteudo);
      const response = await result.response;
      return response.text();
      
    } catch (error: any) {
      const isOverloaded = error.status === 503 || error.message?.includes('503') || error.message?.includes('UNAVAILABLE');
      
      if (isOverloaded) {
        console.warn(`⚠️ Tentativa ${i + 1} falhou (Gemini ocupado). Tentando em 2s...`);
        if (i === tentativas - 1) break; 
        await esperar(2000); 
      } else {
        throw error;
      }
    }
  }
  return "Poxa, a sala dos professores está muito cheia agora! Pode me mandar a questão de novo em alguns segundos?";
}

// ==========================================
// 🚀 2. INICIALIZAÇÃO DO SERVIDOR
// ==========================================

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  // Aumentei o limite para suportar o envio de Base64 de imagens
  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey!);

  // --- ROTA DE CHAT (ANEXAR FOTOS) ---
  app.post("/api/chat", async (req, res) => {
    const { prompt, history, imageBase64, imageMimeType } = req.body;

    try {
      // Usamos o gemini-1.5-flash porque ele é MUITO mais rápido para ver imagens
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `
          # PERFIL: O PEQUENO ROSA
          Você é o "Pequeno Rosa", professor de História...
          (Mantenha todo o seu prompt original aqui igualzinho)
        `
      });

      let imagePart: Part | null = null;
      if (imageBase64 && imageMimeType) {
        imagePart = {
          inlineData: {
            data: imageBase64, // String base64 pura vinda do front
            mimeType: imageMimeType // ex: "image/jpeg"
          }
        };
      }

      const textoResposta = await enviarMensagemComTentativas(model, prompt, history || [], imagePart);
      res.json({ text: textoResposta });

    } catch (error: any) {
      console.error("Erro no Chat:", error);
      res.status(500).json({ error: "Erro ao processar sua pergunta." });
    }
  });

  // --- ROTA DE GERAÇÃO (CRIAR FOTOS) ---
  app.post("/api/generate-image", async (req, res) => {
    const { prompt } = req.body;

    // A geração de imagem via Imagen 3 no SDK Node funciona melhor via fetch direto no momento
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: `Ilustração histórica didática para vestibular: ${prompt}` }],
          parameters: { 
            sampleCount: 1,
            aspectRatio: "1:1"
          }
        })
      });

      const data: any = await response.json();
      
      if (data.predictions && data.predictions.length > 0) {
        // Retorna o base64 para o front exibir
        res.json({ imageBase64: data.predictions[0].bytesBase64Encoded });
      } else {
        res.status(400).json({ error: "O Imagen não conseguiu gerar essa imagem." });
      }
    } catch (error) {
      console.error("Erro Imagen 3:", error);
      res.status(500).json({ error: "Erro ao gerar imagem." });
    }
  });

  // Middleware do Vite (Mantido igual)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduGenie (Pequeno Rosa) rodando em http://localhost:${PORT}`);
  });
}

startServer();
