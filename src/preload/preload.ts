import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
    createTask: (taskData: any) => Promise<any>;
    getAllTasks: () => Promise<any>;
    updateTask: (taskId: number, taskData: any) => Promise<any>;
    markTaskComplete: (taskId: number, scheduledDate: string) => Promise<any>;

    // NEW: Task session methods
    startTaskSession: (taskId: number) => Promise<any>;
    endTaskSession: (sessionId: number, inputData?: {
        numericInput?: number;
        textInput?: string;
        optionSelected?: string;
    }) => Promise<any>;
    getTodayTaskSessions: (taskId: number) => Promise<any>;
    deleteTaskSession?: (sessionId: number) => Promise<any>;
}

const api: ElectronAPI = {
    createTask: async (taskData) => ipcRenderer.invoke('create-task', taskData),
    getAllTasks: async () => ipcRenderer.invoke('get-all-tasks'),
    updateTask: async (taskId, taskData) =>
        ipcRenderer.invoke('update-task', { taskId, ...taskData }),
    markTaskComplete: async (taskId, scheduledDate) =>
        ipcRenderer.invoke('mark-task-complete', { taskId, scheduledDate }),

    // ✅ Task session bindings
    startTaskSession: async (taskId) =>
        ipcRenderer.invoke('task-session:start', taskId),

    endTaskSession: async (sessionId, inputData) =>
        ipcRenderer.invoke('task-session:end', sessionId, inputData),

    getTodayTaskSessions: async (taskId) =>
        ipcRenderer.invoke('task-session:today', taskId),

    deleteTaskSession: async (sessionId) =>
        ipcRenderer.invoke('task-session:delete', sessionId),
};

contextBridge.exposeInMainWorld('electronAPI', api);