import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite'; // Thêm loadEnv vào đây

export default defineConfig(({ mode }) => {
  // Load các biến môi trường dựa trên mode (production/development)
  // Tham số thứ ba '' cho phép load mọi biến env mà không bắt buộc phải có tiền tố VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/BsCamVan/',
    plugins: [react(), tailwindcss()],
    define: {
      // Bây giờ biến env đã tồn tại và bạn có thể sử dụng bình thường
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
