import { LogEntity } from "@/types/entity/LogsEntity";
import { SortResults } from "@elastic/elasticsearch/lib/api/types";

export class Logs implements LogEntity {
    _id: string | undefined;
    _index: string;
    _score: number | null | undefined;
    message: string;
    level: string;
    timestamp: string;
    sort: SortResults | undefined;
    constructor({ _id, _index, _score, message, level, timestamp, sort }: LogEntity) {
        this._id = _id;
        this._index = _index;
        this._score = _score;
        this.message = message;
        this.level = level;
        this.timestamp = timestamp;
        this.sort = sort;
    }
}