import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,       // allows using `describe`, `it`, etc. without imports
    environment: 'jsdom' // lets you test DOM code like document.createElement
  },
});