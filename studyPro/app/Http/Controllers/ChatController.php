<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;

class ChatController extends Controller
{
    // Esta função será chamada pela rota
    public function perguntar(Request $request)
    {
        // 1. Pega a pergunta que veio do formulário
        $pergunta = $request->input('pergunta');

        // 2. Envia para o Gemini
        $result = Gemini::geminiPro()->generateContent($pergunta);

        // 3. Retorna a resposta para a página
        return view('chat', ['resposta' => $result->text(), 'pergunta' => $pergunta]);
    }
}