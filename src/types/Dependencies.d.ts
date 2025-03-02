// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';
import { ElasticSearchClient } from '@/infra/integration/elasticSearch/client';
import { Logger } from '@/infra/integration/elasticSearch/logger';
import { SequelizeSessionModel } from '@/infra/orm/sequelize/models/SequelizeSessionModel';
import { ElasticSearchLogsRepository } from '@/infra/integration/elasticSearch/repositories/ElasticSearchLogsRepository';
import { SequelizeSessionRepository } from '@/infra/orm/sequelize/repositories/SequelizeSessionRepository';
import { StorageS3Client } from '@/infra/integration/storage/client';
import { IStorageRepository } from '@/domain/repositories/storage/IStorageRepository';
import { SequelizeUserModel } from '@/infra/orm/sequelize/models/SequelizeUserModel';
import { PermissionRequestService } from '@/interface/http/services/PermissionRequestService';
import { SequelizePermissionRepository } from '@/infra/orm/sequelize/repositories/SequelizePermissionRepository';
import { SequelizePermissionModel } from '@/infra/orm/sequelize/models/SequelizePermissionModel';

// domain
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ILogsRepository } from '@/domain/repositories/elastic/ILogsRepository';
import { ISessionRepository } from '@/domain/repositories/ISessionRepository';
import { IPermissionRepository } from '@/domain/repositories/IPermissionRepository';
import { Permission } from '@/domain/entities/Permission';
import { Session } from '@/domain/entities/Session';
import { User } from '@/domain/entities/User';

// app
import { GetLogsUseCase } from '@/app/useCases/log/GetLogsUseCase';
import { GetLogsFormattedUseCase } from '@/app/useCases/log/GetLogsFormattedUseCase';
import { CreateUserUseCase } from '@/app/useCases/user/CreateUserUseCase';
import { FindOneUserUseCase } from '@/app/useCases/user/FindOneUserUseCase';
import { FindAllUserUseCase } from '@/app/useCases/user/FindAllUserUseCase';
import { PasswordValidator } from '@/app/services/user/PasswordValidator';
import { LoginUserUseCase } from '@/app/useCases/user/LoginUserUseCase';
import { UnexpiredLoginUseCase } from '@/app/useCases/user/UnexpiredLoginUseCase';
import { DeleteUserUseCase } from '@/app/useCases/user/DeleteUserUseCase';
import { UpdatePermissionUseCase } from '@/app/useCases/permission/UpdatePermissionUseCase';
import { UpdateUserUseCase } from '@/app/useCases/user/UpdateUserUseCase';

// interface
import { UserController } from '@/interface/http/controllers/UserController';
import { LogsController } from '@/interface/http/controllers/LogsController';
import { AuthorizationRequestService } from '@/interface/http/services/AuthorizationRequestService';
import { AuthenticationMiddleware } from '@/interface/http/middlewares/Authentication';


// Shared
import { RegexType } from '@/shared/utils/Regex';

// Types
import { EnvironmentVariables } from '@/types/Environment';
import { EnumsType } from '@/types/Enums';


// Default Imports
import { ModelStatic } from 'sequelize';
import { S3 } from 'aws-sdk';
import SchemaMiddleware from '@/interface/http/middlewares/SchemaMiddleware';

export default interface Dependencies {
    /* INFRA - */
        /* Adapter*/
        sequelizeAdapter: SequelizeAdapter;
        /* Orm */
            /* Models */
            sequelizeSessionModel: ModelStatic<SequelizeSessionModel>;
            sequelizeUserModel: ModelStatic<SequelizeUserModel>;
            sequelizePermissionModel: ModelStatic<SequelizePermissionModel>;
            /* Repository */
            sequelizeUserRepository: SequelizeUserRepository;
            sequelizeSessionRepository: SequelizeSessionRepository;
            sequelizePermissionRepository: SequelizePermissionRepository;
        /* Integration */
            /* ElasticSearch */
            elasticSearchClient: ElasticSearchClient;
            logger: Logger;
            /* Storage */
            storageClient: StorageS3Client;
        
            /* Repository */
            elasticSearchLogsRepository: ElasticSearchLogsRepository;

    /* DOMAIN - */
        /* Entity */
        user: User;
        session: Session;
        permission: Permission;
        /* Repository */
        userRepository: IUserRepository;
        permissionRepository: IPermissionRepository;
        logsRepository: ILogsRepository;
        storageRepository: IStorageRepository;
        sessionRepository: ISessionRepository;

    /* APP - */
        /* Use Cases*/
            /* User */
            createUserUseCase: CreateUserUseCase;
            findOneUserUseCase: FindOneUserUseCase;
            findAllUserUseCase: FindAllUserUseCase;
            loginUserUseCase: LoginUserUseCase;
            unexpiredLoginUseCase: UnexpiredLoginUseCase;
            deleteUserUseCase: DeleteUserUseCase;
            updateUserUseCase: UpdateUserUseCase;
            /* Permission */
            updatePermissionUseCase: UpdatePermissionUseCase;
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
            /* Services */
            authorizationRequestService: AuthorizationRequestService;
            permissionRequestService: PermissionRequestService;
            /* Middlewares */
            authenticationMiddleware: AuthenticationMiddleware;
            schemaMiddleware: SchemaMiddleware;

    /* CONFIG - */
        /* Environment */
        environment: EnvironmentVariables;
    
    /* SHARED - */
        /* Enums */
        enums: EnumsType;
        /* Utils */
        regex: RegexType;
        /* Types */
        storageType: S3

// eslint-disable-next-line semi
};
