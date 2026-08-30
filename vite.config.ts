import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: 'manifest.json',
      watchFilePaths: ['manifest.json'],
      disableAutoLaunch: true,
      // vite-plugin-web-extension's bundled manifest schema predates
      // match_origin_as_fallback (a valid MV3 field); skip its stale validation.
      skipManifestValidation: true,
    }),
  ],
  build: {
    sourcemap: true,
  },
})
