// src/main/ipc/taskSessionHandler.ts
import { ipcMain } from 'electron';
import { TaskSessionController } from '../controllers/taskSessionController.js';
import log from 'electron-log';

const controller = new TaskSessionController();

export function registerTaskSessionHandlers() {
    ipcMain.handle('task-session:start', async (_event, taskId: number) => {
        try {
            log.info(`[IPC] Starting task session for taskId: ${taskId}`);
            return await controller.startSession(taskId);
        } catch (error) {
            log.error('[IPC] Error starting task session:', error);
            throw new Error('Failed to start task session');
        }
    });

    ipcMain.handle('task-session:end', async (_event, sessionId: number, inputData) => {
        try {
            log.info(`[IPC] Ending session ${sessionId} with input:`, inputData);
            return await controller.endSession(sessionId, inputData);
        } catch (error) {
            log.error('[IPC] Error ending task session:', error);
            throw new Error('Failed to end task session');
        }
    });

    ipcMain.handle('task-session:today', async (_event, taskId: number) => {
        try {
            log.info(`[IPC] Fetching today's sessions for taskId: ${taskId}`);
            return await controller.getTodaySessions(taskId);
        } catch (error) {
            log.error('[IPC] Error fetching today’s sessions:', error);
            throw new Error('Failed to get today\'s sessions');
        }
    });

    ipcMain.handle('task-session:delete', async (_event, sessionId: number) => {
        try {
            log.info(`[IPC] Deleting session with ID: ${sessionId}`);
            return await controller.deleteSession(sessionId);
        } catch (error) {
            log.error('[IPC] Error deleting task session:', error);
            throw new Error('Failed to delete task session');
        }
    });
}