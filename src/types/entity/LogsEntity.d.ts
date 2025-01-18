import { SortResults } from "@elastic/elasticsearch/lib/api/types";

export interface ILogEntity {
    _id: string | undefined;
    _score: number | null | undefined;
    _index: string;
    message: string;
    level: string;
    timestamp: string;
    sort: SortResults | undefined;
}