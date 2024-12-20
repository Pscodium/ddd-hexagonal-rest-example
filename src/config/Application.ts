/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Dependencies from '@/types/Dependencies';
import express, { Express } from 'express';
import container from '@/config/container/index';

export class App {
    private app: Express;
    private enrivonment: Dependencies['environment'];
    private elasticSearchClient: Dependencies['elasticSearchClient'];
    private userRoutes: Dependencies['userRoutes'];
    private logRoutes: Dependencies['logRoutes'];

    private sequelizeAdapter: Dependencies['sequelizeAdapter'];
    private logger: Dependencies['logger'];
    

    constructor({ environment, sequelizeAdapter, logger, elasticSearchClient, userRoutes, logRoutes }: Pick<Dependencies, 'environment' | 'sequelizeAdapter' | 'logger' | 'elasticSearchClient' | 'userRoutes' | 'logRoutes'>) {
        this.enrivonment = environment;
        this.sequelizeAdapter = sequelizeAdapter;
        this.logger = logger;
        this.elasticSearchClient = elasticSearchClient;
        this.userRoutes = userRoutes;
        this.logRoutes = logRoutes;
        this.app = express();
    }

    async start() {
        await this.elasticSearchClient.testConnection();
        await this.intializeServer();
        // console.log("Starting application... ", this.enrivonment);   // Use para debugar as envs
        // this.sequelizeAdapter.loadModels();  // Use isso se as tabelas não foram iniciadas pelo sequelize
    }


    async intializeServer() {
        this.app.locals.container = container;
        this.app.use(express.json());
        this.app.use('/api', [this.userRoutes.init(), this.logRoutes.init()]);
        this.app.listen(this.enrivonment.port, () => console.log(`Server running on port ${this.enrivonment.port}`));
    }

}