import { Logs } from "@/domain/entities/elastic/Logs";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";

export interface ILogsRepository {
    get(): Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>>;
    getWithFormat(): Promise<Logs[]>
};