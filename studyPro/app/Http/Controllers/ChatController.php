<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Esta linha abaixo é a que resolve o erro "Class not found"
use Gemini\Laravel\Facades\Gemini;

class ChatController extends Controller
{
    /**
     * Recebe a pergunta do formulário e consulta a API do Gemini.
     */
    public function perguntar(Request $request)
    {
        // 1. Validação básica para garantir que veio uma pergunta
        $request->validate([
            'pergunta' => 'required|string',
        ]);

        // 2. Pega a pergunta que veio do formulário
        $pergunta = $request->input('pergunta');

        try {
            // 3. Envia para o Gemini
            $result = Gemini::geminiPro()->generateContent($pergunta);

            // 4. Retorna a resposta para a página do chat
            return view('chat', [
                'resposta' => $result->text(),
                'pergunta' => $pergunta
            ]);

        } catch (\Exception $e) {
            // Caso aconteça algum erro na API (ex: chave inválida)
            return view('chat', [
                'resposta' => "Erro ao consultar a IA: " . $e->getMessage(),
                'pergunta' => $pergunta
            ]);
        }
    }
}