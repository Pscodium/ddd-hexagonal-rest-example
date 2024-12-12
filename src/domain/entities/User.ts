import { EnumsType } from "@/types/Enums";
import { UserEntity } from "@/types/UserEntity";

export class User implements UserEntity {
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    profileIcon?: string | undefined;
    externalId?: string | undefined;
    role?: EnumsType['UserRoles']  | undefined;
    status?: EnumsType['UserStatus'] | undefined;
    verifiedEmail?: boolean | undefined;
    password: string;
    id?: string | undefined;
    constructor({ email, externalId, firstName, lastName, nickname, password, profileIcon, role, status, verifiedEmail, id }: UserEntity) {
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
    }
  
}