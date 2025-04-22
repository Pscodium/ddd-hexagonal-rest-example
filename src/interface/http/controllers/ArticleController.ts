import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

interface IArticleController {
    create(req: Request, res: Response): Promise<Response>;
    getArticles(req: Request, res: Response): Promise<Response>;
    getTags(req: Request, res: Response): Promise<Response>;
    getArticlesByTagId(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    deleteArticle(req: Request, res: Response): Promise<Response>;
    deleteTag(req: Request, res: Response): Promise<Response>;
}

export class ArticleController implements IArticleController {
    private logger: Dependencies['logger'];
    private createArticleUseCase: Dependencies['createArticleUseCase'];
    private findAllArticlesUseCase: Dependencies['findAllArticlesUseCase'];
    private findAllTagsUseCase: Dependencies['findAllTagsUseCase'];
    private findArticlesByTagIdUseCase: Dependencies['findArticlesByTagIdUseCase'];
    private updateArticleUseCase: Dependencies['updateArticleUseCase'];
    private deleteArticleUseCase: Dependencies['deleteArticleUseCase'];
    private deleteTagUseCase: Dependencies['deleteTagUseCase'];

    constructor({
        logger,
        createArticleUseCase,
        findAllArticlesUseCase,
        findAllTagsUseCase,
        findArticlesByTagIdUseCase,
        updateArticleUseCase,
        deleteArticleUseCase,
        deleteTagUseCase
    }: Pick<
        Dependencies,
        | 'logger'
        | 'createArticleUseCase'
        | 'findAllArticlesUseCase'
        | 'findAllTagsUseCase'
        | 'findArticlesByTagIdUseCase'
        | 'updateArticleUseCase'
        | 'deleteArticleUseCase'
        | 'deleteTagUseCase'
    >) {
        this.logger = logger;
        this.createArticleUseCase = createArticleUseCase;
        this.findAllArticlesUseCase = findAllArticlesUseCase;
        this.findAllTagsUseCase = findAllTagsUseCase;
        this.findArticlesByTagIdUseCase = findArticlesByTagIdUseCase;
        this.updateArticleUseCase = updateArticleUseCase;
        this.deleteArticleUseCase = deleteArticleUseCase;
        this.deleteTagUseCase = deleteTagUseCase;
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.create.name}()`;
        try {
            const data = req.body;
            data.UserId = req.userId;

            const article = await this.createArticleUseCase.execute(data);

            return res.status(200).json(article);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request ${err}` });
        }
    };

    public getArticles = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const callName = `${this.getArticles.name}()`;
        try {
            const articles = await this.findAllArticlesUseCase.execute();

            return res.status(200).json(articles);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request ${err}` });
        }
    };

    public getArticlesByTagId = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const callName = `${this.getArticlesByTagId.name}()`;
        try {
            const { id } = req.params;

            const tag = await this.findArticlesByTagIdUseCase.execute(id);

            return res.status(200).json(tag);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request ${err}` });
        }
    };

    public getTags = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.getTags.name}()`;
        try {
            const tags = await this.findAllTagsUseCase.execute();

            return res.status(200).json(tags);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request ${err}` });
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.update.name}()`;
        try {
            const data = req.body;
            const { id } = req.params;
            const UserId = req.userId;

            const article = await this.updateArticleUseCase.execute({
                ...data,
                id,
                UserId,
            });

            return res.status(200).json(article);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request ${err}` });
        }
    };

    public deleteArticle = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const callName = `${this.deleteArticle.name}()`;
        try {
            const { id } = req.params;

            const success = await this.deleteArticleUseCase.execute(id);

            return res.status(200).json({ success });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request ${err}` });
        }
    };

    public deleteTag = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const callName = `${this.deleteTag.name}()`;
        try {
            const { id } = req.params;

            const success = await this.deleteTagUseCase.execute(id);

            return res.status(200).json({ success });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request ${err}` });
        }
    };
}
