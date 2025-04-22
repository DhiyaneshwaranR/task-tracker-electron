import { TaskSessionService } from '../services/taskSessionService.js';

const sessionService = new TaskSessionService();

export class TaskSessionController {
    async startSession(taskId: number) {
        if (!taskId || typeof taskId !== 'number') {
            throw new Error('Invalid task ID');
        }

        return await sessionService.startSession(taskId);
    }

    async endSession(sessionId: number, input?: {
        numericInput?: number;
        textInput?: string;
        optionSelected?: string;
    }) {
        if (!sessionId || typeof sessionId !== 'number') {
            throw new Error('Invalid session ID');
        }

        return await sessionService.endSession(sessionId, input);
    }

    async getTodaySessions(taskId: number) {
        if (!taskId || typeof taskId !== 'number') {
            throw new Error('Invalid task ID');
        }

        return await sessionService.getSessionsForToday(taskId);
    }

    async deleteSession(sessionId: number) {
        if (!sessionId || typeof sessionId !== 'number') {
            throw new Error('Invalid session ID');
        }

        return await sessionService.deleteSession(sessionId);
    }
}