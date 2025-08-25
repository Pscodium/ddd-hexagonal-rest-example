/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
process.env.NODE_ENV = 'test';
global.File = function () {} as any;
(global.File as any).prototype = {};

import 'reflect-metadata';
import container from "@/config/container";
import Dependencies from "@/types/Dependencies";
jest.mock('aws-sdk');

let sequelizeAdapter: Dependencies['sequelizeAdapter'];

beforeAll(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Isso remove os logs de erro, comente isso sempre que quiser console.error
    sequelizeAdapter = await container.resolve("sequelizeAdapter");
    if (sequelizeAdapter && typeof sequelizeAdapter.createTestInstance === "function") {
        // Use uma connection string de teste, por exemplo:
        const connectionString = global.process.env.TEST_DB_URL;
        await sequelizeAdapter.createTestInstance(connectionString ?? '');
        const sequelize = sequelizeAdapter.getConnection();
        await sequelize.authenticate();
        await sequelize.sync({ force: true, logging: false });
        console.log('All tables have been synchronized (TEST)');
    }
});

jest.mock('@/infra/integration/elasticSearch/client', () => ({
    ElasticSearchClient: jest.fn().mockImplementation(() => ({
        testConnection: jest.fn().mockResolvedValue(undefined),
        client: { cluster: { health: jest.fn().mockResolvedValue({ status: 'yellow' }) } },
        getClient: jest.fn().mockReturnValue({
            search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
        }),
    })),
}));
jest.mock('@/infra/integration/elasticSearch/logger', () => ({
    Logger: jest.fn().mockImplementation(() => ({
        initializeIndex: jest.fn().mockResolvedValue(undefined),
        error: jest.fn((message) => {
            console.log('[LOGGER] - ', message);
        }),
    })),
}));
jest.mock('express', () => {
    const expressMock = () => ({
        use: jest.fn(),
        get: jest.fn(),
        listen: jest.fn((port, cb) => cb && cb()),
        locals: {},
    });
    expressMock.Router = jest.fn(() => ({
        post: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
        put: jest.fn(),
    }));
    return {
        __esModule: true,
        default: expressMock,
        Router: expressMock.Router,
        static: jest.fn(),
    };
});

afterAll(async () => {
    (console.error as jest.Mock).mockRestore(); // restaura logs de erro
    if (sequelizeAdapter && typeof sequelizeAdapter.getConnection === "function") {
        const sequelize = sequelizeAdapter.getConnection();
        await sequelize.close();
    }
});


export { container };