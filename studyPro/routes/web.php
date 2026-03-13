<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Rota Raiz: Agora ao acessar http://localhost:8000/ ele abre o seu chat
Route::get('/', function () {
    return view('chat');
});

// 2. Rota auxiliar: Caso você ainda queira acessar via http://localhost:8000/chat
Route::get('/chat', function () {
    return view('chat');
});

// 3. Rota de Processamento: Onde o formulário envia a pergunta para a IA
Route::post('/chat/enviar', [ChatController::class, 'perguntar'])->name('chat.enviar');