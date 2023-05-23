import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';


/** @type {import('vite').UserConfig} */
export default defineConfig({
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    AutoImport({
      imports: ['react'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/hooks', 'src/store/reducer'],
      eslintrc: {
        enabled: true, 
        filepath: './.eslintrc-auto-import.json', 
        globalsPropValue: true 
      }
    })
  ]
});
