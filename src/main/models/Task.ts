import { Task as PrismaTask, Schedule as PrismaSchedule } from '@prisma/client';

export type Task = PrismaTask & { schedule: PrismaSchedule[] };
export type TaskSchedule = PrismaSchedule;