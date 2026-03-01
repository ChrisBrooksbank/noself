import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@api': resolve(__dirname, 'src/api'),
            '@core': resolve(__dirname, 'src/core'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@config': resolve(__dirname, 'src/config'),
            '@types': resolve(__dirname, 'src/types'),
        },
    },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'src/types/**'],
        },
    },
});
