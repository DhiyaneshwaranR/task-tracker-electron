import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    createTask: async (taskData) => await ipcRenderer.invoke('create-task', taskData),
    getAllTasks: async () => await ipcRenderer.invoke('get-all-tasks'),
    updateTask: async (taskId, taskData) => await ipcRenderer.invoke('update-task', { taskId, ...taskData }),
    markTaskComplete: async (taskId, scheduledDate) => await ipcRenderer.invoke('mark-task-complete', { taskId, scheduledDate })
});