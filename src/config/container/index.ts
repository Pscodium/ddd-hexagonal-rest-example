import { createContainer, asClass, asValue, InjectionMode } from "awilix";
import { App } from "../Application";

// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';
import { ElasticSearchClient } from "@/infra/integration/elasticSearch/client";
import { ElasticSearchLogsRepository } from "@/infra/integration/elasticSearch/repositories/ElasticSearchLogsRepository";
import { SequelizeSessionRepository } from "@/infra/orm/sequelize/repositories/SequelizeSessionRepository";
import { SequelizePermissionRepository } from "@/infra/orm/sequelize/repositories/SequelizePermissionRepository";
import { StorageS3Client } from "@/infra/integration/storage/client";
import { StorageRepository } from "@/infra/integration/storage/repositories/StorageRepository";
import { Logger } from "@/infra/integration/elasticSearch/logger";
import { SequelizeSessionModel } from "@/infra/orm/sequelize/models/SequelizeSessionModel";
import { SequelizeUserModel } from "@/infra/orm/sequelize/models/SequelizeUserModel";
import { SequelizePermissionModel } from "@/infra/orm/sequelize/models/SequelizePermissionModel";

// domain
import { User } from '@/domain/entities/User';
import { Session } from "@/domain/entities/Session";
import { Permission } from "@/domain/entities/Permission";
import { PasswordValidator } from "@/app/services/user/PasswordValidator";

// app
import { CreateUserUseCase } from '@/app/useCases/user/CreateUserUseCase';
import { FindOneUserUseCase } from '@/app/useCases/user/FindOneUserUseCase';
import { UnexpiredLoginUseCase } from "@/app/useCases/user/UnexpiredLoginUseCase";
import { FindAllUserUseCase } from "@/app/useCases/user/FindAllUserUseCase";
import { LoginUserUseCase } from "@/app/useCases/user/LoginUserUseCase";
import { GetLogsUseCase } from "@/app/useCases/log/GetLogsUseCase";
import { GetLogsFormattedUseCase } from "@/app/useCases/log/GetLogsFormattedUseCase";
import { DeleteUserUseCase } from "@/app/useCases/user/DeleteUserUseCase";
import { UpdatePermissionUseCase } from "@/app/useCases/permission/UpdatePermissionUseCase";
import { UpdateUserUseCase } from "@/app/useCases/user/UpdateUserUseCase";

// interface
import { UserRoutes } from "@/interface/http/routes/UserRoutes";
import { LogRoutes } from "@/interface/http/routes/LogsRoutes";
import { UserController } from '@/interface/http/controllers/UserController';
import { LogsController } from "@/interface/http/controllers/LogsController";
import { PermissionRequestService } from "@/interface/http/services/PermissionRequestService";
import { AuthorizationRequestService } from "@/interface/http/services/AuthorizationRequestService";
import { AuthenticationMiddleware } from "@/interface/http/middlewares/Authentication";

// config
import { environment } from "../Environment";

// shared
import { enums } from "@/shared/enums/index";
import { regex } from "@/shared/utils/Regex";
import SchemaMiddleware from "@/interface/http/middlewares/SchemaMiddleware";

const container = createContainer({
    injectionMode: "PROXY",
});

container.register({
    /* APP */
    /* Use Cases - */
    /* User -- */
    createUserUseCase: asClass(CreateUserUseCase).singleton(),
    findOneUserUseCase: asClass(FindOneUserUseCase).singleton(),
    findAllUserUseCase: asClass(FindAllUserUseCase).singleton(),
    loginUserUseCase: asClass(LoginUserUseCase).singleton(),
    unexpiredLoginUseCase: asClass(UnexpiredLoginUseCase).singleton(),
    deleteUserUseCase: asClass(DeleteUserUseCase).singleton(),
    updatePermissionUseCase: asClass(UpdatePermissionUseCase).singleton(),
    updateUserUseCase: asClass(UpdateUserUseCase).singleton(),
    /* Logs -- */
    getLogsUseCase: asClass(GetLogsUseCase).singleton(),
    getLogsFormattedUseCase: asClass(GetLogsFormattedUseCase).singleton(),
    /* Services - */
    passwordValidator: asClass(PasswordValidator).singleton(),

    /* DOMAIN */
    /* Entity - */
    user: asClass(User).singleton(),
    session: asClass(Session).singleton(),
    permission: asClass(Permission).singleton(),

    /* INFRA */
    /* Adapter - */
    sequelizeAdapter: asClass(SequelizeAdapter).singleton(),
    /* Integration -- */
    /* ElasticSearch - */
    elasticSearchClient: asClass(ElasticSearchClient).singleton(),
    logger: asClass(Logger).singleton(),
    /* Storage */
    storageClient: asClass(StorageS3Client).singleton(),
    /* Repository -- */
    logsRepository: asClass(ElasticSearchLogsRepository).singleton(),
    storageRepository: asClass(StorageRepository).singleton(),
    /* Orm -*/
    /* Models -*/
    sequelizeSessionModel: asClass(SequelizeSessionModel).singleton(),
    sequelizeUserModel: asClass(SequelizeUserModel).singleton(),
    sequelizePermissionModel: asClass(SequelizePermissionModel).singleton(),
    
    /* Repository - */
    userRepository: asClass(SequelizeUserRepository).singleton(),
    sessionRepository: asClass(SequelizeSessionRepository).singleton(),
    permissionRepository: asClass(SequelizePermissionRepository).singleton(),

    /* INTERFACE */
    /* HTTP */
    /* Controller - */
    userController: asClass(UserController).singleton(),
    logsController: asClass(LogsController).singleton(),
    /* Routes - */
    userRoutes: asClass(UserRoutes).singleton(),
    logRoutes: asClass(LogRoutes).singleton(),
    /* Services - */
    authorizationRequestService: asClass(AuthorizationRequestService).singleton(),
    permissionRequestService: asClass(PermissionRequestService).singleton(),
    /* Middlewares - */
    authenticationMiddleware: asClass(AuthenticationMiddleware).singleton(),
    schemaMiddleware: asClass(SchemaMiddleware).singleton(),

    /* CONFIG */
    environment: asValue(environment),
    app: asClass(App).singleton(),

    /* SHARED */
    /* Enums - */
    enums: asValue(enums),
    /* Utils - */
    regex: asValue(regex)
}).loadModules(
    [
        '../../app/dto/**/*(*.ts)',
        '../../app/useCases/**/*(*.ts)',
        '../../app/services/**/*(*.ts)',
        '../../config/**/*(*.ts)',
        '../../config/*(*.ts)',
        '../../domain/**/*(*.ts)',
        '../../infra/orm/**/*(*.ts)',
        '../../infra/**/*(*.ts)',
        '../../interface/http/**/*(*.ts)',
        '../../shared/**/*(*.ts)'
    ], {
        cwd: __dirname,
        formatName: 'camelCase',
        resolverOptions: {
            injectionMode: InjectionMode.PROXY
        }
    }
);

// Inicializa a aplicação diretamente no contêiner
container.resolve<App>("app").start();

export default container;