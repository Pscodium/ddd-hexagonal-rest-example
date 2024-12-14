import { Dialect } from "sequelize";

export interface EnvironmentVariables {
    port: number | string;
    database: DatabaseConnectionProps;
    integration: IntegrationProps;
}

export interface IntegrationProps {
    elastic: {
        node: string;
        auth: {
            username: string;
            password: string;
        }
    }
}

export interface DatabaseConnectionProps {
    host: string;
    db_name: string;
    username: string;
    password: string;
    dialect: Dialect;
    port: string;
    
}