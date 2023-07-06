import path from 'path';
import { defineConfig } from 'vitest/dist/config';

export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src/types'),
      },
    ],
  },
});
