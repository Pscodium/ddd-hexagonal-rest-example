/* eslint-disable @typescript-eslint/no-var-requires */
import { createContainer, asClass, asValue, asFunction, InjectionMode, listModules } from "awilix";
import { environment } from "../Environment";
import { enums } from "@/shared/enums/index";
import { regex } from "@/shared/utils/Regex";
import { App } from "../Application";
import path from "path";

// Critical infrastructure service imports
import { ElasticSearchClient } from '@/infra/integration/elasticSearch/client';
import { Logger } from "@/infra/integration/elasticSearch/logger";
import { StorageS3Client } from "@/infra/integration/storage/client";
import { SequelizeAdapter } from '@/infra/adapters/SequelizeAdapter';

// Core repository imports
import { ElasticSearchLogsRepository } from "@/infra/integration/elasticSearch/repositories/ElasticSearchLogsRepository";
import { StorageRepository } from "@/infra/integration/storage/repositories/StorageRepository";
import { SequelizeUserRepository } from '@/infra/orm/sequelize/repositories/SequelizeUserRepository';
import { SequelizeSessionRepository } from "@/infra/orm/sequelize/repositories/SequelizeSessionRepository";
import { SequelizePermissionRepository } from "@/infra/orm/sequelize/repositories/SequelizePermissionRepository";
import { SequelizeFileRepository } from "@/infra/orm/sequelize/repositories/SequelizeFileRepository";
import { SequelizeFolderRepository } from "@/infra/orm/sequelize/repositories/SequelizeFolderRepository";
import { SequelizeArticleRepository } from "@/infra/orm/sequelize/repositories/SequelizeArticleRepository";
import { SequelizeTagRepository } from "@/infra/orm/sequelize/repositories/SequelizeTagRepository";

/**
 * Creates an IoC container with proxy-based dependency injection
 */
const container = createContainer({
    injectionMode: InjectionMode.PROXY,
});

/**
 * Register base configuration values
 * These are not classes and must be manually registered
 */
container.register({
    environment: asValue(environment),
    enums: asValue(enums),
    regex: asValue(regex)
});

/**
 * Register foundation infrastructure services
 * These services have minimal dependencies and form the base layer
 */
container.register({
    elasticSearchClient: asClass(ElasticSearchClient).singleton(),
    storageClient: asClass(StorageS3Client).singleton(),
    sequelizeAdapter: asClass(SequelizeAdapter).singleton()
});

/**
 * Register logging services
 * Logger depends on elasticSearchClient, so it must be registered after
 */
container.register({
    logger: asClass(Logger).singleton()
});

/**
 * Register core repositories
 * These components depend on infrastructure services and provide data access
 */
container.register({
    logsRepository: asClass(ElasticSearchLogsRepository).singleton(),
    storageRepository: asClass(StorageRepository).singleton(),
    userRepository: asClass(SequelizeUserRepository).singleton(),
    sessionRepository: asClass(SequelizeSessionRepository).singleton(),
    permissionRepository: asClass(SequelizePermissionRepository).singleton(),
    fileRepository: asClass(SequelizeFileRepository).singleton(),
    folderRepository: asClass(SequelizeFolderRepository).singleton(),
    articleRepository: asClass(SequelizeArticleRepository).singleton(),
    tagRepository: asClass(SequelizeTagRepository).singleton()
});

/**
 * Module patterns for automatic dependency discovery
 * These patterns target application modules excluding those registered explicitly
 */
const modulesToLoad = [
    'app/useCases/**/*.@(js|ts)',
    'app/services/**/*.@(js|ts)',
    'domain/entities/**/*.@(js|ts)',
    'interface/http/**/*.@(js|ts)',
    'shared/**/*.@(js|ts)'
];

/**
 * Formats a module name to camelCase for consistent registration
 * 
 * @param name The name of the module to format
 * @returns Formatted name in camelCase
 */
function formatName(name: string): string {
    // Remove file extensions
    let formattedName = name.replace(/\.js$|\.ts$/, '');
    
    // Convert to camelCase
    formattedName = formattedName.charAt(0).toLowerCase() + formattedName.slice(1);
    
    return formattedName;
}

/**
 * Automatically register modules matching the specified patterns
 * This discovers and registers dependencies not handled explicitly
 */
modulesToLoad.forEach(pattern => {
    const modules = listModules(pattern, { cwd: path.resolve(__dirname, '../../') });
    
    modules.forEach(module => {
        try {
            // Skip already registered dependencies
            const moduleName = formatName(module.name);
            if (container.registrations[moduleName]) {
                return;
            }
            
            const moduleExports = require(module.path);
            
            // Find the main export (class, function, or object)
            let MainExport;
            
            if (moduleExports[module.name]) {
                MainExport = moduleExports[module.name];
            } else {
                // Get first available export
                const exportKeys = Object.keys(moduleExports);
                if (exportKeys.length > 0) {
                    MainExport = moduleExports[exportKeys[0]];
                }
            }
            
            if (MainExport) {
                // Register based on export type (class, function, or object)
                if (typeof MainExport === 'function') {
                    // Detect if it's a class constructor or regular function
                    const isClass = /^\s*class\s+/.test(MainExport.toString()) || 
                                  (MainExport.prototype && MainExport.prototype.constructor === MainExport);
                    
                    if (isClass) {
                        container.register({
                            [moduleName]: asClass(MainExport).singleton()
                        });
                    } else {
                        container.register({
                            [moduleName]: asFunction(MainExport).singleton()
                        });
                    }
                } else if (typeof MainExport === 'object') {
                    container.register({
                        [moduleName]: asValue(MainExport)
                    });
                }
            }
        } catch (error) {
            console.error(`Error loading module ${module.name}:`, error);
        }
    });
});

/**
 * Register Sequelize models and initializers
 * These have special handling due to their structure and initialization requirements
 */
const modelsPath = path.resolve(__dirname, '../../infra/orm/sequelize/models');
try {
    const modelsModules = listModules('*.@(js|ts)', { cwd: modelsPath });
    
    modelsModules.forEach(module => {
        const modelModule = require(module.path);
        const modelName = module.name.replace(/\.js$|\.ts$/, '');
        
        // Register the model class
        if (modelModule[modelName]) {
            container.register({
                [formatName(modelName)]: asValue(modelModule[modelName])
            });
        }
        
        // Register any initializer function
        const initName = `init${modelName}`;
        if (modelModule[initName]) {
            container.register({
                [formatName(initName)]: asFunction(modelModule[initName]).singleton()
            });
        }
    });
} catch (error) {
    console.error("Error loading Sequelize models:", error);
}

/**
 * Register application root component
 * This is registered last as it depends on all other components
 */
container.register({
    app: asClass(App).singleton()
});

/**
 * Initialize application
 * Resolve and start the application instance with error handling
 */
try {
    const app = container.resolve<App>("app");
    app.start().catch(error => {
        console.error("Application startup error:", error);
    });
} catch (error) {
    console.error("Dependency resolution error:", error);
    console.log("Registered dependencies:", Object.keys(container.registrations).sort());
}

console.log('Total registered dependencies:', Object.keys(container.registrations).length);

export default container;