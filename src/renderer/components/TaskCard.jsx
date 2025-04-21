// src/renderer/components/TaskCard.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Check, Clock, Trash2 } from 'lucide-react'

export function TaskCard({ task }) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(task.dueDate).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{task.description}</p>
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" size="sm" onClick={() => console.log('Mark complete')}>
                    <Check className="mr-2 h-4 w-4" />
                    Complete
                </Button>
                <Button variant="destructive" size="sm" onClick={() => console.log('Delete task')}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    )
}