
// src/main/services/taskService.js
import { db } from '../db/connection.js';

export class TaskService {
    /**
     * Creates a new task
     * @param {string} taskName - Name of the task (max 255 characters)
     * @returns {Promise<{task_id: number}>}
     * @throws {Error} If task creation fails or validation fails
     */
    async createTask(taskName) {
        if (!taskName || typeof taskName !== 'string' || taskName.length > 255) {
            throw new Error('Invalid task name. Must be a string with maximum 255 characters.');
        }

        try {
            const sql = 'INSERT INTO tasks (task_name) VALUES (?)';
            const result = await db.query(sql, [taskName]);
            return { task_id: result.insertId };
        } catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Failed to create task: ' + error.message);
        }
    }

    /**
     * Schedules a task for a specific day and time
     * @param {number} taskId - Task ID
     * @param {number} dayOfWeek - Day of week (1-7, Monday to Sunday)
     * @param {string} startTime - Start time in HH:MM:SS format
     * @param {string} endTime - End time in HH:MM:SS format
     * @throws {Error} If scheduling fails or validation fails
     */
    async scheduleTask(taskId, dayOfWeek, startTime, endTime) {
        if (!taskId || !Number.isInteger(taskId)) {
            throw new Error('Invalid task ID');
        }
        if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) {
            throw new Error('Invalid day of week. Must be between 1 (Monday) and 7 (Sunday)');
        }
        if (!startTime || !endTime) {
            throw new Error('Start time and end time are required');
        }

        try {
            const sql = 'INSERT INTO weekly_schedule (task_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)';
            return await db.query(sql, [taskId, dayOfWeek, startTime, endTime]);
        } catch (error) {
            console.error('Error scheduling task:', error);
            throw new Error('Failed to schedule task: ' + error.message);
        }
    }

    /**
     * Gets all tasks scheduled for a specific day
     * @param {number} dayOfWeek - Day of week (1-7, Monday to Sunday)
     * @returns {Promise<Array>} List of tasks with their schedule
     */
    async getTasksByDay(dayOfWeek) {
        if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) {
            throw new Error('Invalid day of week. Must be between 1 (Monday) and 7 (Sunday)');
        }

        try {
            const sql = `
                SELECT t.task_id, t.task_name, t.created_at, t.updated_at,
                       ws.start_time, ws.end_time 
                FROM tasks t 
                JOIN weekly_schedule ws ON t.task_id = ws.task_id 
                WHERE ws.day_of_week = ?
                ORDER BY ws.start_time`;
            return await db.query(sql, [dayOfWeek]);
        } catch (error) {
            console.error('Error fetching tasks by day:', error);
            throw new Error('Failed to fetch tasks: ' + error.message);
        }
    }

    /**
     * Gets all tasks with their schedule days
     * @returns {Promise<Array>} List of all tasks
     */
    async getAllTasks() {
        try {
            const sql = `
                SELECT t.task_id, t.task_name, t.created_at, t.updated_at,
                       GROUP_CONCAT(ws.day_of_week) as scheduled_days 
                FROM tasks t 
                LEFT JOIN weekly_schedule ws ON t.task_id = ws.task_id 
                GROUP BY t.task_id`;
            return await db.query(sql);
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            throw new Error('Failed to fetch tasks: ' + error.message);
        }
    }

    /**
     * Updates a task's name
     * @param {number} taskId - Task ID
     * @param {string} taskName - New task name
     * @returns {Promise<{affectedRows: number}>}
     */
    async updateTask(taskId, taskName) {
        if (!taskId || !Number.isInteger(taskId)) {
            throw new Error('Invalid task ID');
        }
        if (!taskName || typeof taskName !== 'string' || taskName.length > 255) {
            throw new Error('Invalid task name. Must be a string with maximum 255 characters.');
        }

        try {
            const sql = 'UPDATE tasks SET task_name = ? WHERE task_id = ?';
            return await db.query(sql, [taskName, taskId]);
        } catch (error) {
            console.error('Error updating task:', error);
            throw new Error('Failed to update task: ' + error.message);
        }
    }

    /**
     * Deletes a task and its schedules (cascade delete)
     * @param {number} taskId - Task ID
     * @returns {Promise<{affectedRows: number}>}
     */
    async deleteTask(taskId) {
        if (!taskId || !Number.isInteger(taskId)) {
            throw new Error('Invalid task ID');
        }

        try {
            const sql = 'DELETE FROM tasks WHERE task_id = ?';
            return await db.query(sql, [taskId]);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw new Error('Failed to delete task: ' + error.message);
        }
    }
}