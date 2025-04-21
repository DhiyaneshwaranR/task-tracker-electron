import { prisma } from '../db/prisma.js';
import { Task, Schedule } from '@prisma/client';

export class TaskService {
    async createTask(taskName: string): Promise<Task> {
        if (!taskName || typeof taskName !== 'string' || taskName.length > 255) {
            throw new Error('Invalid task name: must be a string under 255 characters.');
        }

        try {
            const task = await prisma.task.create({
                data: { task_name: taskName }
            });
            console.log(` Created task: ${task.task_id} - "${task.task_name}"`);
            return task;
        } catch (error: any) {
            console.error(' Error in createTask:', error);
            throw new Error('Failed to create task');
        }
    }

    async scheduleTask(taskId: number, dayOfWeek: number, startTime: string, endTime: string): Promise<Schedule> {
        if (!Number.isInteger(taskId)) {
            throw new Error('Invalid task ID');
        }
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            throw new Error('Day of week must be between 1 (Mon) and 7 (Sun)');
        }
        if (!startTime || !endTime) {
            throw new Error('Start and end time are required');
        }

        try {
            const schedule = await prisma.schedule.create({
                data: {
                    taskId,
                    dayOfWeek,
                    startTime,
                    endTime
                }
            });
            console.log(` Scheduled task ${taskId} on day ${dayOfWeek}: ${startTime}–${endTime}`);
            return schedule;
        } catch (error: any) {
            console.error(' Error in scheduleTask:', error);
            throw new Error('Failed to schedule task');
        }
    }

    async getAllTasks(): Promise<(Task & { schedule: Schedule[] })[]> {
        try {
            const tasks = await prisma.task.findMany({
                include: { schedule: true },
                orderBy: { task_id: 'asc' }
            });
            console.log(` Retrieved ${tasks.length} tasks`);
            return tasks;
        } catch (error: any) {
            console.error(' Error in getAllTasks:', error);
            throw new Error('Failed to retrieve tasks');
        }
    }

    async updateTask(taskId: number, taskName: string): Promise<Task> {
        if (!Number.isInteger(taskId)) {
            throw new Error('Invalid task ID');
        }
        if (!taskName || typeof taskName !== 'string' || taskName.length > 255) {
            throw new Error('Invalid task name: must be a string under 255 characters.');
        }

        try {
            const updated = await prisma.task.update({
                where: { task_id: taskId },
                data: { task_name: taskName }
            });
            console.log(` Updated task ${taskId} name to "${taskName}"`);
            return updated;
        } catch (error: any) {
            console.error(' Error in updateTask:', error);
            throw new Error('Failed to update task');
        }
    }

    async deleteTask(taskId: number): Promise<Task> {
        if (!Number.isInteger(taskId)) {
            throw new Error('Invalid task ID');
        }

        try {
            const deleted = await prisma.task.delete({
                where: { task_id: taskId }
            });
            console.log(` Deleted task ${taskId}`);
            return deleted;
        } catch (error: any) {
            console.error(' Error in deleteTask:', error);
            throw new Error('Failed to delete task');
        }
    }
}