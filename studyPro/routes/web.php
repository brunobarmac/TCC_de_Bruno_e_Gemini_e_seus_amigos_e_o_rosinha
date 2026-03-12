<?php
use App\Http\Controllers\ChatController;

// Rota para mostrar a página inicial do chat
Route::get('/chat', function () {
    return view('chat');
});

// Rota que recebe a pergunta via POST
Route::post('/chat/enviar', [ChatController::class, 'perguntar'])->name('chat.enviar');


use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

