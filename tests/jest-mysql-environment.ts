/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
global.File = function () {} as any;
(global.File as any).prototype = {};

import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

export default class MySqlJestEnvironment extends NodeEnvironment {
    private container?: StartedMySqlContainer;

    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context);
    }

    async setup(): Promise<void> {
        await super.setup();

        // sobe container MySQL
        this.container = await new MySqlContainer('mysql:8.0')
            .withDatabase('testdb')
            .withUsername('testuser')
            .withUserPassword('testpass')
            .withRootPassword('testpassroot')
            .withCommand([
                "--character-set-server=utf8mb4",
                "--collation-server=utf8mb4_unicode_ci",
            ])
            .start();

        const host = this.container.getHost();
        const port = this.container.getPort();
        const db   = this.container.getDatabase();
        const user = this.container.getUsername();
        const pass = this.container.getUserPassword();
        const connectionString = `mysql://${user}:${pass}@${host}:${port}/${db}`;

        this.global.process.env.TEST_DB_HOST = host;
        this.global.process.env.TEST_DB_PORT = String(port);
        this.global.process.env.TEST_DB_NAME = db;
        this.global.process.env.TEST_DB_USER = user;
        this.global.process.env.TEST_DB_PASS = pass;
        this.global.process.env.TEST_DB_URL = connectionString;

        // guarda referência para teardown
        (this.global as any).__MYSQL_CONTAINER__ = this.container;
    }

    async teardown(): Promise<void> {
        const ctn: StartedMySqlContainer | undefined = (this.global as any).__MYSQL_CONTAINER__;
        if (ctn) {
            await ctn.stop();
            (this.global as any).__MYSQL_CONTAINER__ = undefined;
        }
        await super.teardown();
    }
}
