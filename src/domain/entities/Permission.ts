import { PermissionEntity } from '@/types/entity/PermissionEntity';

export class Permission implements PermissionEntity {
    id?: string | undefined;
    userId?: string | undefined;
    master_admin_level?: boolean;
    can_manage_roles?: boolean;
    can_edit_user?: boolean;
    can_edit_post_from_another_user?: boolean;
    can_post?: boolean;
    can_like_on_post?: boolean;
    can_comment_on_post?: boolean;
    can_edit_post?: boolean;
    can_edit_profile?: boolean;
    can_edit_photo?: boolean;
    can_remove_account?: boolean;

    constructor({
        id,
        userId,
        master_admin_level,
        can_manage_roles,
        can_edit_user,
        can_edit_post_from_another_user,
        can_post,
        can_like_on_post,
        can_comment_on_post,
        can_edit_post,
        can_edit_profile,
        can_edit_photo,
        can_remove_account
    }: PermissionEntity) {
        this.id = id;
        this.userId = userId;
        this.master_admin_level = master_admin_level;
        this.can_manage_roles = can_manage_roles;
        this.can_edit_user = can_edit_user;
        this.can_edit_post_from_another_user = can_edit_post_from_another_user;
        this.can_post = can_post;
        this.can_like_on_post = can_like_on_post;
        this.can_comment_on_post = can_comment_on_post;
        this.can_edit_post = can_edit_post;
        this.can_edit_profile = can_edit_profile;
        this.can_edit_photo = can_edit_photo;
        this.can_remove_account = can_remove_account;
    }
}
