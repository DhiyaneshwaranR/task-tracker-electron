import { prisma } from '../db/prisma.js';
import { TaskSession } from '@prisma/client';

interface EndSessionInput {
    numericInput?: number;
    textInput?: string;
    optionSelected?: string;
}

export class TaskSessionService {
    /**
     * Starts a new task session
     */
    async startSession(taskId: number): Promise<TaskSession> {
        const now = new Date();
        return prisma.taskSession.create({
            data: {
                taskId,
                startTime: now,
                date: now,
            },
        });
    }

    /**
     * Ends a running task session and updates duration
     */
    async endSession(sessionId: number, input?: EndSessionInput): Promise<TaskSession> {
        const session = await prisma.taskSession.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new Error('Session not found');
        }

        const now = new Date();
        const duration = Math.round((now.getTime() - session.startTime.getTime()) / 60000);

        return prisma.taskSession.update({
            where: { id: sessionId },
            data: {
                endTime: now,
                duration,
                ...input,
            },
        });
    }

    /**
     * Fetch all sessions for a task for today
     */
    async getSessionsForToday(taskId: number): Promise<TaskSession[]> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return prisma.taskSession.findMany({
            where: {
                taskId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { startTime: 'asc' },
        });
    }

    /**
     * Delete a session by ID
     */
    async deleteSession(sessionId: number): Promise<TaskSession> {
        return prisma.taskSession.delete({
            where: { id: sessionId },
        });
    }
}