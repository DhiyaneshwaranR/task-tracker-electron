import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
    createTask: (taskData: any) => Promise<any>;
    getAllTasks: () => Promise<any>;
    updateTask: (taskId: number, taskData: any) => Promise<any>;
    markTaskComplete: (taskId: number, scheduledDate: string) => Promise<any>;
}

const api: ElectronAPI = {
    createTask: async (taskData) => ipcRenderer.invoke('create-task', taskData),
    getAllTasks: async () => ipcRenderer.invoke('get-all-tasks'),
    updateTask: async (taskId, taskData) =>
        ipcRenderer.invoke('update-task', { taskId, ...taskData }),
    markTaskComplete: async (taskId, scheduledDate) =>
        ipcRenderer.invoke('mark-task-complete', { taskId, scheduledDate }),
};

contextBridge.exposeInMainWorld('electronAPI', api);