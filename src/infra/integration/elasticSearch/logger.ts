import Dependencies from "@/types/Dependencies";
import { Client } from "@elastic/elasticsearch";

export class Logger {
    private elasticSearchClient: Dependencies['elasticSearchClient'];
    private client: Client;
    private indexName: string;
    constructor({ elasticSearchClient }: Pick<Dependencies, 'elasticSearchClient'>) {
        this.elasticSearchClient = elasticSearchClient;
        this.client = this.elasticSearchClient.getClient();
        this.indexName = 'logs';
        this.initializeIndex();
    }

    private async initializeIndex(): Promise<void> {
        try {
            const exists = await this.client.indices.exists({ index: this.indexName });
            if (!exists) {
                await this.client.indices.create({
                    index: this.indexName,
                    mappings: {
                        properties: {
                            level: { type: 'keyword' },
                            message: { type: 'text' },
                            timestamp: { type: 'date' },
                        },
                    },
                });
                console.log(`Índice '${this.indexName}' criado com sucesso.`);
            } else {
                console.log(`Índice '${this.indexName}' já existe.`);
            }
        } catch (error) {
            console.error('Erro ao inicializar o índice:', error);
        }
    }

    private async log(level: string, message: string): Promise<void> {
        try {
            await this.client.index({
                index: this.indexName,
                document: {
                    level,
                    message,
                    timestamp: new Date().toISOString(),
                },
            });
            console.log(`Log registrado: [${level}] ${message}`);
        } catch (error) {
            console.error('Erro ao registrar log:', error);
        }
    }

    public async info(message: string): Promise<void> {
        await this.log('INFO', message);
    }
    
    public async warn(message: string): Promise<void> {
        await this.log('WARN', message);
    }
    
    public async error(message: string): Promise<void> {
        await this.log('ERROR', message);
    }
}