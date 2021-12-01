export const getToken = () => {
    try {
        return document.cookie
            .split(';')
            .find((row) => row.startsWith('token='))
            .split('=')[1];
    } catch (error) {
        return false;
    }
};

export const getPayloadAsJson = () => {
    return JSON.parse(Buffer.from(getToken().split('.')[1], 'base64').toString());
};

export const tokenExists = () => {
    return getToken() instanceof String;
};
