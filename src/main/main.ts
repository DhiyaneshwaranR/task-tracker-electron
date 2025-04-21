// src/main/main.ts
import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import { registerTaskIpcHandlers } from './ipc/taskHandlers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createWindow() {
    const preloadPath = path.resolve(__dirname, '../../dist/preload.js');

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath,
        },
    });

    const indexPath = path.resolve(__dirname, '../../dist/index.html');
    await win.loadFile(indexPath);

    win.webContents.openDevTools();
    if (process.env.NODE_ENV === 'development') {

    }
}

app.whenReady().then(() => {
    registerTaskIpcHandlers();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});