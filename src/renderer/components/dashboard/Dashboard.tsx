import React from 'react';
import { Task } from '../../../main/models/Task';
import TodayTasksBoard from "./TodayTaskBoard"; // or @prisma/client

interface DashboardProps {
    tasks: Task[];
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
            <TodayTasksBoard tasks={tasks} />

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