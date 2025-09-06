/* eslint-disable @typescript-eslint/no-explicit-any */
global.File = function () {} as any;
(global.File as any).prototype = {};

import fs from 'fs';
import path from 'path';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

const TEMP_FILE = path.resolve(__dirname, 'mysql-testcontainer-info.json');

export default async function globalSetup(): Promise<void> {
    const container: StartedMySqlContainer = await new MySqlContainer('mysql:8.0')
        .withDatabase('testdb')
        .withUsername('testuser')
        .withUserPassword('testpass')
        .withRootPassword('testpassroot')
        .withCommand([
            '--character-set-server=utf8mb4',
            '--collation-server=utf8mb4_unicode_ci',
        ])
        .start();

    const info = {
        host: container.getHost(),
        port: container.getPort(),
        db: container.getDatabase(),
        user: container.getUsername(),
        pass: container.getUserPassword(),
        connectionString: `mysql://${container.getUsername()}:${container.getUserPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`,
    };

    fs.writeFileSync(TEMP_FILE, JSON.stringify(info));
    (global as any).__MYSQL_CONTAINER__ = container;
}
