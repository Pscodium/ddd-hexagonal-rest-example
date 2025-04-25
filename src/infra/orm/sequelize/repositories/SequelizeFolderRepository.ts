/* eslint-disable @typescript-eslint/no-explicit-any */
import { Folder } from "@/domain/entities/Folder";
import { IFolderRepository } from "@/domain/repositories/IFolderRepository";
import { SequelizeFolderModel } from "../models/SequelizeFolderModel";
import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";


export class SequelizeFolderRepository implements IFolderRepository {
    private sequelize: Dependencies['sequelize'];
    private sequelizeAdapter: Dependencies['sequelizeAdapter'];

    constructor({ sequelizeAdapter }: Pick<Dependencies, 'sequelizeAdapter'>) {
        this.sequelizeAdapter = sequelizeAdapter;
        this.sequelize = this.sequelizeAdapter.getConnection();
    }

    async create(data: Partial<Folder>): Promise<Folder | null> {
        const folder = await SequelizeFolderModel.create(data);

        return folder ? new Folder(folder) : null;
    }

    async delete(folderId: string): Promise<void> {
        const folder = await SequelizeFolderModel.findByPk(folderId);
        if (!folder) {
            throw new AppError('Folder not found', 404);
        }
        await folder.destroy();
    }

    async findOne(folderId: string): Promise<Folder | null> {
        const folder = await SequelizeFolderModel.findByPk(folderId);

        return folder ? new Folder(folder) : null;
    }

    async findAll(): Promise<Folder[]> {
        const query = `
        SELECT 
            f.id,
            f.name,
            f.type,
            u.id AS UserId,
            f.hex,
            f.private,
            COALESCE(COUNT(fi.id), 0) AS filesCount,
            f.createdAt,
            f.updatedAt,
            CASE 
                WHEN COUNT(fi.id) = 0 THEN JSON_ARRAY()
                ELSE COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', fi.id,
                            'name', fi.name,
                            'type', fi.type,
                            'url', fi.url,
                            'private', fi.private,
                            'createdAt', fi.createdAt,
                            'updatedAt', fi.updatedAt
                        )
                    ), JSON_ARRAY()
                )
            END AS Files
        FROM folder f
        INNER JOIN users u ON f.UserId = u.id
        LEFT JOIN file fi on fi.FolderId = f.id
        GROUP BY
            f.id,
            f.name,
            f.type,
            u.id,
            f.hex,
            f.private,
            f.createdAt,
            f.updatedAt
        `;
        const [ results ] = await this.sequelize.query(query);

        return results.map((f: any) => {
            if (f.File) {
                f.File.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            return new Folder(f);
        });
    }
}