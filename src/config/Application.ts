/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Dependencies from '@/types/Dependencies';
import express, { Express } from 'express';
import container from '@/config/container/index';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import docs from './api/openapi.json';
import { IAllowedOrigins, IOptions } from '@/types/config/Aplication';

export class App {
    private app: Express;
    private enrivonment: Dependencies['environment'];
    private elasticSearchClient: Dependencies['elasticSearchClient'];
    private userRoutes: Dependencies['userRoutes'];
    private logRoutes: Dependencies['logRoutes'];
    private allowedOrigins: IAllowedOrigins;
    private options: IOptions;

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

        this.allowedOrigins = [environment.frontend_origin, environment.electron_origin];
        this.options = {
            origin: this.allowedOrigins,
            credentials: true
        };
    }

    async start() {
        await this.elasticSearchClient.testConnection();
        await this.intializeServer();
        // console.log("Starting application... ", this.enrivonment);   // Use para debugar as envs
        // this.sequelizeAdapter.loadModels();  // Use isso se as tabelas não foram iniciadas pelo sequelize
    }


    async intializeServer() {
        this.app.locals.container = container;
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(cors(this.options));
        this.app.use('/api-docs', swaggerUi.serve);
        this.app.get('/api-docs', swaggerUi.setup(docs));
        this.app.use('/api', [this.userRoutes.init(), this.logRoutes.init()]);
        this.app.listen(this.enrivonment.port, () => console.log(`Server running on port ${this.enrivonment.port}`));
    }

}