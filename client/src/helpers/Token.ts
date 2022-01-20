import { Payload } from "../@types/token";

export const getToken = (): string | undefined => {
    try {
        return document.cookie.split(';').find((row) => row.startsWith('token='))?.split('=')[1] || undefined;
    } catch (error) {
        return undefined;
    }
};

export const getPayloadAsJson = (): Payload | null => {
    return tokenExists() ? JSON.parse(Buffer.from(getToken()!.split('.')[1], 'base64').toString()) : null
};

export const tokenExists = (): boolean => {
    return getToken() !== undefined;
};

export const isAdmin = (): boolean | null => {
    return getPayloadAsJson()?.type === "Admin";
};

export const isModerator = (): boolean | null => {
    return getPayloadAsJson()?.type === "Moderator";
};

export const isEmployee = (): boolean | null => {
    return getPayloadAsJson()?.type === "Employee";
};
