export const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => resolve(e.target!.result as string);

        reader.onerror = (e) => reject(e.target);

        reader.readAsText(file);
    });
};

export const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => resolve(e.target!.result as string);

        reader.onerror = (e) => reject(e.target);

        reader.readAsDataURL(file);
    });
};

export const readFiles = (files: Array<File>, func: Function): Promise<any[]> => {
    let promises = [];

    for (let i = 0; i < files.length; i++) {
        promises.push(func(files[i]));
    }

    return Promise.all(promises);
};
