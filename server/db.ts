import {Pool} from "pg";
import type { QueryResult } from 'pg';

import dotenv from "dotenv";
dotenv.config();

export const dbPool = new Pool({
    host: process.env.DB_HOST,       // e.g. "localhost" or "db" in docker-compose
    port: Number(process.env.DB_PORT) || 5433,
    user: process.env.DB_USERNAME,   // e.g. "char"
    password: String(process.env.DB_PASSWORD), // e.g. "123"
    database: process.env.DB_DATABASE, // e.g. "test"
});

export async function query<T = never>(
    text: string,
    params?: (any)[]
): Promise<QueryResult> {
    return dbPool.query(text, params);
}