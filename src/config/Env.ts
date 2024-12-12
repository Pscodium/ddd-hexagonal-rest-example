import { EnvironmentVariables } from "@/types/Environment";
import dotenv from "dotenv";
dotenv.config();

export const environment: EnvironmentVariables = {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST ?? 'localhost',
        db_name: process.env.DB_NAME ?? 'ocs',
        username: process.env.DB_USER ?? 'pscodium',
        password: process.env.DB_PASSWORD ?? 'pscodium123',
        port: process.env.DB_PORT ?? '3306',
        dialect: 'mysql'
    }
};
