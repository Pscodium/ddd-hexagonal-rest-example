import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { AggregationsAggregate, SearchResponse } from '@elastic/elasticsearch/lib/api/types';

export class GetLogsUseCase {
    private logsRepository: Dependencies['logsRepository'];
    private logger: Dependencies['logger'];
    constructor({ logsRepository, logger }: Pick<Dependencies, 'logsRepository' | 'logger'>) {
        this.logsRepository = logsRepository;
        this.logger = logger;
    }

    async execute(): Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>> {
        const logs = await this.logsRepository.get();

        if (!logs) {
            this.logger.error('Error trying get logs.');
            throw new AppError('Error trying get logs.', 404);
        }

        return logs;
    }
}