import { Dialect } from "sequelize";

export interface EnvironmentVariables {
    port: number | string;
    database: DatabaseConnectionProps;
    integration: IntegrationProps;
    frontend_origin: string;
    frontend_domain: string;
    electron_origin: string;
}

export interface IntegrationProps {
    elastic: {
        node: string;
        auth: {
            username: string;
            password: string;
        }
    }
    storage: {
        providers: {
            storage: {
                endpoint: string;
                region: string;
                bucket: string;
                path: string;
                accessKeyId: string;
                secretAccessKey: string;
                signatureVersion: string;
            }
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