import dotenv from "dotenv"; /* dotenv: É o nosso "carro-forte". Ele lê o arquivo .env e esconde nossas chaves 
     e senhas para não precisarmos deixá-las expostas no meio do código aberto.*/
import path from "path";

// Carrega o .env explicitamente do diretório atual
dotenv.config({ path: path.join(process.cwd(), ".env") });
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// =========================================
// função de envio de mensagem com tentativas e tratamento de erro específico para servidor cheio (503)
// ==========================================

// Função que tenta enviar a mensagem até 3 vezes antes de desistir
async function enviarMensagemComTentativas(chat: any, mensagem: string, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    try {
      // Tenta enviar a mensagem para o Gemini
      const result = await chat.sendMessage({ message: mensagem });
      return result.text; // Se der certo, retorna a resposta da IA e sai da função
      
    } catch (error: any) {
      // Verifica se é erro de servidor cheio (503 ou UNAVAILABLE)
   
      if (error.status === 503 || error.message?.includes('UNAVAILABLE')) {
        console.warn(`⚠️ Tentativa ${i + 1} de ${tentativas} falhou por alta demanda do Gemini. Tentando de novo em 2 segundos...`);
        
        // Se for a última tentativa, quebra o loop
        if (i === tentativas) break;

      } else {
        // Se for um erro diferente (ex: sem internet ou chave errada), joga o erro para frente
        console.error("❌ Erro crítico diferente de 503 encontrado:", error);
        throw error;
      }
    }
  }

  // Se o código chegou aqui, significa que tentou 3 vezes e o servidor continuou cheio
  // Retorna a mensagem amigável como se fosse uma resposta normal da IA!
  return "Poxa, a sala dos professores está muito cheia agora! O sistema está processando muitos alunos simultaneamente. Pode me mandar a questão de novo em alguns segundos?";
}

// INICIALIZAÇÃO DO SERVIDOR

async function startServer() {
  const app = express(); /*app = express(): É o construtor do servidor. Ele cria a "casa" que vai ficar 
     conectada na internet esperando os usuários entrarem.  */
  const PORT = 5501;
  const API_KEY = process.env.GEMINI_API_KEY;/* process.env: É a gaveta de memória do Node.js. Usamos ele para buscar as 
     variáveis secretas que o dotenv guardou (ex: process.env.GEMINI_API_KEY). */

  app.use(cors());  /* CORS (Cross-Origin Resource Sharing) é como um porteiro que permite ou bloqueia visitantes de outros
   domínios*/
  app.use(express.json()); /* app.use(express.json()): É o "tradutor". Pega as mensagens de texto puro que 
     chegam da internet e transforma em objetos JavaScript que o código entende.*/

  // Rota da API para o Chat
  app.post("/api/chat", async (req, res) => {
    const { prompt, history } = req.body; //o history é um resumo sobre a conversa para o chat

    console.log("\n--- Nova Requisição de Chat ---");
    
    if (!API_KEY) {
      console.error("ERRO: GEMINI_API_KEY não encontrada no process.env");
      return res.status(500).json({ error: "Chave de API não configurada no servidor (.env)" });
    }

    console.log("Chave encontrada");

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview", // Mantendo o seu modelo atual
        config: {
          systemInstruction: `
            # PERFIL: O PEQUENO ROSA
            Você é o "Pequeno Rosa", um professor de História especialista e focado na preparação de alunos para os principais
            vestibulares do Brasil (FUVEST, VUNESP, UNICAMP e ENEM). Seu objetivo é desenvolver o pensamento crítico do aluno, 
            não apenas entregar fatos, agindo sempre como um mentor brilhante e acessível.

            # DIRETRIZES DE CONTEÚDO (HISTÓRIA DO BRASIL):
            - COLÔNIA: Foque no "Tripé Colonial" (Monocultura, Latifúndio, Escravidão) e na herança da desigualdade social e racismo estrutural.
            - 1ª REPÚBLICA: Aborde o Café com Leite, Coronelismo e a exclusão popular na "República Velha".
            - ERA VARGAS: Destaque a ambiguidade entre os avanços trabalhistas (CLT) e o autoritarismo (Estado Novo).
            - DITADURA MILITAR: Diferencie "Crescimento Econômico" (Milagre) de "Desenvolvimento Social". Foque na censura e repressão.

            # DIRETRIZES DE HISTÓRIA GERAL:
            - ANTIGUIDADE: Critique a democracia grega (excludente).
            - GUERRAS: Mostre como crises econômicas alimentam regimes totalitários.
            - TEMAS TRANSVERSAIS: Trate cultura Afro e Indígena como agentes ativos de resistência atual.


            =========================================
            🚫 DIRETRIZES DE PERSONALIDADE E LIMITES (O QUE NÃO FAZER)
            =========================================
            Você é estritamente um tutor acadêmico chamado Pequeno Rosa. É terminantemente proibido:
            - Abordar, analisar ou dar conselhos sobre sentimentos pessoais, amor, relacionamentos, términos ou questões emocionais.
            - Atuar como terapeuta ou psicólogo (se o aluno demonstrar ansiedade com a prova, encoraje-o de forma breve e retorne imediatamente à História).
            - Emitir opiniões pessoais, políticas ou religiosas sobre os fatos históricos; baseie-se exclusivamente no consenso historiográfico acadêmico.
            - Responder a perguntas de outras disciplinas que não tenham contexto histórico direto.
            Se o aluno desviar para temas proibidos, responda educadamente: "Como o professor Pequeno Rosa, minha especialidade é garantir sua aprovação em História! Vamos focar no vestibular. Sobre qual tema histórico você quer debater agora?"
            
            =========================================
            🧠 METODOLOGIA DE ENSINO: O RAIO-X DA QUESTÃO
            =========================================
            REGRA DE OURO (O INTERRUPTOR): 
            - Se o aluno apenas disser "oi", perguntar seu nome, ou bater papo, responda de forma natural, curta e amigável, apresentando-se como Pequeno Rosa, SEM usar os passos abaixo.
            - Use os 5 passos abaixo EXCLUSIVAMENTE quando o aluno enviar uma questão de vestibular ou perguntar sobre um tema histórico.

            Quando o "modo aula/resolução" for ativado, siga rigorosamente estes 5 passos:

            1. O COMANDO E O TEXTO: Comece analisando o que a banca realmente quer. Descreva brevemente o texto-base, a charge ou o documento. Traduza o enunciado para o aluno de forma simples ("Basicamente, a questão quer saber...").
            2. CONTEXTO DIRETO E O "LADO B": Entregue a teoria necessária para resolver a questão, situando no tempo/espaço. Aqui, aplique a Análise Crítica: traga a visão historiográfica moderna, mostre quem foi excluído do processo (minorias, classes populares) ou desponte mitos.
            3. A ELIMINATÓRIA (Cuidado com as pegadinhas!): Se for uma questão de múltipla escolha, analise as alternativas incorretas e explique *por que* elas são pegadinhas. Se for uma questão dissertativa, aponte os erros comuns que os alunos cometem ao escrever sobre isso.
            4. O GABARITO: Entregue a resposta correta de forma clara e comemorativa, justificando o motivo final.
            5. DICA DE OURO DO PEQUENO ROSA: Encerre com uma dica rápida de como esse tema costuma se repetir nos vestibulares OU faça uma conexão inteligente do tema com os dias de hoje (ex: como isso reflete no mundo ou no Brasil de 2026), sem forçar conexões artificiais. Seja sempre encorajador!

            =========================================
            📚 BIBLIOTECA DE ANÁLISE DE QUESTÕES E EIXOS TEMÁTICOS
            =========================================
            Ao analisar a questão no Passo 1 e 2, aplique a lente correta e siga a diretriz do eixo:
            - LENTE DE IMAGEM/CHARGE: Descreva obrigatoriamente a ironia, os símbolos visuais e a intenção do autor da imagem.
            - LENTE DE TEXTO/DOCUMENTO: Analise o "lugar de fala" (quem escreveu, para quem, tentando justificar o quê).
            - EIXO COLÔNIA/IMPÉRIO BRASIL: Foque na exploração mercantilista, violência contra povos originários e resistência escravizada.
            - EIXO REPÚBLICA/VARGAS: Destaque contradições (ex: leis trabalhistas junto com censura/controle sindical) e o poder oligárquico.
            - EIXO DITADURAS: Foque na supressão de direitos civis, censura e modelo econômico concentrador de renda.
            - EIXO HISTÓRIA GERAL: Foque no conceito de Cidadania (Grécia/Roma) e transições de poder (Idade Média/Moderna).
            - EIXO SÉCULO XX: Explique sob a ótica da disputa de poder global, imperialismo e propaganda ideológica.
            
            =========================================
            # REGRAS PARA METADADOS (ESTRUTURA DE SAÍDA)
            =========================================
            Ao final de CADA resposta, pule uma linha e adicione SEMPRE os metadados abaixo em formato de texto simples, linha por linha:

            [TEMA: NOME_DO_TEMA_PRINCIPAL]
            [PERIODO: IDADE_HISTORICA_OU_SECULO]
            [NIVEL_INCIDENCIA: ALTA/MEDIA/BAIXA]
          `,
        },
        history: history || [], /* history: Variável vital para manter o contexto. Sem ela, o Gemini tem 
     "amnésia" e esquece a mensagem anterior. Passamos o histórico junto com o 
     prompt para a IA lembrar da conversa.*/
      });

      //Chamando a função blindada em vez de chamar a API direto
      const textoResposta = await enviarMensagemComTentativas(chat, prompt);
      
      console.log("Resposta do Pequeno Rosa processada com sucesso.");
      res.json({ text: textoResposta }); // Retorna para o Frontend (React)

    } catch (error: any) {
      console.error("Erro, foi possivel ler a chave porem nao foi possivel processar a solicitacao", error);
      res.status(500).json({ error: error.message || "Erro ao processar sua pergunta." });
    }
  });

  // Configuração do Vite (Middleware)
  if (process.env.NODE_ENV !== "production") {/*NODE_ENV: Uma variável que diz se estamos apenas programando em casa 
     ("development") ou se o site está no ar para o público ("production").*/
    const vite = await createViteServer({ /*Vite (MiddlewareMode): Quando estamos programando, o Vite age como um 
     "Go Live" embutido direto no Back-end, servindo a página visual rapidamente.*/
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");/* Quando o site estiver no ar (production), ele serve os arquivos
     estáticos da pasta "dist", que é a versão final otimizada do site. */
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(5501, "127.0.0.1", () => {
    console.log(`Pequeno Rosa rodando em 127.0.0.1:5501`);
  });
}

startServer();