// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';
import { ElasticSearchClient } from '@/infra/integration/elasticSearch/client';
import { Logger } from '@/infra/integration/elasticSearch/logger';

// domain
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ILogsRepository } from '@/domain/repositories/elastic/ILogsRepository';
import { User } from '@/domain/entities/User';

// app
import { GetLogsUseCase } from '@/app/useCases/log/GetLogsUseCase';
import { GetLogsFormattedUseCase } from '@/app/useCases/log/GetLogsFormattedUseCase';
import { CreateUserUseCase } from '@/app/useCases/user/CreateUserUseCase';
import { FindOneUserUseCase } from '@/app/useCases/user/FindOneUserUseCase';
import { PasswordValidator } from '@/app/services/user/PasswordValidator';

// interface
import { UserController } from '@/interface/http/controllers/UserController';
import { LogsController } from '@/interface/http/controllers/LogsController';

// Shared
import { RegexType } from '@/shared/utils/Regex';

// Types
import { EnvironmentVariables } from '@/types/Environment';
import { EnumsType } from '@/types/Enums';

export default interface Dependencies {
    /* INFRA - */
        /* Adapter*/
        sequelizeAdapter: SequelizeAdapter;
        /* Repository */
        sequelizeUserRepository: SequelizeUserRepository;
        /* Integration */
        elasticSearchClient: ElasticSearchClient,
        logger: Logger;
            /* Repository */
            elasticSearchLogsRepository: Elas

    /* DOMAIN - */
        /* Entity */
        user: User;
        /* Repository */
        userRepository: IUserRepository;
        logsRepository: ILogsRepository;

    /* APP - */
        /* Use Cases*/
            /* User */
            createUserUseCase: CreateUserUseCase;
            findOneUserUseCase: FindOneUserUseCase;
            /* Log */
            getLogsUseCase: GetLogsUseCase;
            getLogsFormattedUseCase: GetLogsFormattedUseCase;
        /* Services */
        passwordValidator: PasswordValidator

    /* INTERFACE - */
        /* HTTP */
            /* Controller */
            userController: UserController;
            logsController: LogsController;

    /* CONFIG - */
        /* Environment */
        environment: EnvironmentVariables;
    
    /* SHARED - */
        /* Enums */
        enums: EnumsType;
        /* Utils */
        regex: RegexType;

// eslint-disable-next-line semi
};
