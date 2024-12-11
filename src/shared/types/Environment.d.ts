import { Dialect } from "sequelize";

interface EnvironmentVariables {
    port: number | string;
    database: DatabaseConnectionProps;
}

interface DatabaseConnectionProps {
    host: string;
    db_name: string;
    username: string;
    password: string;
    dialect: Dialect;
    port: string;
}