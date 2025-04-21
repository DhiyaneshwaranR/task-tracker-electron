// src/renderer/components/App.jsx
import React, { useState, useEffect } from 'react';
import { TaskForm } from './TaskForm';
import { WeeklyView } from './WeeklyView';
import { Button } from './ui/Button';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        if (!window.electronAPI) {
            console.error('🚨 electronAPI not available on window');
            return;
        }

        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const tasks = await window.electronAPI.getAllTasks();
            setTasks(tasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedTask) {
                await window.electronAPI.updateTask(selectedTask.task_id, formData);
            } else {
                await window.electronAPI.createTask(formData);
            }
            await loadTasks();
            setIsFormOpen(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    const handleTaskComplete = async (taskId, dayOfWeek) => {
        try {
            await window.electronAPI.markTaskComplete(
                taskId,
                new Date().toISOString().split('T')[0]
            );
            await loadTasks();
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Task Tracker</h1>
                <Button onClick={() => setIsFormOpen(true)}>Add New Task</Button>
            </div>

            <WeeklyView
                tasks={tasks}
                onTaskClick={(task) => {
                    setSelectedTask(task);
                    setIsFormOpen(true);
                }}
                onTaskComplete={handleTaskComplete}
            />

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-background p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedTask ? 'Edit Task' : 'New Task'}
                        </h2>
                        <TaskForm
                            onSubmit={handleSubmit}
                            initialData={selectedTask}
                        />
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsFormOpen(false);
                                setSelectedTask(null);
                            }}
                            className="mt-4"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}