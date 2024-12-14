import { Logs } from "@/domain/entities/elastic/Logs";
import { ILogsRepository } from "@/domain/repositories/elastic/ILogsRepository";
import Dependencies from "@/types/Dependencies";
import { Client } from "@elastic/elasticsearch";
import { SearchResponse, AggregationsAggregate } from "@elastic/elasticsearch/lib/api/types";


export class ElasticSearchLogsRepository implements ILogsRepository {
    private elasticSearchClient: Dependencies['elasticSearchClient'];
    private client: Client;
    constructor({ elasticSearchClient }: Pick<Dependencies, 'elasticSearchClient'>) {
        this.elasticSearchClient = elasticSearchClient;
        this.client = this.elasticSearchClient.getClient();
    }

    async get(): Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>> {
        const logs = await this.client.search({
            index: 'logs',
            query: {
                match_all: {},
            },
            sort: [{ timestamp: { order: 'desc' } }],
        });

        return logs;
    }

    async getWithFormat(): Promise<Logs[]> {
        const raw_logs = await this.client.search({
            index: 'logs',
            query: {
                match_all: {},
            },
            sort: [{ timestamp: { order: 'desc' } }],
        });

        const logs: Logs[] = raw_logs.hits.hits.map((obj) => {
            const source = obj._source as Logs;
            
            return {
                _id: obj._id,
                _index: obj._index,
                _score: obj._score,
                message: source.message,
                level: source.level,
                timestamp: source.timestamp,
                sort: obj.sort
            };
        });

        return logs;
    }
}