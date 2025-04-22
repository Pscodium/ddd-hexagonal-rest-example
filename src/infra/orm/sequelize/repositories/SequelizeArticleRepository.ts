/* eslint-disable @typescript-eslint/no-explicit-any */
import { IArticleRepository } from '@/domain/repositories/IArticleRepository';
import { SequelizeArticleModel } from '../models/SequelizeArticleModel';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { Article } from '@/domain/entities/Article';

export class SequelizeArticleRepository implements IArticleRepository {
    private sequelize: Dependencies['sequelize'];
    private sequelizeAdapter: Dependencies['sequelizeAdapter'];

    constructor({ sequelizeAdapter }: Pick<Dependencies, 'sequelizeAdapter'>) {
        this.sequelizeAdapter = sequelizeAdapter;
        this.sequelize = this.sequelizeAdapter.getConnection();
    }

    async create(data: Partial<Article>): Promise<Article | null> {
        const article = await SequelizeArticleModel.create({
            title: data.title,
            body: data.body,
            UserId: data.UserId,
        });

        if (!article) {
            throw new AppError('Article was not created', 400);
        }

        return article;
    }

    async findById(id: string): Promise<Article | null> {
        return await SequelizeArticleModel.findOne({
            where: { id },
            include: {
                model: this.sequelize.models.SequelizeTagModel,
                as: 'Tags',
            },
        });
    }

    async findOne(id: string): Promise<Article | null> {
        const query = `
            SELECT 
                a.id,
                a.title,
                a.body,
                u.id AS UserId,
                a.files,
                a.private,
                a.createdAt,
                a.updatedAt,
                CASE 
                    WHEN COUNT(t.id) = 0 THEN JSON_ARRAY()
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', t.id,
                                'title', t.title,
                                'count', t.count,
                                'views', t.views,
                                'hex', t.hex,
                                'createdAt', t.createdAt,
                                'updatedAt', t.updatedAt
                            )
                        ), JSON_ARRAY()
                    )
                END AS Tags
            FROM article a
            INNER JOIN users u ON a.UserId = u.id
            LEFT JOIN article_tags at on at.ArticleId = a.id
            LEFT JOIN tag t on at.TagId = t.id
            WHERE a.id = :id
            GROUP BY
                a.id,
                a.title,
                a.body,
                u.id,
                a.files,
                a.private,
                a.createdAt,
                a.updatedAt
            LIMIT 1
        `;

        const [result] = await this.sequelize.query(query, {
            replacements: {
                id,
            },
        });

        return result[0] as Article;
    }

    async findAll(): Promise<Article[] | null> {
        const query = `
            SELECT 
                a.id,
                a.title,
                a.body,
                u.id AS UserId,
                a.files,
                a.private,
                a.createdAt,
                a.updatedAt,
                CASE 
                    WHEN COUNT(t.id) = 0 THEN JSON_ARRAY()
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', t.id,
                                'title', t.title,
                                'count', t.count,
                                'views', t.views,
                                'hex', t.hex,
                                'createdAt', t.createdAt,
                                'updatedAt', t.updatedAt
                            )
                        ), JSON_ARRAY()
                    )
                END AS Tags
            FROM article a
            INNER JOIN users u ON a.UserId = u.id
            LEFT JOIN article_tags at on at.ArticleId = a.id
            LEFT JOIN tag t on at.TagId = t.id
            GROUP BY
                a.id,
                a.title,
                a.body,
                u.id,
                a.files,
                a.private,
                a.createdAt,
                a.updatedAt
            ORDER BY a.createdAt DESC
        `;

        const [results] = await this.sequelize.query(query);

        return results as Article[];
    }

    async update(data: Partial<Article>): Promise<Article | null> {
        let article;
        article = await SequelizeArticleModel.findByPk(data.id);

        if (!article) {
            return null;
        }

        await SequelizeArticleModel.update(
            { title: data.title, body: data.body },
            { where: { id: data.id } },
        );

        article = await SequelizeArticleModel.findByPk(data.id);
        return article;
    }

    async delete(id: string): Promise<boolean | null> {
        const article = await SequelizeArticleModel.findByPk(id, { include: [{ model: this.sequelize.models.SequelizeTagModel, as: 'Tags' }]});

        if (!article) {
            return false;
        }

        await article.setTags([]);
        await article.destroy();

        return true;
    }

    async destroy(id: string): Promise<boolean | null> {
        return (await SequelizeArticleModel.destroy({ where: { id } })) === 1;
    }

    async getArticlesByTagId(tagId: string): Promise<Article[] | null> {
        const query = `
            SELECT 
                a.id,
                a.title,
                a.body,
                u.id AS UserId,
                a.files,
                a.private,
                a.createdAt,
                a.updatedAt,
                CASE 
                    WHEN COUNT(t.id) = 0 THEN JSON_ARRAY()
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', t.id,
                                'title', t.title,
                                'count', t.count,
                                'views', t.views,
                                'hex', t.hex,
                                'createdAt', t.createdAt,
                                'updatedAt', t.updatedAt
                            )
                        ), JSON_ARRAY()
                    )
                END AS Tags
            FROM article a
            INNER JOIN users u ON a.UserId = u.id
            LEFT JOIN article_tags at ON at.ArticleId = a.id
            LEFT JOIN tag t ON at.TagId = t.id
            WHERE EXISTS (
                SELECT 1
                FROM article_tags att
                WHERE att.ArticleId = a.id AND att.TagId = :tagId
            )
            GROUP BY
                a.id,
                a.title,
                a.body,
                u.id,
                a.files,
                a.private,
                a.createdAt,
                a.updatedAt
            ORDER BY a.createdAt DESC;
        `;

        const [results] = await this.sequelize.query(query, {
            replacements: {
                tagId,
            },
        });

        return results as Article[];
    }
}
