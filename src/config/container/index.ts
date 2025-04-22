import { createContainer, asClass, asValue, InjectionMode, Lifetime } from "awilix";
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
import { SequelizeFileModel } from "@/infra/orm/sequelize/models/SequelizeFileModel";
import { SequelizeFolderModel } from "@/infra/orm/sequelize/models/SequelizeFolderModel";
import { SequelizeFileRepository } from "@/infra/orm/sequelize/repositories/SequelizeFileRepository";
import { SequelizeFolderRepository } from "@/infra/orm/sequelize/repositories/SequelizeFolderRepository";
import { SequelizeArticleModel } from "@/infra/orm/sequelize/models/SequelizeArticleModel";
import { SequelizeTagModel } from "@/infra/orm/sequelize/models/SequelizeTagModel";
import { SequelizeArticleRepository } from "@/infra/orm/sequelize/repositories/SequelizeArticleRepository";
import { SequelizeTagRepository } from "@/infra/orm/sequelize/repositories/SequelizeTagRepository";

// domain
import { User } from '@/domain/entities/User';
import { Session } from "@/domain/entities/Session";
import { Permission } from "@/domain/entities/Permission";
import { Article } from "@/domain/entities/Article";
import { Tag } from "@/domain/entities/Tag";
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
import { CreateFileUseCase } from "@/app/useCases/storage/CreateFIleUseCase";
import { CreateFolderUseCase } from "@/app/useCases/storage/CreateFolderUseCase";
import { DeleteFileUseCase } from "@/app/useCases/storage/DeleteFileUseCase";
import { DeleteFolderUseCase } from "@/app/useCases/storage/DeleteFolderUseCase";
import { FindAllFileUseCase } from "@/app/useCases/storage/FindAllFileUseCase";
import { FindAllFolderUseCase } from "@/app/useCases/storage/FindAllFolderUseCase";
import { CreateArticleUseCase } from "@/app/useCases/article/CreateArticleUseCase";
import { FindAllArticlesUseCase } from "@/app/useCases/article/FindAllArticlesUseCase";
import { FindAllTagsUseCase } from "@/app/useCases/article/FindAllTagsUseCase";
import { FindArticlesByTagIdUseCase } from "@/app/useCases/article/FindArticlesByTagIdUseCase";
import { UpdateArticleUseCase } from "@/app/useCases/article/UpdateArticleUseCase";
import { DeleteArticleUseCase } from "@/app/useCases/article/DeleteArticleUseCase";
import { DeleteTagUseCase } from "@/app/useCases/article/DeleteTagUseCase";

// interface
import { UserRoutes } from "@/interface/http/routes/UserRoutes";
import { LogRoutes } from "@/interface/http/routes/LogsRoutes";
import { UserController } from '@/interface/http/controllers/UserController';
import { LogsController } from "@/interface/http/controllers/LogsController";
import { PermissionRequestService } from "@/interface/http/services/PermissionRequestService";
import { AuthorizationRequestService } from "@/interface/http/services/AuthorizationRequestService";
import { AuthenticationMiddleware } from "@/interface/http/middlewares/Authentication";
import { StorageController } from "@/interface/http/controllers/StorageController";
import { StorageRoutes } from "@/interface/http/routes/StorageRoutes";
import { ArticleController } from "@/interface/http/controllers/ArticleController";
import { ArticleRoutes } from "@/interface/http/routes/ArticleRoutes";

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
    /* Article -- */
    createArticleUseCase: asClass(CreateArticleUseCase).singleton(),
    findAllArticlesUseCase: asClass(FindAllArticlesUseCase).singleton(),
    findAllTagsUseCase: asClass(FindAllTagsUseCase).singleton(),
    findArticlesByTagIdUseCase: asClass(FindArticlesByTagIdUseCase).singleton(),
    updateArticleUseCase: asClass(UpdateArticleUseCase).singleton(),
    deleteArticleUseCase: asClass(DeleteArticleUseCase).singleton(),
    deleteTagUseCase: asClass(DeleteTagUseCase).singleton(),
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
    /* Storage -- */
    createFileUseCase: asClass(CreateFileUseCase).singleton(),
    createFolderUseCase: asClass(CreateFolderUseCase).singleton(),
    deleteFileUseCase: asClass(DeleteFileUseCase).singleton(),
    deleteFolderUseCase: asClass(DeleteFolderUseCase).singleton(),
    findAllFileUseCase: asClass(FindAllFileUseCase).singleton(),
    findAllFolderUseCase: asClass(FindAllFolderUseCase).singleton(),
    /* Services - */
    passwordValidator: asClass(PasswordValidator).singleton(),

    /* DOMAIN */
    /* Entity - */
    user: asClass(User).singleton(),
    session: asClass(Session).singleton(),
    permission: asClass(Permission).singleton(),
    article: asClass(Article).singleton(),
    tag: asClass(Tag).singleton(),

    /* INFRA */
    /* Adapter - */
    sequelizeAdapter: asClass(SequelizeAdapter).singleton(),
    /* Integration - */
    /* ElasticSearch -- */
    elasticSearchClient: asClass(ElasticSearchClient).singleton(),
    logger: asClass(Logger).singleton(),
    /* Storage -- */
    storageClient: asClass(StorageS3Client).singleton(),
    /* Repository --- */
    logsRepository: asClass(ElasticSearchLogsRepository).singleton(),
    storageRepository: asClass(StorageRepository).singleton(),
    /* Orm -*/
    /* Models -*/
    sequelizeSessionModel: asClass(SequelizeSessionModel).singleton(),
    sequelizeUserModel: asClass(SequelizeUserModel).singleton(),
    sequelizePermissionModel: asClass(SequelizePermissionModel).singleton(),
    sequelizeFileModel: asClass(SequelizeFileModel).singleton(),
    sequelizeFolderModel: asClass(SequelizeFolderModel).singleton(),
    sequelizeArticleModel: asClass(SequelizeArticleModel).singleton(),
    sequelizeTagModel: asClass(SequelizeTagModel).singleton(),
    
    /* Repository - */
    userRepository: asClass(SequelizeUserRepository).singleton(),
    sessionRepository: asClass(SequelizeSessionRepository).singleton(),
    permissionRepository: asClass(SequelizePermissionRepository).singleton(),
    fileRepository: asClass(SequelizeFileRepository).singleton(),
    folderRepository: asClass(SequelizeFolderRepository).singleton(),
    articleRepository: asClass(SequelizeArticleRepository).singleton(),
    tagRepository: asClass(SequelizeTagRepository).singleton(),

    /* INTERFACE */
    /* HTTP */
    /* Controller - */
    userController: asClass(UserController).singleton(),
    logsController: asClass(LogsController).singleton(),
    storageController: asClass(StorageController).singleton(),
    articleController: asClass(ArticleController).singleton(),
    /* Routes - */
    userRoutes: asClass(UserRoutes).singleton(),
    logRoutes: asClass(LogRoutes).singleton(),
    storageRoutes: asClass(StorageRoutes).singleton(),
    articleRoutes: asClass(ArticleRoutes).singleton(),
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
        '../../app/useCases/**/*(*.js|*.ts)',
        '../../app/services/**/*(*.js|*.ts)',
        '../../config/**/*(*.js|*.ts)',
        '../../config/*(*.js|*.ts)',
        '../../domain/**/*(*.js|*.ts)',
        '../../infra/orm/**/*(*.js|*.ts)',
        '../../infra/**/*(*.js|*.ts)',
        '../../interface/http/**/*(*.js|*.ts)',
        '../../shared/**/*(*.js|*.ts)'
    ], {
        cwd: __dirname,
        formatName: 'camelCase',
        resolverOptions: {
            injectionMode: InjectionMode.PROXY,
            register: asClass,
            lifetime: Lifetime.SINGLETON,
            dispose: (obj) => obj.dispose && obj.dispose()
        }
    }
);

// Inicializa a aplicação diretamente no contêiner
container.resolve<App>("app").start();

console.log('Dependencias Registradas: ', Object.keys(container.registrations).length);

export default container;