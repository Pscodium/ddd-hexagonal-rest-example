/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Sequelize } from 'sequelize';
import { environment } from '@/config/Environment';
import path from 'path';
import fs from 'fs';

export class SequelizeAdapter {
    private sequelize: Sequelize;
    private models: { [key: string]: any };
    private isTest: boolean;

    constructor() {
        this.isTest = process.env.NODE_ENV === 'test'; // testar o uso do this.environment como injeção
        this.sequelize = {} as Sequelize;
        this.models = {};
        if (!this.isTest) {
            this.sequelize = new Sequelize(
                environment.database.db_name,
                environment.database.username,
                environment.database.password,
                {
                    host: environment.database.host,
                    dialect: environment.database.dialect,
                    logging: false
                }
            );
            this.loadModels();
        }
    }

    public async createTestInstance(connectionString: string): Promise<Sequelize> {
        this.sequelize = new Sequelize(connectionString, { logging: false, dialect: 'mysql' });
        this.loadModels();

        return this.sequelize;
    }

    public setConnection(sequelize: Sequelize) {
        this.sequelize = sequelize;
    }

    public getConnection(): Sequelize {
        return this.sequelize;
    }

    public async associateModels() {
        const modelsPath = path.join(__dirname, '../orm/sequelize/models');
        const files = fs.readdirSync(modelsPath);
        
        for (const file of files) {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                const modelModule = await import(path.join(modelsPath, file));
                
                const initModel = modelModule[`init${path.basename(file, path.extname(file))}`];
                if (initModel) {
                    initModel(this.sequelize);
                    const modelFileName = path.basename(file, path.extname(file));
                    const modelName = modelFileName.replace(/Sequelize|Model/gm, '');

                    this.models[modelName] = modelModule[modelFileName];
                }
            }
        }
        Object.keys(this.models).forEach((modelName) => {
            if (typeof this.models[modelName].associate === 'function') {
                this.models[modelName].associate(this.models);
            }
        });

        if (!this.isTest) {
            await this.sequelize.sync({ alter: true, logging: false });
            
            console.log('All tables have been synchronized');
        }
    }

    public async cleanDatabase(): Promise<void> {
        await this.sequelize.drop();
        await this.sequelize.sync();
    }

    public async loadModels(): Promise<void> {
        await this.associateModels();
    }
}