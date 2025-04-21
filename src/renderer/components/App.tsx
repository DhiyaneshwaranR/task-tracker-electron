// src/renderer/components/App.tsx
import React, { useState, useEffect } from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import { Task } from '../../main/models/Task';
import {ChevronLeft, ChevronRight} from "lucide-react"; // or from @prisma/client
import { Button } from './ui/Button';

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [visibleMonth, setVisibleMonth] = useState(3); // April = 3 (0-based)
    const [visibleYear, setVisibleYear] = useState(2025);

    const goToPreviousMonth = () => {
        if (visibleYear === 2025 && visibleMonth === 3) return;
        if (visibleMonth === 0) {
            setVisibleMonth(11);
            setVisibleYear(y => y - 1);
        } else {
            setVisibleMonth(m => m - 1);
        }
    };

    const goToNextMonth = () => {
        if (visibleMonth === 11) {
            setVisibleMonth(0);
            setVisibleYear(y => y + 1);
        } else {
            setVisibleMonth(m => m + 1);
        }
    };


    useEffect(() => {
        const loadTasks = async () => {
            try {
                const res = await window.electronAPI.getAllTasks();
                setTasks(res);
            } catch (error) {
                console.error('Failed to load tasks:', error);
            }
        };
        loadTasks();
    }, []);

    return (
        <div className="h-screen w-full overflow-hidden px-4 py-6 flex flex-col">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6">📅 Task Tracker</h1>

            {/* Month Nav Row */}
            <div className="flex justify-center items-center gap-2 mb-4">
                <Button variant="ghost" onClick={goToPreviousMonth} disabled={visibleMonth === 3 && visibleYear === 2025}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="text-xl font-semibold">
                    {new Date(visibleYear, visibleMonth).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>

                <Button variant="ghost" onClick={goToNextMonth}>
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Calendar Grid */}
            <MonthlyCalendar
                tasks={tasks}
                year={visibleYear}
                month={visibleMonth}
            />
        </div>

    );
}