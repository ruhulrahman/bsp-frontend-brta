import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bsp',  // Set the base path for all assets
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    },
  },
  plugins: [react()],
  // Workaround before renaming .js to .jsx
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
