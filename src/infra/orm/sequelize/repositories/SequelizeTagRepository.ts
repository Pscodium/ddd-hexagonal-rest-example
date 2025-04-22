/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITagRepository } from "@/domain/repositories/ITagRepository";
import { SequelizeTagModel } from "../models/SequelizeTagModel";
import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";
import { Tag } from "@/domain/entities/Tag";


export class SequelizeTagRepository implements ITagRepository {
    private sequelize: Dependencies['sequelize'];
    private sequelizeAdapter: Dependencies['sequelizeAdapter'];

    constructor({ sequelizeAdapter }: Pick<Dependencies, 'sequelizeAdapter'>) {
        this.sequelizeAdapter = sequelizeAdapter;
        this.sequelize = this.sequelizeAdapter.getConnection();
    }

    async create(data: Partial<Tag>): Promise<Tag | null> {
        const tag = await SequelizeTagModel.create({
            title: data.title,
            hex: data.hex,
            UserId: data.UserId,
            count: 1
        });

        if (!tag) {
            throw new AppError("Tag was not created", 400);
        }

        if (data.Article) await tag.addArticle(data.Article);
        
        return tag ? new Tag(tag) : null;
    }

    async findOne(title?: string): Promise<Tag | null> {
        const tagExists = await SequelizeTagModel.findOne({
            where: this.sequelize.where(
                this.sequelize.fn("LOWER", this.sequelize.col('title')),
                this.sequelize.fn("LOWER", title)
            )
        });

        return tagExists ? new Tag(tagExists) : null;
    }

    async findById(tagId: string): Promise<Tag | null> {
        const tag = await SequelizeTagModel.findByPk(tagId, {
            include: {
                model: this.sequelize.models.SequelizeArticleModel,
                as: 'Articles'
            }
        });

        return tag;
    }

    async addArticleAndCount(data: Partial<Tag>): Promise<Tag | null> {
        const tag = await SequelizeTagModel.findOne({
            where: {
                id: data.id
            }
        });

        if (!tag) {
            throw new AppError('Tag not found', 404);
        }

        tag.count += 1;
        await tag.save();
        if (data.Article) {
            await tag.addArticle(data.Article);
        }

        return tag;
    }

    async findAll(): Promise<Tag[] | null> {
        const query = `
            SELECT 
                t.id,
                t.title,
                t.count,
                u.id AS UserId,
                t.views,
                t.hex,
                COALESCE(COUNT(a.id), 0) AS articlesCount,
                t.createdAt,
                t.updatedAt,
                CASE 
                    WHEN COUNT(a.id) = 0 THEN JSON_ARRAY()
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', a.id,
                                'title', a.title,
                                'body', a.body,
                                'files', a.files,
                                'UserId', a.UserId,
                                'private', a.private,
                                'createdAt', a.createdAt,
                                'updatedAt', a.updatedAt
                            )
                        ), JSON_ARRAY()
                    )
                END AS Articles
            FROM tag t
            INNER JOIN users u ON t.UserId = u.id
            LEFT JOIN article_tags at on at.TagId = t.id
            LEFT JOIN article a on at.ArticleId = a.id
            GROUP BY
                t.id,
                t.title,
                t.count,
                u.id,
                t.views,
                t.hex,
                t.createdAt,
                t.updatedAt
            ORDER BY t.createdAt DESC
        `;

        const [ results ] = await this.sequelize.query(query);

        return results as Tag[];
    }

    async findTagsByArticleId(articleId: string): Promise<Tag[] | null> {
        const tags = await SequelizeTagModel.findAll({
            include: [
                {
                    model: this.sequelize.models.SequelizeArticleModel,
                    as: "Articles",
                    where: {
                        id: articleId
                    }
                }
            ],
        });

        return tags? tags.map((tag) => new Tag(tag)) : null;
    }

    async dissociateTagFromArticle(articleId: string, tagId: string): Promise<boolean | null> {
        const tag = await SequelizeTagModel.findByPk(tagId);

        if (!tag) {
            return null;
        }

        await tag.removeArticle(articleId);
        await SequelizeTagModel.update({ count: this.sequelize.literal('count - 1')}, { where: { id: tagId }});

        return true;
    }

    async removeArticle(tagId: string, articleId: string): Promise<boolean | null> {
        const tag = await SequelizeTagModel.findByPk(tagId, {
            include: {
                model: this.sequelize.models.SequelizeArticleModel,
                as: 'Articles'
            }
        });

        if (!tag) {
            return false;
        }

        await tag.removeArticle(articleId);

        return true;
    }

    async delete(id: string): Promise<boolean | null> {
        const tag = await SequelizeTagModel.findByPk(id, {
            include: {
                model: this.sequelize.models.SequelizeArticleModel,
                as: 'Articles'
            }
        });

        if (!tag) {
            return false;
        }

        await tag.destroy();

        return true;
    }
}