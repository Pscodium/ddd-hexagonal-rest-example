import { PermissionsValuesType } from "../Enums";

export type PermissionEntity = {
    id?: string;
    userId?: string;
} & {
    [key in PermissionsValuesType]?: boolean;
}