import { TemplateDataObject } from "../@types/templateEngine";

export const createDataObject = (file: File, data: string): TemplateDataObject => {
    return {
        name: file.name,
        data: data,
    };
};
