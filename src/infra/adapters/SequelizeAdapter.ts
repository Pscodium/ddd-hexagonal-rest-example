import { Sequelize } from 'sequelize';
import { injectable } from 'tsyringe';
import { environment } from '@/config/env';

@injectable()
export class SequelizeAdapter {
    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(
            environment.database.db_name,
            environment.database.username,
            environment.database.password,
            {
                host: environment.database.host,
                dialect: environment.database.dialect,
            }
        );
        this.loadModels();
    }

    public getConnection(): Sequelize {
        return this.sequelize;
    }

    public async loadModels(): Promise<void> {
        await this.sequelize.sync({ alter: true, logging: false });
    }
}