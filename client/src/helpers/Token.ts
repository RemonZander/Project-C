export const getToken = (): string | undefined => {
    try {
        return document.cookie.split(';').find((row) => row.startsWith('token='))?.split('=')[1];
    } catch (error) {
        return undefined;
    }
};

export const getPayloadAsJson = (): string | null => {
    return tokenExists() ? JSON.parse(Buffer.from(getToken()!.split('.')[1], 'base64').toString()) : null
};

export const tokenExists = (): boolean => {
    return getToken() !== undefined;
};
