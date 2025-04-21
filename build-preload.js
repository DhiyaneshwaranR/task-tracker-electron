// build-preload.js
import { build } from 'esbuild';

build({
    entryPoints: ['src/preload/preload.js'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node16'], // Electron-compatible Node/Chromium version
    outfile: 'dist/preload.js',
    external: ['electron', 'fs', 'path', 'os'], // avoid bundling core modules
}).catch(() => process.exit(1));