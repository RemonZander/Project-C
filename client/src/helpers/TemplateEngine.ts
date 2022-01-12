import { TemplateData } from "../@types/templateEngine";

export const createDataObject = (file: File, data: string): TemplateData => {
    return {
        name: file.name,
        data: data,
    };
};
