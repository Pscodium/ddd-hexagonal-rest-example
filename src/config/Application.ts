/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Dependencies from '@/types/Dependencies';

export class App {
    private enrivonment: Dependencies['environment'];
    private sequelizeAdapter: Dependencies['sequelizeAdapter'];
    private logger: Dependencies['logger'];
    private elasticSearchClient: Dependencies['elasticSearchClient'];

    constructor({ environment, sequelizeAdapter, logger, elasticSearchClient }: Pick<Dependencies, 'environment' | 'sequelizeAdapter' | 'logger' | 'elasticSearchClient'>) {
        this.enrivonment = environment;
        this.sequelizeAdapter = sequelizeAdapter;
        this.logger = logger;
        this.elasticSearchClient = elasticSearchClient;
    }

    async start() {
        // console.log("Starting application... ", this.enrivonment);   // Use para debugar as envs
        await this.elasticSearchClient.testConnection();
        // this.sequelizeAdapter.loadModels();  // Use isso se as tabelas não foram iniciadas pelo sequelize
    }

}