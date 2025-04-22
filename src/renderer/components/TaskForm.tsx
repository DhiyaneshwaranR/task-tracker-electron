import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Task, ScheduleInput } from '../../main/models/Task'; // Make sure this path is correct

const daysOfWeek = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' },
];

interface TaskFormProps {
    onSubmit: (formData: { taskName: string; schedule: ScheduleInput[] }) => void;
    initialData?: Task;
}

export function TaskForm({ onSubmit, initialData }: TaskFormProps) {
    const [formData, setFormData] = useState<{
        taskName: string;
        schedule: ScheduleInput[];
    }>({
        taskName: initialData?.task_name || '',
        schedule:
            initialData?.schedule?.map(({ dayOfWeek, startTime, endTime }) => ({
                dayOfWeek,
                startTime,
                endTime,
            })) || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const toggleDay = (dayId: number) => {
        const exists = formData.schedule.find((s) => s.dayOfWeek === dayId);

        if (exists) {
            setFormData({
                ...formData,
                schedule: formData.schedule.filter((s) => s.dayOfWeek !== dayId),
            });
        } else {
            const updatedSchedule = [
                ...formData.schedule,
                {
                    dayOfWeek: dayId,
                    startTime: '09:00',
                    endTime: '17:00',
                },
            ];
            setFormData({
                ...formData,
                schedule: updatedSchedule,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium">Task Name</label>
                <input
                    type="text"
                    value={formData.taskName}
                    onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-input px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Schedule</label>
                <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                        <Button
                            key={day.id}
                            type="button"
                            variant={
                                formData.schedule.some((s) => s.dayOfWeek === day.id)
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => toggleDay(day.id)}
                        >
                            {day.name}
                        </Button>
                    ))}
                </div>
            </div>

            {formData.schedule.map((schedule) => (
                <div key={schedule.dayOfWeek} className="flex gap-4">
                    <div>
                        <label className="block text-sm font-medium">Start Time</label>
                        <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => {
                                const updated = formData.schedule.map((s) =>
                                    s.dayOfWeek === schedule.dayOfWeek
                                        ? { ...s, startTime: e.target.value }
                                        : s
                                );
                                setFormData({ ...formData, schedule: updated });
                            }}
                            className="mt-1 block rounded-md border border-input px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">End Time</label>
                        <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => {
                                const updated = formData.schedule.map((s) =>
                                    s.dayOfWeek === schedule.dayOfWeek
                                        ? { ...s, endTime: e.target.value }
                                        : s
                                );
                                setFormData({ ...formData, schedule: updated });
                            }}
                            className="mt-1 block rounded-md border border-input px-3 py-2"
                        />
                    </div>
                </div>
            ))}

            <Button type="submit" className="w-full">
                {initialData ? 'Update Task' : 'Create Task'}
            </Button>
        </form>
    );
}