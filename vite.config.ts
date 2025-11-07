/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'
import react from "@vitejs/plugin-react";


export default defineConfig({
    plugins: [react()],
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