import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { Client } from '@elastic/elasticsearch';

export class ElasticSearchClient {
    public client: Client;
    private environment: Dependencies['environment'];
    constructor({ environment }: Pick<Dependencies, 'environment'>) {
        this.environment = environment;
        this.client = this.instanceClient();
    }


    private instanceClient(): Client {
        const callName = `${this.constructor.name}.${this.instanceClient.name}()`;
        try {
            const client = new Client({
                node: this.environment.integration.elastic.node,
                auth: {
                    username: this.environment.integration.elastic.auth.username,
                    password: this.environment.integration.elastic.auth.password
                }
            });
    
            return client;
        } catch (err) {
            throw new AppError(`Error on ${callName} \nStack: ${err}`, 500);
        }
    }

    async testConnection(): Promise<void> {
        try {
            const health = await this.client.cluster.health();
            console.log('ElasticSearch Status ON - ', health.status);
        } catch (err) {
            throw new AppError('Error on test Elastic Search connection.', 500);
        }
    }

    public getClient(): Client {
        return this.client;
    }
}