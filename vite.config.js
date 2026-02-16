import { defineConfig } from 'vite';
import { resolve, basename } from 'path';
import fs from 'fs';

// Helper to find all HTML files in src/pages
const getPages = () => {
    const pagesDir = resolve(__dirname, 'src/pages');
    const files = fs.readdirSync(pagesDir);
    const pages = {};

    files.forEach(file => {
        if (file.endsWith('.html')) {
            const name = basename(file, '.html');
            pages[name] = resolve(pagesDir, file);
        }
    });

    // Add nested pages
    const authDir = resolve(pagesDir, 'auth');
    if (fs.existsSync(authDir)) {
        fs.readdirSync(authDir).forEach(file => {
            if (file.endsWith('.html')) {
                pages[`auth-${basename(file, '.html')}`] = resolve(authDir, file);
            }
        });
    }

    const dashboardDir = resolve(pagesDir, 'dashboard');
    if (fs.existsSync(dashboardDir)) {
        fs.readdirSync(dashboardDir).forEach(file => {
            if (file.endsWith('.html')) {
                pages[`dashboard-${basename(file, '.html')}`] = resolve(dashboardDir, file);
            }
        });
    }

    return pages;
};

export default defineConfig({
  root: '.',
  base: './', // Use relative paths for assets
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...getPages()
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
