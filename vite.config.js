import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // strictPort: se la 5173 è occupata meglio un errore chiaro che un'altra porta non ammessa dal CORS del BE
  server: { port: 5173, strictPort: true }
});
