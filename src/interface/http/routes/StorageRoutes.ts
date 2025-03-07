/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import Dependencies from '@/types/Dependencies';
import multer from 'multer';

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

export class StorageRoutes {
    private router: any;
    private storageController: Dependencies['storageController'];
    private authenticationMiddleware: Dependencies['authenticationMiddleware'];
    private enums: Dependencies['enums'];

    constructor({ storageController, authenticationMiddleware, enums }: Pick<Dependencies, 'storageController' | 'authenticationMiddleware' | 'enums'>) {
        this.storageController = storageController;
        this.authenticationMiddleware = authenticationMiddleware;
        this.enums = enums;
        this.router = Router();
    }

    public init(): Router {
        this.router.post('/storage/upload/:folderId', 
            this.authenticationMiddleware.validate, 
            this.authenticationMiddleware.hasPermissions([this.enums.Permissions.MASTER_ADMIN_LEVEL]),
            upload.single('media'),
            this.storageController.createFile
        );
        this.router.delete('/storage/delete/:id/folder/:folderId', 
            this.authenticationMiddleware.validate, 
            this.authenticationMiddleware.hasPermissions([this.enums.Permissions.MASTER_ADMIN_LEVEL]),
            this.storageController.deleteFile
        );
        this.router.post('/storage/folders/create', 
            this.authenticationMiddleware.validate, 
            this.authenticationMiddleware.hasPermissions([this.enums.Permissions.MASTER_ADMIN_LEVEL]),
            this.storageController.createFolder
        );
        this.router.delete('/storage/folders/delete/:id', 
            this.authenticationMiddleware.validate, 
            this.authenticationMiddleware.hasPermissions([this.enums.Permissions.MASTER_ADMIN_LEVEL]),
            this.storageController.deleteFolder
        );
        this.router.get('/proxy', this.storageController.proxy);
        this.router.get('/storage/folders', this.storageController.getFolders);
        this.router.get('/storage/files', this.storageController.getFiles);
        
        return this.router;
    }

}