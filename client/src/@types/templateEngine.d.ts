export interface TemplateDataObject {
    name: string,
    data: string,
}

export interface HtmlDataObject extends TemplateDataObject {}
export interface CssDataObject extends TemplateDataObject {}
export interface ImagesDataObject extends TemplateDataObject {}
export interface JavascriptDataObject extends TemplateDataObject {}

export interface TemplateFiles {
    html: Array<HtmlDataObject>,
    css: Array<CssDataObject>,
    images: Array<ImagesDataObject>,
    js: Array<JavascriptDataObject>,
}

export interface IEntryPoint {
    id: string,
    element: HTMLElement,
    spanClasses: Array<string>,
    pElements: Array<HTMLParagraphElement>,
    spanElements: Array<HTMLSpanElement>,
}