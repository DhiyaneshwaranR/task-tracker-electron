// src/main/db/init.js
import mysql from 'mysql2/promise';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { dbConfig } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initializeDatabase() {
    let connection;
    try {
        // First connect without database to create it
        const initialConfig = { ...dbConfig };
        delete initialConfig.database;
        
        connection = await mysql.createConnection(initialConfig);
        
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'migrations/init.sql');
        const sqlContent = await fs.readFile(sqlFile, 'utf8');
        
        // Split SQL content into individual statements
        const statements = sqlContent
            .split(';')
            .filter(statement => statement.trim().length > 0);
        
        // Execute each statement
        for (const statement of statements) {
            await connection.query(statement);
            console.log('Executed:', statement.slice(0, 50) + '...');
        }
        
        console.log('Database initialized successfully');
        
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Execute initialization
initializeDatabase().catch(console.error);