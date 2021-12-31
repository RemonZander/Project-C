import { IPayload } from "../@types/token";

export const getToken = (): string | undefined => {
    try {
        return document.cookie.split(';').find((row) => row.startsWith('token='))?.split('=')[1] || undefined;
    } catch (error) {
        return undefined;
    }
};

export const getPayloadAsJson = (): IPayload | null => {
    return tokenExists() ? JSON.parse(Buffer.from(getToken()!.split('.')[1], 'base64').toString()) : null
};

export const tokenExists = (): boolean => {
    return getToken() !== undefined;
};
