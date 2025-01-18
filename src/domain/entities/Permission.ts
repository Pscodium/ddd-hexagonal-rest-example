import { IPermissionEntity } from '@/types/entity/PermissionEntity';

export class Permission implements IPermissionEntity {
    id?: string | undefined;
    userId?: string | undefined;
    master_admin_level?: boolean;
    can_manage_roles?: boolean;
    can_generate_apikey?: boolean;
    can_access_private_routes?: boolean;
    can_access_admin_routes?: boolean;
    can_post_article?: boolean;


    constructor({
        id,
        userId,
        master_admin_level,
        can_manage_roles,
        can_generate_apikey,
        can_access_private_routes,
        can_access_admin_routes,
        can_post_article
    }: IPermissionEntity) {
        this.id = id;
        this.userId = userId;
        this.master_admin_level = master_admin_level;
        this.can_manage_roles = can_manage_roles;
        this.can_generate_apikey = can_generate_apikey;
        this.can_access_private_routes = can_access_private_routes;
        this.can_access_admin_routes = can_access_admin_routes;
        this.can_post_article = can_post_article;
    }
}
