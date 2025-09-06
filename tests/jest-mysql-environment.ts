/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
global.File = function () {} as any;
(global.File as any).prototype = {};

import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';
import fs from 'fs';
import path from 'path';

export default class MySqlJestEnvironment extends NodeEnvironment {

    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context);
    }

    async setup(): Promise<void> {
        await super.setup();
        const TEMP_FILE = path.resolve(__dirname, 'mysql-testcontainer-info.json');
        if (fs.existsSync(TEMP_FILE)) {
            const info = JSON.parse(fs.readFileSync(TEMP_FILE, 'utf8'));
            this.global.process.env.TEST_DB_HOST = info.host;
            this.global.process.env.TEST_DB_PORT = String(info.port);
            this.global.process.env.TEST_DB_NAME = info.db;
            this.global.process.env.TEST_DB_USER = info.user;
            this.global.process.env.TEST_DB_PASS = info.pass;
            this.global.process.env.TEST_DB_URL = info.connectionString;
        } else {
            throw new Error('MySQL testcontainer info file not found. Did you forget to run globalSetup?');
        }
    }

    async teardown(): Promise<void> {
        await super.teardown();
    }
}
