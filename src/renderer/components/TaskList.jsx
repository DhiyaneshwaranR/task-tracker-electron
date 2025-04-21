// src/renderer/components/TaskList.jsx
import React from 'react'
import { TaskCard } from './TaskCard'

export function TaskList({ tasks }) {
    return (
        <div className="grid gap-4 p-4">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    )
}