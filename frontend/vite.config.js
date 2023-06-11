import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.jsx',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json'],
      reportsDirectory: './coverage',
      lines: 20,
      branches: 20,
      functions: 20,
      statements: 20,
      exclude: [
        ...configDefaults.coverage.exclude,
        'src/mock/**',
        'src/features/**',
        'src/routes/**'
      ]
    }
  }
});
