/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/vitest.setup.ts"],
        coverage: {
            provider: 'v8' // or 'istanbul'
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})