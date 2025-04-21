import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import { db } from './db/connection.js';
import { TaskService } from './services/taskService.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const taskService = new TaskService();

async function createWindow() {
    await db.connect();

    const preloadPath = path.resolve(__dirname, '../../dist/preload.js');

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        }
    });

    // Always load from dist in both development and production
    const indexPath = path.join(__dirname, '../../dist/index.html');
    console.log('Loading from:', indexPath);

    await win.loadFile(indexPath);
    win.webContents.openDevTools();

}


ipcMain.handle('create-task', async (event, taskData) => {
    try {
        if (taskData.taskId) {
            // This is a schedule creation
            return await taskService.scheduleTask(
                taskData.taskId,
                taskData.dayOfWeek,
                taskData.startTime,
                taskData.endTime
            );
        } else {
            const createdTask = await taskService.createTask(taskData.taskName);
            console.log('Created task:', createdTask);
            if (taskData.schedule && Array.isArray(taskData.schedule)) {
                for (const entry of taskData.schedule) {
                    await taskService.scheduleTask(
                        createdTask.task_id,
                        entry.dayOfWeek,
                        entry.startTime,
                        entry.endTime
                    );
                }
            }
            return createdTask;
        }
    } catch (error) {
        console.error('Error in create-task handler:', error);
        throw error;
    }
});

ipcMain.handle('get-all-tasks', async () => {
    try {
        return await taskService.getAllTasks();
    } catch (error) {
        console.error('Error in get-all-tasks handler:', error);
        throw error;
    }
});

ipcMain.handle('update-task', async (event, { taskId, ...taskData }) => {
    return await taskService.updateTask(taskId, taskData);
});

ipcMain.handle('mark-task-complete', async (event, { taskId, scheduledDate }) => {
    return await taskService.markTaskComplete(taskId, scheduledDate);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', async () => {
    await db.close();
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});