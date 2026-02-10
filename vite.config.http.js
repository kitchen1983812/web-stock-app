import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// HTTP-only config for testing on devices that block self-signed certs
export default defineConfig({
    server: {
        host: true,
        hmr: {
            protocol: 'ws'
        }
    },
    plugins: [react()],
})
