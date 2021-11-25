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

export const tokenExists = () => {
    return getToken() instanceof String;
};
