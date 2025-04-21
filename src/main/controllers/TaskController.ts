// src/main/controllers/TaskController.ts
import { TaskService } from '../services/TaskService.js';
const taskService = new TaskService();

export class TaskController {
    async createOrScheduleTask(data: any) {
        if (data.taskId) {
            return await taskService.scheduleTask(
                data.taskId,
                data.dayOfWeek,
                data.startTime,
                data.endTime
            );
        } else {
            const createdTask = await taskService.createTask(data.taskName);
            if (data.schedule && Array.isArray(data.schedule)) {
                for (const entry of data.schedule) {
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
    }

    async getAllTasks() {
        return await taskService.getAllTasks();
    }

    async updateTask(taskId: number, taskName: string) {
        return await taskService.updateTask(taskId, taskName);
    }

    async markTaskComplete(taskId: number, scheduledDate: string) {
        // Stubbed logic (implement if needed)
        return { taskId, scheduledDate, status: 'complete (not implemented)' };
    }
}