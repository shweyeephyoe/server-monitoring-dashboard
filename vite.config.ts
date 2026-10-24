// Vite builds and serves the app. Vitest (the test runner) reads the `test`
// section of this same file, so there is only one config to maintain.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split third-party code into separate files ("chunks"). Browsers can
        // cache them independently, and no single file gets too large.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('node_modules')) return 'charts';
        },
      },
    },
  },
  test: {
    // jsdom simulates a browser so React components can render inside tests.
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
