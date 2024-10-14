import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@react-three/fiber', '@react-three/drei', 'maath'], // Exclude problematic packages
  },
  server: {
    port: 5173, // You can set a specific port if necessary
    strictPort: true, // Prevents the server from trying to use another port if 5173 is busy
    open: true, // Automatically open the app in the browser on server start
  },
});
