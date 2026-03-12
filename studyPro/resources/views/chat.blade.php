<!DOCTYPE html>
<html>
<head>
    <title>Meu Laravel GPT</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-10">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-4">Pergunte ao Gemini</h1>

        <form action="{{ route('chat.enviar') }}" method="POST" class="flex gap-2">
            @csrf
            <input type="text" name="pergunta" placeholder="Digite sua dúvida..." class="border p-2 flex-1 rounded">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Enviar</button>
        </form>

        @isset($resposta)
            <div class="mt-6 p-4 bg-gray-50 border-l-4 border-blue-500">
                <p><strong>Você:</strong> {{ $pergunta }}</p>
                <p class="mt-2 text-gray-700"><strong>IA:</strong> {{ $resposta }}</p>
            </div>
        @endisset
    </div>
</body>
</html>