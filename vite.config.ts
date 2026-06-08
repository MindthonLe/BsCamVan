import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite'; // 1. Added loadEnv here

export default defineConfig(({ mode }) => { // 2. Added { mode } parameter
  // 3. Load the environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/BsCamVan/', // 4. Fixed 'Base' -> 'base'
    plugins: [react(), tailwindcss()],
    define: {
      // 5. env is now safely defined and accessible here
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) // Fixed double dot typo
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
