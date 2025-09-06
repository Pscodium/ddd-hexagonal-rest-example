/* eslint-disable @typescript-eslint/no-explicit-any */
global.File = function () {} as any;
(global.File as any).prototype = {};

import fs from 'fs';
import path from 'path';
const TEMP_FILE = path.resolve(__dirname, 'mysql-testcontainer-info.json');

export default async function globalTeardown(): Promise<void> {
    if (fs.existsSync(TEMP_FILE)) {
        if ((global as any).__MYSQL_CONTAINER__) {
            await (global as any).__MYSQL_CONTAINER__.stop();
        }
        fs.unlinkSync(TEMP_FILE);
    }
}
