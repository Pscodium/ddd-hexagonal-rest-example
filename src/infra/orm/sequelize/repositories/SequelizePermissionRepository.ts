import { Permission } from "@/domain/entities/Permission";
import { IPermissionRepository } from "@/domain/repositories/IPermissionRepository";
import { SequelizePermissionModel } from "../models/SequelizePermissionModel";

export class SequelizePermissionRepository implements IPermissionRepository {
    async findOne(userId: string): Promise<Permission | null> {
        const permission = await SequelizePermissionModel.findOne({
            where: {
                userId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id']
            }
        });

        return permission ? new Permission(permission) : null;
    }

    async updateUserPermission(permission: Partial<Permission>): Promise<[affectedCount: number]> {
        return await SequelizePermissionModel.update(permission, { where: { userId: permission.userId }});
    }
}