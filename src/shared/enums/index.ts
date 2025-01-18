/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { EnumsType } from "@/types/Enums";

/* eslint-disable no-prototype-builtins */
const ENUMS = {
    UserRoles: {
        "ADMIN": "admin",
        "DEVELOPER": "developer",
        "OWNER": "owner",
        "CUSTOMER": "customer",
        "DEFAULT": "default"
    },
    UserStatus: {
        "ACTIVE": "active",
        "INACTIVE": "inactive",
        "OFFLINE": "offline",
    },
    Permissions: {
        // admin perms
        "MASTER_ADMIN_LEVEL": 'master_admin_level',
        "CAN_MANAGE_ROLES": 'can_manage_roles',
        "CAN_GENERATE_APIKEY": 'can_generate_apikey',
        "CAN_ACCESS_PRIVATE_ROUTES": 'can_access_private_routes',
        "CAN_ACCESS_ADMIN_ROUTES": 'can_access_admin_routes',
        "CAN_POST_ARTICLE": 'can_post_article'
    } as const,
    Threads: {
        Reactions: {
            "POST_LIKE": "post_like",
            "COMMENT_LIKE": "comment_like"
        }
    },
    values: function (enumObj: { [x: string]: any; }) {
        return Object.keys(enumObj).map(function (key) {
            return enumObj[key];
        });
    },
    keys: (enumObj: {}) => {
        return Object.keys(enumObj);
    }
};

const enums: Partial<EnumsType | any> = {};

for (const enumKey in ENUMS) {
    if (ENUMS.hasOwnProperty(enumKey)) { 
        enums[enumKey] = Object.freeze(ENUMS[enumKey as keyof EnumsType]);
    }
}

export { enums, ENUMS };