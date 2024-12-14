import { Logs } from '@/domain/entities/elastic/Logs';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class GetLogsFormattedUseCase {
    private logsRepository: Dependencies['logsRepository'];
    private logger: Dependencies['logger'];
    constructor({ logsRepository, logger }: Pick<Dependencies, 'logsRepository' | 'logger'>) {
        this.logsRepository = logsRepository;
        this.logger = logger;
    }

    async execute(): Promise<Logs[]> {
        const logs = await this.logsRepository.getWithFormat();

        if (!logs) {
            this.logger.error('Error trying get logs.');
            throw new AppError('Error trying get logs.', 404);
        }

        return logs;
    }
}