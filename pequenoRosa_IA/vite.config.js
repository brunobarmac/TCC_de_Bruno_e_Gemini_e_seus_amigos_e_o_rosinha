import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // Apontando direto para a pasta src usando o ambiente nativo do Node
        '@': path.resolve(process.cwd(), './src'),
      },
    },
    server: {
      // Desativa o HMR no AI Studio para evitar bugs de tela piscando
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});