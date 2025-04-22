import React, { useEffect, useState } from 'react';
import { Task, TaskSession } from '../../../main/models/Task';
import { cn } from '../../lib/utils';
import {Button} from "../ui/Button";

const taskColors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

function getColorForTask(taskId: number) {
    return taskColors[taskId % taskColors.length];
}

function getTaskStatus(startTime: string, endTime: string): 'upcoming' | 'past' | 'ongoing' {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const start = new Date(`${todayStr}T${startTime}`);
    const end = new Date(`${todayStr}T${endTime}`);
    if (now < start) return 'upcoming';
    if (now > end) return 'past';
    return 'ongoing';
}

function formatDateTime(input: string | Date) {
    const d = new Date(input);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function TodayTasksBoard({ tasks }: { tasks: Task[] }) {
    const today = new Date();
    const todayDayOfWeek = today.getDay() + 1;

    const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [taskSessions, setTaskSessions] = useState<Record<number, TaskSession[]>>({});

    const todayTasks = tasks.filter((task) =>
        task.schedule?.some((s) => s.dayOfWeek === todayDayOfWeek)
    );

    // Load sessions for each task
    useEffect(() => {
        (async () => {
            const updatedSessions: Record<number, TaskSession[]> = {};
            for (const task of todayTasks) {
                const sessions = await window.electronAPI.getTodayTaskSessions(task.task_id);
                updatedSessions[task.task_id] = sessions;
            }
            setTaskSessions(updatedSessions);
        })();
    }, [tasks]);

    const handleTimerToggle = async (task: Task) => {
        if (activeSessionId && activeTaskId === task.task_id) {
            const result = await window.electronAPI.endTaskSession(activeSessionId);
            updateSessions(task.task_id);
            setActiveSessionId(null);
            setActiveTaskId(null);
        } else {
            const session = await window.electronAPI.startTaskSession(task.task_id);
            setActiveSessionId(session.id);
            setActiveTaskId(task.task_id);
        }
    };

    const updateSessions = async (taskId: number) => {
        const sessions = await window.electronAPI.getTodayTaskSessions(taskId);
        setTaskSessions((prev) => ({ ...prev, [taskId]: sessions }));
    };

    const handleDelete = async (sessionId: number, taskId: number) => {
        await window.electronAPI.deleteTaskSession(sessionId);
        updateSessions(taskId);
    };

    return (
        <div className="bg-card border rounded-lg p-4 overflow-auto h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>

            {todayTasks.length === 0 ? (
                <div className="text-sm text-muted-foreground">No tasks for today.</div>
            ) : (
                todayTasks.map((task) => {
                    const schedule = task.schedule.find((s) => s.dayOfWeek === todayDayOfWeek);
                    const status = schedule ? getTaskStatus(schedule.startTime, schedule.endTime) : 'upcoming';

                    const bgColor = {
                        upcoming: 'bg-gray-100',
                        past: 'bg-red-100 text-red-800',
                        ongoing: 'bg-green-100 text-green-800',
                    }[status];

                    const isRunning = activeTaskId === task.task_id;

                    return (
                        <div key={task.task_id} className={cn('mb-4 p-3 border rounded-lg', bgColor)}>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 truncate">
                                    <div className={cn('w-1.5 h-4 rounded-full', getColorForTask(task.task_id))} />
                                    <div className="text-base font-semibold truncate">{task.task_name}</div>
                                </div>

                                <div className="text-muted-foreground px-2">|</div>

                                {schedule && (
                                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatTime(schedule.startTime)}
                                    </div>
                                )}
                            </div>

                            {/* Sessions */}
                            <ul className="mt-2 space-y-1">
                                {(taskSessions[task.task_id] || []).map((session) => (
                                    <li key={session.id} className="flex justify-between text-sm text-muted-foreground items-center">
                    <span>
                      {formatDateTime(session.startTime)} –{' '}
                        {session.endTime ? formatDateTime(session.endTime) : '...'}
                    </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(session.id, task.task_id)}
                                        >
                                            🗑
                                        </Button>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-2 flex justify-between items-center">
                                <Button size="sm" variant="outline" onClick={() => handleTimerToggle(task)}>
                                    {isRunning ? 'Stop' : 'Start'}
                                </Button>
                                {isRunning && <span className="text-xs text-green-600">⏱️ Running</span>}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}