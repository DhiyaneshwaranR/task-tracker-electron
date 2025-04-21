import type { ElectronAPI } from '../../../preload/preload'; // adjust the relative path if needed

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}