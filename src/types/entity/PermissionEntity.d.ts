import { PermissionsValuesType } from "../Enums";

export type IPermissionEntity = {
    id?: string;
    userId?: string;
} & {
    [key in PermissionsValuesType]?: boolean;
}