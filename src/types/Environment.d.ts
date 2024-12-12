import { Dialect } from "sequelize";

export interface EnvironmentVariables {
    port: number | string;
    database: DatabaseConnectionProps;
}

export interface DatabaseConnectionProps {
    host: string;
    db_name: string;
    username: string;
    password: string;
    dialect: Dialect;
    port: string;
}