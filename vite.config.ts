import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS LINE BELOW (Replace with your exact repo name)
  // base: "/Bhashkar_Terminal_portfolio/",
  base: "/",
})