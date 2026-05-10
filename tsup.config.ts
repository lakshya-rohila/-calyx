import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-native', 'date-fns', 'zustand', 'immer', '@shopify/flash-list'],
  treeshake: true,
  splitting: false,
  minify: false,
});
