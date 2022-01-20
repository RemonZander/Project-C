export interface TemplateData {
    name: string,
    data: string,
}

export type EditorSectionType = null | "upload" | "design"

export interface HtmlData extends TemplateData {
    isFetched: boolean,
}
export interface CssData extends TemplateData {}
export interface ImagesData extends TemplateData {}
export interface JavascriptData extends TemplateData {}

export interface TemplateFiles {
    html: Array<HtmlData>,
    css: Array<CssData>,
    images: Array<ImagesData>,
    js: Array<JavascriptData>,
}

// Deprecated
export interface EntryPoint {
    id: string,
    element: HTMLElement,
    spanClasses: Array<string>,
    pElements: Array<HTMLParagraphElement>,
    spanElements: Array<HTMLSpanElement>,
}

export interface TextEntryPoint {
    id: string,
    element: HTMLElement,
    type: "text",
    spanClasses: Array<string>,
    pElements: Array<HTMLParagraphElement>,
    spanElements: Array<HTMLSpanElement>,
}

export interface SelectedElement {
    element: HTMLElement,
    type: "image" | "text",
}
export interface ImageEntryPoint {
    id: string,
    element: HTMLElement,
    type: "image",
    imgElement: HTMLImageElement,
}