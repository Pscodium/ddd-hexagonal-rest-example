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
    },
    integration: {
        elastic: {
            node: process.env.ELASTIC_HOST ?? '',
            auth: {
                password: process.env.ELASTIC_PASSWORD ?? '', 
                username: process.env.ELASTIC_USERNAME ?? ''
            }
        }
    },
    frontend_domain: process.env.FRONTEND_DOMAIN ?? 'localhost',
    frontend_origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:2304',
    electron_origin: process.env.ELECTRON_ORIGIN ?? 'http://localhost:5173'
};
