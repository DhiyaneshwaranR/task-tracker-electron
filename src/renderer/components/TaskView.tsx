// src/renderer/components/TaskView.tsx
import React, { useState } from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Task } from '../../main/models/Task';
import { TaskForm } from './TaskForm';

interface TaskViewProps {
    tasks: Task[];
    visibleMonth: number;
    visibleYear: number;
    setVisibleMonth: (month: number) => void;
    setVisibleYear: (year: number) => void;
    reloadTasks: () => void;
}

export default function TaskView({
                                     tasks,
                                     visibleMonth,
                                     visibleYear,
                                     setVisibleMonth,
                                     setVisibleYear,
                                     reloadTasks,
                                 }: TaskViewProps) {
    const [view, setView] = useState<'calendar' | 'task'>('calendar');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const goToPreviousMonth = () => {
        if (visibleYear === 2025 && visibleMonth === 3) return;
        if (visibleMonth === 0) {
            setVisibleMonth(11);
            setVisibleYear(visibleYear - 1);
        } else {
            setVisibleMonth(visibleMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (visibleMonth === 11) {
            setVisibleMonth(0);
            setVisibleYear(visibleYear + 1);
        } else {
            setVisibleMonth(visibleMonth + 1);
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (selectedTask) {
                await window.electronAPI.updateTask(selectedTask.task_id, formData);
            } else {
                await window.electronAPI.createTask(formData);
            }

            await reloadTasks();
            setIsFormOpen(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Button onClick={() => setIsFormOpen(true)}>+ Add Task</Button>
                </div>
                {/* Left - Month nav */}


                {/* Centre - Month label */}
                <div className="text-lg font-semibold text-center">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={goToPreviousMonth} disabled={visibleMonth === 3 && visibleYear === 2025}>
                            <ChevronLeft />
                        </Button>
                        {new Date(visibleYear, visibleMonth).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                        })}
                        <Button variant="ghost" onClick={goToNextMonth}>
                            <ChevronRight />
                        </Button>
                    </div>
                </div>

                {/* Right - Add Task + Toggle View */}
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setView(view === 'calendar' ? 'task' : 'calendar')}>
                        {view === 'calendar' ? '→ Task View' : '← Calendar View'}
                    </Button>
                </div>
            </div>

            {view === 'calendar' && (
                <MonthlyCalendar
                    tasks={tasks}
                    year={visibleYear}
                    month={visibleMonth}
                />
            )}

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedTask ? 'Edit Task' : 'New Task'}
                        </h2>
                        <TaskForm onSubmit={handleSubmit} initialData={selectedTask || undefined} />
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