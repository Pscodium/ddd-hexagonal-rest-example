import { createContainer, asClass, asValue, InjectionMode } from "awilix";
import { App } from "../Application";

// infra
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';

// domain
import { User } from '@/domain/entities/User';

// app
import { CreateUserUseCase } from '@/app/useCases/user/CreateUserUseCase';
import { FindOneUserUseCase } from '@/app/useCases/user/FindOneUserUseCase';

// interface
import { UserController } from '@/interface/http/controllers/UserController';



import { environment } from "../Env";

const container = createContainer({
    injectionMode: "PROXY",
});

container.register({
    /* APP */
    /* Use Cases */
    createUserUseCase: asClass(CreateUserUseCase).singleton(),
    findOneUserUseCase: asClass(FindOneUserUseCase).singleton(),

    /* DOMAIN */
    /* Entity */
    user: asClass(User).singleton(),

    /* INFRA */
    /* Adapter */
    sequelizeAdapter: asClass(SequelizeAdapter).singleton(),
    /* Repository */
    userRepository: asClass(SequelizeUserRepository).singleton(),

    /* INTERFACE */
    /* HTTP */
    /* Controller */
    userController: asClass(UserController).singleton(),

    /* CONFIG */
    environment: asValue(environment),
    app: asClass(App).singleton(),
}).loadModules(
    [
        '../../app/dto/**/*(*.ts)',
        '../../app/useCases/**/*(*.ts)',
        '../../config/**/*(*.ts)',
        '../../config/*(*.ts)',
        '../../domain/**/*(*.ts)',
        '../../infra/orm/**/*(*.ts)',
        '../../infra/**/*(*.ts)',
        '../../interface/http/**/*(*.ts)'
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