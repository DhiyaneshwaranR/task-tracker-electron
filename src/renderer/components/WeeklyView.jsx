// src/renderer/components/WeeklyView.jsx
import React from 'react';
import { Button } from './ui/Button';

const daysOfWeek = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
  { id: 7, name: 'Sunday' },
];

export function WeeklyView({ tasks, onTaskClick, onTaskComplete }) {
  return (
      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
            <div key={day.id} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">{day.name}</h3>
              <div className="space-y-2">
                {tasks
                    .filter(
                        (task) =>
                            Array.isArray(task.schedule) &&
                            task.schedule.some((s) => s.dayOfWeek === day.id)
                    )
                    .sort((a, b) => {
                      const aTime =
                          a.schedule?.find((s) => s.dayOfWeek === day.id)?.startTime || '';
                      const bTime =
                          b.schedule?.find((s) => s.dayOfWeek === day.id)?.startTime || '';
                      return aTime.localeCompare(bTime);
                    })
                    .map((task) => {
                      const schedule = task.schedule?.find((s) => s.dayOfWeek === day.id);
                      return (
                          <div
                              key={task.task_id}
                              className="border rounded p-2 bg-card hover:bg-accent cursor-pointer"
                              onClick={() => onTaskClick(task)}
                          >
                            <div className="font-medium">{task.task_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {schedule?.startTime} - {schedule?.endTime}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTaskComplete(task.task_id, day.id);
                                }}
                            >
                              Complete
                            </Button>
                          </div>
                      );
                    })}
              </div>
            </div>
        ))}
      </div>
  );
}