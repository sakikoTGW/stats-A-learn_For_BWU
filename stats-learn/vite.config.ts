import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { notesAssetsPlugin } from './vite.config.notes'

export default defineConfig({
  plugins: [react(), notesAssetsPlugin()],
  server: {
    port: 5173,
    open: false,
    fs: { allow: ['..'] },
  },
})
