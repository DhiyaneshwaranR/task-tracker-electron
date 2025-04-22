// src/types/task.ts
import { Task as PrismaTask, Schedule as PrismaSchedule, TaskSession as PrismaTaskSession } from '@prisma/client';

export type ScheduleInput = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

export type Task = PrismaTask & {
    schedule: PrismaSchedule[];
};


export type TaskWithSessions = PrismaTask & {
    sessions: PrismaTaskSession[];
};

export type TaskSchedule = PrismaSchedule;
export type TaskSession = PrismaTaskSession;