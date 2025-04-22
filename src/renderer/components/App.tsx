// src/renderer/components/App.tsx
import React, { useState, useEffect } from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import { Task } from '../../main/models/Task';
import {ChevronLeft, ChevronRight} from "lucide-react";
import { Button } from './ui/Button';
import Sidebar from "./ui/Sidebar";
import Dashboard from "./dashboard/Dashboard";

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [visibleMonth, setVisibleMonth] = useState(3); // April
    const [visibleYear, setVisibleYear] = useState(2025);

    useEffect(() => {
        window.electronAPI.getAllTasks().then(setTasks);
    }, []);

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
        <div className="h-screen w-full flex overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 flex flex-col px-4 py-6 overflow-auto">
                {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}
                {activeTab === 'calendar' && (
                    <>
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <Button variant="ghost" onClick={goToPreviousMonth}><ChevronLeft /></Button>
                            <div className="text-lg ">
                                {new Date(visibleYear, visibleMonth).toLocaleString('default', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </div>
                            <Button variant="ghost" onClick={goToNextMonth}><ChevronRight /></Button>
                        </div>
                        <MonthlyCalendar tasks={tasks} year={visibleYear} month={visibleMonth} />
                    </>
                )}

                {/*{activeTab === 'meals' && </>}*/}
            </div>
        </div>

    );
}