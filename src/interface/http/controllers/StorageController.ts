
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import randomColor from 'randomcolor';

interface IStorageController {
    createFile(req: Request, res: Response): Promise<Response>;
    createFolder(req: Request, res: Response): Promise<Response>;
    deleteFile(req: Request, res: Response): Promise<Response>;
    deleteFolder(req: Request, res: Response): Promise<Response>;
    getFolders(req: Request, res: Response): Promise<Response>;
    getFiles(req: Request, res: Response): Promise<Response>;
    proxy(req: Request, res: Response): Promise<Response>;
}

export class StorageController implements IStorageController {
    private logger: Dependencies['logger'];
    private storageRepository: Dependencies['storageRepository'];
    private folderRepository: Dependencies['folderRepository'];
    private fileRepository: Dependencies['fileRepository'];
    private createFileUseCase: Dependencies['createFileUseCase'];
    private createFolderUseCase: Dependencies['createFolderUseCase'];
    private deleteFolderUseCase: Dependencies['deleteFolderUseCase'];
    private deleteFileUseCase: Dependencies['deleteFileUseCase'];
    private findAllFolderUseCase: Dependencies['findAllFolderUseCase'];
    private findAllFileUseCase: Dependencies['findAllFileUseCase'];

    constructor({ logger, storageRepository, folderRepository, fileRepository, createFileUseCase, createFolderUseCase, deleteFolderUseCase, deleteFileUseCase, findAllFolderUseCase, findAllFileUseCase }: Pick<Dependencies, 'logger' | 'storageRepository' | 'folderRepository' | 'fileRepository' | 'createFileUseCase' | 'createFolderUseCase' | 'deleteFolderUseCase' | 'deleteFileUseCase' | 'findAllFolderUseCase' | 'findAllFileUseCase'>) {
        this.logger = logger;
        this.storageRepository = storageRepository;
        this.folderRepository = folderRepository;
        this.fileRepository = fileRepository;
        this.createFileUseCase = createFileUseCase;
        this.createFolderUseCase = createFolderUseCase;
        this.deleteFolderUseCase = deleteFolderUseCase;
        this.deleteFileUseCase = deleteFileUseCase;
        this.findAllFolderUseCase = findAllFolderUseCase;
        this.findAllFileUseCase = findAllFileUseCase;
    }

    public createFile = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.createFile()`;
        try {
            const { folderId } = req.params;
            const file = req.file;

            if (!file || !folderId) {
                this.logger.error(`[REQUEST ERROR] - Invalid Body`);
                return res.status(400).json({ error: "Invalid Body" });
            }

            const folderExists = await this.folderRepository.findOne(folderId);

            if (!folderExists) {
                this.logger.error(`[REQUEST ERROR] - Folder doesn't exists`);
                return res.status(400).json({ error: "Folder doesn't exists" });
            }

            const type = file.mimetype;
            const content = file.buffer;

            const fileUrl = await this.storageRepository.uploadFile(file.originalname, content, `${folderExists.name}/`);

            if (!fileUrl) {
                this.logger.error(`[MINIO] - Failed to upload`);
                return res.status(500).json({ error: "[MINIO] - Failed to upload" });
            }

            const uploaded = await this.createFileUseCase.execute({
                name: file.originalname,
                url: fileUrl,
                UserId: req.userId,
                FolderId: folderId,
                type
            });

            return res.status(200).json(uploaded);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request - ${err}` });
        }
    };

    public createFolder = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.createFolder()`;
        try {
            const { folderName, type } = req.body;
            const validFolderName = `${folderName}/`;

            if (!folderName) {
                this.logger.error('Folder must have a name');
                return res.status(400).json({ message: "Folder must have a name" });
            }

            this.storageRepository.createFolder(validFolderName);

            const folder = await this.createFolderUseCase.execute({
                hex: randomColor(),
                name: folderName,
                UserId: req.userId,
                type
            });

            return res.status(200).json(folder);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public deleteFile = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.deleteFile()`;
        try {
            const { id, folderId } = req.params;

            const file = await this.fileRepository.findOne(id);
            const folder = await this.folderRepository.findOne(folderId);

            if (!file || !folder) {
                this.logger.error(`[REQUEST ERROR] - File or Folder not found`);
                throw new AppError('File or Folder not found', 404);
            }

            await this.deleteFileUseCase.execute(id, folderId);

            await this.storageRepository.deleteFile(file.name, `${folder.name}/`);

            return res.status(200).json({ success: true });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public deleteFolder = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.deleteFolder()`;
        try {
            const { id } = req.params;

            const folder = await this.folderRepository.findOne(id);

            if (!folder) {
                this.logger.error(`[REQUEST ERROR] - Folder not found`);
                throw new AppError('Folder not found', 404);
            }

            await this.deleteFolderUseCase.execute(id);

            await this.storageRepository.deleteFolder(`${folder.name}/`);

            return res.status(200).json({ success: true });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public getFolders = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.getFolders()`;
        try {

            const folders = await this.findAllFolderUseCase.execute();

            return res.status(200).json(folders);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request - ${err}` });
        }
    };

    public getFiles = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.getFiles()`;
        try {
            const files = await this.findAllFileUseCase.execute();

            return res.status(200).json(files);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request - ${err}` });
        }
    };

    public proxy = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.proxy()`;
        try {
            const url = req.query.url as string;

            if (!url) {
                return res.status(400).send('URL Needed');
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Origin': 'http://localhost'
                }
            });

            if (!response.ok) {
                return res.status(response.status).send('Error on get image');
            }

            const data = await response.text();
            const contentType = response.headers.get('content-type');
            if (!contentType) {
                return res.status(500).json({ message: 'Unexpected error on get proxy content type' });
            }
            res.set('Content-Type', contentType);

            return res.status(200).json(data);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };
}
