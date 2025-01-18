import { EnumsType } from "@/types/Enums";
import { IPermissionEntity } from "@/types/entity/PermissionEntity";
import { IUserEntity } from "@/types/entity/UserEntity";

export class User implements IUserEntity {
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    profileIcon?: string | undefined;
    externalId?: string | undefined;
    role?: EnumsType['UserRoles']  | undefined;
    status?: EnumsType['UserStatus'] | undefined;
    verifiedEmail?: boolean | undefined;
    password?: string | undefined;
    id?: string | undefined;
    token?: string | undefined;
    Permission?: IPermissionEntity;
    constructor({ email, externalId, firstName, lastName, nickname, password, profileIcon, role, status, verifiedEmail, id, Permission }: IUserEntity) {
        this.email = email;
        this.externalId = externalId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickname = nickname;
        this.password = password;
        this.profileIcon = profileIcon;
        this.role = role;
        this.status = status;
        this.verifiedEmail = verifiedEmail;
        this.id = id;
        this.Permission = Permission;
    }
  
}