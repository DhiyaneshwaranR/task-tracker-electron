import React, {useEffect, useState} from 'react';
import {Task} from '../../main/models/Task';
import Sidebar from './ui/Sidebar';
import Dashboard from './dashboard/Dashboard';
import TaskView from "./TaskView";

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [visibleMonth, setVisibleMonth] = useState(3); // April
    const [visibleYear, setVisibleYear] = useState(2025);

    const loadTasks = async () => {
        try {
            const res = await window.electronAPI.getAllTasks();
            setTasks(res);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <div className="h-screen w-full flex overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 flex flex-col px-4 py-6 overflow-auto">
                {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}

                {activeTab === 'calendar' &&
                    <TaskView
                        tasks={tasks}
                        visibleMonth={visibleMonth}
                        visibleYear={visibleYear}
                        setVisibleMonth={setVisibleMonth}
                        setVisibleYear={setVisibleYear}
                        reloadTasks={loadTasks}
                    />
                }

                {/* {activeTab === 'meals' && <MealTracker />} */}
            </div>
        </div>
    );
}