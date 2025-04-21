import React from 'react';
import { Task } from '../../main/models/Task';
import {cn} from "../lib/utils"; // or @prisma/client

interface DashboardProps {
    tasks: Task[];
}

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

export default function Dashboard({ tasks }: DashboardProps) {
    const today = new Date();
    const todayDayOfWeek = today.getDay() + 1; // Sun=0 → 1-7
    const todayTasks = tasks.filter((task) =>
        task.schedule?.some((s) => s.dayOfWeek === todayDayOfWeek)
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Left: Today’s Tasks */}
            <div className="bg-card border rounded-lg p-4 overflow-auto h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>

                {todayTasks.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No tasks for today.</div>
                ) : (
                    todayTasks.map((task) => {
                        const schedule = task.schedule.find(
                            (s) => s.dayOfWeek === todayDayOfWeek
                        );

                        const status = schedule ? getTaskStatus(schedule.startTime, schedule.endTime) : 'upcoming';

                        const bgColor = {
                            upcoming: 'bg-gray-100',
                            past: 'bg-red-100 text-red-800',
                            ongoing: 'bg-green-100 text-green-800', // optional
                        }[status];

                        return (
                            <div
                                key={task.task_id}
                                className={cn('mb-4 p-3 border rounded-lg', bgColor)}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    {/* Left: Colour + Task Name */}
                                    <div className="flex items-center gap-2 flex-1 truncate">
                                        <div className={cn('w-1.5 h-4 rounded-full', getColorForTask(task.task_id))} />
                                        <div className="text-base font-semibold truncate">{task.task_name}</div>
                                    </div>

                                    {/* Divider bar */}
                                    <div className="text-muted-foreground px-2">|</div>

                                    {/* Right: Start Time */}
                                    {schedule && (
                                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                                            {formatTime(schedule.startTime)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Middle Section */}
            <div className="bg-card border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Middle Section</h2>
                <div className="text-sm text-muted-foreground">Reserved</div>
            </div>

            {/* Right Section */}
            <div className="bg-card border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Right Section</h2>
                <div className="text-sm text-muted-foreground">Reserved</div>
            </div>
        </div>
    );
}

function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}