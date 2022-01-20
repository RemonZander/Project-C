import { ICreateObject } from "../@types/app"

export const CreateExport = (url: string, component: any, auth: boolean = true, allowedUsers: Array<string> = ["Admin", "Moderator", "Employee"]): ICreateObject => (
    {
        url: url,
        component: component,
        auth: auth,
        allowedUsers: allowedUsers
    }
);