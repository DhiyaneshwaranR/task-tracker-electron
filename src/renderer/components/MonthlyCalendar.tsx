// src/renderer/components/MonthlyCalendar.tsx
import React from 'react';
import { Task } from '../../main/models/Task';
import {cn} from "../lib/utils";

interface MonthlyCalendarProps {
    tasks: Task[];
    year: number;
    month: number;
}

interface Day {
    date: Date;
    isCurrentMonth: boolean;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const taskColors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

function getColorForTask(taskId: number) {
    return taskColors[taskId % taskColors.length];
}

function generateMonthView(year: number, month: number): Day[] {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const startDay = start.getDay();
    const daysInMonth = end.getDate();
    const days: Day[] = [];

    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
        const prev = new Date(year, month, -i);
        days.push({ date: prev, isCurrentMonth: false });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Next month filler
    while (days.length % 7 !== 0) {
        const next = new Date(year, month + 1, days.length - daysInMonth - startDay + 1);
        days.push({ date: next, isCurrentMonth: false });
    }

    return days;
}

function formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function MonthlyCalendar({ tasks, month, year }: MonthlyCalendarProps) {
    const current = new Date(year, month);
    const days = generateMonthView(current.getFullYear(), current.getMonth());

    const getTasksForDate = (date: Date) => {
        return tasks.filter((task) =>
            task.schedule?.some((s) => {
                const dayMatch = date.getDay() === s.dayOfWeek - 1;
                return dayMatch;
            })
        );
    };

    return (
        <div className="flex flex-col h-full">
            {/*<div className="text-xl font-semibold mb-4 text-center">*/}
            {/*    {current.toLocaleString('default', { month: 'long' })} {current.getFullYear()}*/}
            {/*</div>*/}

            <div className="grid grid-cols-7 gap-px text-sm font-medium text-center bg-border border border-border">
                {daysOfWeek.map((d) => (
                    <div key={d} className="py-2 bg-background text-muted-foreground">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 flex-1 text-sm bg-border border border-border">
                {days.map(({ date, isCurrentMonth }, idx) => {
                    const dayTasks = getTasksForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <div
                            key={idx}
                            className={cn(
                                'relative p-2 flex flex-col gap-1 overflow-hidden border border-border',
                                !isCurrentMonth && 'bg-muted text-muted-foreground',
                                isToday && 'bg-gray-200'
                            )}
                        >
                            <div className="absolute top-1 right-2 text-xs font-medium text-muted-foreground">
                                {date.getDate()}
                            </div>

                            <div className="flex flex-col gap-1 mt-4">
                                {dayTasks.slice(0, 3).map((task) => {
                                    const schedule = task.schedule.find(
                                        (s) => s.dayOfWeek === date.getDay() + 1
                                    );

                                    return (
                                        <div key={task.task_id} className="flex items-center gap-1 text-xs">
                                            <div
                                                className={cn('w-1.5 h-4 rounded-full', getColorForTask(task.task_id))}
                                            />
                                            <div className="truncate">{task.task_name}</div>
                                            {schedule?.startTime && (
                                                <div className="text-[10px] text-muted-foreground ml-auto">
                                                    {formatTime(schedule.startTime)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {dayTasks.length > 3 && (
                                    <div className="text-[10px] text-muted-foreground">
                                        +{dayTasks.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}