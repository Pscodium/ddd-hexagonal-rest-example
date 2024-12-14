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

    constructor() {
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
        this.models = {};
        this.loadModels();
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
                    const modelName = path.basename(file, path.extname(file));
                    this.models[modelName] = modelModule[modelName];
                }
            }
        }
        Object.keys(this.models).forEach((modelName) => {
            if (typeof this.models[modelName].associate === 'function') {
                this.models[modelName].associate(this.models);
            }
        });

        await this.sequelize.sync({ alter: true, logging: false });
        console.log('All tables has been syncronized');
    }

    public async loadModels(): Promise<void> {
        await this.associateModels();
    }
}