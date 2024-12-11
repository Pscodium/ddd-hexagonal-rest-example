import { Sequelize } from 'sequelize';
import { environment } from '@/config/Env';

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
                logging: false
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