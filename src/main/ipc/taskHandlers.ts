// src/main/ipc/taskHandlers.ts
import { ipcMain } from 'electron';
import { TaskController } from '../controllers/TaskController.js';

const controller = new TaskController();

export function registerTaskIpcHandlers() {
    ipcMain.handle('create-task', async (_event, data) => {
        try {
            return await controller.createOrScheduleTask(data);
        } catch (error) {
            console.error('Error in create-task:', error);
            throw error;
        }
    });

    ipcMain.handle('get-all-tasks', async () => {
        try {
            return await controller.getAllTasks();
        } catch (error) {
            console.error('Error in get-all-tasks:', error);
            throw error;
        }
    });

    ipcMain.handle('update-task', async (_event, { taskId, ...rest }) => {
        return await controller.updateTask(taskId, rest.taskName);
    });

    ipcMain.handle('mark-task-complete', async (_event, data) => {
        return await controller.markTaskComplete(data.taskId, data.scheduledDate);
    });
}