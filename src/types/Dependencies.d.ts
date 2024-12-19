// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';
import { ElasticSearchClient } from '@/infra/integration/elasticSearch/client';
import { Logger } from '@/infra/integration/elasticSearch/logger';
import { SequelizeSessionModel } from '@/infra/orm/sequelize/models/SequelizeSessionModel';
import { ElasticSearchLogsRepository } from '@/infra/integration/elasticSearch/repositories/ElasticSearchLogsRepository';
import { SequelizeSessionRepository } from '@/infra/orm/sequelize/repositories/SequelizeSessionRepository';
import { SequelizeUserModel } from '@/infra/orm/sequelize/models/SequelizeUserModel';

// domain
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ILogsRepository } from '@/domain/repositories/elastic/ILogsRepository';
import { ISessionRepository } from '@/domain/repositories/ISessionRepository';
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


// Default Imports
import { ModelStatic } from 'sequelize';
import { LoginUserUseCase } from '@/app/useCases/user/LoginUserUseCase';

export default interface Dependencies {
    /* INFRA - */
        /* Adapter*/
        sequelizeAdapter: SequelizeAdapter;
        /* Orm */
            /* Models */
            sequelizeSessionModel: ModelStatic<SequelizeSessionModel>;
            sequelizeUserModel: ModelStatic<SequelizeUserModel>;
            /* Repository */
            sequelizeUserRepository: SequelizeUserRepository;
            sequelizeSessionRepository: SequelizeSessionRepository;
        /* Integration */
        elasticSearchClient: ElasticSearchClient,
        logger: Logger;
            /* Repository */
            elasticSearchLogsRepository: ElasticSearchLogsRepository

    /* DOMAIN - */
        /* Entity */
        user: User;
        /* Repository */
        userRepository: IUserRepository;
        logsRepository: ILogsRepository;
        sessionRepository: ISessionRepository;

    /* APP - */
        /* Use Cases*/
            /* User */
            createUserUseCase: CreateUserUseCase;
            findOneUserUseCase: FindOneUserUseCase;
            loginUserUseCase: LoginUserUseCase;
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
            /* Routes */
            userRoutes: UserRoutes;
            logRoutes: LogRoutes;

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
