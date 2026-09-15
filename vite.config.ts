import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function copyPosterPlugin(): Plugin {
  return {
    name: 'copy-posters',
    closeBundle() {
      const copyDir = (src: string, dest: string) => {
        if (!fs.existsSync(src)) return;
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      copyDir(path.resolve(__dirname, 'SGfes'), path.resolve(__dirname, 'dist/SGfes'));
      copyDir(path.resolve(__dirname, 'SGfes'), path.resolve(__dirname, 'dist/images/schedule'));
      copyDir(path.resolve(__dirname, 'public/SGfes'), path.resolve(__dirname, 'dist/SGfes'));
      copyDir(path.resolve(__dirname, 'public/images/schedule'), path.resolve(__dirname, 'dist/images/schedule'));
    }
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), copyPosterPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
