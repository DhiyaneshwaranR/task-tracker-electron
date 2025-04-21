-- Create database
CREATE DATABASE IF NOT EXISTS TaskTracker;
USE TaskTracker;

-- Drop child tables first to handle foreign key constraints
DROP TABLE IF EXISTS task_executions;
DROP TABLE IF EXISTS weekly_schedule;
-- Drop parent table last
DROP TABLE IF EXISTS tasks;


-- Tasks table
CREATE TABLE tasks (
    task_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- WeeklySchedule table
CREATE TABLE weekly_schedule (
    schedule_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    day_of_week TINYINT NOT NULL, -- 1 (Monday) to 7 (Sunday)
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    -- Ensure no duplicate schedules for the same task on the same day
    UNIQUE KEY unique_task_day (task_id, day_of_week)
);

-- TaskExecution table (optional - for tracking completion history)
CREATE TABLE task_executions (
    execution_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    execution_date DATE NOT NULL,
    completion_status BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);